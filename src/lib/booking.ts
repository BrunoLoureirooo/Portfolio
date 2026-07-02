// Slot math for /api/slots and /api/book — see docs/features/call-booking.md.
// All windows are defined in Bruno's wall-clock time (Europe/Lisbon) and
// converted to absolute UTC instants here, server-side, so the browser only
// ever sees unambiguous ISO timestamps it can render in the visitor's zone.

export const SLOT_MINUTES = 30;
export const HORIZON_DAYS = 14; // how far ahead the picker goes
export const MIN_LEAD_MINUTES = 60; // no "call me in 5 minutes" bookings
const TZ = 'Europe/Lisbon';

// Windows as minutes-since-midnight [start, end) in Lisbon time.
// Weekdays: 13:30–14:00 + 19:00–22:00. Weekends: 09:00–18:00.
const WEEKDAY_WINDOWS: Array<[number, number]> = [
  [13 * 60 + 30, 14 * 60],
  [19 * 60, 22 * 60],
];
const WEEKEND_WINDOWS: Array<[number, number]> = [[9 * 60, 18 * 60]];

export interface Slot {
  start: string; // UTC ISO, also the booking's identity/KV key
  end: string;
}

// How far Lisbon wall-clock is ahead of UTC at a given instant (0h or +1h,
// DST-dependent). Workers have full Intl, so we ask it what the wall clock
// reads at that instant, then diff against the instant itself.
function tzOffsetMs(at: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(at);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  const wall = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return wall - at.getTime();
}

// "13:30 Lisbon wall time on 2026-07-02" → the real UTC instant.
// Guess the instant as if Lisbon were UTC, then subtract the zone offset.
// Re-check once because the offset itself can differ across a DST switch.
function lisbonWallToUtc(y: number, m: number, d: number, minutes: number): Date {
  const guess = Date.UTC(y, m - 1, d, 0, minutes);
  let ts = guess - tzOffsetMs(new Date(guess));
  const offset = tzOffsetMs(new Date(ts));
  if (guess - offset !== ts) ts = guess - offset;
  return new Date(ts);
}

// Every bookable slot in the horizon, regardless of KV state — the endpoints
// subtract taken ones. Days are walked on Lisbon's calendar (what "today" and
// "Saturday" mean to Bruno), then each wall-clock window is emitted as UTC.
export function generateSlots(now: Date = new Date()): Slot[] {
  // Today's date on the Lisbon calendar (UTC getters read the shifted clock).
  const lisbonNow = new Date(now.getTime() + tzOffsetMs(now));
  const earliest = now.getTime() + MIN_LEAD_MINUTES * 60_000;
  const slots: Slot[] = [];

  for (let i = 0; i < HORIZON_DAYS; i++) {
    // Date.UTC normalizes day overflow (July 35 → August 4) — free day math.
    const day = new Date(Date.UTC(
      lisbonNow.getUTCFullYear(), lisbonNow.getUTCMonth(), lisbonNow.getUTCDate() + i,
    ));
    const isWeekend = day.getUTCDay() === 0 || day.getUTCDay() === 6;
    const windows = isWeekend ? WEEKEND_WINDOWS : WEEKDAY_WINDOWS;

    for (const [from, to] of windows) {
      for (let m = from; m + SLOT_MINUTES <= to; m += SLOT_MINUTES) {
        const start = lisbonWallToUtc(
          day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), m,
        );
        if (start.getTime() < earliest) continue;
        slots.push({
          start: start.toISOString(),
          end: new Date(start.getTime() + SLOT_MINUTES * 60_000).toISOString(),
        });
      }
    }
  }
  return slots;
}

// A POSTed start is only valid if it's byte-identical to a slot we'd offer
// right now — one check covers grid alignment, windows, horizon, and lead time.
export function isValidSlotStart(startIso: string, now: Date = new Date()): boolean {
  return generateSlots(now).some((s) => s.start === startIso);
}
