# Product

## Register

brand

## Users

Primary: recruiters and hiring managers screening many candidates fast — often non-technical, working a ~10-second budget per portfolio, zero patience for clicks-to-find-info.

Secondary: technical leads / senior engineers who land here after the recruiter pass and evaluate depth — they read the architecture decisions, the stack groupings, the actual project reasoning.

The job to be done: answer "who is this, what do they do, what have they built, how do I reach them?" with confidence and near-zero effort. The site must serve both the skimmer and the scrutinizer without compromising for either.

## Product Purpose

A personal developer portfolio that functions as a calling card for employers. Success = a recruiter forms a clear, favorable judgment in ~10 seconds with no clicks, and a technical reader who digs deeper finds substance (architecture-led project framing, honest stack, real decisions).

Secondary purpose: a hands-on Astro learning vehicle for the owner. Build decisions favor clarity and teachability over cleverness.

## Brand Personality

Precise and engineered — the site should read like well-crafted code: exact, intentional, nothing decorative-for-its-own-sake. Restraint is the signal.

Confident and declarative — copy states facts, never hedges ("Built X to do Y", not "I tried to make a thing that maybe…"). Writing carries as much weight as visuals.

Full terminal treatment, not terminal-gated — the page is one terminal window (prompt-led sections, green-on-black phosphor, CRT atmosphere); but it behaves like a normal site: real scroll, clickable sticky nav, fully legible to non-technical readers. It is styling, never a barrier — not a working REPL.

Three words: **precise, declarative, technical.**

## Anti-references

- **Generic dev-folio.** No gradient hero, no animated skill-percentage bars, no grid of technology logo icons, no cookie-cutter template silhouette. If it looks like a Bootstrap/template starter, it has failed.
- **Terminal cosplay, badly done.** The terminal window + CRT atmosphere IS the brand — embraced fully, but tasteful. No fake boot sequence, no "press any key", no working-REPL pretense, no nausea-inducing CRT. Atmosphere, not gimmick.
- **Over-design.** No parallax, no scroll-jacking, no competing animations. Motion is purposeful and limited to: live clock, hero typewriter tagline, timer-tween nav scroll, and the CRT layer. Everything else static.
- **Hedging copy.** No "I'm passionate about…", no "aspiring", no apologetic framing of the learning stack.

## Design Principles

1. **The site is a work sample.** Craft, restraint, and correctness in the portfolio itself are the strongest evidence of competence. Practice what you preach.
2. **Ten-second legibility.** Hierarchy, copy, and structure must deliver who/what/built/contact before the visitor decides to leave. Structure does the work, not decoration.
3. **Declarative confidence.** State, don't hedge. Lead projects with architecture and decisions, not "a website I made".
4. **Honest seniority signal.** Show the learning stack (Java / Spring Boot) openly next to the established one (.NET) — confidence is showing growth in the open, not hiding it. Amber marker, no apology.
5. **Legible to both audiences.** Never sacrifice the non-technical recruiter's comprehension for the technical reader's delight, or vice versa. Mono for flavor, sans for everything that must be read.

## Accessibility & Inclusion

- Target WCAG AA contrast on all text. The supplied dark palette must be verified against AA (body ≥4.5:1, large text ≥3:1) before shipping.
- Responsive down to mobile.
- Visible keyboard focus states on every interactive element.
- Semantic HTML throughout.
- `prefers-reduced-motion` honored: the hero cursor goes static, no type-on animation.
