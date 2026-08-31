# Pikinic Design System

This is the visual language built for `pikinic.ng` (home, about, contact). It's meant to be reused as-is across the other Pikinic properties — `studyabroad.pikinic.ng`, `travelsandtours.pikinic.ng`, `stayandride.pikinic.ng` — so the whole ecosystem reads as one brand, not four different sites that happen to link to each other.

Everything here is implemented in Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`) plus a handful of small React components. If another site isn't Next.js/Tailwind, the *values* (colors, type scale, motion timing, the two brand motifs) still apply — just port them to whatever the stack is.

---

## 1. Philosophy

- **Confident, not decorative.** Big bold uppercase type carries the pages, not stock photography. We don't have real product photography for most of this brand yet, so the design leans on typography, color, and two custom line-art motifs instead of filler images.
- **One dark anchor per page.** Every page is mostly light (`neutral-50` background) with exactly one full-bleed `green-900` section — the emotional high point (hero, the "Travel & Tours" service, the final CTA, the team section). Don't make everything dark, and don't skip the dark section — the contrast is what makes both halves feel intentional.
- **Never fabricate.** No fake testimonials, no stock photos standing in for real team members, no invented stats or addresses. If real content isn't available yet, build the honest placeholder (a monogram tile instead of a fake headshot) and say so — don't dress up a guess as fact.
- **Motion is a system, not sprinkles.** Every animation is one of a small, named set (below), reused everywhere, and every single one degrades cleanly under `prefers-reduced-motion`.

---

## 2. Color

### Raw scales

```css
/* Neutral — cool gray, used for text/borders/backgrounds */
--color-neutral-0:   #ffffff;
--color-neutral-50:  #f7f8f7;
--color-neutral-100: #eef0ef;
--color-neutral-200: #dee1df;
--color-neutral-300: #c4c9c5;
--color-neutral-400: #9ba39d;
--color-neutral-500: #757d78;
--color-neutral-600: #565d58;
--color-neutral-700: #3d423e;
--color-neutral-800: #262a27;
--color-neutral-900: #141613;
--color-neutral-1000:#000000;

/* Brand green */
--color-green-50:  #effbf3;
--color-green-100: #d7f3e1;
--color-green-200: #aee7c4;
--color-green-300: #7dd9a3;
--color-green-400: #56ce8b;
--color-green-500: #43c074; /* exact brand mark color — decorative/large surfaces ONLY, fails AA for small text */
--color-green-600: #2f9d5c;
--color-green-700: #227a48; /* text-safe brand green — 5.3:1 on white, use for all green text/icons on light bg */
--color-green-800: #175934;
--color-green-900: #012613; /* exact brand dark — the one dark-anchor background color */
```

There's also an unused-by-default warm "paper" scale (`--color-paper-100/200/300`, `--color-warm-gray-200/300`) left in the tokens for a possible future warm-toned section. Nothing currently points at it — the whole site runs on the neutral scale for backgrounds. Don't wire it up without a deliberate reason; it was tried as the default background once and rejected as too "brochure-warm" for this brand.

### Semantic tokens (what you actually use in markup)

```css
--color-text-primary:    neutral-900
--color-text-secondary:  neutral-600
--color-text-tertiary:   neutral-400   /* eyebrow tags, captions, muted labels */
--color-text-inverse:    neutral-0     /* text on dark/green-900 sections */

--color-background-primary:   neutral-50   /* default page bg */
--color-background-secondary: neutral-100  /* subtle section alternation */
--color-background-inverse:   neutral-900

--color-border-primary:   neutral-200
--color-border-secondary: neutral-300

--color-surface-primary:   neutral-0   /* cards, inputs */
--color-surface-secondary: neutral-50
```

### Rules

- **green-700** is the only green used for text/icons on a light background. green-500/400 read as decorative only (glows, accents, large fills) — never as body text on white.
- On a **green-900** section, primary buttons invert to solid white (`bg-neutral-0 text-green-800`) rather than green-on-green, and green text becomes `green-400` (readable, still reads as "brand green").
- Every dark section is `bg-green-900`, never `neutral-900`/black — that's what distinguishes "an intentional brand moment" from "a generic dark-mode panel." (`neutral-900` / `background-inverse` is reserved for the footer only.)

---

## 3. Typography

- **Font:** [Outfit](https://fonts.google.com/specimen/Outfit) (variable, weights 400/500/600/700), loaded via `next/font/google`. Falls back to `system-ui, sans-serif`.
- **Headlines are bold, uppercase, tight leading** (`font-bold uppercase leading-[0.95] tracking-tight`). Scale climbs aggressively on desktop — hero goes up to `text-8xl`; section headings top out around `text-5xl`–`text-6xl`.
- **One accent word per headline**, colored `green-700` (or `green-400` on dark), never the whole headline.
- **Eyebrow tags**: `text-xs font-semibold uppercase tracking-widest text-text-tertiary` — a short 2–4 word label above every major headline ("The Ecosystem", "By The Numbers", "Ready When You Are").
- **Numbered indices** (`01`, `02`, `03`) in `text-sm font-bold tracking-widest text-green-700` mark ordered content (mission/vision, services) — ties back to the "journey has steps" brand idea.
- **Body copy** is sentence case, `text-text-secondary`, `leading-relaxed`, kept to a `max-w-md`/`max-w-xl` measure — never full-width paragraphs.

---

## 4. Layout

### Container

No max-width — full width with responsive side padding:

```tsx
<div className="mx-auto w-full px-6 md:px-10 lg:px-16">
```

### Section rhythm

```
py-20 md:py-28   — standard section
py-24 md:py-32   — hero-weight section (page intros, contact hero)
py-28 md:py-40   — the closing CTA (biggest, most dramatic)
```

### Radius

The token scale (`--radius-sm: 4px`, `md: 8px`, `lg: 12px`, `xl: 16px`) exists, but **in practice almost everything uses a flat, sharp `rounded-[2px]`** — buttons, cards, images, inputs, the nav pill container. This is a deliberate override of the token scale: 2px reads as "engineered/precise" rather than "soft," matching the blueprint-grid motif below. Use `rounded-[2px]` for anything framed (button, card, image, input); reserve fully-rounded (`rounded-full`) only for small dot/circle accents (pulse dots, avatar monograms' outer edge if ever needed — currently even avatars are square).

---

## 5. Motion system

All keyframes live together in `globals.css` under one comment block, and every one is neutralized in a single `@media (prefers-reduced-motion: reduce)` block at the end. Copy the whole block, don't cherry-pick.

| Class | Purpose | Trigger |
|---|---|---|
| `.reveal` | Fade+rise+unblur on mount, with a `style={{animationDelay}}` per element for staggered entrances (hero headline lines, mobile nav links) | Runs once on mount |
| `.scroll-reveal` (+ `<ScrollReveal>` component) | Same fade+rise+unblur, but triggered the first time the element scrolls into view (`IntersectionObserver`, threshold 0.2) | Scroll |
| `.float-slow` | Gentle 14px vertical bob, 8s loop — used on the pathway mark so background motifs feel alive without being distracting | Continuous |
| `.mesh-glow` | Slow scale/opacity breathe, 9s loop — used behind the `.mesh-gradient` video-poster background | Continuous |
| `.pulse-dot` | Small radiating box-shadow ping — the "live" indicator dot next to eyebrow tags and the intro-section waypoint | Continuous |
| `.draw-underline` | `stroke-dashoffset` animates a hand-drawn underline stroke in under an accent word | Runs once on mount |
| `.scroll-close` | Modern CSS scroll-driven animation (`animation-timeline: view()`) — the hero video card scales down and dims as it scrolls out of view, gated behind `@supports (animation-timeline: view())` so unsupported browsers just get a static card | Scroll (native, no JS) |

`ScrollReveal` component (`src/components/ui/scroll-reveal.tsx`) — wraps any block, accepts `delay` (ms) and `as` ("div"/"span"). This is the one to reuse for "this section should animate in as the visitor scrolls to it," which is nearly every section on the site.

---

## 6. Brand motifs

Two custom line-art assets carry the "journey / path" idea through every page. Both are `fill="currentColor"` / `stroke="currentColor"` so they inherit color and opacity from Tailwind classes.

### Square-frame grid

A technical blueprint-style grid (thin lines dividing the canvas into a cross pattern, `viewBox="0 0 1282 579"`). Source: `public/square frame.svg`, inlined directly in components (see `src/components/sections/hero.tsx` for the canonical copy).

**Usage rules:**
- On a light background: `text-neutral-300/60` (light hero) or lighter (`/50`) as a subtler backdrop.
- On a `green-900` background: `text-neutral-0/[0.06]` to `text-neutral-0/20` — dark sections need it slightly more visible since the base is already busy.
- Two placement patterns:
  - **Scoped to content, natural aspect ratio** (no distortion): `w-[90%]` centered, no `preserveAspectRatio="none"`, so the squares stay square and it simply stops where its own height ends. Use this behind a hero/intro headline.
  - **Full-bleed cover**: `absolute inset-0 h-full w-full` with `preserveAspectRatio="xMidYMid slice"` — scales uniformly and crops, so squares still stay square while covering an arbitrary container (mobile nav panel, a full-height dark section). **Never** use `preserveAspectRatio="none"` with `h-full w-full` together — that stretches the squares into rectangles, which reads as broken, not intentional.

### Pathway mark

An organic winding-ribbon shape (three solid `fill-rule="evenodd"` paths, `viewBox="0 0 516 516"`) that echoes the winding-road shape in the logo mark. Source: `public/pathway.svg`, shared component at `src/components/ui/pathway-mark.tsx` (`<PathwayMark className="..." style={{ animationDelay }} />`).

**Usage rules:**
- Opacity stays low: `/[0.06]` to `/[0.14]` depending on background — it's texture, never a focal shape.
- Typical placement: one large instance (400–640px) centered behind a headline, or positioned in a corner behind whichever column holds body text (not behind an image — it competes with photography).
- Pair with `.float-slow` for a slow bob. Resist the urge to add more than one or two instances per section — this was tried (a tiled grid of copies) and explicitly rejected as looking messy; **one big mark reads as intentional, many small ones read as noise.**

---

## 7. Core components to port

### Button (`src/components/ui/button.tsx`)

- Two variants: `primary` (solid `green-700`, white text) and `secondary` (outline `green-700`, fills solid `green-700` with white text **on hover** — not just a tint).
- Every button carries a small square icon-chip on the right with a diagonal arrow (`fill="currentColor"`, inherits from a `spanClasses` map per variant) — this is the site's signature CTA affordance, present on literally every button.
- Sizes `sm`/`md`/`lg` all use `text-[14px]` — text size doesn't scale with button size, only height/padding do.
- On a dark section, override manually per-instance (`className="bg-neutral-0 text-green-800 hover:bg-green-50"` for primary, `className="border-neutral-0/40 text-neutral-0 hover:bg-neutral-0/10"` for secondary) — the component's default colors assume a light background.

### Bordered square-tile grid

Used for both the Stats section (numbers) and the About page's Values section (words) — same pattern, proves the design system is a system:

```tsx
<div className="grid grid-cols-2 border-l border-t border-border-primary md:grid-cols-4">
  {items.map((item) => (
    <div className="aspect-square border-b border-r border-border-primary p-6 hover:bg-neutral-900/[0.03]">
      {/* heading (number or short label) + short text underneath */}
    </div>
  ))}
</div>
```

The `border-l/border-t` on the container + `border-r/border-b` on each cell is what gives a single continuous grid line instead of doubled borders between cells — don't add borders on all four sides per cell.

### Nav: hover dropdown (desktop) + full-screen panel (mobile)

- Desktop "Services" is a hover-triggered dropdown (CSS `group`/`group-hover`, no JS), not a page — see §8, there's no dedicated services page on this site and there shouldn't be one on the others either; link straight out to the relevant subdomain.
- Mobile nav is a **separate sibling element from `<header>`**, not nested inside it. This matters: if the header has `backdrop-blur`, that CSS property makes the header the *containing block* for any `position: fixed` descendant, which silently breaks a full-screen fixed overlay (it gets sized to the header's own height instead of the viewport). Keep the mobile panel as a top-level sibling.
- Mobile panel is `bg-green-900`, full-bleed square-frame + pathway mark, brand wordmark centered at the bottom.

---

## 8. Page composition pattern

Every page so far follows the same shape — reuse it:

1. **Intro/hero** — eyebrow, huge headline, one accent word, short subcopy, one CTA. Motifs behind the text (never in front).
2. **Body content** — alternating light sections, `ScrollReveal`-wrapped, numbered where it's a sequence (mission/vision, services).
3. **One dark `green-900` section** somewhere in the middle or as the emotional peak (team, a specific service, stats if it fits the page).
4. **Closing CTA** (`src/components/sections/cta.tsx`, reused verbatim across pages) — big centered headline, dual buttons (primary + outline), same motifs, `green-900`.
5. **Footer** — the one place that's `neutral-900`/black rather than `green-900`, closing with a giant low-opacity wordmark.

Each subdomain doesn't need its own services page — cross-link between the four sites directly (this site's nav "Services" dropdown points straight at `studyabroad.pikinic.ng`, `travelsandtours.pikinic.ng`, `stayandride.pikinic.ng` rather than an internal page).

---

## 9. Content rules

- Real copy only. Every stat, address, email, and team name on this site is real data pulled from what the client provided — nothing was invented to fill space.
- Placeholder ≠ fake. Where a real asset doesn't exist yet (team headshots), build an honest placeholder (initials monogram) rather than a stock photo standing in as if it were real.
- If you don't have enough real content to fill a section (e.g. only 2 of "several" team members), build the section to gracefully hold more later — don't invent names to fill a grid.

---

## 10. Quick-start checklist for a new Pikinic site

1. Copy the color tokens (§2) and radius override convention (§4) into the new project's Tailwind `@theme`.
2. Load Outfit via `next/font/google` (or `<link>` to Google Fonts if not Next.js).
3. Copy the motion keyframes block (§5) verbatim, including the `prefers-reduced-motion` override.
4. Copy `public/square frame.svg` and `public/pathway.svg` (or the inline SVG paths from `src/components/sections/hero.tsx` / `src/components/ui/pathway-mark.tsx`) — same two motifs, same brand.
5. Port `Button`, `Container`, and `ScrollReveal` as-is.
6. Structure the homepage per §8. Pick one section to be the `green-900` anchor.
7. Link back to `pikinic.ng` and the sibling subdomains in the footer/nav rather than duplicating "About"/"Contact" content on every site.
