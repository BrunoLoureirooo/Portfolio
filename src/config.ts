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
