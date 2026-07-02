# Demo modal (iframe live demos)

Each sample card's "▸ open live demo" button opens the demo site in an
in-page terminal-window modal (iframe) instead of navigating away — the
visitor previews the work without leaving the pitch. "open full ↗" in the
modal's title bar is the escape hatch to a real tab.

## Decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Trigger wiring | Event delegation on `[data-demo-url]` (document-level click listener) | Cards stay static Astro — zero per-card JS. One island serves every card, present and future. |
| Mounting | One `<DemoModal client:idle />` in ClientWork | Hydrates when idle; costs nothing until a button exists to click. |
| iframe `src` | Only set while open | Demo site isn't fetched until asked for — no hidden traffic to it on page load. |
| Loading state | Terminal loader ("loading demo…" + blinking ▮, `steps(2)`) under the iframe; iframe `opacity: 0 → 1` on `load` | No white flash mid-fetch; blink is the site's TTY idiom and dies on load. Static cursor under `prefers-reduced-motion`. |
| i18n | Labels resolved in Astro (`c.demo.*` / `c.work.*` keys) and passed as props | Island stays i18n-dumb — same pattern as BookingModal. Per-locale page ships its own strings in the hydration payload. |
| a11y | `role="dialog"` + `aria-modal`, ESC closes, focus moves to close button on open and back to the trigger on close, Tab wraps at panel edges, loader is `role="status"` | Standard dialog contract. Keydown trap alone can't catch focus tabbing OUT of the cross-origin iframe (keys stay in the child doc) — a zero-size focus **sentinel** after the iframe punts exiting focus back to the first control. |
| Title bar | Traffic-light dots mirroring the page's own — **red is the close button** (no separate ✕), yellow/green decorative | Same window language as the layout: red already means "close this program" there. One close control, no duplicate a11y announcements. |
| Scroll lock | `body { overflow: hidden }` while open, restored on close | Scrolling the demo shouldn't scroll the portfolio behind it. |
| z-index | `--z-modal` (300), **below** the CRT overlay (500) | Scanlines fall over the demo too — it lives "inside the terminal". |

## Architecture

```
SampleCard.astro (static)
  └─ <button data-demo-url data-demo-title>   ← from samples collection demoUrl
DemoModal.tsx (Preact island, mounted once in ClientWork)
  ├─ document click delegation on [data-demo-url] → open
  ├─ loader (role=status) → iframe onLoad → fade in
  └─ ESC / backdrop / ✕ → close, focus restored
DemoModal.css — terminal window chrome, tokens only
```

## Constraints on demo sites

- **Must allow framing** — the hosted demo needs `frame-ancestors` (in its
  `_headers` on Pages) permitting this origin, or the iframe renders blank.
  Browsers still fire `load` on blocked frames, so there is no reliable
  in-page detection; "open full ↗" is the fallback.
- `outcast.md` still points at `https://example.com` (wiring proof) — replace
  `demoUrl`/`repo` with the real hosted demo when it ships.

## Not done (deliberate)

- No frame-blocked detection (unreliable cross-browser, see above).
- No history/back-button close — ESC + backdrop + ✕ cover it; revisit if
  mobile users report getting "stuck".
