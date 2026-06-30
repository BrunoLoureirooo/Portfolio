# Feature: Audience-gated dual views (Portfolio v2)

**Status: planned.** This file owns *what* renders and *how it's wired*; the v2
[DESIGN.md](../../DESIGN.md) (two-audience terminal) owns *how it looks* —
`DESIGN §n` refs below point into it. Visual direction is no longer deferred.

The same site serves **two audiences** that want opposite things: recruiters
want technical depth (the v1 content), freelance clients want outcomes (fewer
no-shows, deposits collected, less admin). One page, two **views**, toggled by
an up-front audience selection. The selection is a **content switch, not
navigation** — no router, no separate URLs, both narratives live in the page and
only the chosen one shows. The two views are never merged; merging waters both
down.

## Core decision

- **One page, no new routes.** Stays `index.astro` (+ `pt/index.astro`).
- A single state value — the active **program** — gates everything, persisted in
  `localStorage` under key **`tp_view`** (DESIGN §4):
  - unset → the **entry moment** (in-terminal selection; first-ever visit). Path `~`.
  - `'recruiter'` → v1 content (ETM, .NET microservices, deep-dives, live
    `~/now`, GitHub stats — technical depth intact). Path `~/dev`.
  - `'client'` → the new outcome-first view (Part 2 below). Path `~/studio`.
- The title-bar **path segment is program-aware** (`~` / `~/dev` / `~/studio`),
  reflecting the active program (DESIGN §3).
- **Shared chassis** (rendered regardless of selection): nav, footer, i18n,
  terminal chrome, and the hero component (reused with per-view copy).

## State & rendering (the static-first wrinkle)

The spec asks for "one client island driving conditional rendering," but Astro
section components are **server-rendered** — JS can't mount/unmount them. So the
faithful, CDN-friendly interpretation:

- **Both views' markup ships in the static HTML**, each in its own wrapper
  (`[data-view="recruiter"]`, `[data-view="client"]`). Nothing is fetched or
  re-rendered on selection.
- A **tiny client controller** (the one "island", really just a small inline
  script — no framework tree to hydrate) owns the state:
  1. Reads `localStorage.tp_view`; if set, applies it; else shows the entry
     moment. A `startView` toggle (`ask` default · `recruiter` · `client`) can
     force-boot a program and skip the selector (DESIGN §11).
  2. Selection cards / the switch affordance write `tp_view` and flip a single
     attribute (`data-view` on `<html>` or a top wrapper). Each swap also
     **scrolls to top and restarts the typewriter** for the new program (DESIGN §8).
  3. **CSS** keys off that attribute to show exactly one program (and hide the
     entry moment once chosen). Pure attribute → CSS, so it's instant.
- **No-flash:** a blocking inline script in `<head>` sets `data-view` from
  `localStorage.tp_view` *before* first paint (same pattern as theme-no-flash
  scripts), so returning visitors never see the selector blink.
- Existing islands (`Activity.tsx`, `ProjectsCarousel.tsx`) stay as-is **inside**
  the recruiter view — they keep their own `client:*` directives.

This keeps the page fully static on Cloudflare Pages: both DOMs are in the HTML,
one small script + CSS decides what's visible.

### Entry moment (DESIGN §4)

Not a modal — an in-terminal boot/`whoami` sequence (title bar + clock already
showing, nav hidden): dim `Last login`, `whoami` → big green "Hi, I'm Bruno", a
one-line positioning sentence, then `./welcome.sh --select-audience` and two real
`<button>` cards: **▸ recruiter** (green-leaning, footer chip `$ open ~/dev`) and
**▸ client** (amber-leaning, `$ open ~/studio`). Choosing one swaps the program
(persist + scroll-top + restart typewriter). The card colors telegraph the two
worlds before entry.

### Switch affordance (DESIGN §5)

Always in the nav, after the section tabs: a **dashed-border pill** (distinct
from the solid section tabs) — `→ client` (amber) on recruiter, `→ recruiter`
(green) on client. Same swap behavior. Lets a curious recruiter peek at the
freelance side and vice versa.

## Recruiter view

Wrap the existing `main` sections (`Hero`, `About`, `Projects`, `Experience`,
`Stack`, `GitHub`) in the `recruiter` wrapper. Content and behavior unchanged —
this is v1. Hero copy comes from the per-view hero (recruiter framing).

## Client view (Deya structure — five sections, in order)

Rendered in the `client` wrapper. Guiding test for **every** section: *would a
busy tattoo-studio owner understand this in 5 seconds?* No engineering jargon.

> **Honesty rule (critical, DESIGN §7):** Bruno has **not shipped freelance work
> yet.** Nothing here may imply a delivered-client track record — no invented
> studio results, no "N studios shipped." Credibility comes from his real 6-year
> engineering background + an honest **first-client / founder-pricing** position.
> The samples card is a **concept demo**, never badged "live."

1. **Brief intro / hero** (`#c-hero` · `./pitch.sh`) — lead with the reusable
   **"I help" statement** (big green line, one clause flipped to `--fg` for
   emphasis): *I help [audience] [service] so they can [outcome]*. Sell the
   unlock, not the deliverable; be specific. Amber typewriter sub-line + caret.
   Max two CTAs: amber `$ book a 20-min call →` + green-hover `↳ see a sample
   build`. Draft: *"I help studios take bookings & deposits online — so you stop
   chasing no-shows and get paid up front."*
2. **Services (the "what")** (`#services` · `cat services.md`) — a tight set of
   **outcome cards** (not a feature grid), single theme (booking outcomes), each
   a plain-language result with a small amber `↳ outcome` tag. Draft set:
   *calendar fills itself · no-shows stop hurting · reminders that land · a site
   that looks like you.*
3. **Work / case study** (`#work` · `ls -la ~/demos`) — the proof, visual-first.
   **One repeatable card** (media | details), seeded with **only the Outcast
   concept demo**, badged amber **`◆ concept demo`** (NOT a green "live"). Per the
   honesty rule: describe it as a working demo of the booking flow — what he'd
   build *for you*. The big green numbers are **demo facts, not business results**
   (`60s` to book · `24/7` open · `0` phone calls). Capability chips (Online
   booking, Deposits, SMS reminders, Custom site). Optional <1-min walkthrough
   video. Closes with a dim **founder-pricing / first-client** line. Adding real
   work later = drop in another card (the list grows into a grid).
4. **About / why me** (`#c-about` · `whoami --client`) — short, client-centric,
   "why me." Real numbers translated to trust language: `6yr` building payments &
   scheduling · `1:1` direct, no agency layers · `1st` clients get founder
   pricing. Honest "studio work is new." Optional collapsible **FAQ**.
5. **Contact / final CTA** (`#contact` · `./contact.sh`) — explicit close in a
   green-wash panel, **max two** CTAs: amber `$ book a 20-min call →` + green-
   hover `↳ email bruno`. The call is the primary funnel entry.

## Samples collection (new)

Portfolio samples are **data-driven**, matching the project's content-collection
pattern (`experience`/`extras`). Add `samples` to `src/content.config.ts` with a
Zod schema mirroring the case-study card: `title`, `subtitle`, `badge` (defaults
to `concept demo` — honesty rule: never "live"), `summary`, `media[]` (one wide +
detail shots), optional `video`, `facts[]` (label + value — **demo facts, not
business results**), `capabilities[]` (chips), optional `process`/`deliverables`,
optional `testimonial`, plus `order` for "best first." Seed with one entry:
`outcast`. **Do not fabricate other samples** — Bruno authors those later. The
section renders the collection sorted by `order`, so growth is drop-in (one card
today, a grid later).

## i18n (EN/PT — PT matters here)

Local studios are the target market, so the client view especially needs PT.
- **UI chrome + fixed copy** (selection-screen labels, section headings, CTA
  labels, service blurbs, about copy, FAQ Q/A) → `src/i18n/ui.ts`, keyed, EN
  canonical + PT mirror. The **"I help" statement** lives here as a single key so
  it's reused verbatim in hero, Instagram bio, and cold-outreach DMs.
- **Samples** → localized per entry. Recommended: bilingual frontmatter fields
  (e.g. localized objects `{ en, pt }`) so a sample's two languages stay in sync
  in one file (decision below).

## CTAs

Capped at **two everywhere** (DESIGN §7). **Email** (parsed from the CV contact
block — see [cv-content.md](cv-content.md)) + **book-a-call** (`$ book a 20-min
call →`; scheduling provider/URL TBD — decision below). The call is the primary
client funnel; the recruiter view keeps its CV-download + email pair.

## Configurable toggles (must keep working — DESIGN §11)

The client view must not break these knobs:
- **`startView`** — `ask` (default) · `recruiter` · `client`. Force-boots a
  program (skips the selector) for previewing; else selector + `tp_view` decide.
- **`accent`** — `amber` (default) · `cyan` · `magenta`. Retints every amber
  element together — incl. the client view's primary CTAs (via `--accent`).
- **`crt`** — on/off (default on).
- **`available`** — on/off, shows/hides the recruiter `● available for hire` line.

## Visual direction

No longer deferred — it lives in the v2 [DESIGN.md](../../DESIGN.md). Pointers:
shared chrome + program-aware path (§3), entry moment (§4), switch affordance
(§5), recruiter sections to preserve (§6), client sections + honesty rule (§7),
motion / program-switch (§8), CRT (§9), a11y/i18n (§10). This file stays
functional; defer look-and-feel questions to DESIGN.md.

## Decisions to confirm

1. **Identity mismatch.** DESIGN.md uses placeholder **"Bruno Moreira" /
   `brunomoreira.dev` / Porto**, but the live site + CV are **Bruno Loureiro /
   `brunoloureiro.dev`**. Recommend: keep pulling name/contact from the CV (real
   identity) and treat DESIGN's name strings as placeholder only. Confirm.
2. **Case-study images.** DESIGN calls for "drag-and-drop / persistent drop
   slots." For a static prod site, recommend committed `media[]` in the `samples`
   collection (+ `public/`); an in-browser drag-drop + `localStorage` slot is an
   authoring convenience at most — confirm which you want.
3. **Replace canonical DESIGN.md?** The pasted v2 doc supersedes the v1
   (recruiter-only) [DESIGN.md](../../DESIGN.md). Want me to overwrite it (with a
   dated "supersedes" note matching its existing changelog style)?
4. **No-JS / crawler default.** Both views ship in the DOM for SEO. With JS off,
   recommend default-visible = recruiter so crawlers/no-JS get real content, not
   a dead selector.
5. **Sample localization shape** — bilingual frontmatter per entry (recommended)
   vs. paired per-locale files.
6. **Book-a-call provider** — Cal.com / Calendly link, or mailto-only for now.

## Build order

1. Entry moment + controller (`tp_view` state, localStorage, no-flash inline
   script, dashed switch pill, `startView` override).
2. Wrap existing sections in the recruiter view; scaffold the five client
   sections with placeholder copy, gated by the attribute.
3. Repeatable sample-card component + `samples` collection, seeded with Outcast
   only (visual-first).
4. Write/refine the "I help" statement + outcome-focused service copy.
5. PT translations for the client view.
6. Optional: <1-min walkthrough video.
7. Final pass: best samples first, two CTAs per view, FAQ toggles wired up.
