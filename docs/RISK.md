# Risk Register

## Risk 1 — Direct Brand Copying

**Risk:** The portfolio may look too close to Honcho.

**Control:** Use Honcho only as UI/UX architecture reference. Use original Freddie K. content, logo/avatar, wording, project structure, and visual details.

## Risk 2 — Visual Drift From Prototype

**Risk:** Implementation may become generic Astro/Tailwind instead of matching the prototype.

**Control:** Keep `assets/reference/prototype-honcho-architecture.png` as visual source of truth. Reviewer must compare against it, especially dark-first grid, dashed borders, terminal/profile panels, project cards, metrics strip, and footer/status bar.

## Risk 3 — Replacing Live Portfolio Too Early

**Risk:** New prototype could accidentally replace the current portfolio before approval.

**Control:** This folder is planning/prototype only. No deployment or repo replacement without explicit Freddie approval.

## Risk 4 — Overbuilding

**Risk:** Adding backend, CMS, dashboards, auth, or unnecessary interactivity.

**Control:** MVP is one static Astro homepage with reusable components and data-driven content.

## Risk 5 — Content Confusion

**Risk:** Mixing unrelated business/logistics/n8n content into personal portfolio.

**Control:** Content is focused on Freddie K., AI agents, terminal-native tools, creative systems, and portfolio identity.

## Risk 6 — Accessibility Failure

**Risk:** High-style design may reduce readability or keyboard usability.

**Control:** Maintain contrast, visible focus states, semantic nav, descriptive links, and responsive layout.

## Risk 7 — Fake Metrics Presented As Real

**Risk:** Prototype metrics such as commits, memories, time saved, uptime, or lines of code may be mistaken for verified live data.

**Control:** Treat metrics as demo/prototype copy unless Freddie provides a source. Prefer conservative labels such as `TOOLS BUILT`, `EXPERIMENTS`, or `PROTOTYPE SIGNALS` during MVP.

## Risk 8 — Scaffold Overwrite

**Risk:** Running `npm create astro@latest .` in a non-empty folder could overwrite planning docs or reference assets.

**Control:** Builder must preserve `docs/` and `assets/reference/`. If the Astro CLI asks to overwrite files, block and ask Freddie before proceeding.
