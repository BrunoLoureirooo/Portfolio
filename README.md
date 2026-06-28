# Portfolio

Personal developer portfolio — a single-page, terminal-themed site. The whole
page is one terminal window: green-on-black phosphor, a sticky title bar with a
live clock, prompt-line section headings, and a tasteful CRT atmosphere. Static
Astro with **live GitHub data** (via an edge Function, with a build-time
fallback so it runs on any static host) and content sourced from the CV PDF.

## Stack

- **[Astro](https://astro.build)** — `output: 'static'`; **Preact islands** only
  where data is live (GitHub activity + project cards)
- **Cloudflare Pages Function** (`functions/api/activity.ts`) for the ~5-min live
  GitHub poll; islands fall back to build-time data on any other host
- **CSS custom properties** for the whole design system (no Tailwind)
- **JetBrains Mono** as the single typeface
- **i18n** — `en` (default, `/`) + `pt` (`/pt/`); all UI strings in a keyed
  dictionary (`src/i18n/ui.ts`), `.resx`-style, single source per locale
- **CV-driven content** — the About bio + Experience are parsed from the CV PDF
  (`unpdf`) at build time; the PDF is the single source
- **pnpm** package manager

## Commands

```bash
pnpm install      # install dependencies
pnpm start        # PRIMARY: build + serve LIVE (wrangler runs the edge Function) → :8788
pnpm dev          # fast HMR for UI — no /api/activity Function, so the island shows build-time data
pnpm build        # static build → dist/
pnpm preview      # preview the static build (no Functions)
pnpm og           # regenerate the social card → public/og.png
pnpm astro check  # type-check
```

`pnpm start` is the real local run: it executes `functions/api/activity.ts`
(needs a `.dev.vars` with `GITHUB_TOKEN`), so live polling works. `pnpm dev`
skips the edge runtime and shows build-time data only.

## Structure

```
src/
  layouts/BaseLayout.astro   # terminal window shell: title bar, clock, nav, CRT, <head>
  components/                # one component per section + Nav / Footer / LangToggle / SEO
                             #   *.tsx = Preact islands (Activity, ProjectsCarousel)
  lib/                       # github.ts (data layer) · cv.ts / cvContent.ts (CV parsing)
                             #   useGitHubData.ts (shared island hook)
  i18n/                      # ui.ts (string dictionary) + utils.ts (useTranslations)
  content/                   # experience/ and extras/ collections (Zod schemas, fallback)
  styles/                    # tokens.css (design system) + global.css (reset)
  pages/
    index.astro              # en root (/)
    pt/index.astro           # pt root (/pt/)
    robots.txt.ts            # robots.txt as an endpoint (Sitemap URL from `site`)
functions/api/activity.ts    # Cloudflare Pages Function — the live GitHub poll
scripts/og.mjs               # build-time social-card generator (→ public/og.png)
```

Adding work history or extras is a content change, not a code change: drop a
`.md` file into `src/content/experience/` or `src/content/extras/` (validated
against the schema in `src/content.config.ts` at build time). The CV PDF takes
precedence for About + Experience; the collections are the fallback.

## Configuration

All optional — the build never breaks without them (mock GitHub data, no
analytics, default origin). See [.env.example](.env.example).

| Variable | Used by | Effect |
|----------|---------|--------|
| `GITHUB_TOKEN` | build + edge Function | real GitHub data; without it, deterministic mock |
| `GITHUB_USERNAME` | build + edge Function | whose data to fetch (default `BrunoLoureirooo`) |
| `SITE` | build | canonical origin for SEO/sitemap/OG (default `https://brunoloureiro.dev`) |
| `PUBLIC_PLAUSIBLE_DOMAIN` | build | enables cookieless Plausible analytics; unset → no tracking ships |

Locally, `pnpm start` reads `GITHUB_TOKEN` from `.dev.vars` (git-ignored) for the
edge Function. For a host without edge Functions (e.g. GitHub Pages), the site
still builds and serves build-time GitHub data.

## Documentation

- [PRODUCT.md](PRODUCT.md) — audience, voice, design principles
- [DESIGN.md](DESIGN.md) — canonical visual system (tokens, typography, motion)
- [docs/CONTENT_ARCH.md](docs/CONTENT_ARCH.md) — collections schema + i18n routing
- [docs/PHASES.md](docs/PHASES.md) — what's stubbed, what's live, next phases
- **Feature docs** ([docs/features/](docs/features/)):
  - [github-data.md](docs/features/github-data.md) — live data layer + edge Function
  - [cv-content.md](docs/features/cv-content.md) — CV PDF as the single content source
  - [i18n.md](docs/features/i18n.md) — the string dictionary + `useTranslations`
  - [seo.md](docs/features/seo.md) — SEO meta, OG card, sitemap, analytics, contrast
  - [hero.md](docs/features/hero.md) — Hero spec + motion

## Status

**Live:** GitHub activity + project cards (real API data, ~5-min refresh),
CV-driven About + Experience, full `en`/`pt` localization, and SEO/OG/sitemap/
robots/analytics with a WCAG AA contrast pass.

**Remaining:** align the Hero tagline + Skills copy with the CV, fill the Extras
section, and deploy (pick a host; set `GITHUB_TOKEN`, and `PUBLIC_PLAUSIBLE_DOMAIN`
for analytics).

## Accessibility & motion

WCAG AA contrast (audited — every text token ≥ 4.5:1 on its background),
semantic HTML, and visible keyboard focus. All motion (live clock, hero
typewriter, nav scroll tween, CRT) is honored under `prefers-reduced-motion`:
no type-on, static caret, no CRT animation.
