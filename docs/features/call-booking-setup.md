# Call booking — one-time setup tutorial

Companion to [call-booking.md](call-booking.md) (architecture). This is the
click-by-click guide to go from "code works with a fake Meet link" to real
bookings in production, using a **dedicated Google account** whose only job is
owning the booking calendar, with all notifications landing in your **Proton
professional inbox**.

How the mail flows once done:

```
visitor books on brunoloureiro.dev
  → /api/book creates the event on the DEDICATED account's calendar
      → Google emails the invite (with the Meet link) to:
           • the visitor's address
           • your Proton address (added as attendee via OWNER_NOTIFY_EMAIL)
```

Your Proton address is an *attendee* on every event, so Google delivers the
invite straight to Proton — no Gmail forwarding required for bookings. (An
optional Gmail→Proton forward at the end catches the rest: RSVP replies,
cancellations, Google account notices.)

---

## Step 1 — Create the dedicated Google account

1. Open a private/incognito window (keeps your personal Google session out of it).
2. <https://accounts.google.com/signup> → create the account, e.g.
   `bookings.brunoloureiro@gmail.com`.
3. Recovery email: your Proton address. Turn on 2-step verification.

Why a separate account: the refresh token you'll mint gives whoever holds it
control of this account's calendar events. On a throwaway-purpose account the
blast radius of a leaked secret is "someone can put events on my booking
calendar", not your personal mail/calendar.

> Do everything in the following steps **inside this incognito window, logged
> in as the new account**. The refresh token binds to whichever account clicks
> "Allow", and the Cloud project should be owned by the same account.

## Step 2 — Google Cloud project + Calendar API

1. <https://console.cloud.google.com> (as the new account) → accept terms →
   top bar project picker → **New project** → name `portfolio-booking` → Create.
2. Make sure the new project is selected in the top bar.
3. **APIs & Services → Library** → search "Google Calendar API" → **Enable**.

No billing account is needed — the Calendar API is free at this scale. If the
Cloud project **Overview** page shows a "Google Auth Platform" check-up card
warning about a missing billing account, ignore it — that's a generic Cloud
nudge, unrelated to OAuth or Calendar working.

## Step 3 — OAuth consent (publish it!)

Google renamed "OAuth consent screen" to **Google Auth Platform**, split
across a few left-sidebar pages: Overview, Branding, Audience, Clients, Data
access, Verification Center, Settings. (Portuguese console: Visão geral,
Branding, Público-alvo, Clientes, Acesso a dados, Central de verificação,
Configurações.) This step uses **Audience**; Step 4 uses **Clients**.

1. Left sidebar → **Audience** (Público-alvo).
2. If this is the project's first visit here, it'll prompt you to configure
   the app first: User type **External** → Create. App name
   `portfolio-booking`, support email = the new Gmail, developer contact =
   the new Gmail. Save through the steps — skip adding scopes/test users.
3. Back on **Audience**: find **Publish app** and click it to move the app
   from Testing to **Production**.
   - It will say the app is *unverified*. That's fine — you are the only
     person who will ever consent to it.
   - **Do not leave it in Testing**: testing-mode refresh tokens expire after
     7 days and your booking would silently die a week after launch.

## Step 4 — OAuth client

1. Left sidebar → **Clients** (Clientes) → **+ Create client** (or
   **+ Create credentials → OAuth client ID** if you're on the older
   Credentials page).
2. Application type: **Web application**, name `portfolio-booking-local`.
3. Authorized redirect URIs → **Add URI** → exactly:
   `http://localhost:8787/callback`
4. Create → copy the **Client ID** (`…apps.googleusercontent.com`) and
   **Client secret** (`GOCSPX-…`).

> The client you created earlier under your personal account: delete it
> (Credentials page of that other project). Everything should live under the
> new account so it survives independently of your personal one.

## Step 5 — Mint the refresh token

In the repo:

```bash
node scripts/google-oauth.mjs <client_id> <client_secret>
```

1. The script prints a URL and waits on `localhost:8787`.
2. Open the URL **in the incognito window** (so the new account consents).
3. Google shows "Google hasn't verified this app" → **Advanced →
   Go to portfolio-booking (unsafe)** — expected for an unverified app you own.
4. Tick the calendar-events checkbox if asked → Continue.
5. Terminal prints `GOOGLE_REFRESH_TOKEN=…`. Copy it.

If the response has **no refresh_token**: the account already consented once
before — revoke it at <https://myaccount.google.com/permissions> and rerun.

## Step 6 — Local wiring + real-booking test

Edit `.dev.vars` (git-ignored): remove `BOOKING_DEV=1`, add:

```
GOOGLE_CLIENT_ID=<client id>
GOOGLE_CLIENT_SECRET=<client secret>
GOOGLE_REFRESH_TOKEN=<refresh token>
OWNER_NOTIFY_EMAIL=<your proton professional address>
```

Then:

```bash
pnpm start        # → http://localhost:8788
```

Book a slot with a second email you control as the "visitor". Verify:

- [ ] confirmation screen shows a real `meet.google.com/xxx-xxxx-xxx` link
- [ ] event appears on the new account's calendar (calendar.google.com in the incognito window)
- [ ] invite email arrives at the visitor address
- [ ] invite email arrives at your **Proton** inbox — accept it and it lands in Proton Calendar
- [ ] booking the same slot again fails with "slot not available"

Clean up the test: delete the event in Google Calendar ("send cancellation"
emails attendees). The local KV slot reservation lives only in `.wrangler/`
state — restart wipes it.

## Step 7 — Cloudflare production wiring

In <https://dash.cloudflare.com> → Workers & Pages → your Pages project:

1. **KV namespace**: left nav **Storage & Databases → KV → Create namespace**
   → name `portfolio-bookings`.
2. **Bind it**: Pages project → **Settings → Bindings** (older UI: Functions →
   KV namespace bindings) → Add → variable name **`BOOKINGS`** (must match
   exactly) → select the namespace. Add for **Production** (and Preview if you
   want test deploys bookable — usually leave Preview unbound).
3. **Secrets**: Settings → **Variables and Secrets** → add for Production,
   type **Secret**:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REFRESH_TOKEN`
   - `OWNER_NOTIFY_EMAIL` (plain text type is fine for this one)
   - **never** set `BOOKING_DEV` in production.
4. **Redeploy** (bindings/secrets apply to new deployments): push a commit or
   Deployments → … → Retry deployment.

Then repeat the Step 6 checklist once against the live site.

## Step 8 — Optional: forward the rest of the Gmail to Proton

Bookings already reach Proton via the attendee invite. To also see RSVP
replies ("visitor accepted"), cancellations, and Google notices without ever
opening the Gmail:

1. Gmail (new account) → ⚙ → See all settings → **Forwarding and POP/IMAP**.
2. **Add a forwarding address** → your Proton address.
3. Google emails a verification code **to Proton** — open it there, click the
   confirm link.
4. Back in Gmail settings: select **"Forward a copy of incoming mail to …"**
   → Save. (Optionally "delete Gmail's copy".)

## Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| `redirect_uri_mismatch` on the consent URL | Redirect URI on the OAuth client isn't exactly `http://localhost:8787/callback` |
| Consent screen refuses / `access_denied` | You're consenting with the wrong Google account, or the app is in Testing mode without you as a test user — publish to Production (Step 3) |
| Script prints `no refresh_token in response` | Account consented before — revoke at myaccount.google.com/permissions, rerun |
| Booking → 503 `booking not configured` | Missing secrets or missing `BOOKINGS` KV binding in that environment; redeploy after adding |
| Booking → 502 `could not create meeting` | Check the Pages Function logs. `invalid_grant` = refresh token expired (was the app left in Testing mode?) or revoked → re-mint (Step 5). Also confirm Calendar API is enabled |
| Works locally, 503 in prod | Secrets were added but no new deployment happened |
| Invite in Proton spam folder | Mark "not spam" once; subsequent Google Calendar invites are trusted |
| Slot booked but you want it freed | Delete the event in Google Calendar **and** delete the `booking:<ISO>` key in the KV namespace (dashboard → KV → your namespace → view) |
