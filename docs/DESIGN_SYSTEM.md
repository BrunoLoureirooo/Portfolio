# Design System

## Tokens (src/styles/tokens.css)

```css
--bg:       #0d1117
--surface:  #161b22
--border:   #30363d
--text:     #e6edf3
--muted:    #8b949e
--accent:   #5dcaa5   /* prompts, links, active, tag pills */
--learning: #e3b341   /* ONLY: "currently learning" marker */
```

## Typography

**Monospace** — prompts, section markers, paths, labels, tags, hero CLI:
```
ui-monospace, "SF Mono", "JetBrains Mono", Consolas, monospace
```

**Sans-serif** — body text in cards and prose:
```
system-ui, -apple-system, "Segoe UI", sans-serif
```

Type scale: set via `--text-xs` through `--text-xl` custom properties.

## Motion

Single allowed flourish: typing/cursor animation on hero.
All else: static.
`prefers-reduced-motion`: cursor static, no type-on effect.

## Rules

- One accent color only (`--accent`)
- `--learning` amber used nowhere except the learning group marker in Stack
- No CRT, scanlines, boot sequences
- Terminal-flavored, NOT terminal-gated — normal scroll, clickable nav
