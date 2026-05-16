# Freddie K. Portfolio — Agent Instructions

Quick reference for adding and editing content. Read this before touching any files.

## Stack

- **Framework:** Astro 6 (static output)
- **Animations:** GSAP
- **Deploy:** Cloudflare Pages — push to `main`, it auto-deploys
- **Build:** `npm run build` (clears Astro cache first — do not skip)
- **Dev:** `npm run dev` → `http://localhost:4321`

## Workflow

1. Edit or create the relevant file (see sections below)
2. Run `npm run build` to verify — it must complete with 0 errors
3. `git add <file> && git commit -m "<message>"` → `git push origin main`
4. Do **not** open a PR. Push directly to `main`.

---

## Adding a Note

**File location:** `src/content/notes/<slug>.md`

**Slug rules:** lowercase, kebab-case, matches the filename exactly.

### Frontmatter schema

```md
---
title: "Your Note Title"
date: "YYYY-MM-DD"
publisher: "Freddie K."
summary: "One sentence that describes what this note is about."
tags: ["tag-one", "tag-two"]
---
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | yes | Title case, shown on the notes listing |
| `date` | string | yes | ISO format `YYYY-MM-DD` |
| `publisher` | string | no | Defaults to `"Freddie K."` — omit unless different |
| `summary` | string | yes | One sentence, shown as the card description |
| `tags` | string[] | no | Lowercase kebab-case, shown as dashed badges |

### Body

Standard Markdown after the frontmatter. No MDX — plain `.md` only.

### Full example

```md
---
title: "Why I Use RSS Over Newsletters"
date: "2026-05-20"
summary: "RSS is still the cleanest way to follow people without handing over your inbox."
tags: ["tools", "workflow"]
---

Main content goes here. Write in plain Markdown.
```

---

## Adding a Lab

**File location:** `src/data/projects.ts`

Append a new object to the `projects` array. Keep the `index` sequential (next after the last entry).

### Interface

```ts
{
  index: string        // "01", "02" — zero-padded, sequential
  slug: string         // kebab-case, used in URL: /labs/<slug>
  title: string        // ALL CAPS
  label: string        // lowercase, short phrase — shown under index number
  category: string     // ALL CAPS — type of project
  date: string         // "YYYY-MM-DD"
  publisher: string    // "Freddie K."
  summary: string      // One sentence shown on the card
  problem: string      // What problem this solves
  does: string         // What it actually does
  stack: string[]      // Tech used — first 2 shown on card, rest on detail page
  status: string       // "concept build" | "active lab" | "concept lab" | etc.
  nextStep: string     // One concrete next action
  command: string      // Terminal command, no leading $
  output: string[]     // Exactly 3 lines of terminal output
  metrics?: [          // Optional — omit if not needed
    { name: string, value: string }
  ]
}
```

### Metrics convention (if used)

Use exactly 3 metrics. Standard names and values:

```ts
metrics: [
  { name: 'MODE',   value: 'CONCEPT' },   // or 'LAB' | 'DEMO' | 'LIVE'
  { name: 'SIGNAL', value: 'MEMORY' },    // the domain signal word
  { name: 'STATE',  value: 'BUILD' },     // or 'OPEN' | 'LAB' | 'DONE'
],
```

### Full example

```ts
{
  index: '06',
  slug: 'signal-log',
  title: 'SIGNAL LOG',
  label: 'decision trail',
  category: 'KNOWLEDGE TOOL',
  date: '2026-05-20',
  publisher: 'Freddie K.',
  summary: 'A lightweight log for capturing why a decision was made, not just what it was.',
  problem: 'Decisions get made but the reasoning disappears — leaving future-you guessing.',
  does: 'Signal Log writes a timestamped entry with the decision, the reason, and the context that mattered.',
  stack: ['markdown', 'CLI', 'knowledge systems'],
  status: 'concept build',
  nextStep: 'Define the entry schema and test it against a real week of decisions.',
  command: 'signal-log add',
  output: [
    'decision captured',
    'reason recorded',
    'context saved',
  ],
  metrics: [
    { name: 'MODE',   value: 'CONCEPT' },
    { name: 'SIGNAL', value: 'CLARITY' },
    { name: 'STATE',  value: 'BUILD' },
  ],
},
```

---

## Key file map

| What | Where |
|------|-------|
| All notes | `src/content/notes/` |
| Notes schema | `src/content.config.ts` |
| All labs/projects | `src/data/projects.ts` |
| Lab detail page | `src/pages/labs/[slug].astro` |
| Notes listing page | `src/pages/notes.astro` |
| Site config (title, OG, URL) | `src/config/site.ts` |
| Design tokens | `src/styles/tokens.css` |
| Global styles | `src/styles/global.css` |

---

## What not to do

- Do not add MDX (`.mdx`) files — only `.md` is supported for notes
- Do not edit `dist/` — it is generated, not committed
- Do not edit `.astro/` — it is a build cache, not committed
- Do not open a PR — push to `main` directly
- Do not skip `npm run build` before committing
