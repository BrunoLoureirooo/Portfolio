# Feature: CV-driven content

The CV PDF is the **single source** for the About bio and the Experience
timeline. The PDF already has to exist for the download, so the site reads it
at build time instead of duplicating its content. Update the PDF → redeploy →
content updates. Locale-aware: `public/CV.pdf` (EN), `public/CV_PT.pdf` (PT).

## Mechanism

Build-time only (Node). `src/lib/cvContent.ts`:
- `unpdf` extracts the PDF text → one continuous string.
- Parse by the known section headers (`Summary`, `Skills & Certifications`,
  `Work Experience`, `Projects`, `Education`):
  - **summary** = text between `Summary` and `Skills & Certifications` → About.
  - **experience** = between `Work Experience` and `Projects`; split into roles
    on the date-range pattern (`MM/YYYY - MM/YYYY|Present`); each role →
    `{ title, company, start, end, bullets[] }`, bullets split on `●`.
- **Per-role stack:** the CV has no per-role tag field, so infer it by scanning
  each role's bullets against a tech keyword list.
- `getCvContent(locale)` returns `{ summary, experience }`.

## Resilience (the cost of PDF-as-source)

PDF text extraction is coupled to the CV's headers/layout. So:
- Everything is wrapped so a parse miss returns a **fallback** (static default
  summary + the example `experience/` collection entries). The build never
  breaks and no section ever goes blank.
- If the CV is restructured and parsing drifts, the fallback shows and the
  parser's slice points need a tweak — documented here as the known risk.

## Consumers

- `About.astro` → renders `summary` (fallback string if empty).
- `Experience.astro` → renders parsed roles with their bullets (2–3 per DESIGN);
  falls back to the `experience` content collection if parsing yields nothing.

## i18n

`getCvContent(Astro.currentLocale)` picks the matching PDF. PT content comes
free once `CV_PT.pdf` is a real translated CV.
