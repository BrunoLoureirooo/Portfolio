# Design

Canonical visual system for the portfolio. Tokens here are the single source of truth, implemented in [src/styles/tokens.css](src/styles/tokens.css). Colors and chrome are committed by the brief (non-negotiable) — identity preserved, not re-derived. Section numbers (`§n`) are stable anchors referenced from [docs/features/audience-views.md](docs/features/audience-views.md).

> **Direction change (2026-06-25):** terminal-window treatment — green-on-black phosphor, one amber accent, CRT on by default. Superseded the earlier "restrained, no-CRT" system.
>
> **v2 (2026-07-01):** adds the **two-audience** layer. The same terminal serves two **programs** — *recruiter* (the v1 content) and *client* (outcome-first freelance) — chosen at an in-terminal entry moment and swapped by a single attribute. The v1 visual system below is unchanged and becomes the recruiter program; v2 adds the entry moment (§4), switch affordance (§5), client program (§7), program-aware chrome (§3), and the program-switch motion (§8). Identity (name, contact) comes from the CV, not hard-coded strings.

## §1 — Concept & tone

- **Metaphor:** the whole page is one terminal window. Every section is introduced by a shell command (`$ cat about.md`) and its "output" is the content.
- **Voice:** dry, confident, engineer-to-engineer. Comments use `#`. No marketing fluff.
- **Not** a working REPL — terminal *styling* over a real scrolling site. Sticky nav, normal scroll, no required typing.
- **Two audiences, one page (v2):** recruiters want technical depth; freelance clients want outcomes. They get opposite content via a **content switch, not navigation** — no router, no separate URLs. Both programs live in the static HTML; one shows at a time. The two are never merged.

## §2 — Color & typography

Dark phosphor. sRGB hex, committed by brief. Green is the hero; amber is a sparing second accent only. No other hues.

| Token | Value | Role |
|-------|-------|------|
| `--bg` | `#0a0a0a` | Terminal screen |
| (page bg) | `#060806` | Behind the window — faint green radial glow at top |
| `--panel` | `#0d110d` | Cards, stat boxes |
| `--border` | `#1b291b` | Hairline borders |
| `--green` | `#00ff00` | Primary: prompts, headings, key accents (the star) |
| `--fg` | `#b9f3c0` | Body text (soft, readable green) |
| `--muted` | `#5f8f68` | Secondary text, labels (≈5.2:1 on `--panel`, AA body) |
| `--dim` | `#56895f` | Tertiary: timestamps, comments, file perms (≈4.7:1 on `--panel`, AA body) |
| `--accent` | `#ffb000` | Amber — the ONE second color: `:~$` marks, tags, CV button, section command prompts |

**GitHub heatmap ramp** (GitHub's own greens): empty `#0d1f14` · 1 `#0e4429` · 2 `#006d32` · 3 `#26a641` · 4 `#39d353`.

Rules:
- Green is the hero; amber is sparing accent **only**. No third hue.
- Selection highlight = green bg / near-black text.
- Green text-glow `--glow-green` on **bright-green headings and prompts only** — never body.
- `--status-available: #39d353` — the bright-green `● available for hire` line.

**One font, everywhere:** `JetBrains Mono` (400 / 500 / 700), fallback `ui-monospace, "SF Mono", Menlo, monospace`. This is a *literal* terminal, so single-mono is identity, not costume. Base body 14px, line-height ~1.65. Hero name `clamp(34px, 7vw, 68px)`, weight 700. Tabular numbers on the clock and all stats. `text-wrap: balance` on display headings.

## §3 — Shared chrome + program-aware path

Centered terminal window: `max-width: 1080px`, 1px border, 10px radius, soft green outer glow.

1. **Title bar** (sticky): three traffic-light dots, centered title, right side `UTF-8` + **live ticking clock** (HH:MM:SS).
   - **Program-aware path:** the title's path segment reflects the active program — `~` (entry moment) · `~/dev` (recruiter) · `~/studio` (client). The controller swaps just that segment (`#tb-path`) on load + on every switch.
2. **Nav bar** (sticky, below title): left = amber `$ wget cv.pdf ↓` (real download). Right = section tabs (program-specific, §6/§7), the **switch pill** (§5), and the language toggle.
3. **Content:** ~64px vertical rhythm, horizontal padding `clamp(18px, 4vw, 46px)`.

**Section heading = prompt line:** `bruno@portfolio` (muted) + `:~$` (amber) + the command (bright green, glow).

**State model (v2):** a single attribute `data-view` on `<html>` gates everything — `ask` | `recruiter` | `client` — persisted in `localStorage.tp_view`. Both programs ship in the static HTML, each in a `[data-view-content]` wrapper; CSS shows exactly one (no fetch, no re-render). A blocking `<head>` script sets `data-view` **before first paint** (no selector flash). With JS off / for crawlers the attribute is unset → CSS defaults to the **recruiter** program (real content, never a dead selector).

## §4 — Entry moment

Shown when `data-view='ask'` (first visit, or `startView` pinned to `ask`). **Not a modal** — an in-terminal boot/`whoami` sequence: the title bar + clock stay visible, nav hidden. Dim `Last login` → `whoami` prompt → big green glowing **"Hi, I'm Bruno"** → one-line positioning sentence → `./welcome.sh --select-audience` with a blinking caret → two real `<button>` cards:

- **▸ recruiter** — green-leaning, footer chip `$ open ~/dev`.
- **▸ client** — amber-leaning, footer chip `$ open ~/studio`.

Card tints telegraph the two worlds before entry. Choosing one persists `tp_view`, scrolls to top, moves focus into the chosen program, and restarts that program's typewriter. Cards carry a visible per-card focus ring (green / amber).

## §5 — Switch affordance

Always in the nav after the section tabs: a **dashed-border pill** (distinct from the solid section tabs) — `→ client` (amber) on the recruiter program, `→ recruiter` (green) on the client program. Both render; CSS shows the one that flips to the *other* program. Same swap behavior as the entry cards. Lets a curious recruiter peek at the freelance side and vice versa.

## §6 — Recruiter program (the v1 content — preserve)

Rendered in `[data-view-content="recruiter"]`. The default program; v1 unchanged. Sections in order, each a prompt-line heading:

- **Hero** (`whoami`) — dim last-login, big green glowing name, **amber typewriter tagline** (~42ms/char, blinking block caret), neofetch panel (initials box + key/value list, `Status: ● available for hire`), quick-link pills.
- **About** (`cat about.md`) — 3 short paragraphs, max-width ~760px, amber `#` opener.
- **Projects** (`ls -la ~/projects`) — card grid; header `▸ name` + status pill, one-liner, amber tech chips, footer links; hover → green border + lift + glow.
- **Experience** (`git log --author=bruno --all`) — vertical timeline; newest node bright green w/ glow, amber `[ 2023 — present ]`, green bold `Role @ Company`, bullets, dim stack line.
- **Skills** (`cat ~/.config/skills.toml`) — card grid, TOML-section titles in amber, green chips. The learning stack gets the amber marker, no apology.
- **GitHub** (`gh activity --live`) — stat cards (big green numbers), 53×7 contribution heatmap (GitHub ramp), recent-commits + top-languages panels. Live via the edge Function; mock fallback.

Nav section tabs: `about · projects · experience · skills · github`.

## §7 — Client program (outcome-first)

Rendered in `[data-view-content="client"]`. Guiding test for every section: *would a busy studio owner understand this in 5 seconds?* No engineering jargon. Five sections:

1. **Pitch / hero** (`./pitch.sh`) — leads with the canonical **"I help [audience] [service] so they can [outcome]"** statement (big green, second clause flipped to `--fg` for emphasis), amber typewriter sub-line + caret. Two CTAs max: amber `$ book a 20-min call →` + green-hover `↳ see a sample build`.
2. **Services** (`cat services.md`) — a tight set of **outcome cards** (not a feature grid), single booking theme, each a plain result with a small amber `↳ outcome` tag.
3. **Work** (`ls -la ~/demos`) — the proof, **visual-first**. One repeatable, data-driven `SampleCard` from the `samples` collection (sorted best-first), seeded with the **Outcast concept demo only**. Media | details; big green **demo facts** (`60s · 24/7 · 0`), capability chips, dim founder-pricing close. Adding work later = drop a `.md` (grows into a grid).
4. **About** (`whoami --client`) — short, client-centric "why me." Real background as trust language; honest that studio work is new. Optional FAQ toggle (planned).
5. **Contact** (`./contact.sh`) — green-wash panel, two CTAs max: amber `$ book a 20-min call →` + green-hover `↳ email bruno` (email from the CV).

Nav section tabs: `services · work · about · contact`.

> **Honesty rule (critical).** Bruno has **not shipped freelance work yet.** Nothing here may imply a delivered-client track record — no invented studio results, no "N studios shipped." Credibility comes from the real engineering background + an honest **first-client / founder-pricing** position. Samples are **concept demos**, never badged "live": the `samples` schema defaults `badge` to `concept demo` / `demo conceito`, and `facts` are **demo facts, not business results**.

**CTAs are capped at two per section everywhere.** Booking target is the `bookingUrl` config knob (Cal.com/Calendly when set), falling back to a pre-filled email so the CTA is never a dead anchor.

## §8 — Motion & program-switch

- **Program switch:** flips `data-view`, scrolls to top, moves focus into the new program, and **restarts that program's typewriter** (each hero listens for the `view:changed` event). Instant attribute → CSS swap, no cross-fade.
- **Nav scroll:** timer-based tween (ease-out cubic, ~300–700ms), offset for the sticky chrome — not `scrollTo` alone.
- **Live clock:** title bar, every second.
- **Typewriter:** recruiter tagline + client sub-line type on load and on (re)show; blinking block caret (`step-end`).
- **Hover:** pills/cards gain green (or amber, client) border + glow; amber elements brighten. Snappy (~150ms).
- All transitions ease out (quart/expo), no bounce. Content is never gated behind a transition (full text ships; type-on is enhancement).

## §9 — CRT mode (toggleable, ON by default)

Fixed full-viewport overlay, `pointer-events:none`, above content: scanlines, corner vignette, a ~140px green scan band drifting top→bottom (~7s), barely-there flicker (~4s). Tasteful — atmosphere, not nausea.

## §10 — Accessibility & i18n

- Body `--fg` on `--bg` is AA-safe; the at-risk `--muted` / `--dim` were verified (≈5.2:1 / ≈4.7:1 on `--panel`) — restrict `--dim` to non-essential text.
- Real `<a>` / `<button>` elements; visible keyboard focus on every interactive element (incl. per-card rings on the entry selector). Focus is moved into the new program after a swap, never stranded.
- Semantic HTML; responsive (grids collapse, heatmap scrolls, tabs wrap). Primary client CTAs are ≥44px touch targets.
- `prefers-reduced-motion`: no type-on (full text shown), caret static, no CRT animation, no card lift.
- **i18n:** `en` (default) + `pt` via Astro routing. UI chrome + fixed copy in [src/i18n/ui.ts](src/i18n/ui.ts) (EN canonical, PT mirror); the "I help" statement is one shared key. Samples are bilingual per entry (`{ en, pt }` frontmatter). CV-sourced personal data stays dynamic.

## §11 — Configurable toggles

One canonical home: [src/config.ts](src/config.ts) (+ tokens for color).

- **`startView`** — `ask` (default) · `recruiter` · `client`. Pins a program (skips the selector) for previewing; otherwise `tp_view` decides.
- **`bookingUrl`** — scheduling link for the client "book a call" CTA; `null` → pre-filled email fallback.
- **`accent`** — `amber` (default) · `cyan` `#22d3ee` · `magenta` `#ff4fd8` — retints every amber element together, incl. client primary CTAs (via `--accent`). *(token-level; wiring planned.)*
- **`crt`** — on/off (default on). *(planned.)*
- **`available`** — on/off, shows/hides the recruiter `● available for hire` line. *(planned.)*

## Content note

All copy is realistic placeholder, swappable. GitHub data wires to the real API via the edge Function (mock fallback). Identity and contact come from the CV.
