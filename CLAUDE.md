# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal developer portfolio. Static Astro site hosted on Cloudflare Pages. Learning project — make unitary edits with explanations, not batch changes.

## Working style (NON-NEGOTIABLE)

This is a learning project. **Always make small, single-purpose edits, each immediately followed by a plain explanation of what it does and why.** Never write or rewrite a whole file in one shot when it can be built up incrementally. One concept per edit. The user is reading to understand every change — pace accordingly. If a change feels large, split it.

## Commands

```bash
pnpm start        # PRIMARY: build + serve LIVE (wrangler runs the edge Function) → :8788
pnpm dev          # fast HMR for UI work — no /api/activity Function, so the island shows build-time data only
pnpm build        # static build (output: 'static')
pnpm preview      # preview the static build (no Functions)
pnpm astro check  # type-check
```

`pnpm start` is the real local run: it executes `functions/api/activity.ts` (needs `.dev.vars`), so the live polling works. `pnpm dev` is mock-ish (no edge runtime). See [docs/features/github-data.md](docs/features/github-data.md).

## Stack (non-negotiable)

- **Astro** — `output: 'static'`, Cloudflare Pages target
- **CSS custom properties** only — no Tailwind
- **pnpm** package manager
- Islands only where strictly needed (Phase 1: zero live islands)
- i18n: `en` (default) + `pt` via Astro built-in routing

## File conventions

See [PRODUCT.md](PRODUCT.md) — strategic: register, users, voice, design principles (impeccable reads this).
See [DESIGN.md](DESIGN.md) — canonical visual system: tokens, typography, motion (impeccable reads this).
See [docs/CONTENT_ARCH.md](docs/CONTENT_ARCH.md) — content collections schema, i18n routing.
See [docs/PHASES.md](docs/PHASES.md) — what's stubbed, what's live, next phases.

## Architecture

```
src/
  layouts/       # BaseLayout.astro — single layout shell
  components/    # one component per section + shared nav/footer
  content/       # experience/ and extras/ collections (Zod schemas)
  styles/        # tokens.css (design system), global.css
  pages/
    index.astro        # en root
    pt/index.astro     # pt root
```

Content collections: `experience` and `extras` — adding an entry = drop a `.md` file, no code change.

## Design rules

- **Single font everywhere**: JetBrains Mono (400/500/700). No sans/mono split.
- Green is the hero — `--green: #00ff00` (prompts, headings, key accents).
- Amber is the ONE sparing accent — `--accent: #ffb000` (`:~$` marks, tags, CV button, section command prompts). No third hue.
- Body text `--fg: #b9f3c0`; green glow (`--glow-green`) on bright-green headings/prompts only, never body.
- GitHub heatmap uses GitHub's own green ramp (`--heat-0` … `--heat-4`).
- Whole page = one terminal window (title bar + traffic dots + live clock, sticky nav).
- Motion: live clock, typewriter hero tagline (~42ms/char), timer-tween nav scroll (NOT `scrollTo` alone), CRT atmosphere. All honored under `prefers-reduced-motion` (no type-on, static caret, no CRT animation).
- **CRT mode ON by default** — scanlines, vignette, drifting scan band, subtle flicker. Tasteful, not nausea. No fake boot sequence / "press any key".

## Agent / skill rules

- Large-scale code analysis → deploy Haiku agents
- All visual changes → run `/impeccable` `/design-motion-principles`
- All interactions → `/caveman` active
- After 25% context → run `/compact`
- Each large feature → create `docs/features/<feature>.md` (plan first, then impl context)
- Test changes headlessly before marking complete
- CLAUDE.md max 200 lines — overflow goes to referenced docs/

## TODOs (Phase 1 stubs)

- GitHub REST API fetch (project cards + language stats)
- Live `~/now` activity island
- Nightly GitHub Actions cron + Cloudflare deploy hook
- Full PT translations
