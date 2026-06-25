# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal developer portfolio. Static Astro site hosted on Cloudflare Pages. Learning project — make unitary edits with explanations, not batch changes.

## Commands

```bash
pnpm dev                    # dev server (foreground)
pnpm astro dev --background # dev server (background) — stop with: pnpm astro dev stop
pnpm build        # static build (output: 'static')
pnpm preview      # preview build
pnpm astro check  # type-check
```

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

- Monospace: prompts, section markers, labels, tags, hero CLI
- Sans-serif: body text inside cards and prose
- One accent: `--accent: #5dcaa5`
- `--learning: #e3b341` — amber, ONLY for "currently learning" marker
- Motion: typing/cursor hero animation only. `prefers-reduced-motion` → cursor still, no type-on.
- No CRT, no scanlines, no boot sequences.

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
