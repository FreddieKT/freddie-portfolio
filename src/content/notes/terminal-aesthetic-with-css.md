---
title: "Building a terminal aesthetic with CSS — no images required"
date: "2026-05-05"
publisher: "Freddie K."
summary: "The grid background, monospace everything, dashed borders, glowing dots — all of it is pure CSS. Here's how the visual language of this portfolio works."
tags: ["CSS", "Design", "Design System"]
---

The portfolio has a distinct look: dark background, fine grid lines, dashed borders, glowing accent elements, and monospace type throughout. None of it uses images. This is a breakdown of how each piece works.

## The grid background

The grid overlay on `body::before` uses four layered `background-image` gradients:

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px),
    linear-gradient(var(--grid-line-strong) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-strong) 1px, transparent 1px);
  background-size: 18px 18px, 18px 18px, 90px 90px, 90px 90px;
  mask-image: radial-gradient(circle at center, black 35%, rgba(0,0,0,0.7) 72%, transparent 100%);
  opacity: 0.75;
  z-index: -1;
}
```

The first two gradients create a fine 18px grid. The second two create a coarser 90px major grid (exactly 5× the minor grid). The `mask-image` makes the grid fade out toward the edges — this is what gives it the focused, centered feel rather than an industrial repeating tile.

The `--grid-line` and `--grid-line-strong` tokens are different opacities of the accent color. In dark mode: `rgba(181, 217, 253, 0.08)` and `rgba(181, 217, 253, 0.14)`. Light enough to suggest structure without competing with content.

## Dashed borders as a design language

The portfolio uses two border styles. `.frame` (solid panels like the main hero card) gets `1px solid`. Everything lighter — sidebars, terminal panels, tag rows, status cards — gets `1px dashed`. This distinction creates visual hierarchy without color:

- **Solid** = primary container, holds the most important content
- **Dashed** = secondary container, informational, decorative, optional

The dashed color is slightly stronger than the solid border (`--border-dashed-color: rgba(244, 247, 251, 0.48)` vs `--border: rgba(244, 247, 251, 0.22)`) because dashed lines have natural visual breaks that make them appear lighter than solid lines at the same opacity.

## The corner-frame decoration

Cards that use `.corner-frame` get L-shaped brackets in the corners using `::before` and `::after` pseudo-elements with `clip-path`:

```css
.corner-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-top: 1px solid var(--border-strong);
  border-left: 1px solid var(--border-strong);
  clip-path: polygon(0 0, 100% 0, 100% 12px, 12px 12px, 12px 100%, 0 100%);
}
```

The `clip-path` polygon traces the top-left L shape: full top edge, then down 12px at the right, then left to 12px from left, then down to the bottom, then left to the origin. The `::after` does the same for the bottom-right corner. No images, no SVG — just border + clip-path.

## Glowing dots

The `--status-dot` and `--tag-dot` elements are pure CSS circles. The glow is a `box-shadow` with no offset and a large blur radius:

```css
.status-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: var(--success);
  box-shadow: 0 0 0.85rem rgba(126, 231, 135, 0.45);
}
```

The hollow ring variant (used for tag dots and link dots) uses `border` instead of `background`:

```css
.tag-dot {
  width: 0.55rem;
  height: 0.55rem;
  border: 1px solid currentColor;
  border-radius: 999px;
  background: transparent;
  opacity: 0.75;
}
```

`currentColor` inherits from the parent's text color, so the dot always matches the label next to it without needing a separate token.

## Monospace everywhere

Using a monospace font for the entire site (not just code blocks) is an unusual choice that defines the terminal aesthetic more than any other single decision. IBM Plex Mono is the primary font — it has tabular numbers, consistent character width, and enough personality to work as a display font at large sizes.

The tradeoff: monospace fonts are wider than proportional fonts at the same size, so line lengths need more careful management. The `.mono-copy` class uses `line-height: 1.65` (higher than typical body text) because monospace fonts feel tight at 1.5.

## Panel backgrounds and surface layering

The dark theme uses four surface levels:

| Token | Value | Used for |
|---|---|---|
| `--background` | `#0b0d10` | Page background |
| `--surface` | `#11151a` | Raised surfaces |
| `--panel-overlay` | `rgba(10, 13, 18, 0.92)` | Cards, panels |
| `--terminal-overlay` | `rgba(181, 217, 253, 0.05)` | Terminal backgrounds |

The semi-transparency on `--panel-overlay` lets the grid background show through slightly, which ties the cards to the page without making them feel disconnected.

## What makes it feel "terminal" rather than just dark

The aesthetic works because of the combination, not any single element. Monospace type alone is just retro. Dark background alone is just dark mode. The combination of:

- Monospace type at every size
- Grid overlay (implies a coordinate system)
- Dashed borders (implies draft/prototype status)
- Corner brackets (implies a targeting interface)
- Glowing dots (implies live status indicators)
- Uppercase labels with letter-spacing (implies system readouts)

...creates a coherent visual language that reads as "terminal" without using any terminal colors (green-on-black) or tropes. It's a reinterpretation rather than a costume.
