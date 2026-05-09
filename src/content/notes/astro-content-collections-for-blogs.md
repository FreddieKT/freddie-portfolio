---
title: "Using Astro content collections to build a knowledge base"
date: "2026-05-09"
publisher: "KTT.DEV"
summary: "Content collections turn markdown files into typed, queryable data. Here's why they're the right architecture for a blog or notes section, and how to set them up from scratch."
tags: ["Astro", "Architecture", "TypeScript"]
---

When I first built the notes section for this portfolio, I stored posts as TypeScript objects in the page file. It worked, but the content was trapped in code — no markdown, no frontmatter, no syntax highlighting, and every post required a code change. Content collections fix all of that.

## What content collections are

Astro's content collections treat folders of markdown (or MDX) files as structured data with a defined schema. You get:

- **Type safety** — frontmatter is validated against a Zod schema at build time
- **`getCollection()`** — query all posts, sort, filter, paginate
- **`entry.render()`** — compile markdown to HTML with your styles
- **Static generation** — `getStaticPaths()` generates one page per post at build time

The result: content lives in `.md` files (editable by anyone, versionable in git), and code handles display.

## Setting up the schema

Create `src/content/config.ts` to define the collection:

```typescript
import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).optional().default([]),
  }),
});

export const collections = { notes };
```

The Zod schema validates every post's frontmatter at build time. If a post is missing `title`, the build fails with a clear error — not a runtime crash in production. This is the main advantage over untyped markdown processing.

## Writing a post

Posts live in `src/content/notes/`. The filename becomes the URL slug:

```
src/content/notes/why-gsap-over-css-animations.md
→ /notes/why-gsap-over-css-animations
```

Each file starts with frontmatter matching the schema:

```markdown
---
title: "Why I use GSAP over CSS animations"
date: "2026-05-06"
summary: "CSS animations are fine for hover states..."
tags: ["Animation", "GSAP", "CSS"]
---

Write the note body here.
```

## The index page

The notes list queries all posts and sorts them by date:

```typescript
import { getCollection } from 'astro:content';

const allNotes = await getCollection('notes');
const notes = allNotes.sort(
  (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
);
```

`note.data` contains the validated frontmatter. `note.slug` is the URL-safe filename without extension. `note.body` is the raw markdown string (useful for excerpt generation).

## The detail page

The individual post page uses `getStaticPaths()` to generate one route per post:

```typescript
export async function getStaticPaths() {
  const notes = await getCollection('notes');
  return notes.map((note) => ({
    params: { slug: note.slug },
    props: { note },
  }));
}
```

Rendering markdown content is one line:

```astro
---
const { Content } = await Astro.props.note.render();
---

<div class="prose">
  <Content />
</div>
```

`Content` is a compiled Astro component. It renders the markdown as HTML and applies any remark/rehype plugins you've configured.

## Prose styling for rendered markdown

The `Content` component renders semantic HTML (`h2`, `p`, `ul`, `code`, `blockquote`). You need CSS to style it. The approach used here scopes styles to a `.prose` wrapper:

```css
.prose h2 {
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 1.8vw, 1.5rem);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--foreground);
  margin: 2rem 0 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: var(--border-solid);
}

.prose p {
  color: var(--foreground-soft);
  line-height: 1.75;
  margin: 0 0 1rem;
}

.prose code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--panel-overlay);
  border: var(--border-solid);
  padding: 0.15em 0.4em;
  border-radius: var(--radius-sm);
}

.prose pre {
  background: var(--surface-terminal);
  border: var(--border-dashed);
  padding: 1rem;
  overflow-x: auto;
  margin: 1.25rem 0;
}

.prose pre code {
  background: none;
  border: none;
  padding: 0;
  font-size: var(--text-sm);
  color: var(--foreground-soft);
}
```

## Why not MDX?

MDX allows embedding React (or Astro) components inside markdown. It's powerful but comes with cost: the component format bleeds into content files, making them less portable. A `.md` file is readable by any tool — GitHub, VS Code preview, static site generators, note-taking apps. An `.mdx` file is tied to the framework.

For a knowledge-sharing blog, portability matters. Use `.md` unless you specifically need component-in-content embedding.

## The real benefit: separation of concerns

Before content collections, my notes were TypeScript objects. Changing a note title meant opening code, finding the object, editing a string, and committing. With `.md` files, notes are documents — they live where documents live, open in document editors, and are portable outside the project.

The schema contract at `src/content/config.ts` keeps the two sides (content and code) in sync without coupling them. If you rename `summary` to `excerpt` in the schema, the TypeScript error in `notes.astro` immediately tells you what broke. That's the right kind of tight coupling — validated at build time, not discovered at runtime.
