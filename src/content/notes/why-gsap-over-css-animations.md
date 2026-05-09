---
title: "Why I use GSAP over CSS animations for portfolio motion"
date: "2026-05-06"
publisher: "KTT.DEV"
summary: "CSS animations are fine for hover states. For anything that needs to feel alive — sequenced, staggered, timeline-driven — GSAP wins every time."
tags: ["Animation", "GSAP", "CSS"]
---

When I started building this portfolio, I assumed CSS animations would be enough. They're native, they're fast, they don't need a library. But after two days of fighting with `animation-delay` chains and trying to coordinate multiple elements, I switched to GSAP. Here's why that was the right call.

## The problem with CSS-only animation sequences

CSS animations are great at a single job: animating one element, one property, one time. The moment you need three elements to animate in sequence — where element B starts 80ms after element A finishes — you're writing `animation-delay` math by hand.

```css
.hero-portrait  { animation-delay: 0ms; }
.hero-eyebrow   { animation-delay: 300ms; }
.hero-heading   { animation-delay: 520ms; }
.hero-subtitle  { animation-delay: 720ms; }
.hero-tag       { animation-delay: calc(880ms + var(--i) * 70ms); }
```

This works until you need to adjust timing. Change the portrait from 600ms to 500ms and you're recalculating every delay by hand. Add an element in the middle and the whole chain breaks. It's brittle coordination disguised as code.

## What GSAP timelines actually do

GSAP's `timeline()` treats animation as a sequence of relative instructions, not absolute timestamps.

```js
const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

heroTl
  .to('[data-animate="hero-portrait"]', { autoAlpha: 1, scale: 1, y: 0, duration: 0.65 })
  .to('[data-animate="hero-eyebrow"]',  { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.35')
  .to('[data-animate="hero-heading"]',  { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.28')
  .to('[data-animate="hero-subhead"]',  { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.22')
  .to('[data-animate="hero-tag"]',      { autoAlpha: 1, x: 0, duration: 0.32, stagger: 0.07 }, '-=0.18');
```

The `'-=0.35'` means "start this 350ms before the previous animation ends." Change the portrait duration from 0.65 to 0.5 and nothing else breaks — the relative offsets recalculate automatically. Add a new element anywhere in the chain with `heroTl.add()` and it slots in cleanly.

## `autoAlpha` vs `opacity`

GSAP's `autoAlpha` property handles both `opacity` and `visibility`. When opacity reaches 0, it also sets `visibility: hidden`, which removes the element from tab order and prevents it from blocking clicks. Setting opacity to 0 via CSS alone leaves the element in the accessibility tree and still intercepts pointer events. This matters in a hero section where invisible elements can block navigation links.

## The `prefers-reduced-motion` pattern

GSAP doesn't automatically respect `prefers-reduced-motion`. You have to guard it yourself:

```js
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  gsap.set('[data-animate]', { autoAlpha: 0, y: 18 });
  // ... animations
}
```

The important thing: if you set `autoAlpha: 0` at the start (to hide elements before they animate in), you must not do that when `reduceMotion` is true. Otherwise elements stay invisible forever for users who have motion preferences set. I've seen this bug in production on multiple sites.

## When CSS is still the right tool

CSS wins for hover states, focus indicators, and simple transitions where no sequencing is needed. The portfolio uses CSS for nav pill hover states, theme toggle transitions, and sidebar item active states. These don't need a library — they're single-element, property-level changes that respond to user interaction.

The rule I follow: **CSS for interactions, GSAP for choreography.**

## File size concern

GSAP adds ~35KB gzipped to the bundle. For a portfolio site it's not a concern. For a high-traffic production app, it'd be worth profiling. The `ScrollTrigger` plugin would add more — I'm not using it here, just the core GSAP library.

The tradeoff is worthwhile for the control you get. A page that feels considered and intentional in its motion signals care about craft in a way that a few `transition: opacity 0.3s` rules can't match.
