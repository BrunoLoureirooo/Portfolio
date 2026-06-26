# Portfolio

Personal developer portfolio — a single-page, terminal-themed site. The whole
page is one terminal window: green-on-black phosphor, a sticky title bar with a
live clock, prompt-line section headings, and a tasteful CRT atmosphere. Static
Astro, deployed to Cloudflare Pages.

## Stack

- **[Astro](https://astro.build)** — `output: 'static'`, zero live islands in Phase 1
- **CSS custom properties** for the whole design system (no Tailwind)
- **JetBrains Mono** as the single typeface
- **pnpm** package manager
- **i18n** — `en` (default, `/`) + `pt` (`/pt/`) via Astro's built-in routing

## Commands

```bash
pnpm install                 # install dependencies
pnpm dev                     # dev server (foreground)
pnpm astro dev --background  # dev server (background) — stop: pnpm astro dev stop
pnpm build                   # static build → dist/
pnpm preview                 # preview the production build
pnpm astro check             # type-check
```

## Structure

```
src/
  layouts/BaseLayout.astro   # terminal window shell: title bar, clock, nav, CRT
  components/                # one component per section + Nav / Footer / LangToggle
  content/                   # experience/ and extras/ collections (Zod schemas)
  styles/                    # tokens.css (design system) + global.css (reset)
  pages/
    index.astro              # en root (/)
    pt/index.astro           # pt root (/pt/) — Phase 1 stub
```

Adding work history or extras is a content change, not a code change: drop a
`.md` file into `src/content/experience/` or `src/content/extras/` (validated
against the schema in `src/content.config.ts` at build time).

## Documentation

- [PRODUCT.md](PRODUCT.md) — audience, voice, design principles
- [DESIGN.md](DESIGN.md) — canonical visual system (tokens, typography, motion)
- [docs/CONTENT_ARCH.md](docs/CONTENT_ARCH.md) — collections schema + i18n routing
- [docs/PHASES.md](docs/PHASES.md) — what's stubbed, what's live, next phases
- [docs/features/](docs/features/) — per-feature plans + implementation notes

## Status

Phase 1 (scaffold + skeleton). The GitHub activity section, project cards, and
`pt` translations are static stubs; the live GitHub API fetch and a nightly
deploy cron land in Phase 2 (see [docs/PHASES.md](docs/PHASES.md)).

## Accessibility & motion

Targets WCAG AA contrast, semantic HTML, and visible keyboard focus. All motion
(live clock, hero typewriter, nav scroll tween, CRT) is honored under
`prefers-reduced-motion`: no type-on, static caret, no CRT animation.
