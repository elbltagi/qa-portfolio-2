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
- **Report date**: 11 November 2026

### The result

| Figure | Value |
| --- | --- |
| User stories (one per module) | 10 |
| Test cases written | 603 |
| Executed | 602 (99.8%) |
| Passed | 470 |
| Failed | 130 |
| Blocked | 2 |
| Never run | 1 |
| Pass rate of executed cases | 78.1% |
| Defects logged | 59 |
| Failures never written up | 29 |
| Static review findings | 44 |

### What the site does not hide

The run finished, but it did not finish clean. These are stated on the pages
themselves, not buried:

- **US-008 and US-009** were executed and produced **29 failures that were never
  written up** as defects. They exist only as a Failed verdict in a workbook.
- **US-007 Authentication** is the one module that was **never statically
  reviewed**.
- **US-010** has one case that was never executed — the only one left in the
  project.
- The **end-to-end purchase journey now reaches all 21 steps**, but 3 of them
  fail; those failures are written up in their own bug report.
- **6 of the 10 cross-module integration cases failed**, the weakest result here.
- Two static findings on US-001 carry **no severity**. They are reported as
  *Unrated*, never folded into Low.
- The pass rate of 78.1% is of **executed** cases. It is never presented as
  coverage.

> Execution finished late in the project: US-005 Checkout was the last module to
> run, which moved the figures from 530 executed / 50 defects to 602 / 59 and
> dropped the pass rate from 80.2% to 78.1%. Re-running the generator is what
> surfaced that, and it is why nothing on this site is typed by hand.

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

There is no longer any exception: every figure and every page on the site comes
from the delivered workbooks. The Test Design Lab, which held *illustrative*
technique examples rather than delivered work, has been removed — the site now
shows the four artefacts the project actually produced and nothing else.

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
8. Timeline — the nine-week plan, and the three weeks never run

**Detail pages — one per delivered artefact**

| Route | Page | Headline figure |
| --- | --- | --- |
| `#/stories` | User Stories | 10 user stories delivered |
| `#/test-cases` | Test Cases | 603 written, 602 run, 1 never run |
| `#/bugs` | Bugs | 59 logged, 29 failures never written up |
| `#/summary` | Test Summary Report | 78.1% pass rate of executed |

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
