# The Quality Journey — Toolshop Test Report

An interactive report on the testing of **Practice Software Testing — Toolshop**,
carried out by the **Bug Hunters QA Team** under the Digital Egypt Pioneers
Initiative (DEPI), Software Testing track.

### Project context

- **Programme**: Digital Egypt Pioneers Initiative (DEPI)
- **Track**: Software Testing
- **Application under test**: [Practice Software Testing — Toolshop](https://practicesoftwaretesting.com)
- **Team**: Bug Hunters QA Team
- **Stage**: Execution complete; reporting delivered
- **Report date**: 7 November 2026

### The result

| Figure | Value |
| --- | --- |
| User stories (one per module) | 10 |
| Test cases written | 603 |
| Executed | 530 (87.9%) |
| Passed | 425 |
| Failed | 103 |
| Blocked | 2 |
| Never run | 73 |
| Pass rate of executed cases | 80.2% |
| Defects logged | 50 |
| Failures never written up | 29 |
| Static review findings | 44 |

### What the site does not hide

The run finished, but it did not finish clean. These are stated on the pages
themselves, not buried:

- **US-005 Checkout, Address and Payment** has 72 cases written and reviewed and
  **zero executed**. It reads as *not run* everywhere, never as passed.
- **US-008 and US-009** were executed and produced **29 failures that were never
  written up** as defects. They exist only as a Failed verdict in a workbook.
- **US-007 Authentication** is the one module that was **never statically
  reviewed**.
- **US-010** has one case that was never executed.
- The **end-to-end purchase journey is 12 steps blocked out of 21** — the run
  stopped before creating an account, entering a password and confirming payment.
- Two static findings on US-001 carry **no severity**. They are reported as
  *Unrated*, never folded into Low.
- The pass rate of 80.2% is of **executed** cases. It is never presented as
  coverage.

### Where the numbers come from

Every figure on the site is generated, not typed:

```
D:\Tool shop\06 Dashboard\data\     meta.json, US-001..US-010.json, cross-module.json
          │
          ▼  scripts/generate-toolshop-data.mjs
src/data/toolshop.ts                 GENERATED - do not edit by hand
          │
          ▼
src/services/projectService.ts       assembles the page data from it
```

The generator reconciles its derived roll-ups against `meta.json` and refuses to
emit a file if they disagree, so the site cannot drift from the delivered
workbooks. To change a number, fix the workbook, re-run the dashboard generator,
then:

```bash
node scripts/generate-toolshop-data.mjs
```

The one exception is `src/data/testDesign.ts`, which holds **illustrative**
technique examples (equivalence partitioning, boundary value analysis, decision
tables, state transition) drawn against real Toolshop modules. The project's 603
cases do not record which technique produced each one, so no technique specimen
exists to publish. Every page that renders these labels them as illustrative.

### Structure

A two-level hash-routed SPA. The home page carries the narrative; the detail
pages carry the evidence.

**Home (`#/`)**

1. Result — the headline figures
2. Mission — what was tested and why
3. The Team — the people who ran it
4. The Work — index of the detail pages
5. Disciplines — the testing types actually carried out
6. Activities — the hands-on work in each discipline
7. Levels — component through acceptance, with the result at each
8. Delivery — the pipeline from user story to delivered report

**Detail pages**

| Route | Page | Headline figure |
| --- | --- | --- |
| `#/stories` | User Stories | 10 modules, 603 cases |
| `#/test-design` | Test Design Lab | 4 techniques (illustrative) |
| `#/traceability` | Traceability Matrix | 87.9% executed, 53 test areas |
| `#/defects` | Defect Management | 50 defects logged |
| `#/metrics` | Metrics & Risk | 80.2% pass rate of executed |

### Architecture notes

- **No network.** The results are final and ship with the bundle. There is no
  remote data source, no loading state, and no way for the page to disagree with
  the delivered workbooks.
- **Routing**: a dependency-free hash router (`src/lib/router.tsx`). Routes live
  under `#/…`; a bare `#section` stays an in-page anchor. Survives a refresh on
  any static host, GitHub Pages included.
- **Site map**: `src/lib/chapters.ts` is the single source of truth for the
  navbar, chapter rail, footer, Explore grid and detail routes. Every headline
  figure there is computed from the data, so a card cannot disagree with the page
  it introduces.
- **Traceability**: the matrix is derived from each module's `areas[]` breakdown
  (53 areas), so it regenerates rather than drifting by hand.
- **Boot curtain**: the first screen is a loading curtain inlined in
  `index.html` — markup, CSS and script, deliberately not a component. It has
  to paint before the CSS bundle and before React parses, otherwise the hero
  headline paints at its final position and is then yanked to `yPercent: 115`
  by the GSAP entrance, with the Syne face swapping in underneath it. Progress
  tracks real milestones (webfonts resolved, the app committed), never the
  `load` event, which waits on the team photographs far below the fold. The
  app's half of the handoff is `src/lib/boot.ts`: the hero builds its timeline
  paused and `onBooted` plays it, so the entrance runs into a page someone is
  actually looking at. Revealing the page is never left to a transition or
  animation — a throttled renderer can suspend those indefinitely — and a hard
  cap lifts the curtain even if the app fails to mount.
- **Motion**: one shared language via `src/components/Reveal.tsx` and
  `BlurTextReveal`, collapsing to a plain fade under `prefers-reduced-motion`.
  GSAP drives the hero and the legacy sections.

### Tech stack

React 18 · TypeScript · Vite 6 · Tailwind CSS 3 · Framer Motion 12 · GSAP 3

### Running it

```bash
npm install
npm run dev      # http://localhost:5174
npm run build    # typecheck + production bundle into dist/
npm run preview  # serve the production bundle
```
