# Freddie K. Portfolio Implementation Plan

> **For Hermes:** Use Kanban orchestrator workflow for execution. Do not implement large chunks directly in the parent session.

**Goal:** Build an Astro-based portfolio prototype that matches the generated Freddie K. dashboard reference closely enough for visual review.

**Architecture:** Static-first Astro site with token-driven CSS, reusable components, and one polished homepage. The generated prototype is the visual target; Honcho is only an architectural reference and must not be copied directly.

**Tech Stack:** Astro, TypeScript, CSS variables, static assets.

---

## Current Decisions

- Project folder: `/Users/ktythaung/Desktop/Projects/ktt-dev-portfolio`
- Stage: planning/prototype only; not yet replacing the live portfolio.
- Docs scope: full documentation pack.
- Build method: Kanban orchestrator workflow.
- Visual fidelity target: generated Freddie K. prototype reference image.
- Theme priority: dark-first, because the reference image is dark.
- Content integrity: placeholder/demo metrics must not be presented as real live stats unless Freddie provides source data.

## Phase 0 — Planning and Guardrails

### Task 0.1: Confirm source of truth

**Objective:** Ensure workers use the prototype image and docs as canonical references.

**Files:**
- Read: `README.md`
- Read: `assets/reference/prototype-honcho-architecture.png`
- Read: `docs/DESIGN.md`
- Read: `docs/ARCHITECTURE.md`
- Read: `docs/CONTENT_MAP.md`
- Read: `docs/STYLE_GUIDE.md`
- Read: `docs/RISK.md`

**Verification:** Worker summary states that Honcho is not copied directly and that the prototype remains non-deployed.

### Task 0.2: Create Astro scaffold

**Objective:** Initialize an Astro app in the existing project folder without overwriting docs or reference assets.

**Command:**

```bash
cd /Users/ktythaung/Desktop/Projects/ktt-dev-portfolio
npm create astro@latest .
```

**Expected:** Astro project files are created while preserving `docs/` and `assets/reference/`.

**Approval gate:** If the CLI asks whether to overwrite existing files, stop and ask Freddie.

## Phase 1 — Design Tokens

### Task 1.1: Add token CSS

**Objective:** Create exact dark-first color, border, grid, and typography tokens from `docs/DESIGN.md`.

**Files:**
- Create: `src/styles/tokens.css`
- Modify: `src/styles/global.css`

**Verification:** Dark theme tokens exist and the grid/checker background renders without images.

### Task 1.2: Add base layout

**Objective:** Create global HTML structure, metadata, and shared page shell.

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`

**Verification:** Page renders with global background, correct title, and no client-side JavaScript beyond required interactions.

## Phase 2 — Components

### Task 2.1: Header component

**Objective:** Implement Freddie K. header with pixel/block logo treatment, path label, dashed nav buttons, contact CTA, and theme toggle.

**Files:**
- Create: `src/components/Header.astro`
- Create/Modify: `src/components/ThemeToggle.astro`

**Verification:** Desktop nav matches prototype structure and collapses safely on mobile.

### Task 2.2: Hero component

**Objective:** Implement bold uppercase hero claim, subheading, and category row.

**Files:**
- Create: `src/components/Hero.astro`

**Verification:** Hero matches prototype hierarchy and spacing.

### Task 2.3: Terminal card component

**Objective:** Implement CLI demo card for `afterglow`, `unfog`, `hermes skills doctor`, and `promptglass`-style tooling.

**Files:**
- Create: `src/components/TerminalCard.astro`

**Verification:** Commands are readable, styled as terminal output, and use prototype/demo copy only.

### Task 2.4: Profile/status card component

**Objective:** Implement original Freddie K. pixel avatar/profile card and `BUILDING` status block.

**Files:**
- Create: `src/components/ProfileStatusCard.astro`
- Create: `public/assets/avatar.svg` or equivalent original lightweight asset

**Verification:** The avatar is original and does not copy Honcho’s mascot.

### Task 2.5: Project card component

**Objective:** Implement reusable bordered project cards driven by project data.

**Files:**
- Create: `src/components/ProjectCard.astro`
- Create: `src/data/projects.ts`

**Verification:** Cards support index, title, label/category, summary, command snippet, status, and optional demo metrics.

### Task 2.6: Metrics strip and footer components

**Objective:** Implement systems/metrics strip and footer/status bar from the reference layout.

**Files:**
- Create: `src/components/MetricsStrip.astro`
- Create: `src/components/FooterStatus.astro`
- Create: `src/data/metrics.ts`

**Verification:** Placeholder stats are labelled or phrased as prototype/demo indicators unless real source data exists.

## Phase 3 — Homepage Composition

### Task 3.1: Compose homepage sections

**Objective:** Assemble header, hero, terminal card, profile card, project modules, metrics strip, and footer.

**Files:**
- Modify: `src/pages/index.astro`

**Verification:** Page visually resembles the generated prototype without using Honcho brand assets or wording.

### Task 3.2: Responsive pass

**Objective:** Ensure mobile and tablet layouts remain usable.

**Files:**
- Modify: component styles as needed.

**Verification:** Test at 375px, 768px, and desktop widths.

## Phase 4 — Review and Readiness

### Task 4.1: Visual/accessibility review

**Objective:** Compare implemented homepage against prototype and basic accessibility rules.

**Files:**
- Read: `assets/reference/prototype-honcho-architecture.png`
- Read: `docs/DESIGN.md`
- Read: `docs/RISK.md`

**Verification:** Reviewer lists visual deltas, accessibility deltas, and pass/fail.

### Task 4.2: Build verification

**Objective:** Run formatting/build checks.

**Commands:**

```bash
npm run build
```

**Verification:** Build passes.

### Task 4.3: Replacement decision gate

**Objective:** Decide whether this prototype should replace the current portfolio.

**Output:** Decision note added to `docs/READINESS.md`.

**Verification:** No deployment or replacement happens without Freddie approval, repo/source-of-truth selection, and migration plan.
