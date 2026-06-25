# Phases

## Phase 1 — Scaffold & Skeleton (current)

### Done when
- `pnpm dev` runs clean, zero console errors
- All 8 sections render with placeholder content
- Design tokens file live
- Content collections configured (schema + 1 example entry each)
- i18n routing live with language toggle
- README.md written

### Stubs (Phase 2+)
- `src/components/Activity.astro` — static block, TODO comment for live island
- `src/components/Projects.astro` — 2-3 dummy cards, TODO for GitHub API fetch
- `src/pages/pt/index.astro` — PT content duplicated from EN, TODO for real translation
- No GitHub Actions workflow yet

## Phase 2 — Live Data

- GitHub REST API fetch → real project cards + language stats
- `~/now` activity island (Astro island, client:idle)
- Nightly GitHub Actions cron + Cloudflare deploy hook

## Phase 3 — Polish & Launch

- Full PT translations
- Final font selection
- SEO / OG images
- Analytics (privacy-first)
