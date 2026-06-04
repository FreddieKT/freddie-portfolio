# Production QA Audit — 2026-06-04

Target: <https://freddie-portfolio.pages.dev/>

## Verdict

Production portfolio passed the practical browser-side QA loop. Desktop quality is excellent; the only meaningful improvement area is mobile perceived performance.

## Checks Run

- CDP production crawl across key pages
- DOM exposure scan for common secrets/private-data patterns
- Security headers check
- External request/domain audit
- Console, JavaScript exception, and network failure audit
- Internal and external link/navigation checks
- Visual smoke QA via production screenshots
- Lighthouse mobile and desktop audits

## Pages Checked

- `/`
- `/about/`
- `/labs/`
- `/labs/kairos-daydreamer/`
- `/notes/`
- `/contact/`

## CDP / Dogfood Results

- Pages checked: 6
- Issues found: 0
- Console errors/messages: 0
- JavaScript exceptions: 0
- Network failures / 4xx / 5xx: 0
- External runtime request domains: `freddie-portfolio.pages.dev` only
- External links verified: GitHub and X
- Internal route trailing-slash redirects resolve to `200`

## Security Header Results

Present on production:

- `Strict-Transport-Security`
- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy`

## Lighthouse Scores

### Mobile

- Performance: 75
- Accessibility: 100
- Best Practices: 100
- SEO: 100

Key mobile metrics:

- First Contentful Paint: 1.2 s
- Largest Contentful Paint: 7.0 s
- Speed Index: 3.8 s
- Total Blocking Time: 0 ms
- Cumulative Layout Shift: 0
- Time to Interactive: 7.0 s

### Desktop

- Performance: 100
- Accessibility: 100
- Best Practices: 100
- SEO: 100

Key desktop metrics:

- First Contentful Paint: 0.4 s
- Largest Contentful Paint: 0.4 s
- Speed Index: 0.7 s
- Total Blocking Time: 0 ms
- Cumulative Layout Shift: 0
- Time to Interactive: 0.4 s

## Follow-Up Ideas

Not blockers, but worth improving later:

1. Improve mobile perceived performance: Lighthouse flagged 7.0 s LCP/TTI on mobile throttling.
2. Shrink `favicon.png`: Lighthouse reported it as roughly 1.18 MB.
3. Review two `aria-label` values where visible link text does not fully match the accessible name.
4. If animation is delaying hero text render, consider reducing or disabling the initial hero animation on mobile.

## Artifact Policy

Raw QA artifacts are intentionally local-only and ignored by git:

- `dogfood-output/`

This keeps screenshots, Lighthouse HTML/JSON, and CDP reports out of the repository while preserving this summary as the permanent audit record.
