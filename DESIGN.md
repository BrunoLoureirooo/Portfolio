# Design

Canonical visual system for the portfolio. Tokens here are the single source of truth, implemented in [src/styles/tokens.css](src/styles/tokens.css). Colors are committed by the brief (non-negotiable) — identity preserved, not re-derived.

## Theme

Dark, terminal-flavored, engineered. Reads like well-crafted code: exact, restrained, intentional. Terminal nods (monospace accents, prompt markers, dark surface) without terminal cosplay (no CRT, scanlines, boot sequences). Normal scroll, clickable nav, legible to non-technical readers.

Scene: a recruiter skims this on a laptop in a bright office, 10-second budget; later a senior engineer reads it carefully at night. Dark is chosen because the audience is dev-adjacent and the terminal flavor is the brand — not "dark because tools look cool."

Color strategy: **Restrained** — tinted dark neutrals carry the surface, one green accent ≤10% of surface, one amber used in exactly one place.

## Color

sRGB hex, committed by brief. All pairings **verified WCAG AA** (lowest: muted-on-surface 5.62:1; text-on-bg 16:1; accent-on-bg 9.4:1; learning-on-bg 9.7:1).

| Token | Value | Role |
|-------|-------|------|
| `--bg` | `#0d1117` | Base background |
| `--surface` | `#161b22` | Cards, raised surfaces |
| `--border` | `#30363d` | Hairlines, dividers |
| `--text` | `#e6edf3` | Body text |
| `--muted` | `#8b949e` | Secondary text, captions, labels |
| `--accent` | `#5dcaa5` | Terminal green — prompts, links, active states, tag pills |
| `--learning` | `#e3b341` | Amber — ONLY the "currently learning" marker, nowhere else |

Rules:
- One accent only. `--accent` is the sole brand color.
- `--learning` is single-purpose. It appears on the learning-group marker in Stack and nowhere else, ever.
- Muted text on `--bg` and on `--surface` must hold ≥4.5:1; verify before shipping any new muted usage.

## Typography

Two families on a contrast axis (mono vs sans), not two similar sans.

- **Mono** — `ui-monospace, "SF Mono", "JetBrains Mono", Consolas, monospace`. Used for: prompts, section markers, paths, labels, tags, the hero command line. System stack for v1 (zero font load).
- **Sans** — `system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif`. Used for: all body copy inside cards and prose. This contrast is deliberate — keeps it readable for non-technical readers. Body copy is NEVER mono.

Scale (custom properties, fluid where useful):
- `--text-xs` labels/captions
- `--text-sm` secondary
- `--text-base` body
- `--text-lg` lead
- `--text-xl` subheads
- hero display via `clamp()`, max ≤ 6rem, letter-spacing ≥ -0.04em

Body line length capped 65–75ch. `text-wrap: balance` on headings, `pretty` on prose.

## Spacing & Layout

- Spacing scale as custom properties (`--space-1` … `--space-12`), varied for rhythm — not uniform.
- Single-column reading measure for prose; grid only where 2D layout earns it.
- Responsive grids: `repeat(auto-fit, minmax(280px, 1fr))` where cards appear.
- Semantic z-index scale, no magic 999s.
- Mobile-first, responsive down to small phones.

## Components (Phase 1 skeleton)

Section-per-component: Hero, About, Stack, Projects, Activity, Extras, Experience, Contact, plus Nav + LangToggle + Footer. Cards used sparingly (Projects, Extras) — never nested. Tag pills use `--accent`. Prompt-style section markers in mono (e.g. `~/projects`), used as genuine wayfinding, not decorative numbered eyebrows.

## Motion

Exactly one flourish: hero typing/cursor animation. Everything else static.

- Ease-out exponential curves only. No bounce, no elastic.
- `@media (prefers-reduced-motion: reduce)`: cursor static, no type-on — content already fully visible by default (never gated behind a transition).
- Phase 1 implements the cursor as CSS-only (blink + static fallback text). Phase 2 may upgrade the type-on to a hydrated island; the static text becomes its fallback.

## Anti-slop guardrails

No gradient text, no side-stripe borders, no glassmorphism, no hero-metric template, no identical card grids, no tiny tracked uppercase eyebrows, no numbered section scaffolding unless the section is a real sequence (Experience timeline qualifies).
