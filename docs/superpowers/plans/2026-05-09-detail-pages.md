# Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 4 detail pages (Labs dynamic route, About, Notes, Contact) plus a shared sidebar layout to the Freddie K. Astro portfolio, initialize git, and wire all homepage links.

**Architecture:** Shared `PageLayout.astro` wraps every detail page with Header + Footer + GSAP fade-in. `PageSidebar.astro` is a reusable sidebar nav component that takes an items array and active href. Labs pages are statically generated from `projects.ts` via Astro's `getStaticPaths()`.

**Tech Stack:** Astro 6, TypeScript, GSAP 3, IBM Plex Mono, existing design tokens (`tokens.css`, `global.css`)

---

## Parallelization Map

```
Task 1 → Task 2 → Task 3 ──┬──> Task 4 (Labs)    ─┐
(git)    (layout) (data)    ├──> Task 5 (About)   ─┤─> Task 8 (verify)
                            ├──> Task 6 (Notes)   ─┤
                            └──> Task 7 (Contact) ─┘
```

Tasks 4–7 are **fully independent** after Task 3 completes — dispatch them in parallel.

---

## File Map

| File | Action | Responsible for |
|---|---|---|
| `src/layouts/PageLayout.astro` | **Create** | HTML shell, Header slot, sidebar slot, Footer, GSAP, FOUC fix |
| `src/components/PageSidebar.astro` | **Create** | Sticky sidebar nav, active state, animate attrs |
| `src/data/projects.ts` | **Modify** | Add `slug` field to `Project` interface + each project entry |
| `src/components/Header.astro` | **Modify** | Change CONTACT `href` `#contact` → `/contact` |
| `src/components/ProjectCard.astro` | **Modify** | Add ghost link overlay to make card clickable |
| `src/pages/labs/[slug].astro` | **Create** | Dynamic route, getStaticPaths, full lab detail UI |
| `src/pages/about.astro` | **Create** | Identity, stack, approach, links sections |
| `src/pages/notes.astro` | **Create** | Static note list with empty state |
| `src/pages/contact.astro` | **Create** | Contact methods + status terminal panel |
| `.gitignore` | **Create** | Exclude node_modules, dist, .astro, .superpowers |

---

## Task 1 — Git Init

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Initialize git repo**

```bash
cd /Users/ktythaung/Desktop/Projects/freddie-portfolio
git init
git branch -M main
```

- [ ] **Step 2: Create .gitignore**

Create `.gitignore` at project root:

```
node_modules/
dist/
.astro/
.superpowers/
.context/
*.output
.DS_Store
```

- [ ] **Step 3: Initial commit**

```bash
git add -A
git commit -m "chore: initial commit — Freddie K. portfolio v0"
```

Expected: `[main (root-commit) xxxxxxx] chore: initial commit`

---

## Task 2 — Shared Layout + Sidebar

**Files:**
- Create: `src/layouts/PageLayout.astro`
- Create: `src/components/PageSidebar.astro`

- [ ] **Step 1: Create `src/layouts/PageLayout.astro`**

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import FooterStatus from '../components/FooterStatus.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Freddie K. — Strange tools for real life' } = Astro.props;
---

<html lang="en" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="generator" content={Astro.generator} />
    <title>{title} — Freddie K.</title>
    <meta name="description" content={description} />
    <!-- Prevent flash of unstyled theme -->
    <script is:inline>
      const t = localStorage.getItem('freddie-portfolio-theme');
      if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
    </script>
  </head>
  <body>
    <main id="top" class="page-shell">
      <div class="frame page-frame">
        <Header navItems={[
          { label: 'ABOUT', href: '/about' },
          { label: 'LABS',  href: '/labs/afterglow' },
          { label: 'NOTES', href: '/notes' },
          { label: 'WORK',  href: '/#work' },
        ]} />
        <div class="page-layout">
          <slot name="sidebar" />
          <div class="page-main">
            <slot />
          </div>
        </div>
      </div>
      <FooterStatus />
    </main>

    <script>
      import { gsap } from 'gsap';
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduceMotion) {
        gsap.set('[data-animate="sidebar-item"]', { autoAlpha: 0, x: -12 });
        gsap.set('[data-animate="page-section"]', { autoAlpha: 0, y: 16 });
        gsap.to('[data-animate="sidebar-item"]', {
          autoAlpha: 1, x: 0, duration: 0.4, ease: 'power2.out', stagger: 0.06,
        });
        gsap.to('[data-animate="page-section"]', {
          autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08, delay: 0.1,
        });
      }
    </script>
  </body>
</html>

<style>
  .page-frame {
    padding: 1rem 1rem 0.75rem;
  }

  .page-layout {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: clamp(1rem, 2vw, 1.5rem);
    padding: clamp(1rem, 2vw, 1.5rem) 0;
    align-items: start;
  }

  .page-main {
    display: grid;
    gap: 1rem;
    min-width: 0;
  }

  @media (max-width: 768px) {
    .page-layout {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: Create `src/components/PageSidebar.astro`**

```astro
---
interface SidebarItem {
  label: string;
  href: string;
}

interface Props {
  items: SidebarItem[];
  activeHref: string;
  heading?: string;
}

const { items, activeHref, heading } = Astro.props;
---

<nav class="page-sidebar" aria-label="Section navigation">
  {heading && <p class="sidebar-heading">{heading}</p>}
  <ul class="sidebar-list">
    {items.map((item) => (
      <li>
        <a
          class:list={['sidebar-item', item.href === activeHref && 'is-active']}
          href={item.href}
          data-animate="sidebar-item"
        >
          {item.label}
        </a>
      </li>
    ))}
  </ul>
</nav>

<style>
  .page-sidebar {
    position: sticky;
    top: 1.5rem;
    border: var(--border-solid);
    background: var(--panel-overlay);
    border-radius: var(--radius-md);
  }

  .sidebar-heading {
    margin: 0;
    padding: 0.6rem 1rem;
    font-size: var(--text-xs);
    color: var(--muted-faint);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border-bottom: var(--border-solid);
  }

  .sidebar-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .sidebar-item {
    display: block;
    padding: 0.65rem 1rem;
    font-size: var(--text-xs);
    color: var(--muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-left: 2px solid transparent;
    transition: color 160ms ease, background 160ms ease, border-color 160ms ease;
  }

  .sidebar-item:hover,
  .sidebar-item:focus-visible {
    color: var(--accent);
    background: var(--accent-soft);
    border-left-color: var(--accent);
    outline: none;
  }

  .sidebar-item.is-active {
    color: var(--accent);
    background: var(--accent-soft);
    border-left-color: var(--accent);
  }

  .sidebar-list li + li {
    border-top: var(--border-solid);
  }
</style>
```

- [ ] **Step 3: Verify Astro can see the new files**

```bash
npx astro check
```

Expected: no errors about missing imports.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/PageLayout.astro src/components/PageSidebar.astro
git commit -m "feat: add PageLayout and PageSidebar shared components"
```

---

## Task 3 — Data + Component Updates

**Files:**
- Modify: `src/data/projects.ts`
- Modify: `src/components/Header.astro`
- Modify: `src/components/ProjectCard.astro`

- [ ] **Step 1: Add `slug` field to `src/data/projects.ts`**

Replace the entire file contents:

```typescript
export interface ProjectMetric {
  name: string;
  value: string;
}

export interface Project {
  index: string;
  slug: string;
  title: string;
  label: string;
  category: string;
  summary: string;
  command: string;
  output: string[];
  metrics?: ProjectMetric[];
}

// Prototype indicators only. These are not live or verified portfolio metrics.
export const projects: Project[] = [
  {
    index: '01',
    slug: 'afterglow',
    title: 'AFTERGLOW',
    label: 'terminal memory',
    category: 'DAILY RECALL AGENT',
    summary: 'End your session with tomorrow\'s starting point.',
    command: 'afterglow --today',
    output: ['generating digest…', 'memories captured', 'plan for tomorrow'],
    metrics: [
      { name: 'MODE', value: 'CONCEPT' },
      { name: 'SIGNAL', value: 'MEMORY' },
      { name: 'STATE', value: 'BUILD' },
    ],
  },
  {
    index: '02',
    slug: 'unfog',
    title: 'UNFOG',
    label: 'decision clarity',
    category: 'NOTE CLARITY ENGINE',
    summary: 'Extract the real decision from messy notes, transcripts, and plans.',
    command: 'unfog notes/',
    output: ['scanning notes…', 'decision shape found', 'next action extracted'],
    metrics: [
      { name: 'MODE', value: 'CONCEPT' },
      { name: 'SIGNAL', value: 'CLARITY' },
      { name: 'STATE', value: 'BUILD' },
    ],
  },
  {
    index: '03',
    slug: 'promptglass',
    title: 'PROMPTGLASS',
    label: 'prompt linting',
    category: 'PROMPT OBSERVER',
    summary: 'Find hidden prompt conflicts before they become model failures.',
    command: 'promptglass watch',
    output: ['observing session…', 'conflicts surfaced', 'repair notes queued'],
    metrics: [
      { name: 'MODE', value: 'CONCEPT' },
      { name: 'SIGNAL', value: 'PROMPTS' },
      { name: 'STATE', value: 'BUILD' },
    ],
  },
  {
    index: '04',
    slug: 'kairos-lab',
    title: 'KAIROS LAB',
    label: 'visual systems',
    category: 'EXPERIMENTAL SYSTEMS',
    summary: 'Pixel-cosmic experiments, motion logos, and symbolic interface studies.',
    command: 'kairos lab list',
    output: ['experiments indexed', 'orbital sketches active', 'interface studies queued'],
    metrics: [
      { name: 'MODE', value: 'LAB' },
      { name: 'SIGNAL', value: 'VISUAL' },
      { name: 'STATE', value: 'OPEN' },
    ],
  },
];
```

- [ ] **Step 2: Update nav defaults + CONTACT href in `src/components/Header.astro`**

Replace the default `navItems` array and the primary-pill href:

```astro
const { navItems = [
  { label: 'ABOUT', href: '/about' },
  { label: 'LABS',  href: '/labs/afterglow' },
  { label: 'NOTES', href: '/notes' },
  { label: 'WORK',  href: '#work' },
] } = Astro.props;
```

And update the CONTACT pill (line below the `<nav>`):
```astro
  <a class="primary-pill" href="/contact">&gt; CONTACT</a>
```

- [ ] **Step 3: Add clickable ghost link overlay to `src/components/ProjectCard.astro`**

In the `<article>` tag, add the link as the first child (before `<div class="project-top">`):

```astro
<article class="project-card corner-frame" aria-labelledby={`project-${project.index}`} data-animate="project-card">
  <a href={`/labs/${project.slug}`} class="card-link" aria-label={`View ${project.title} detail`}></a>
  <div class="project-top">
  ...rest unchanged...
```

Then add these CSS rules to the `<style>` block in `ProjectCard.astro`:

```css
  .card-link {
    position: absolute;
    inset: 0;
    z-index: 1;
    border-radius: var(--radius-md);
  }

  .project-card > *:not(.card-link) {
    position: relative;
    z-index: 2;
  }

  .project-card:has(.card-link:hover) {
    border-color: var(--accent);
    box-shadow: var(--shadow-glow);
  }

  .project-card:has(.card-link:focus-visible) {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
  }
```

- [ ] **Step 4: Run type check**

```bash
npx astro check
```

Expected: no TypeScript errors (the `slug` field is now required; all 4 projects have it).

- [ ] **Step 5: Commit**

```bash
git add src/data/projects.ts src/components/Header.astro src/components/ProjectCard.astro
git commit -m "feat: add slug to Project type, wire card links, update contact href"
```

---

## Task 4 — Labs Detail Page ⚡ PARALLEL after Task 3

**Files:**
- Create: `src/pages/labs/[slug].astro`

- [ ] **Step 1: Create `src/pages/labs/[slug].astro`**

```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
import PageSidebar from '../../components/PageSidebar.astro';
import SectionLabel from '../../components/SectionLabel.astro';
import { projects, type Project } from '../../data/projects';

export function getStaticPaths() {
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

interface Props {
  project: Project;
}

const { project } = Astro.props;
const idx = projects.findIndex((p) => p.slug === project.slug);
const prev = projects[(idx - 1 + projects.length) % projects.length];
const next = projects[(idx + 1) % projects.length];

const sidebarItems = projects.map((p) => ({
  label: p.title,
  href: `/labs/${p.slug}`,
}));
---

<PageLayout title={project.title} description={project.summary}>
  <PageSidebar
    slot="sidebar"
    heading="LABS"
    items={sidebarItems}
    activeHref={`/labs/${project.slug}`}
  />

  <article class="labs-detail">
    <header class="page-section frame lab-hero" data-animate="page-section">
      <SectionLabel>{project.category}</SectionLabel>
      <h1 class="lab-title">{project.title}</h1>
      <p class="mini-kicker">{project.label}</p>
    </header>

    <section class="page-section frame" aria-label="Summary" data-animate="page-section">
      <SectionLabel>Summary</SectionLabel>
      <p class="mono-copy">{project.summary}</p>
    </section>

    <section class="page-section frame terminal-panel" aria-label="Terminal output" data-animate="page-section">
      <div class="terminal-head">
        <div class="terminal-head-left">
          <span class="status-dot" aria-hidden="true"></span>
          <span>TERMINAL</span>
        </div>
        <span class="terminal-path">freddie@devbox:~</span>
      </div>
      <div class="terminal-body">
        <div class="terminal-row">
          <code class="terminal-cmd">freddie.k$ {project.command}</code>
        </div>
        {project.output.map((line) => (
          <div class="terminal-row">
            <span class="terminal-check" aria-hidden="true">✓</span>
            <span class="terminal-out">{line}</span>
          </div>
        ))}
      </div>
    </section>

    {project.metrics && project.metrics.length > 0 && (
      <section class="page-section frame" aria-label="Prototype indicators" data-animate="page-section">
        <SectionLabel>Indicators</SectionLabel>
        <div class="indicators-grid">
          {project.metrics.map((m) => (
            <div class="indicator-cell">
              <span class="indicator-label">{m.name}</span>
              <strong class="indicator-value">{m.value}</strong>
            </div>
          ))}
        </div>
      </section>
    )}

    <nav class="page-section frame project-nav" aria-label="Project navigation" data-animate="page-section">
      <a class="nav-pill" href={`/labs/${prev.slug}`}>← {prev.title}</a>
      <a class="nav-pill" href={`/labs/${next.slug}`}>{next.title} →</a>
    </nav>
  </article>
</PageLayout>

<style>
  .labs-detail {
    display: grid;
    gap: 1rem;
  }

  .page-section {
    padding: 1.25rem;
    border-radius: var(--radius-md);
  }

  .lab-hero {
    display: grid;
    gap: 0.5rem;
  }

  .lab-title {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 4vw, 3rem);
    line-height: 1;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--foreground);
  }

  /* Terminal panel */
  .terminal-panel {
    display: grid;
    gap: 0.75rem;
    background: var(--panel-overlay);
  }

  .terminal-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.75rem;
    border-bottom: var(--border-solid);
    font-size: var(--text-xs);
    color: var(--muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .terminal-head-left {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
  }

  .terminal-path { color: var(--accent); }

  .terminal-body {
    display: grid;
    gap: 0.55rem;
    font-size: var(--text-sm);
  }

  .terminal-row {
    display: flex;
    gap: 0.75rem;
    align-items: baseline;
  }

  .terminal-cmd {
    color: var(--accent);
    font-family: var(--font-mono);
  }

  .terminal-check { color: var(--success); flex-shrink: 0; }
  .terminal-out   { color: var(--muted); }

  /* Indicators */
  .indicators-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
    margin-top: 0.75rem;
  }

  .indicator-cell {
    border: var(--border-solid);
    padding: 0.75rem;
    display: grid;
    gap: 0.25rem;
  }

  .indicator-label {
    font-size: var(--text-xs);
    color: var(--muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .indicator-value {
    font-family: var(--font-display);
    font-size: var(--text-md);
    color: var(--accent);
  }

  /* Prev / next */
  .project-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
</style>
```

- [ ] **Step 2: Verify build generates all 4 routes**

```bash
npx astro build 2>&1 | grep "labs/"
```

Expected output (4 lines):
```
▶ /labs/afterglow
▶ /labs/unfog
▶ /labs/promptglass
▶ /labs/kairos-lab
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/labs/
git commit -m "feat: add /labs/[slug] dynamic route with sidebar, terminal, indicators"
```

---

## Task 5 — About Page ⚡ PARALLEL after Task 3

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create `src/pages/about.astro`**

```astro
---
import { Image } from 'astro:assets';
import profileImage from 'src/assets/images/profile-about.jpg';
import PageLayout from '../layouts/PageLayout.astro';
import PageSidebar from '../components/PageSidebar.astro';
import SectionLabel from '../components/SectionLabel.astro';

const sidebarItems = [
  { label: 'IDENTITY', href: '#identity' },
  { label: 'STACK',    href: '#stack' },
  { label: 'APPROACH', href: '#approach' },
  { label: 'LINKS',    href: '#links' },
];

const stack = [
  'Astro', 'TypeScript', 'Python',
  'AI / LLMs', 'GSAP', 'Terminal UX', 'Systems Design',
];
---

<PageLayout
  title="About"
  description="Khant Thura Thaung — builder of AI workflows, memory systems, and terminal-native tools."
>
  <PageSidebar slot="sidebar" heading="ABOUT" items={sidebarItems} activeHref="#identity" />

  <div class="about-content">

    <section id="identity" class="page-section frame" aria-labelledby="identity-heading" data-animate="page-section">
      <SectionLabel id="identity-heading">Identity</SectionLabel>
      <div class="identity-layout">
        <figure class="identity-photo-frame">
          <Image
            src={profileImage}
            alt="Khant Thura Thaung"
            width={352}
            height={470}
            loading="eager"
            decoding="async"
            class="identity-photo"
          />
        </figure>
        <div class="identity-text">
          <p class="identity-name">FREDDIE K.</p>
          <p class="mini-kicker">BUILDER @ Freddie K.</p>
          <p class="mono-copy identity-bio">
            I'm Khant Thura Thaung — I build AI workflows, memory systems, and terminal-native tools that stay useful in real life.
          </p>
        </div>
      </div>
    </section>

    <section id="stack" class="page-section frame" aria-labelledby="stack-heading" data-animate="page-section">
      <SectionLabel id="stack-heading">Stack</SectionLabel>
      <div class="stack-tags">
        {stack.map((tool) => <span class="stack-tag">{tool}</span>)}
      </div>
    </section>

    <section id="approach" class="page-section frame" aria-labelledby="approach-heading" data-animate="page-section">
      <SectionLabel id="approach-heading">Approach</SectionLabel>
      <div class="approach-text">
        <p class="mono-copy">Build small. Ship fast. Keep what's useful.</p>
        <p class="mono-copy">I like building hobby projects, testing ideas, and writing down the parts that were actually worth keeping. Some work stays small. Some turns into a real tool. Both are fine.</p>
        <p class="mono-copy">I split my time between learning, building, and simplifying things that started too complicated.</p>
      </div>
    </section>

    <section id="links" class="page-section frame" aria-labelledby="links-heading" data-animate="page-section">
      <SectionLabel id="links-heading">Links</SectionLabel>
      <ul class="links-list">
        <li>
          <a class="link-row" href="https://github.com/FreddieKT" target="_blank" rel="noreferrer">
            <span class="link-dot" aria-hidden="true"></span>
            <span class="link-label">GITHUB</span>
            <span class="link-value">FreddieKT</span>
            <span class="link-arrow" aria-hidden="true">↗</span>
          </a>
        </li>
        <li>
          <a class="link-row" href="https://x.com/ktythaung" target="_blank" rel="noreferrer">
            <span class="link-dot" aria-hidden="true"></span>
            <span class="link-label">X</span>
            <span class="link-value">@ktythaung</span>
            <span class="link-arrow" aria-hidden="true">↗</span>
          </a>
        </li>
        <li>
          <a class="link-row" href="mailto:ktythaung@gmail.com">
            <span class="link-dot" aria-hidden="true"></span>
            <span class="link-label">EMAIL</span>
            <span class="link-value">ktythaung@gmail.com</span>
            <span class="link-arrow" aria-hidden="true">→</span>
          </a>
        </li>
      </ul>
    </section>

  </div>
</PageLayout>

<style>
  .about-content {
    display: grid;
    gap: 1rem;
  }

  .page-section {
    padding: 1.25rem;
    border-radius: var(--radius-md);
    display: grid;
    gap: 0.75rem;
  }

  /* Identity */
  .identity-layout {
    display: flex;
    gap: clamp(1rem, 2vw, 1.5rem);
    align-items: flex-start;
  }

  .identity-photo-frame {
    flex: 0 0 auto;
    width: 7rem;
    aspect-ratio: 3 / 4;
    margin: 0;
    padding: 0.3rem;
    border: var(--border-solid-strong);
    border-radius: var(--radius-md);
    background: var(--surface-terminal);
    box-shadow: var(--shadow-glow);
  }

  .identity-photo {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: calc(var(--radius-md) - 0.2rem);
    object-fit: cover;
    object-position: 50% 0%;
    filter: saturate(0.95) contrast(1.02);
  }

  .identity-text {
    display: grid;
    gap: 0.5rem;
    min-width: 0;
  }

  .identity-name {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(1.4rem, 2.5vw, 2rem);
    color: var(--accent);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    line-height: 1;
  }

  .identity-bio {
    max-width: 48ch;
  }

  /* Stack */
  .stack-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .stack-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.85rem;
    border: var(--border-dashed);
    font-size: var(--text-xs);
    color: var(--accent);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .stack-tag::before {
    content: '';
    width: 0.45rem;
    height: 0.45rem;
    border: 1px solid currentColor;
    border-radius: 999px;
    opacity: 0.7;
    flex-shrink: 0;
  }

  /* Approach */
  .approach-text {
    display: grid;
    gap: 0.75rem;
  }

  /* Links */
  .links-list {
    list-style: none;
    margin: 0;
    padding: 0;
    border: var(--border-solid);
  }

  .links-list li + li {
    border-top: var(--border-solid);
  }

  .link-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    transition: background 160ms ease, color 160ms ease;
  }

  .link-row:hover {
    background: var(--accent-soft);
    color: var(--accent);
  }

  .link-dot {
    width: 0.55rem;
    height: 0.55rem;
    border: 1px solid var(--accent);
    border-radius: 999px;
    flex-shrink: 0;
    opacity: 0.75;
  }

  .link-label {
    font-size: var(--text-xs);
    color: var(--muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    min-width: 5rem;
  }

  .link-value {
    font-size: var(--text-sm);
    color: var(--foreground-soft);
    flex: 1;
  }

  .link-arrow {
    color: var(--accent);
    font-size: var(--text-sm);
    margin-left: auto;
  }

  @media (max-width: 600px) {
    .identity-layout {
      flex-direction: column;
    }
  }
</style>
```

- [ ] **Step 2: Add IntersectionObserver script inside `about.astro` before `</PageLayout>`**

Add this inside the Astro component (after the closing `</div>` of `.about-content`, still inside `<PageLayout>`):

```astro
<script>
  const sections = document.querySelectorAll<HTMLElement>('#identity, #stack, #approach, #links');
  const sidebarLinks = document.querySelectorAll<HTMLAnchorElement>('.sidebar-item');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sidebarLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => observer.observe(s));
</script>
```

- [ ] **Step 3: Verify page builds**

```bash
npx astro build 2>&1 | grep "/about"
```

Expected: `▶ /about`

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add /about page with identity, stack, approach, links, scroll-spy"
```

---

## Task 6 — Notes Page ⚡ PARALLEL after Task 3

**Files:**
- Create: `src/pages/notes.astro`

- [ ] **Step 1: Create `src/pages/notes.astro`**

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import PageSidebar from '../components/PageSidebar.astro';
import SectionLabel from '../components/SectionLabel.astro';

interface Note {
  date: string;
  title: string;
  summary: string;
}

const notes: Note[] = [
  {
    date: '2026-05-09',
    title: 'Why I removed the terminal card from the hero',
    summary: 'The TerminalCard was heavy dev-coded aesthetic. Removing it let the ProfileStatusCard breathe and eliminated the empty-space stretch problem.',
  },
  {
    date: '2026-05-08',
    title: 'Switching align-items from stretch to start in the hero grid',
    summary: 'stretch was forcing the hero photo panel to match the height of the right column, leaving a large empty area below the content.',
  },
];

const sidebarItems = [{ label: 'ALL NOTES', href: '/notes' }];
---

<PageLayout title="Notes" description="Short decision logs and build notes from Freddie K..">
  <PageSidebar slot="sidebar" heading="NOTES" items={sidebarItems} activeHref="/notes" />

  <div class="notes-content">

    <header class="page-section frame" data-animate="page-section">
      <SectionLabel>Notes</SectionLabel>
      <p class="mono-copy">Short decision logs and build notes.</p>
    </header>

    {notes.length > 0 ? (
      <section class="page-section frame" aria-label="Note list" data-animate="page-section">
        <ul class="notes-list">
          {notes.map((note) => (
            <li class="note-row">
              <time class="note-date" datetime={note.date}>{note.date}</time>
              <div class="note-body">
                <p class="note-title">{note.title}</p>
                <p class="mono-copy note-summary">{note.summary}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    ) : (
      <section class="page-section frame" data-animate="page-section">
        <div class="empty-state">// no notes yet — check back soon</div>
      </section>
    )}

  </div>
</PageLayout>

<style>
  .notes-content {
    display: grid;
    gap: 1rem;
  }

  .page-section {
    padding: 1.25rem;
    border-radius: var(--radius-md);
    display: grid;
    gap: 0.75rem;
  }

  .notes-list {
    list-style: none;
    margin: 0;
    padding: 0;
    border: var(--border-solid);
  }

  .note-row {
    display: grid;
    grid-template-columns: 9rem 1fr;
    gap: 1rem;
    padding: 1rem;
    align-items: start;
    transition: background 160ms ease;
  }

  .note-row:hover {
    background: var(--accent-soft);
  }

  .note-row + .note-row {
    border-top: var(--border-solid);
  }

  .note-date {
    font-size: var(--text-xs);
    color: var(--muted-faint);
    letter-spacing: 0.08em;
    padding-top: 0.1rem;
    white-space: nowrap;
  }

  .note-title {
    margin: 0 0 0.35rem;
    font-size: var(--text-sm);
    color: var(--foreground);
    letter-spacing: 0.02em;
  }

  .note-summary {
    font-size: var(--text-xs);
    color: var(--muted);
    line-height: 1.6;
    margin: 0;
  }

  .empty-state {
    font-size: var(--text-sm);
    color: var(--muted);
    padding: 1rem;
    border: var(--border-dashed);
    font-family: var(--font-mono);
  }

  @media (max-width: 600px) {
    .note-row {
      grid-template-columns: 1fr;
      gap: 0.35rem;
    }
  }
</style>
```

- [ ] **Step 2: Verify build**

```bash
npx astro build 2>&1 | grep "/notes"
```

Expected: `▶ /notes`

- [ ] **Step 3: Commit**

```bash
git add src/pages/notes.astro
git commit -m "feat: add /notes page with static note list"
```

---

## Task 7 — Contact Page ⚡ PARALLEL after Task 3

**Files:**
- Create: `src/pages/contact.astro`

- [ ] **Step 1: Create `src/pages/contact.astro`**

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import PageSidebar from '../components/PageSidebar.astro';
import SectionLabel from '../components/SectionLabel.astro';

const sidebarItems = [
  { label: 'REACH OUT', href: '/contact' },
  { label: 'STATUS',    href: '#status' },
];
---

<PageLayout title="Contact" description="How to find Freddie — builder of Freddie K..">
  <PageSidebar slot="sidebar" heading="CONTACT" items={sidebarItems} activeHref="/contact" />

  <div class="contact-content">

    <header class="page-section frame" data-animate="page-section">
      <SectionLabel>Contact</SectionLabel>
      <p class="mono-copy">Building in the open. Here's how to find me.</p>
    </header>

    <section class="page-section frame" aria-label="Contact methods" data-animate="page-section">
      <SectionLabel>Reach out</SectionLabel>
      <ul class="contact-list">
        <li>
          <a class="contact-row" href="https://github.com/FreddieKT" target="_blank" rel="noreferrer">
            <span class="contact-dot" aria-hidden="true"></span>
            <span class="contact-label">GITHUB</span>
            <span class="contact-value">FreddieKT</span>
            <span class="contact-arrow" aria-hidden="true">↗</span>
          </a>
        </li>
        <li>
          <a class="contact-row" href="https://x.com/ktythaung" target="_blank" rel="noreferrer">
            <span class="contact-dot" aria-hidden="true"></span>
            <span class="contact-label">X</span>
            <span class="contact-value">@ktythaung</span>
            <span class="contact-arrow" aria-hidden="true">↗</span>
          </a>
        </li>
        <li>
          <a class="contact-row" href="mailto:ktythaung@gmail.com">
            <span class="contact-dot" aria-hidden="true"></span>
            <span class="contact-label">EMAIL</span>
            <span class="contact-value">ktythaung@gmail.com</span>
            <span class="contact-arrow" aria-hidden="true">→</span>
          </a>
        </li>
      </ul>
    </section>

    <section id="status" class="page-section frame status-panel" aria-label="Current status" data-animate="page-section">
      <SectionLabel>Status</SectionLabel>
      <div class="status-terminal">
        <div class="status-line">
          <span class="status-key">OPEN TO</span>
          <span class="status-sep">:</span>
          <span class="status-val">interesting problems</span>
        </div>
        <div class="status-line">
          <span class="status-key">BUILDING</span>
          <span class="status-sep">:</span>
          <span class="status-val">Freddie K. labs</span>
        </div>
        <div class="status-line">
          <span class="status-key">STATUS</span>
          <span class="status-sep">:</span>
          <span class="status-val">
            <span class="status-dot" aria-hidden="true"></span>
            ACTIVE
          </span>
        </div>
      </div>
    </section>

  </div>
</PageLayout>

<style>
  .contact-content {
    display: grid;
    gap: 1rem;
  }

  .page-section {
    padding: 1.25rem;
    border-radius: var(--radius-md);
    display: grid;
    gap: 0.75rem;
  }

  /* Contact list */
  .contact-list {
    list-style: none;
    margin: 0;
    padding: 0;
    border: var(--border-solid);
  }

  .contact-list li + li {
    border-top: var(--border-solid);
  }

  .contact-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.9rem 1rem;
    transition: background 160ms ease;
  }

  .contact-row:hover {
    background: var(--accent-soft);
  }

  .contact-dot {
    width: 0.55rem;
    height: 0.55rem;
    border: 1px solid var(--accent);
    border-radius: 999px;
    flex-shrink: 0;
    opacity: 0.75;
  }

  .contact-label {
    font-size: var(--text-xs);
    color: var(--muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    min-width: 5rem;
  }

  .contact-value {
    font-size: var(--text-sm);
    color: var(--foreground-soft);
    flex: 1;
  }

  .contact-arrow {
    color: var(--accent);
    margin-left: auto;
  }

  /* Status terminal */
  .status-panel {
    background: var(--panel-overlay);
  }

  .status-terminal {
    display: grid;
    gap: 0.55rem;
    padding: 0.85rem;
    border: var(--border-dashed);
    background: var(--terminal-overlay);
    font-size: var(--text-sm);
  }

  .status-line {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .status-key {
    color: var(--accent);
    font-family: var(--font-mono);
    min-width: 8rem;
    letter-spacing: 0.08em;
  }

  .status-sep {
    color: var(--muted);
  }

  .status-val {
    color: var(--foreground-soft);
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
```

- [ ] **Step 2: Verify build**

```bash
npx astro build 2>&1 | grep "/contact"
```

Expected: `▶ /contact`

- [ ] **Step 3: Commit**

```bash
git add src/pages/contact.astro
git commit -m "feat: add /contact page with methods and status panel"
```

---

## Task 8 — Final Verification

**Files:** none new — smoke test only

- [ ] **Step 1: Full build with no errors**

```bash
npx astro build
```

Expected: exits 0, no TypeScript errors, generates:
```
/
/about
/notes
/contact
/labs/afterglow
/labs/unfog
/labs/promptglass
/labs/kairos-lab
```

- [ ] **Step 2: Preview build and spot-check all routes**

```bash
npx astro preview &
sleep 2
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/about     # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/notes     # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/contact   # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/labs/afterglow   # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/labs/kairos-lab  # 200
```

All should return `200`.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: verify all detail pages build and respond 200"
```
