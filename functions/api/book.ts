// Cloudflare Pages Function → POST /api/book  {start, name, email, website}.
// The write side of booking: re-validate everything the client claims, guard
// the slot in KV, create the Google Calendar event (unique Meet link + invite
// emails via sendUpdates=all), respond with the Meet URL.
// See docs/features/call-booking.md.
import { SLOT_MINUTES, isValidSlotStart } from '../../src/lib/booking';
import { createMeetEvent } from '../../src/lib/google';
import { KV_PREFIX, type BookingsKV } from './slots';

interface Env {
  BOOKINGS?: BookingsKV;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REFRESH_TOKEN?: string;
  OWNER_NOTIFY_EMAIL?: string; // real inbox (Proton) — invited to every event
  BOOKING_DEV?: string; // '1' → fake Meet link, skip Google (local testing)
}

interface Ctx {
  env: Env;
  request: Request;
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

export const onRequestPost = async (context: Ctx): Promise<Response> => {
  let body: { start?: string; name?: string; email?: string; website?: string };
  try {
    body = await context.request.json();
  } catch {
    return json(400, { error: 'invalid json' });
  }

  // Honeypot: the form has an invisible "website" field humans never fill.
  // Bots that do get a fake 200 — no error to learn from, no event created.
  if (body.website) return json(200, { ok: true });

  const name = (body.name ?? '').trim().slice(0, 80);
  const email = (body.email ?? '').trim().slice(0, 120);
  const start = body.start ?? '';
  if (name.length < 2) return json(400, { error: 'name required' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: 'valid email required' });
  if (!isValidSlotStart(start)) return json(409, { error: 'slot not available' });

  const { BOOKINGS, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, BOOKING_DEV } =
    context.env;
  const dev = BOOKING_DEV === '1';
  const configured = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN;

  // Refuse to run blind in prod: no KV → can't guard slots; no Google creds →
  // can't create the meeting. (Locally, BOOKING_DEV=1 lifts both.)
  if (!dev && (!BOOKINGS || !configured)) return json(503, { error: 'booking not configured' });

  const end = new Date(new Date(start).getTime() + SLOT_MINUTES * 60_000).toISOString();
  const key = KV_PREFIX + start;

  // Reserve BEFORE calling Google so a concurrent request sees the slot as
  // taken during the (slow) API call. KV is eventually consistent, so this is
  // a strong deterrent, not a hard lock — acceptable at portfolio traffic.
  if (BOOKINGS) {
    if (await BOOKINGS.get(key)) return json(409, { error: 'slot not available' });
    await BOOKINGS.put(key, JSON.stringify({ name, email, booked: new Date().toISOString() }), {
      expirationTtl: 60 * 60 * 24 * 60, // self-clean after 60 days
    });
  }

  let meetLink: string;
  try {
    meetLink = dev && !configured
      ? `https://meet.google.com/dev-fake-link`
      : await createMeetEvent(
          {
            clientId: GOOGLE_CLIENT_ID!,
            clientSecret: GOOGLE_CLIENT_SECRET!,
            refreshToken: GOOGLE_REFRESH_TOKEN!,
          },
          { start, end, name, email, ownerEmail: context.env.OWNER_NOTIFY_EMAIL },
        );
  } catch (err) {
    await BOOKINGS?.delete(key); // free the slot again — no event was created
    console.error('booking failed:', err);
    return json(502, { error: 'could not create meeting, slot released' });
  }

  return json(200, { ok: true, meetLink, start, end });
};
