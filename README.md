# Freddie K. Portfolio — Planning Workspace

This folder is the planning and execution workspace for a potential replacement portfolio for **Freddie K. / Freddie**.

The current stage is **production-candidate prototype**. It can be deployed for review after the build checks pass, but it should not replace an existing live site without explicit approval.

## Goal

Build an Astro-based portfolio prototype that adapts the UI/UX architecture observed in Honcho-style developer-tool landing pages, while using original Freddie K. content, branding, and visual language.

## Source of Truth

- Design reference image: `assets/reference/prototype-honcho-architecture.png`
- Design system: `docs/DESIGN.md`
- Portfolio editing rules: `docs/INSTRUCTIONS.md`
- Technical architecture: `docs/ARCHITECTURE.md`
- Execution plan: `docs/IMPLEMENTATION_PLAN.md`
- Kanban workflow: `docs/KANBAN_PLAN.md`
- Risk controls: `docs/RISK.md`
- Readiness checklist: `docs/READINESS.md`
- Content map: `docs/CONTENT_MAP.md`
- Style guide: `docs/STYLE_GUIDE.md`

## Current Decision

We are preparing a **production-candidate review deploy**, not replacing an existing live site yet. The reference direction is dark-first, terminal-dashboard, and Freddie K.-branded.

## Production deploy

Recommended host: **Cloudflare Pages**.

Use these settings:

```text
Build command: npm run build
Build output directory: dist
Node version: 22.12.0 or newer
Environment variable: PUBLIC_SITE_URL=https://your-project.pages.dev
```

If the project name changes, update `PUBLIC_SITE_URL` in Cloudflare Pages so canonical URLs, Open Graph URLs, and `robots.txt` point at the deployed URL.

Production assets included:

- `public/_headers` for basic security headers on Cloudflare Pages.
- `public/robots.txt` for crawler discovery.
- `src/pages/sitemap.xml.ts` for generated sitemap routes.
- `src/components/SiteHead.astro` for shared SEO, canonical, Open Graph, and Twitter metadata.

## Tech Stack

- Astro
- TypeScript
- CSS variables / design tokens
- Static-first pages
- Optional island components only where interaction is meaningful

## Non-goals

- Do not copy Honcho branding, mascot, wording, or assets.
- Do not replace the existing portfolio until explicitly approved.
- Do not deploy as the final public site without a review build and explicit approval.
- Do not overbuild a CMS, dashboard, auth system, or backend.
- Do not introduce logistics/KTM/n8n/private automation content into this portfolio.
- Do not present prototype metrics as verified live facts unless source data exists.
