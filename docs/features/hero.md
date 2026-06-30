# Feature: Hero

The 10-second hook. Terminal-framed identity block — the first and most
important screen. Answers *who is this* before any scroll.

## Composition (top → bottom)

1. Dim `Last login: …` line (atmosphere).
2. Prompt line: `bruno@portfolio` (green) · `:~$` (amber marks) · `whoami` (fg).
3. Big green **glowing** name (`--text-hero`, weight 700, `--glow-green`).
4. **Typewriter tagline** in amber, blinking block caret (the section's one caret).
5. **Neofetch panel** — bordered, faint green wash. Left: square box (green
   hairline border, `--green-line`) with glowing green initials. Right: a
   `bruno@portfolio` title line over a green separator rule (real-neofetch
   convention), then a key/value list with green keys and a dim aligned colon
   column — OS, Role, Uptime, Shell, Location, Langs, then a blank line and
   Status (`● available for hire`, `--status-available`).
6. **Quick links** row — bordered pills: `~/github`, `↳ email` (green hover glow),
   `resume.pdf ↓` (amber, real download).

## Motion (see /design-motion-principles pass — Jakub primary)

- Entrance: opacity + translateY(8px) + blur(4px), 450ms ease-out-quart, 70ms
  stagger, `backwards` fill. Reduced-motion → instant.
- Typewriter: JS types tagline ~42ms/char (`--type-speed`). Full text in DOM as
  fallback; reduced-motion shows it instantly, no typing.
- Caret: CSS `step-end` blink; reduced-motion pins solid (explicit override).
- Pill hover: 150ms green border + glow (box-shadow). No looping pulses.

## Data (Phase 1: hardcoded)

Name, tagline, neofetch values, and links are inline. PHASE 2 TODO: neofetch
"Langs"/activity could pull from the GitHub API alongside the Projects fetch.

## Accessibility

- Caret + decorative initials are `aria-hidden`.
- Tagline text present without JS (screen readers read the full string).
- Reduced-motion fully handled in the same component.
