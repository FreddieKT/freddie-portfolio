---
title: "Static vs dynamic rendering: how to actually decide"
date: "2026-04-10"
summary: "The Next.js default is to reach for SSR. The right answer is usually SSG. Here's a framework for deciding which rendering strategy to use for each page."
tags: ["Architecture", "Astro", "Performance"]
---

Every page on every site has a rendering question: should this be generated at build time, rendered on the server at request time, or rendered on the client? Most developers default to whatever the framework does by default. That default is often wrong for the actual use case.

Here's how I think through the decision.

## The three strategies

**Static Site Generation (SSG)**: HTML is generated at build time. Every user gets the same file. The CDN serves it directly.
- Fastest possible response time
- Zero server cost at request time
- Content is only as fresh as the last build

**Server-Side Rendering (SSR)**: HTML is generated at request time on a server.
- Content can be personalized per user
- Content is always fresh
- Slower response time, higher server cost

**Client-Side Rendering (CSR)**: HTML shell is sent, JavaScript fetches data and renders.
- Works for highly interactive UIs
- Poor for SEO, poor initial load performance
- Right for dashboard-style apps where users are already authenticated

## The decision tree

**Question 1: Does the content change based on who is viewing it?**

If yes (user dashboard, personalized feed, anything behind auth) → SSR or CSR.
If no → continue.

**Question 2: How often does the content change?**

- Never/rarely (portfolio, docs, marketing pages) → SSG
- Regularly but not continuously (blog, product catalog) → SSG with scheduled rebuilds or ISR
- Continuously (live scores, stock prices, chat) → SSR or CSR

**Question 3: Does SEO matter?**

If content needs to be indexed → SSG or SSR (never CSR for public content).
If content is behind auth → SEO doesn't apply.

## Why SSG is underused

SSG has a reputation for being limited. That reputation comes from early static site generators that treated "static" as "unchanging forever." Modern SSG — Astro, Next.js with ISR, Eleventy — can rebuild on content changes, pull from APIs at build time, and generate thousands of pages efficiently.

The performance argument for SSG is strong and often underappreciated:

- A CDN-served static file has ~10ms response time
- A SSR-rendered page has ~100-300ms response time (server processing + network)
- A CSR page has ~500-2000ms before content is visible (network + JS parse + data fetch)

For a portfolio, blog, or documentation site, SSG is the correct answer. There's no reason to pay for a server, add latency, and increase complexity when a static file would do the same job faster.

## The Astro case

This portfolio is 100% static. Every page is generated at build time:

```
/ → /index.html
/about → /about/index.html
/notes → /notes/index.html
/notes/why-gsap-over-css-animations → /notes/why-gsap-over-css-animations/index.html
/labs/afterglow → /labs/afterglow/index.html
```

Eight HTML files. Deployable to any CDN or object storage. No server to maintain. No runtime errors from server infrastructure. Zero cold starts.

Adding a new blog post regenerates the notes index and creates one new HTML file. The rebuild takes under 5 seconds. The CDN deploys the delta, not the entire site.

## When SSG breaks down

SSG struggles when:

1. **You have thousands of pages that update frequently**. Rebuilding 100,000 product pages every time any product changes is expensive. ISR (Incremental Static Regeneration) helps here.

2. **Content is personalized**. If every user sees different content, you can't prebuild it. You need SSR, CSR, or client-side hydration after authentication.

3. **You need real-time data**. Sports scores, order status, live chat — these need live data, not build-time snapshots.

4. **Your build takes longer than your content freshness requirement**. If your build takes 20 minutes and content needs to be fresh within 5 minutes, SSG can't keep up.

None of these apply to a portfolio. For content that doesn't change per-user and doesn't need to be real-time, static generation is the right default.

## The actual cost of SSR

Teams reach for SSR because it's flexible — you can always add dynamic features later. The cost of that flexibility:

- Server infrastructure to maintain
- Cold start latency (especially with serverless)
- Response caching complexity
- Higher ongoing cost than CDN delivery
- Runtime failures that don't exist in static files

These costs are worth paying when SSR is genuinely necessary. They're not worth paying as a default for a site that could be static.

## Practical recommendation

Start with static. Add dynamic only when a specific page has a specific requirement that static can't meet. Identify that requirement precisely — "we need live data" is too vague. "The inventory count on product pages must be accurate within 30 seconds" is specific enough to evaluate.

Most of the time, the requirement that seems to demand dynamic rendering can be met with a static page plus a small client-side API call for the one dynamic piece. That hybrid approach preserves the performance of static delivery while adding just enough dynamism where needed.
