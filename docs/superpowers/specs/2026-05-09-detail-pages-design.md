# Detail Pages Design Spec
**Date:** 2026-05-09  
**Project:** KTT.DEV Portfolio  
**Scope:** 4 new pages — Labs detail, About, Notes, Contact

---

## Decisions Made

| Decision | Choice | Reason |
|---|---|---|
| Page layout | Sidebar + main content | Chosen over full-width and bento grid |
| Labs routing | Separate URL per project (`/labs/[slug]`) | Shareable URLs, Astro native static generation |
| Contact | Links only, no form | Cleaner, no backend needed |
| Notes | Static list for now | No CMS; content added manually |

---

## Shared Architecture

- **Framework:** Astro 6 (static generation)
- **Shared layout:** New `src/layouts/PageLayout.astro` wrapping Header + Footer + GSAP page fade-in
- **Shared sidebar:** New `src/components/PageSidebar.astro` — receives `items: { label: string; href: string }[]` + `activeHref: string`. Items can be page links (`/labs/afterglow`) or anchor links (`#identity`) — the component uses plain `<a>` tags for both.
- **Design tokens:** All existing tokens from `tokens.css` apply unchanged
- **Theme:** Dark/light via `[data-theme]` — same as homepage
- **GSAP:** Page-level fade-in on all detail pages (sidebar slides in from left, main content from right)

---

## Page 1 — Labs Detail (`/labs/[slug].astro`)

### Routing
- File: `src/pages/labs/[slug].astro`
- Uses `getStaticPaths()` mapping over `projects` array in `src/data/projects.ts`
- Add `slug` field to `Project` interface in `projects.ts` with explicit values: `afterglow`, `unfog`, `promptglass`, `kairos-lab`
- Slug is stored in data (not computed) so it's stable and available to `ProjectCard` for linking

### Sidebar
- Lists all 4 projects by title
- Active project highlighted with accent border-left
- Each item is an `<a href="/labs/{slug}">` link

### Main Content Sections (top to bottom)
1. **Hero block** — `SectionLabel` with category, large project title (`<h1>`), mini-kicker with label
2. **Summary** — `mono-copy` paragraph from `project.summary`
3. **Terminal block** — dashed panel showing `$ {project.command}` and `project.output` lines with ✓ prefix (reuses terminal-shell aesthetic from `TerminalCard`)
4. **Indicators strip** — 3-column grid of `project.metrics` (MODE / SIGNAL / STATE), same metric-chip style as homepage
5. **Prev / Next navigation** — footer row with `← prev project` and `next project →` links

### Navigation between projects
- Prev/Next derived from project index in the array
- Wraps: last project's "next" is the first; first project's "prev" is the last

---

## Page 2 — About (`/about.astro`)

### Sidebar
- 4 fixed items: IDENTITY, STACK, APPROACH, LINKS
- Items are anchor links to in-page sections (`#identity`, `#stack`, `#approach`, `#links`)
- Active state set via `IntersectionObserver` with `threshold: 0.4` — whichever section has >40% visibility is active

### Main Content Sections
1. **Identity** (`id="identity"`) — profile photo (import from same path as `Hero.astro`: `../../../../../imported/freddie-portfolio-v2/src/assets/images/profile-about.jpg`, rendered at `width=352 height=470`) + name "FREDDIE K." in accent, role "BUILDER @ KTT.DEV", bio: "I'm Khant Thura Thaung — I build AI workflows, memory systems, and terminal-native tools that stay useful in real life."
2. **Stack** (`id="stack"`) — dashed-tag chips for tools: Astro, TypeScript, Python, AI/LLMs, GSAP, Terminal UX
3. **Approach** (`id="approach"`) — 2–3 short `mono-copy` paragraphs about build philosophy
4. **Links** (`id="links"`) — list rows for GitHub (FreddieKT), X (@ktythaung), Email (ktythaung@gmail.com); each row uses the hollow ring dot + label + external link arrow

---

## Page 3 — Notes (`/notes.astro`)

### Sidebar
- Single item: ALL NOTES (active)
- Future: tag filter items (not in scope now)

### Main Content Sections
1. **Header** — `SectionLabel` + short description: "Short decision logs and build notes."
2. **Note list** — static array of notes defined inline in the page frontmatter; each note row shows:
   - Date (`YYYY-MM-DD` in muted color)
   - Title (foreground color, hover → accent)
   - Future: link to `/notes/[slug]` detail — not in scope now
3. **Empty state** — if no notes, show a dashed panel with `// no notes yet — check back soon`

### Initial notes (2 placeholder entries)
- `2026-05-09` — "Why I removed the terminal card from the hero"
- `2026-05-08` — "Switching align-items from stretch to start in hero grid"

---

## Page 4 — Contact (`/contact.astro`)

### Sidebar
- 2 items: REACH OUT (active by default), STATUS

### Main Content Sections
1. **Header** — `SectionLabel` + tagline: "Building in the open. Here's how to find me."
2. **Contact methods** — 3 rows, each with hollow ring dot + label + value/link:
   - GITHUB → `https://github.com/FreddieKT` (external)
   - X → `https://x.com/ktythaung` (external)
   - EMAIL → `mailto:ktythaung@gmail.com`
3. **Current status block** — dashed terminal-style panel:
   - `OPEN TO: interesting problems`
   - `BUILDING: KTT.DEV labs`
   - `STATUS: ● ACTIVE`

### Note
- No contact form — links only
- This page is the destination for the existing `> CONTACT` header button (currently links to `#contact` footer section; update `href` to `/contact`)

---

## Homepage Updates Required

| Location | Change |
|---|---|
| `src/components/Header.astro` | Update `> CONTACT` href from `#contact` to `/contact` |
| `src/components/ProjectCard.astro` | Add `<a href="/labs/{project.slug}" class="card-link">` overlay so the entire card is clickable; `project.slug` now exists on the data type |
| `src/pages/index.astro` | Nav pills: update ABOUT → `/about`, LABS → `/labs/afterglow`, NOTES → `/notes` |

---

## File Structure After Implementation

```
src/
  layouts/
    PageLayout.astro          ← new shared layout
  components/
    PageSidebar.astro         ← new sidebar component
    (existing components unchanged)
  pages/
    index.astro               ← updated nav links + project card links
    about.astro               ← new
    notes.astro               ← new
    contact.astro             ← new
    labs/
      [slug].astro            ← new dynamic route
  data/
    projects.ts               ← add slug field to Project interface
```

---

## GSAP Animations (per page)

- **Sidebar items:** fade in + slide from left (`x: -12`), staggered 0.06s
- **Main content sections:** fade in + slide up (`y: 16`), staggered 0.08s
- **Respects** `prefers-reduced-motion` (same guard as homepage)

---

## Out of Scope

- Notes detail pages (`/notes/[slug]`) — no content yet
- Contact form with backend
- CMS integration
- Search / filtering on Notes
