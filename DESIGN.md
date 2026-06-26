# Design

Canonical visual system for the portfolio. Tokens here are the single source of truth, implemented in [src/styles/tokens.css](src/styles/tokens.css). Colors and chrome are committed by the brief (non-negotiable) — identity preserved, not re-derived.

> **Direction change (2026-06-25):** this supersedes the earlier "restrained, no-CRT" system. The portfolio is now a full **terminal-window** treatment — green-on-black phosphor, one amber accent, CRT atmosphere on by default. PRODUCT.md, CLAUDE.md, and tokens.css have been reconciled; see [Implementation follow-ups](#reconciled--implementation-follow-ups) for what still rides the old semantics.

## Concept & tone

- **Metaphor:** the whole page is one terminal window. Every section is introduced by a shell command (`$ cat about.md`) and its "output" is the content.
- **Voice:** dry, confident, engineer-to-engineer. Comments use `#`. No marketing fluff. Easter-egg-friendly (`whoami`, `sudo hire-me`).
- **Not** a working REPL — terminal *styling* over a real scrolling site. Sticky nav, normal scroll, no required user typing.

## Color

Dark phosphor. sRGB hex, committed by brief. Green is the hero; amber is a sparing second accent only. No other hues.

| Token | Value | Role |
|-------|-------|------|
| `--bg` | `#0a0a0a` | Terminal screen |
| (page bg) | `#060806` | Behind the window — faint green radial glow at top |
| `--panel` | `#0d110d` | Cards, stat boxes |
| `--border` | `#1b291b` | Hairline borders |
| `--green` | `#00ff00` | Primary: prompts, headings, key accents (the star) |
| `--fg` | `#b9f3c0` | Body text (soft, readable green) |
| `--muted` | `#5f8f68` | Secondary text, labels |
| `--dim` | `#3a6a45` | Tertiary: timestamps, comments, file perms |
| `--accent` | `#ffb000` | Amber — the ONE second color: `:~$` prompt marks, tags, CV button, section command prompts |

**GitHub heatmap ramp** (GitHub's own greens, by intensity):

| Level | Value |
|-------|-------|
| empty | `#0d1f14` |
| 1 | `#0e4429` |
| 2 | `#006d32` |
| 3 | `#26a641` |
| 4 (busiest) | `#39d353` |

Rules:
- Green is the hero; amber is sparing accent **only** (`:~$` marks, tags, CV button, section command prompts). No third hue.
- Selection highlight = green bg / near-black text.
- Green text-glow `text-shadow: 0 0 8px rgba(0,255,0,.45)` on **bright-green headings and prompts only** — not body text.
- `--status-available: #39d353` — the bright-green `● available for hire` line (heatmap level-4 green).

## Typography

**One font, everywhere:** `JetBrains Mono` (Google Fonts), weights 400 / 500 / 700. Fallback `ui-monospace, "SF Mono", Menlo, monospace`. This is a deliberate reversal of the old mono/sans split — terminal authenticity requires single-font.

- Base body **14px**, line-height ~1.65.
- Hero name `clamp(34px, 7vw, 68px)`, weight 700, letter-spacing 1px.
- **Tabular numbers** (`font-variant-numeric: tabular-nums`) on the live clock and all stats.

## Layout / chrome

Centered terminal window: `max-width: 1080px`, 1px border, 10px radius, soft green outer glow. Top-to-bottom:

1. **Title bar** (sticky, `top:0`): three macOS traffic-light dots (`#ff5f56` `#ffbd2e` `#27c93f`), centered title `visitor@portfolio: ~/dev — zsh — 132×40`, right side `UTF-8` + **live ticking clock** (HH:MM:SS, updates every second).
2. **Nav + CV bar** (sticky, just below title bar): **left** = amber download button styled `$ wget cv.pdf ↓` (real `<a download>`). **right** = nav tabs `about · projects · experience · skills · github` as bordered pills; hover turns text + border amber.
3. **Content**: ~64px vertical rhythm between sections, horizontal padding `clamp(18px, 4vw, 46px)`.

**Section heading = prompt line:** `visitor@portfolio` (muted) + `:~$` (amber) + the command (bright green, glow). E.g. `cat about.md`, `ls -la ~/projects`, `git log --author=alex --all`, `cat ~/.config/skills.toml`, `gh activity --live`.

## Sections (in order)

### Hero (`#hero`)
- Dim line: `Last login: Wed Jun 25 14:08:21 on ttys001`.
- Prompt: `visitor@portfolio:~$ whoami`.
- **Big green glowing name.**
- **Typewriter tagline** in amber, types char-by-char on load (~42ms/char), blinking block caret.
- **Neofetch panel** (bordered, faint green wash): left = square box with big glowing green initials; right = key/value list, green keys — `OS`, `Role`, `Uptime`, `Shell`, `Location`, `Langs`, `Status: ● available for hire` (last line in `--status-available`).
- **Quick links** row: bordered pills — `~/github`, `↳ email` (green hover glow), `resume.pdf ↓` (amber, real download).

### About (`#about`)
`$ cat about.md` → 3 short paragraphs, max-width ~760px. First line opens with an amber `#` comment.

### Projects (`#projects`)
`$ ls -la ~/projects` → card grid `repeat(auto-fill, minmax(290px,1fr))`, 16px gap. Each card:
- Header: `▸ project-name` (green bold) + status pill (`● active` green / `○ stable` muted).
- One-line description (muted).
- Tech tags: small amber-bordered chips.
- Footer links: `git:repo →`, optional `↗ live`, dim `★ <stars>`.
- Hover: border → green, slight lift, green glow.

### Experience (`#experience`)
`$ git log --author=alex --all` → vertical timeline (left border + dot nodes; newest dot bright green w/ glow, older dim). Each entry: amber `[ 2023 — present ]`, green bold `Role @ Company`, 2–3 bullets, dim tech-stack line.

### Skills (`#skills`)
`$ cat ~/.config/skills.toml` → card grid. Card titles as TOML sections in amber: `[languages]`, `[data & messaging]`, `[infra & tooling]`, `[practices]`. Inside: green chips, faint green fill.

### GitHub (`#github`) — activity layer
`$ gh activity --live` + dim comment `# streams from the GitHub API — drop in your token to go live`. **Currently mocked**; this is the real-API plug-in point (contributions, recent commits, top languages).
- **Stat cards** (auto-fit, `minmax(150px)`): big green numbers — contributions/12mo, current streak, longest streak, PRs merged.
- **Contribution heatmap:** caption `N contributions in the last year`. 53-week × 7-day CSS grid (7 rows, `grid-auto-flow:column`, 12px cells, 3px gap, 2px radius), colored by heatmap ramp. `Less ▢▢▢▢▢ More` legend below. Horizontally scrollable on narrow screens.
- **Two panels** (auto-fit, `minmax(290px)`):
  - `$ git log --oneline -6` → 6 recent commits: amber short-hash, green repo name, right-aligned dim meta (`2h · +214 −38`), message on next line.
  - `$ gh api /langs` → language bars: label + %, thin track, green gradient fill (`#006d32 → #39d353`) with green glow.

### Footer
`visitor@portfolio:~$ exit` (green, blinking caret) → dim `Connection to <domain> closed.` → row of muted social links (`github`, `linkedin`, `x.com`, email) green on hover, right-aligned `© 2026 · built in vim, btw`.

## Motion & interactions

- **Nav scroll:** clicking a tab smooth-scrolls to section, offset for sticky bars (~122px). **Animate with a timer-based tween** (ease-out cubic, ~300–700ms) — do **not** rely on `scrollTo({behavior:'smooth'})` alone. Target = `el.getBoundingClientRect().top + scrollY − 122`, step toward it.
- **Live clock:** title bar, updates every second.
- **Typewriter:** hero tagline on load + blinking caret (CSS `blink` keyframes, `step-end`).
- **Hover:** pills/cards gain green border + glow; amber elements brighten.
- All transitions snappy (~150ms).
- `prefers-reduced-motion: reduce` → no type-on (tagline shown in full), caret static, no CRT animation. Content never gated behind a transition.

## CRT mode (toggleable, ON by default)

Fixed full-viewport overlay, `pointer-events:none`, above content:
- **Scanlines:** `repeating-linear-gradient(0deg, rgba(0,0,0,.16) 0 1px, transparent 1px 3px)`.
- **Vignette:** radial gradient darkening corners.
- **Drifting scan band:** ~140px faint green gradient bar, top→bottom on ~7s loop.
- **Subtle flicker:** overlay opacity oscillates gently (~4s).

Tasteful — atmosphere, not nausea. Suppressed under `prefers-reduced-motion`.

## Configurable options (toggles / props)

- `accent`: `amber` (default) | `cyan` `#22d3ee` | `magenta` `#ff4fd8` — swaps the single accent color.
- `crt`: on/off (default **on**).
- `available`: on/off — shows/hides `● available for hire`.

## Accessibility

- Body `--fg #b9f3c0` on `--bg #0a0a0a` — high contrast, AA-safe. **Verify `--muted #5f8f68` and `--dim #3a6a45` against `--bg` and `--panel`** before shipping — these are the at-risk pairings; restrict `--dim` to non-essential text (timestamps, comments).
- Real `<a>` / `<button>` elements; visible keyboard focus states on every interactive element.
- Semantic HTML throughout. Responsive: grids collapse, heatmap scrolls horizontally, nav tabs wrap.

## Content note

All copy is **realistic placeholder**, swappable. GitHub data is mocked — wire to the real GitHub API (contributions, events, languages) when ready. (See Phase 1 TODOs in [CLAUDE.md](CLAUDE.md).)

## Reconciled & implementation follow-ups

[PRODUCT.md](PRODUCT.md), [CLAUDE.md](CLAUDE.md), and [src/styles/tokens.css](src/styles/tokens.css) are now aligned with this direction. The following still ride the OLD token semantics — rework when building out sections:

- **[src/styles/tokens.css](src/styles/tokens.css)** keeps `--accent` (now amber), `--accent-dim`, `--learning`, `--learning-dim`, and `--font-sans` (aliased to mono) defined only to avoid breaking existing components. Anything that used `--accent` expecting *green* must move to `--green`. The "currently learning" amber marker collides with amber-as-accent — give it a distinguishing treatment.
- **[src/components/](src/components/)** (Hero, Section, Stack, About) and **[src/styles/global.css](src/styles/global.css)** style against the old palette/semantics — re-skin to the terminal system (green hero, amber accent, glow, prompt-line headings).
- **[src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro)**: load JetBrains Mono (Google Fonts) — the system stack no longer satisfies the single-font rule.
- **global.css**: selection highlight → green bg / near-black text; generic anchor color should not default to amber.
