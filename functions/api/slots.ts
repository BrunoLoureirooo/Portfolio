// Cloudflare Pages Function → GET /api/slots.
// Returns every bookable 30-min slot in the next 14 days, minus ones already
// taken (KV). No edge caching on purpose: availability must be live, and the
// work is trivial (one KV list + array filter).
// See docs/features/call-booking.md.
import { generateSlots } from '../../src/lib/booking';

// The slice of Workers KV we use (full type lives in @cloudflare/workers-types;
// a local shape keeps this dependency-free, same approach as activity.ts).
export interface BookingsKV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  list(opts: { prefix: string }): Promise<{ keys: Array<{ name: string }> }>;
}

interface Ctx {
  env: { BOOKINGS?: BookingsKV };
}

export const KV_PREFIX = 'booking:';

export const onRequestGet = async (context: Ctx): Promise<Response> => {
  // Missing binding (e.g. `pnpm start` without --kv) → everything looks free.
  // Fine locally; in prod the POST handler re-checks and refuses to run blind.
  const kv = context.env.BOOKINGS;
  const taken = new Set(
    kv ? (await kv.list({ prefix: KV_PREFIX })).keys.map((k) => k.name.slice(KV_PREFIX.length)) : [],
  );

  const slots = generateSlots().filter((s) => !taken.has(s.start));

  return new Response(JSON.stringify({ slots }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
};
