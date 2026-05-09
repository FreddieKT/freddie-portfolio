---
title: "Using TypeScript as a configuration language"
date: "2026-04-15"
publisher: "Freddie K."
summary: "JSON configs break silently. YAML configs have footguns. TypeScript configs give you autocomplete, validation, and refactoring — for free, with no extra tooling."
tags: ["TypeScript", "Architecture", "Engineering"]
---

Most projects accumulate configuration in JSON or YAML files. These formats have real advantages — they're readable, language-agnostic, and easy to parse. But they have one critical weakness: they're not typed. A typo in a JSON config key is a runtime bug, not a compile-time error.

TypeScript as a configuration language solves this. The tradeoff is that configs are no longer language-agnostic — but for a TypeScript project, you weren't going to process them with Python anyway.

## The pattern

Instead of `config.json`:

```json
{
  "projects": [
    {
      "id": "01",
      "slg": "afterglow",
      "title": "AFTERGLOW"
    }
  ]
}
```

Use `projects.ts`:

```typescript
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

export const projects: Project[] = [
  {
    index: '01',
    slug: 'afterglow',
    title: 'AFTERGLOW',
    // ...
  },
];
```

The typo `"slg"` in the JSON is a silent failure — the slug would just be undefined at runtime. In TypeScript, it's a compile error: `Object literal may only specify known properties, and 'slg' does not exist in type 'Project'`.

## What you get

**Autocomplete**: When adding a new project entry, the editor lists every required and optional field. You can't forget a required field — the compiler tells you before you run anything.

**Refactoring**: Rename `slug` to `path` across the entire codebase in one operation. Every reference — in the data file, in components, in route generation — updates atomically. Try that with a JSON key.

**Computed values**: Config can include computed fields:

```typescript
export const projects = rawProjects.map(p => ({
  ...p,
  url: `/labs/${p.slug}`,
  readTime: estimateReadTime(p.summary),
}));
```

You can't do computation in JSON. YAML has anchors, but they're not code — they're text substitution.

**Conditional config**: Different values for development and production:

```typescript
export const config = {
  apiUrl: import.meta.env.DEV
    ? 'http://localhost:3000'
    : 'https://api.ktt.dev',
};
```

**Type-safe consumption**: Any component that imports the data gets the type for free. No need to assert types when reading config values.

## When to use it

This pattern works best when:

1. The config is consumed by TypeScript code (which is the only code that can benefit from the types)
2. The config doesn't need to be read by non-TypeScript tools
3. The config is complex enough that typos and missing fields are real risks

It's not the right pattern for:
- Configs read by Docker, CI systems, or shell scripts
- Configs that need to be edited by people without TypeScript knowledge
- Configs that change frequently at runtime (environment variables are better)

## The Astro case

This portfolio uses TypeScript config for projects (`projects.ts`) and metrics (`metrics.ts`). Both are consumed only by Astro components and pages. The type checking happens at build time — if a project is missing a required field, the build fails with a clear error before anything reaches production.

Adding a new project is: add an object to the array, fill in the typed fields, run the build. The compiler catches anything missing. No schema files, no JSON validators, no separate type definitions — the interface is the schema.

## The content collections caveat

Astro's content collections do something similar for markdown: they validate frontmatter against a Zod schema at build time. That's the right tool when content is written by people (markdown is more author-friendly than TypeScript objects). TypeScript config is the right tool when content is structured data that developers maintain.

The rule of thumb: if it's code data (structured, maintained by developers, consumed by code), use TypeScript. If it's author content (written in prose, maintained by non-developers, consumed for display), use content collections.
