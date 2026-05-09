---
title: "Design tokens that actually survive theme switching"
date: "2026-05-07"
publisher: "Freddie K."
summary: "Getting dark/light themes right is harder than swapping background and foreground colors. Here's what breaks, what the FOUC problem is, and how the token system in this portfolio handles it."
tags: ["CSS", "Design System", "Accessibility"]
---

Most dark mode implementations swap two colors: background and text. That's not enough. A proper theme system needs to handle contrast ratios, surface layering, border opacities, shadow intensities, glow effects, and transitions — all consistently across both themes. Here's how I thought through the token system for this portfolio.

## The token hierarchy

Tokens are defined at three levels:

**Primitive tokens** — raw values that don't change between themes:
```css
/* Not used directly in components */
--blue-100: #b5d9fd;
--blue-600: #2563eb;
--green-500: #7ee787;
```

**Semantic tokens** — named by purpose, change between themes:
```css
:root {
  --accent: #b5d9fd;         /* dark mode: light blue */
  --background: #0b0d10;
  --foreground: #f4f7fb;
}

:root[data-theme="light"] {
  --accent: #2563eb;         /* light mode: dark blue */
  --background: #fafafa;
  --foreground: #181818;
}
```

**Component usage** — always references semantic tokens, never primitives:
```css
.section-label { color: var(--accent); }
```

This indirection is the entire point. When you toggle themes, every component updates automatically because they're all reading from the same semantic variable.

## Where most implementations break

### 1. Contrast ratios flip between themes

The dark-mode accent `#b5d9fd` (a light, desaturated blue) has excellent contrast on `#0b0d10` (dark background) — approximately 9:1. But on `#fafafa` (light background), it drops to ~1.97:1. WCAG AA requires 4.5:1 for normal text.

The mistake is assuming you can use the same color in both themes. You can't — not for text. The dark-mode accent is light so it reads on dark. The light-mode accent needs to be dark so it reads on light. They're different colors that convey the same semantic meaning ("accent") in their respective contexts.

```css
/* dark: light blue works on dark background */
--accent: #b5d9fd;   /* ~9:1 contrast on #0b0d10 */

/* light: dark blue works on white */
--accent: #2563eb;   /* ~5:1 contrast on #fafafa */
```

### 2. Semi-transparent surfaces need separate tokens

Cards in dark mode use `rgba(10, 13, 18, 0.92)` — a near-opaque dark overlay. In light mode, that same token becomes `rgba(255, 255, 255, 0.94)`. The opacity is similar, but the base color is opposite. This is correct behavior, but it requires both values to be defined:

```css
/* dark mode */
--panel-overlay: rgba(10, 13, 18, 0.92);

/* light mode */
--panel-overlay: rgba(255, 255, 255, 0.94);
```

If you forget to define the light-mode value, the dark-mode rgba shows through on light backgrounds — panels become slightly gray. It's subtle and easy to miss in testing.

### 3. Glow effects need their base color updated

The shadow/glow tokens include hardcoded color values:

```css
/* dark mode */
--shadow-glow: 0 0 0.9rem rgba(181, 217, 253, 0.18);

/* light mode — wrong if you forget to update */
--shadow-glow: 0 0 0.9rem rgba(181, 217, 253, 0.14);  /* same color! */
```

The light-mode version should use the light-mode accent's RGB values:

```css
/* light mode — correct */
--shadow-glow: 0 0 0.9rem rgba(37, 99, 235, 0.12);
```

Using the wrong base color in light mode produces a ghost-blue glow on a white background that looks fine at low opacity but off against the new accent color.

## The FOUC problem and how to fix it

FOUC = Flash of Unstyled Content. In the context of theme switching, it's when a page loads with the wrong theme for a split second before JavaScript applies the correct one.

The sequence without a fix:

1. Browser requests HTML → gets `data-theme="dark"` (hardcoded default)
2. Browser renders dark theme
3. JavaScript loads and reads `localStorage`
4. JavaScript applies `data-theme="light"`
5. User sees a flash of dark → light

The fix is an inline `<script>` in `<head>` that runs synchronously before the first paint:

```html
<head>
  <!-- runs before any rendering, eliminates flash -->
  <script is:inline>
    const t = localStorage.getItem('ktt-dev-theme');
    if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
  </script>
</head>
```

`is:inline` in Astro means the script is not processed or deferred — it's injected literally into the HTML. This is the only way to guarantee it runs before the browser's first paint. If you use a regular `<script>` tag, Astro will bundle and defer it, and you'll get the flash.

## Theme persistence with localStorage

The ThemeToggle component stores the user's choice in `localStorage`:

```js
const storageKey = 'ktt-dev-theme';

const applyTheme = (theme) => {
  root.dataset.theme = theme;
  button.setAttribute('aria-pressed', String(theme === 'light'));
  window.localStorage.setItem(storageKey, theme);
};
```

`aria-pressed` is important for accessibility — screen readers announce the toggle as "pressed" or "not pressed," which communicates the current state without relying on the visual icon.

## Testing both themes during development

The fastest way to verify both themes look correct: open devtools, go to Elements, find `<html>`, and manually toggle `data-theme` between `"dark"` and `"light"`. This shows the full theme switch instantly without clicking the toggle repeatedly.

For contrast checking, browser devtools have a built-in contrast ratio checker in the color picker. Select any text element, open the color in devtools, and it shows the computed ratio against the background. Aim for ≥4.5:1 for normal text, ≥3:1 for large text or icons.

## What "design token" actually means

The term gets overloaded. In this context: a design token is a CSS custom property with a semantic name that represents one design decision. `--accent` is a token. `#2563eb` is not — it's a value. Tokens are named for what they mean, not what they look like. `--accent` can be any color; what makes it a token is that it consistently means "interactive element / highlight" throughout the design system.

Tokens fail when they're too specific (`--blue-button-hover`) or too generic (`--color-1`). The right level of abstraction is semantic purpose: `--accent`, `--muted`, `--success`, `--border`, `--background`.
