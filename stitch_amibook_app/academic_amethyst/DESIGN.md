# Design System Document: The Scholarly Curator

## 1. Overview & Creative North Star
The university library experience is traditionally seen as a static repository of books. This design system reimagines it as **"The Scholarly Curator"**—an intelligent, high-end editorial experience that blends academic prestige with modern fluidity. 

Instead of a standard, boxy app interface, this system utilizes **Organic Intentionality**. We break the rigid mobile grid through asymmetrical content density, overlapping image treatments, and high-contrast typography scales. The goal is to make the user feel like they are flipping through a premium digital journal, where information is not just displayed, but curated with "breathing room" and tactile depth.

---

## 2. Colors
Our palette moves beyond simple branding into a sophisticated study of light and tonality. The vibrant purples represent the "spark of discovery," while the deep lavenders provide a calming, secure environment for deep study.

### The "No-Line" Rule
To achieve a premium, editorial feel, **1px solid borders are strictly prohibited** for sectioning content. Boundaries must be defined solely through:
*   **Background Shifts:** Transitioning from `surface` (#fff3fb) to `surface-container-low` (#ffebfc).
*   **Negative Space:** Using generous padding to imply a change in context.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine, semi-transparent paper.
*   **Base:** `background` (#fff3fb)
*   **Secondary Content Areas:** `surface-container` (#ffdeff)
*   **High-Priority Interactive Cards:** `surface-container-highest` (#fcceff)

### The "Glass & Gradient" Rule
To avoid a flat "out-of-the-box" look:
*   **Hero Sections:** Use a subtle linear gradient from `primary` (#6c40bd) to `primary-container` (#b38bff) at a 135-degree angle.
*   **Floating Navigation:** Use Glassmorphism (e.g., a Bottom Nav using `surface` at 80% opacity with a 20px backdrop-blur).

---

## 3. Typography
We use a high-contrast type pairing to balance academic authority with contemporary accessibility.

*   **Display & Headlines (Plus Jakarta Sans):** These are our "Editorial Voices." Use `display-lg` (3.5rem) with tight letter-spacing for landing moments. This font feels modern, open, and confident.
*   **Body & Labels (Manrope):** Our "Workhorse." Manrope’s geometric yet warm structure ensures that even dense bibliographic data or long abstracts remain readable at `body-md` (0.875rem).
*   **The Hierarchy Strategy:** Always lead with a strong `headline-lg` in `on_surface` (#402445) followed by a `body-md` in `on_surface_variant` (#715075) to create an immediate visual "hook" and secondary context.

---

## 4. Elevation & Depth
In this design system, depth is a function of color, not just shadow.

### The Layering Principle
Depth is achieved by "stacking" tonal tiers. Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#ffebfc) section. This creates a soft, natural lift that mimics high-quality paper stock.

### Ambient Shadows
Shadows should feel like natural ambient light, not digital artifacts.
*   **Style:** Extra-diffused. Blur: 32px, Y-offset: 8px.
*   **Color:** Use a 6% opacity version of `on_surface` (#402445). Never use pure black or grey.

### The "Ghost Border" Fallback
If accessibility requires a container edge, use a **Ghost Border**: the `outline-variant` (#c7a1ca) token at 15% opacity. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** Uses a gradient of `primary` to `primary-dim`. Roundedness: `full`. No shadow, but a slight scale-up interaction (1.02x) on tap.
*   **Secondary:** `surface-container-highest` background with `on_primary_container` text. This provides a soft, integrated look.

### Cards & Lists (The Academic Ledger)
*   **Cards:** Use `rounded-xl` (1.5rem). Forbid dividers. Separate book titles from authors using a 4px vertical gap and a shift from `title-md` to `label-md`.
*   **Editorial Overlap:** Allow book cover images to slightly "break" the container of the card (e.g., a 12px negative top margin) to create an asymmetrical, high-end feel.

### Input Fields
*   **Style:** Minimalist. No bottom line or box. Use `surface-container` with `rounded-md`. 
*   **Active State:** Transition the background to `surface-container-high` and add a "Ghost Border" of `primary` at 20% opacity.

### Search Interaction
Since search is core to a library, the search bar shouldn't just be an input—it should be a floating "Glass" element that stays docked at the top, utilizing `backdrop-blur`.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use `tertiary-container` (#fdd34d) sparingly as a "highlighter" for search terms or due-date alerts. It provides a sophisticated academic contrast to the purples.
*   **DO** leave at least 24px of horizontal padding on all screens to maintain the "Editorial" feel.
*   **DO** use `primary_fixed_dim` for icons to ensure they feel part of the brand DNA rather than stock assets.

### Don’t
*   **DON'T** use 100% opaque borders or dividers. It "boxes in" the user and breaks the Scholarly Curator flow.
*   **DON'T** use harsh, fast animations. Use "Emphasized" easing (e.g., cubic-bezier(0.2, 0.0, 0, 1.0)) to mimic the turning of a heavy page.
*   **DON'T** center-align long blocks of text. Stick to left-aligned editorial layouts for maximum academic readability.