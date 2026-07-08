// Site-wide configuration knobs (documented in DESIGN.md "Configurable options").
// One canonical place so previews/tweaks don't hunt through components.
//
// Only `startView` is wired today (v2 audience-gated views). The other
// documented toggles (accent / crt / available) join here as they're built.

// Which program boots first:
//   'ask'       → show the entry moment (audience selector) on first visit
//   'recruiter' → force-boot the recruiter view, skip the selector
//   'client'    → force-boot the client view, skip the selector
// `localStorage.tp_view` overrides this on return visits — UNLESS startView is
// pinned to a specific program (then it always wins, for previewing).
export type StartView = 'ask' | 'recruiter' | 'client';
export const startView: StartView = 'ask';

// Booking CTA target (audience-views.md "Decisions to confirm" #6). Set to a
// scheduling link (Cal.com / Calendly) to send "book a call" straight there;
// null falls back to a pre-filled email so the CTA is never a dead anchor.
export const bookingUrl: string | null = null;

// Self-hosted booking modal (docs/features/call-booking.md) — code is done
// and tested, but it's STUBBED OFF: the Google account it needs (dedicated
// calendar owner, see docs/features/call-booking-setup.md) isn't finished —
// blocked on phone-verification + storage-quota issues on that account.
// false → CTA is a plain mailto with a visible "coming soon" note, so
// visitors never see a booking flow backed by an unconfigured API.
// Flip to true once GOOGLE_* secrets are live in Cloudflare Pages.
export const bookingEnabled = false;
