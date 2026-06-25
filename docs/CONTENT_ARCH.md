# Content Architecture

## Collections (src/content/)

### experience/
Schema fields: `title`, `company`, `start` (date), `end` (date | null), `description`, `stack` (string[])
Render order: newest first.
Add entry: drop `.md` file in `src/content/experience/`.

### extras/
Schema fields: `title`, `description`, `url` (optional), `tags` (string[])
Add entry: drop `.md` file in `src/content/extras/`.

## i18n Routing

Astro built-in i18n:
- Default locale: `en` → `src/pages/index.astro`
- Secondary: `pt` → `src/pages/pt/index.astro`
- Language toggle component: `src/components/LangToggle.astro`

Phase 1: PT content stubs (duplicated EN). TODO markers on each PT string.

## Hardcoded (Phase 1)

- Hero text
- About bio
- Stack groups + learning marker
- Project cards (dummy data, TODO GitHub API)
- Activity widget (static placeholder, TODO live island)
- Contact links
