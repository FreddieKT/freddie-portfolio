# Kanban Plan — KTT.DEV Portfolio

## Workflow Principle

This project will use a Kanban orchestrator workflow. The parent session plans and routes. Workers execute specific tasks in the project directory.

## Workspace

All real implementation tasks must use:

`dir:/Users/ktythaung/Desktop/Projects/ktt-dev-portfolio`

Do not use scratch for implementation unless the task is explicitly exploratory.

## Proposed Task Graph

```text
T1  pm           finalize planning docs and acceptance criteria
T2  builder      scaffold Astro project safely                         parent: T1
T3  frontend-eng implement dark-first tokens and grid system            parent: T2
T4  frontend-eng implement header, hero, terminal, profile components   parent: T3
T5  frontend-eng implement project cards, metrics strip, footer         parent: T4
T6  frontend-eng compose homepage and responsive layout                 parent: T5
T7  reviewer     visual fidelity, accessibility, and content review     parent: T6
T8  frontend-eng fix review deltas                                      parent: T7 if blocked
T9  reviewer     final readiness review                                 parent: T8 or T7
```

## Acceptance Criteria

- Astro project exists in the project folder only after T1 is complete.
- Homepage visually matches the generated KTT.DEV prototype direction.
- Dark-first grid/checker background, dashed borders, terminal card, profile/status card, project cards, metrics strip, and footer/status bar are represented.
- Honcho is not copied directly: no Honcho logo, mascot, copy, or proprietary brand wording.
- Core docs remain present and current.
- `npm run build` passes.
- Placeholder/demo metrics are not presented as verified live facts unless Freddie provides source data.
- No replacement of the existing live portfolio happens without explicit approval.

## Worker Instructions

Every worker must read:

- `README.md`
- `docs/DESIGN.md`
- `docs/ARCHITECTURE.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/RISK.md`

Frontend workers must also inspect:

- `assets/reference/prototype-honcho-architecture.png`
- `docs/CONTENT_MAP.md`
- `docs/STYLE_GUIDE.md`

## Review Gate

Reviewer must check:

- visual fidelity to `assets/reference/prototype-honcho-architecture.png`
- accessibility
- responsive layout
- no direct Honcho brand copying
- no unverified live-stat claims
- build status
- docs consistency
