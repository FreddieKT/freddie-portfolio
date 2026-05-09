# Freddie K. Portfolio

Personal portfolio for **Freddie K.** — small AI tools, automation workflows, and terminal-native experiments.
Live at [`freddie-portfolio.pages.dev`](https://freddie-portfolio.pages.dev).

## Status

**Live production** on Cloudflare Pages. Deployed from `main`, auto-deploys on push.

## Source of Truth

- GitHub: [`FreddieKT/freddie-portfolio`](https://github.com/FreddieKT/freddie-portfolio)
- Deploy target: Cloudflare Pages
- Design system: `docs/DESIGN.md`
- Architecture: `docs/ARCHITECTURE.md`
- Content map: `docs/CONTENT_MAP.md`
- Style guide: `docs/STYLE_GUIDE.md`
- Risk controls: `docs/RISK.md`
- Readiness checklist: `docs/READINESS.md`

## Production deploy

Host: **Cloudflare Pages** connected to this GitHub repo.

```text
Repository:        FreddieKT/freddie-portfolio
Production branch: main
Framework preset:  Astro
Build command:     npm run build
Build output dir:  dist
Node version:      22.12.0 or newer
Env var:           PUBLIC_SITE_URL=https://freddie-portfolio.pages.dev
```

Production assets:

- `public/_headers` — security headers (X-Frame-Options, nosniff, referrer policy)
- `public/robots.txt` — crawler discovery, points to sitemap
- `src/pages/sitemap.xml.ts` — auto-generated sitemap from content + projects
- `src/components/SiteHead.astro` — shared SEO, canonical, Open Graph, and Twitter metadata

## Tech Stack

- Astro (static site)
- TypeScript
- CSS design tokens / custom properties
- Static-first pages, no unnecessary client islands
- GSAP for animation where interaction is meaningful

## Non-goals

- Do not copy Honcho branding, mascot, wording, or assets.
- Do not overbuild a CMS, dashboard, auth system, or backend.
- Do not introduce logistics, KTM, n8n, or private automation content into this portfolio.
- Do not present prototype metrics as verified live facts unless source data exists.
