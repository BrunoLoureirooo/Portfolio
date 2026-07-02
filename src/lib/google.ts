// Minimal Google Calendar client for the /api/book Function — plain fetch, no
// SDK (Workers-friendly, zero deps). Auth model: Bruno consented ONCE via
// scripts/google-oauth.mjs, which yielded a long-lived refresh token; here we
// trade it for a ~1h access token on every booking (bookings are rare — no
// caching needed). See docs/features/call-booking.md.

export interface GoogleCreds {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

async function getAccessToken(creds: GoogleCreds): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      refresh_token: creds.refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) throw new Error(`google token refresh failed: ${res.status}`);
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

export interface MeetBooking {
  start: string; // UTC ISO
  end: string;
  name: string; // visitor's name → event title
  email: string; // visitor → attendee, gets the invite email
}

// Creates the event on Bruno's primary calendar and returns the Meet URL.
//   conferenceDataVersion=1 → "please mint a Meet room for this event"
//   sendUpdates=all         → Google emails the invite to the attendee
// Bruno is the organizer, so it lands on his calendar with normal reminders.
export async function createMeetEvent(creds: GoogleCreds, b: MeetBooking): Promise<string> {
  const token = await getAccessToken(creds);
  const url =
    'https://www.googleapis.com/calendar/v3/calendars/primary/events' +
    '?conferenceDataVersion=1&sendUpdates=all';

  const res = await fetch(url, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      summary: `Intro call — ${b.name}`,
      description: `Booked via brunoloureiro.dev by ${b.name} <${b.email}>.`,
      start: { dateTime: b.start },
      end: { dateTime: b.end },
      attendees: [{ email: b.email }],
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(), // idempotency key Google requires
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`google event create failed: ${res.status} ${await res.text()}`);
  const event = (await res.json()) as { hangoutLink?: string };
  if (!event.hangoutLink) throw new Error('google event created but no meet link returned');
  return event.hangoutLink;
}
