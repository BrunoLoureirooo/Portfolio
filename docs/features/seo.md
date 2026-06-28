# Feature: SEO, social cards, analytics, contrast (Phase 3)

Host-agnostic by design — everything derives from `site` (astro.config, or the
`SITE` env var), so it works unchanged on Cloudflare Pages, GitHub Pages, or the
`brunoloureiro.dev` domain.

## Canonical origin

`astro.config.mjs` sets `site` (default `https://brunoloureiro.dev`, override
with `SITE=…`). Canonical tags, Open Graph URLs, the sitemap, and robots all
build absolute URLs from it.

## SEO meta — `src/components/SEO.astro`

Rendered in `<head>` by `BaseLayout`. Emits: `<title>`, description, canonical,
`robots`, `theme-color`, full Open Graph (incl. `og:image` 1200×630 +
`og:locale`/`:alternate`), Twitter `summary_large_image`, and **hreflang**
alternates (`en` / `pt` / `x-default`). Title + description come from the i18n
dictionary via `BaseLayout` (`meta.title`, `meta.description`), so they're
localized and single-sourced.

## Sitemap + robots

- `@astrojs/sitemap` integration → `sitemap-index.xml` + `sitemap-0.xml` at the
  root, listing `/` and `/pt/`.
- `src/pages/robots.txt.ts` — an endpoint (not a static file) so the `Sitemap:`
  line is built from `site` and always matches the deploy host. Prerenders to
  `/robots.txt` in the static build.

## OG image — `scripts/og.mjs` → `public/og.png`

Build-time generator: authors an SVG mirroring the terminal window (traffic
dots, prompt, glowing green name, amber tagline, status + domain) and rasterizes
it with `sharp`. Committed as `public/og.png`. Regenerate after a brand/copy
change: `pnpm og`. Strings/colors are duplicated in the script on purpose (it's
a standalone tool, not in the Astro graph) — keep in sync with tokens.css/Hero.

## Analytics — `src/components/Analytics.astro`

Plausible (cookieless, no consent banner, host-independent). Renders **only**
when `PUBLIC_PLAUSIBLE_DOMAIN` is set at build, so dev + unconfigured builds ship
zero tracking. Enable in production:
`PUBLIC_PLAUSIBLE_DOMAIN=brunoloureiro.dev pnpm build`. Self-hosted? Set
`PUBLIC_PLAUSIBLE_SRC`. (See `.env.example`.)

## Contrast (WCAG AA)

Audited every text color against `--bg` and `--panel`. Only `--dim` failed
(3.0:1 as small body text); raised `#3a6a45` → `#56895f` (≥4.5:1 on both) while
keeping it dimmer than `--muted` so the hierarchy holds. All other tokens pass
comfortably (fg 15:1, green 14:1, accent 10.8:1).

**Known caveat:** the decorative CRT overlay (scanlines + vignette) lowers
*effective* on-screen contrast, most at the screen corners. Page content sits
centered in the window away from those corners, and the declared tokens meet AA;
the overlay is intentionally subtle and brand-core (CRT on by default).
