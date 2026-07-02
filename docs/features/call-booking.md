# Call booking (self-hosted)

Book-a-call CTA opens an in-page terminal-window modal (no Calendly/Cal.com).
Visitor picks a 30-min slot → a Cloudflare Pages Function creates a Google
Calendar event with a **unique Google Meet link** → Google emails the invite to
both Bruno and the visitor. Everything except that one Google API call lives in
this repo.

## Decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Meeting provider | Google Meet via Google Calendar API | Works with a personal Gmail (Teams' Graph API needs a paid M365 work tenant). One API covers meeting + both emails (`sendUpdates=all`). |
| Booking windows | Weekdays 13:30–14:00 and 19:00–22:00; weekends 09:00–18:00 — **Europe/Lisbon** | Owner availability. |
| Slot size / horizon / lead | 30 min / next 14 days / ≥60 min from now | Intro-call defaults. |
| Double-booking guard | Cloudflare KV namespace `BOOKINGS`, key = slot start ISO (UTC) | Simplest persistent store on Pages. KV is eventually consistent → a same-second race could double-book; acceptable at portfolio traffic (worst case: two invites, reschedule one). |
| Display timezone | Visitor's local TZ (slots computed as UTC instants server-side) | Honest UX; DST handled once, server-side. |
| No-JS fallback | CTA keeps `mailto:` href; island intercepts click when hydrated | Never a dead button. |
| Abuse guard | Honeypot form field + server-side slot validation | Turnstile is Phase 2 if spam appears. |

## Architecture

```
BookingModal.tsx (Preact island, mounted in ClientContact)
  ├─ GET /api/slots           → available slot starts (14 days, minus KV-taken, minus past)
  └─ POST /api/book {start,name,email}
        ├─ re-validate slot server-side (grid + window + horizon + KV)
        ├─ src/lib/google.ts: refresh token → POST calendar/v3 event
        │    conferenceData.createRequest (hangoutsMeet) + attendees + sendUpdates=all
        ├─ KV put booking:<startISO>  (expirationTtl 60 days)
        └─ → { meetLink, start, end }
src/lib/booking.ts — shared slot math (windows, Lisbon-TZ→UTC, validation)
```

## Env / bindings

| Name | Where | Purpose |
| --- | --- | --- |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | `.dev.vars` + Pages secrets | OAuth app credentials |
| `GOOGLE_REFRESH_TOKEN` | `.dev.vars` + Pages secrets | Long-lived token for Bruno's Gmail (mint with `scripts/google-oauth.mjs`) |
| `BOOKING_DEV` | `.dev.vars` only | `1` → skip Google, return fake Meet link (local testing without creds) |
| `BOOKINGS` (KV) | `--kv BOOKINGS` locally; KV namespace bound in Pages dashboard | taken-slot store |

## One-time Google setup

1. console.cloud.google.com → new project → enable **Google Calendar API**.
2. OAuth consent screen: External. **Publish to production** (stays "unverified"
   — fine, only Bruno consents). Testing mode would expire the refresh token
   every 7 days.
3. Credentials → OAuth client ID → Web application → redirect URI
   `http://localhost:8787/callback`.
4. `node scripts/google-oauth.mjs` → consent in browser with the Gmail →
   prints `GOOGLE_REFRESH_TOKEN`.
5. Cloudflare dashboard: create KV namespace `BOOKINGS`, bind to the Pages
   project; add the three secrets.

## Risks / Phase 2

- KV race (above). Fix if ever needed: Durable Object slot lock.
- Owner gets the event on his calendar but Google doesn't email organizers —
  rely on calendar notifications, or add Phase-2 email.
- Modal strings come via props from `ui.ts` (island stays i18n-dumb like DemoModal).
- Phase 2: Turnstile, cancellation links, reminder emails.
