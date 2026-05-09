# freddie-portfolio

Personal portfolio for **Freddie K.** -- small AI tools, automation workflows, and terminal-native experiments.

**[freddie-portfolio.pages.dev](https://freddie-portfolio.pages.dev)**

## Tech Stack

- [Astro](https://astro.build) -- static site generator
- TypeScript
- CSS custom properties / design tokens
- GSAP for animation

## Project Structure

```
src/
  components/   Astro components (Hero, Header, Footer, etc.)
  layouts/      Page layouts
  pages/        Route pages and API endpoints (sitemap)
  content/      Content collections (notes, blog posts)
  data/         Project/Labs data
  styles/       Global CSS and design tokens
  config/       Site configuration
public/         Static assets, favicon, headers, robots.txt
docs/           Design docs, architecture, style guide
```

## Local Development

```bash
npm install
npm run dev    # start dev server
nm test       # regression checks
npm run build  # production build to dist/
```

## Deploy

Hosted on **Cloudflare Pages**, connected to this repository. Pushes to `main` auto-deploy.

```text
Framework preset:  Astro
Build command:     npm run build
Build output:      dist
Env var:           PUBLIC_SITE_URL=https://freddie-portfolio.pages.dev
```

## License

MIT