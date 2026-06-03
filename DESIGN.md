# Design

## Overview

Dark-store aesthetic for a curated precision-goods e-commerce site. Reference axis: Zed IDE meets a private collector's cabinet — terminal-native dark mode, one oxidized-crimson accent, everything else disciplined monochrome. The surface is void; the products are lit objects inside it.

Color strategy: **Committed** — pure-black surface, one saturated brand color (crimson) carries 30–60% of the identity weight. Accent is warm amber/aged steel. No warmth in the surface itself.

---

## Color Palette

All values in OKLCH. Never hex in new token additions.

```css
:root {
  /* Surface */
  --color-bg:       oklch(0.08 0.000 0);    /* near-pure black — the void */
  --color-surface:  oklch(0.12 0.000 0);    /* cards, panels, sidebar */
  --color-surface-2: oklch(0.16 0.000 0);   /* elevated surface, hover states */

  /* Brand */
  --color-primary:  oklch(0.418 0.155 27.2); /* oxidized crimson — seed-022 */
  --color-primary-hover: oklch(0.48 0.155 27.2);
  --color-accent:   oklch(0.72 0.12 55);    /* warm amber / aged steel */

  /* Text */
  --color-ink:      oklch(0.94 0.005 27);   /* near-white, whisper of warmth */
  --color-muted:    oklch(0.55 0.005 27);   /* secondary text, ≥3.5:1 on bg */

  /* Utility */
  --color-border:   oklch(0.20 0.000 0);    /* subtle dividers */
  --color-border-active: oklch(0.418 0.155 27.2); /* focused/active border = primary */
  --color-error:    oklch(0.55 0.18 15);    /* error states */
  --color-success:  oklch(0.58 0.14 142);   /* success states */
}
```

### Text-on-fill rule

Any element where text sits on a saturated fill (primary button, accent badge, status pill): use `--color-ink` (near-white), not dark text. Saturated mid-luminance fills always read better with light text.

---

## Typography

### Fonts

- **Display / UI**: [Geist](https://vercel.com/font) or [Inter](https://rsms.me/inter/) — geometric grotesque, terminal-adjacent. Load from CDN or self-host. Prefer Geist for its precision; fall back to Inter.
- **Mono**: [Geist Mono](https://vercel.com/font) — for prices, specs, stock counts, codes.
- **No display serif.** This brand is not editorial-warm; it's technical-precise.

### Scale (OKLCH-paired, clamp-based)

```css
:root {
  --text-xs:    clamp(0.69rem, 0.65rem + 0.2vw, 0.75rem);  /* labels, metadata */
  --text-sm:    clamp(0.81rem, 0.77rem + 0.2vw, 0.875rem); /* secondary body */
  --text-base:  clamp(0.94rem, 0.88rem + 0.3vw, 1rem);     /* body copy */
  --text-lg:    clamp(1.06rem, 1rem + 0.3vw, 1.125rem);    /* lead text */
  --text-xl:    clamp(1.19rem, 1.1rem + 0.5vw, 1.25rem);   /* card headings */
  --text-2xl:   clamp(1.38rem, 1.25rem + 0.7vw, 1.5rem);   /* section headings */
  --text-3xl:   clamp(1.75rem, 1.5rem + 1.25vw, 2rem);     /* page headings */
  --text-4xl:   clamp(2.25rem, 1.8rem + 2.25vw, 3rem);     /* hero headings */
  --text-5xl:   clamp(3rem, 2.4rem + 3vw, 4.5rem);         /* display — hard cap 6rem */
}
```

Letter spacing: display headings at `-0.02em` to `-0.03em` max. Never below `-0.04em`.
Line height: `1.6` for body, `1.15` for headings.
Max line length: `65ch` for body copy.

---

## Spacing & Layout

```css
:root {
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
  --space-32: 8rem;
}
```

Grid: `repeat(auto-fit, minmax(280px, 1fr))` for product grids. Max content width: `1280px`. Gutters: `--space-8` on desktop, `--space-4` on mobile.

---

## Border Radius

```css
:root {
  --radius-sm:   4px;   /* inputs, tags */
  --radius-md:   8px;   /* cards — hard ceiling at 12px */
  --radius-lg:   12px;  /* modals, drawers */
  --radius-full: 9999px; /* pills, avatar thumbnails only */
}
```

No `border-radius` above `12px` on cards or sections.

---

## Shadows

Dark-mode shadows are rarely visible. Use subtle glow instead where needed:

```css
:root {
  --shadow-sm:     0 1px 3px oklch(0 0 0 / 0.4);
  --shadow-md:     0 4px 12px oklch(0 0 0 / 0.5);
  --shadow-primary-glow: 0 0 16px oklch(0.418 0.155 27.2 / 0.3); /* crimson ambient */
}
```

Never pair a `1px solid border` with a `box-shadow blur ≥ 16px` — ghost-card pattern. Pick one.

---

## Motion

Energy level: **low** — Zed IDE doesn't bounce. Transitions are functional, not decorative.

```css
:root {
  --duration-fast:   120ms;
  --duration-base:   200ms;
  --duration-slow:   350ms;
  --ease-out-quart:  cubic-bezier(0.25, 1, 0.5, 1);
}
```

- All color/opacity transitions: `var(--duration-fast) var(--ease-out-quart)`.
- Enter animations (product cards, modals): `var(--duration-base)` with `translateY(8px) → 0` + `opacity`.
- No bounce, no elastic, no spring physics.
- Every animation must have `@media (prefers-reduced-motion: reduce)` crossfade fallback.

---

## Component Patterns

### Buttons

- **Primary**: `background: var(--color-primary)`, `color: var(--color-ink)`, `border-radius: var(--radius-sm)`. Hover: `background: var(--color-primary-hover)`.
- **Ghost**: `border: 1px solid var(--color-border-active)`, transparent bg. Hover: `background: var(--color-surface-2)`.
- **Destructive**: `background: var(--color-error)`.
- No `border` + wide `box-shadow` on the same button.

### Cards (Product)

- Background: `var(--color-surface)`.
- Border: `1px solid var(--color-border)` OR a `--shadow-md` — never both.
- Border radius: `var(--radius-md)` (8px).
- Hover: `border-color: var(--color-border-active)`, subtle `--shadow-primary-glow`.
- Product name in `--text-xl`, price in `--text-base` mono, muted stock label.

### Inputs

- Background: `var(--color-surface)`, border: `1px solid var(--color-border)`.
- Focus: `border-color: var(--color-primary)`, `outline: none`.
- No default blue focus ring — match brand.

### Navigation

- Full-width, `height: 64px`, background: `var(--color-bg)`, bottom `border-bottom: 1px solid var(--color-border)`.
- Logo/wordmark in `--text-lg` weight 700 using primary color or full ink.
- No gradient in nav background.

---

## Design Anti-patterns for This Project

(In addition to SKILL.md absolute bans)

- No warm-tinted surface backgrounds. The void is pure black.
- No blue hover states on anything. All hover interactions use brand crimson or surface-2 lift.
- No cream/sand/paper backgrounds anywhere in the store.
- No generic "Shop Now" CTA copy. Specific verb + object per product action.
- No placeholder image grids shipping to production — every product image needs real or generated art.
