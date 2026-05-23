# Blender Section Redesign

**Date:** 2026-05-23
**Scope:** Full redesign — blender SVG visual + blend interaction/animation

---

## Overview

Redesign the Interactive Blend Lab section of the FruitBlend website. The existing blender is a minimal SVG trapezoid with basic CSS animations. The redesign replaces it with a realistic premium blender graphic and a 5-phase dramatic animation sequence culminating in a pour-into-glass reveal.

---

## 1. Blender Visual (SVG Redesign)

The blender SVG (`viewBox="0 0 320 420"`) is rebuilt from scratch within the existing `.blender-svg` element. All existing SVG markup inside `index.html` for the blender is replaced.

### Jar

- Taller, more proportional trapezoid shape: `M102 82 L218 82 L192 302 L128 302 Z`
- Fill: multi-stop linear gradient (left-to-right) producing a glass transparency effect — very subtle center highlight, near-opaque edges
- Stroke: `rgba(255,255,255,0.18)`, 1.5px
- Left-edge highlight streak: wide soft path `stroke-width: 10`, `rgba(255,255,255,0.10)`, `stroke-linecap: round` — simulates light catching the glass
- Right-edge faint reflection: narrower path, `rgba(255,255,255,0.04)`
- Measuring marks (right side): 3 tick lines at 130px, 180px, 230px Y with `MAX` label at top, `rgba(255,255,255,0.15–0.25)`

### Handle

- Left side curved path: `M102 110 Q68 110 68 150 Q68 200 102 200`
- Two strokes overlaid: outer `stroke-width: 9, rgba(255,255,255,0.12)` and inner `stroke-width: 5, rgba(255,255,255,0.06)` for depth
- `fill: none`, `stroke-linecap: round`

### Lid

- Main lid: trapezoid `M96 82 L224 82 L216 66 L104 66 Z` with `fill: url(#d-lid)` dark gradient, faint stroke
- Lid ridge: `rect` 48×16px, `rx: 8`, centered at top
- Center knob: smaller `rect` 24×10px, `rx: 5`, darkest fill

### Base

- Tapered path: `M120 302 L200 302 L208 370 L112 370 Z` with dark metallic gradient (top: `#475569` → bottom: `#0f172a`)
- Front panel inset: `rect` with very subtle fill and border
- Speed indicator dots: 3 circles in a row, dim fill, subtle ring border
- Power button: outer ring `r: 12`, inner glowing circle `r: 6`, `fill: #dc2626` with `feGaussianBlur` glow filter
- Power symbol icon drawn with SVG `path` arcs over the button
- Footer strip: dark `rect` at base bottom

### Blade Assembly

- Hub ellipse: `rx: 22, ry: 7`, `fill: #334155`
- Two crossing lines with metallic gradient (`#d-blade`): `stroke-width: 5`, `stroke-linecap: round`
- Center rivet: small circle `r: 4`

### Drop Shadow

- `ellipse` below the entire unit: `rx: 75, ry: 10`, `fill: rgba(0,0,0,0.45)`

### SVG Gradients Required

| ID | Purpose |
|----|---------|
| `d-jar-left` | Horizontal glass transparency effect on jar |
| `d-base` | Vertical dark metallic gradient on base |
| `d-lid` | Dark gradient on lid |
| `d-blade` | Metallic gradient on blade lines |
| `d-glow-red` | feGaussianBlur glow for power button (idle/blending state) |
| `d-glow-green` | feGaussianBlur glow for power button (settled/done state) |

All defined in the existing `<defs>` block in `index.html`.

---

## 2. Blend Animation Sequence

The blend sequence is orchestrated by a new `async function runBlendSequence()` in `main.js`, replacing the current `blendTriggerBtn` click handler body. Uses `await delay(ms)` (a local `Promise`-based helper) to step through phases.

### Phase 1 — Ingredient Drop-In (0–1.2s)

- For each selected ingredient, create a styled `div.falling-fruit` positioned above the blender lid
- Drop one at a time, staggered 400ms apart
- Each lands with a splash: a `circle.splash-ring` SVG element appended inside the blender SVG, animated via `@keyframes splashRing` (scale 0→2, opacity 1→0, 0.4s)
- The final blend color is pre-calculated via `calculateBlendColor()` before the sequence starts
- Liquid layer tints progressively toward the final blend color as each ingredient drops

### Phase 2 — Full Blend / Blade Frenzy (1.2–3.2s)

- Add class `.blending` to `.blender-wrapper` (existing hook)
- Blade spin: `@keyframes spinBlade` at `0.08s linear infinite` (faster than current `0.1s`)
- Add `filter: blur(2px)` to `.blending .blender-blade` for motion blur effect
- Liquid churn: `@keyframes liquidChurn` — `skewX(±3deg)` + `scaleY(0.96–1.04)` oscillation at `0.15s` loop
- Jar vibration: `@keyframes jarShake` — `translateX(±2px)` at `0.05s` loop, applied to `.blender-wrapper`
- Bubble spawner: JS `setInterval` every 200ms creates small `circle` SVG elements inside the jar at blade Y, animates them rising to surface (`translateY` + `opacity` fade), removes after 0.6s

### Phase 3 — Settle & Color Lock (3.2–4.5s)

- Remove `.blending` class (stops frenzy animations)
- Blade deceleration: JS reduces the spin `animation-duration` in steps (`setInterval` every 50ms, incrementing from `0.08s` → `0.4s` → remove animation entirely) to simulate motor slowing
- Liquid surface: brief gentle `@keyframes liquidSettle` wave (low amplitude skewX, 0.3s, 2 iterations)
- Liquid color: `CSS transition: fill 1.2s ease` on `#liquid-layer` to final blended color
- Power button: swap indicator from `#dc2626` to `#16a34a` (red → green)

### Phase 4 — Pour Into Glass (4.5–6.5s)

- `.glass-svg` element (pre-existing in DOM, hidden) slides in from right: `translateX(60px) → translateX(0)`, `opacity 0 → 1`, `0.4s ease-out`
- Blender SVG wrapper tilts: `rotate(0deg) → rotate(-12deg)` on the SVG `g.blender-jar-group`, `transform-origin: bottom center`, `0.5s ease-in-out`
- Liquid stream: a `path.pour-stream` SVG element (pre-existing, `stroke-dasharray` set to path length) animates `stroke-dashoffset` from full length to `0` over `0.8s` — draws the arc from jar spout to glass rim
- Glass fill: `rect.glass-liquid` inside `.glass-svg` has its `y` and `height` SVG attributes animated via JS (`requestAnimationFrame` loop over 1.2s) — `y` decreases from the glass bottom upward as `height` grows, simulating liquid rising from the bottom
- Blender liquid layer drains: path transitions to near-empty (thin residue at bottom) during pour

### Phase 5 — Result State (6.5s+)

- Stream path fades out (`opacity → 0`, `0.3s`)
- Blender returns upright (`rotate(-12deg) → rotate(0deg)`, `0.4s ease-out`)
- Result label fades in below the glass: smoothie name + "Your custom smoothie" subtext (`opacity 0 → 1`, `0.5s`)
- "Blend It!" button text changes to "Blend Again", re-enabled
- Clicking "Blend Again" resets: glass slides out, label fades out, blender resets, ingredients re-enable

---

## 3. Glass SVG Element

A new `svg.glass-svg` is added to the `.blender-container` in `index.html`, positioned absolutely to the right of the blender wrapper. Hidden by default.

```
viewBox="0 0 120 200"
Class: glass-svg (hidden initially via opacity:0, transform:translateX(60px))
```

### Glass structure

- Outer jar outline: `path d="M18 12 L102 12 L90 168 L30 168 Z"` — glass shape, stroke `rgba(255,255,255,0.22)`, transparent fill
- Left highlight streak: `rgba(255,255,255,0.10)`, wide soft path
- Straw: dashed line from upper rim at angle
- Base rim: short line at bottom
- Liquid fill: `rect.glass-liquid` clipped to jar shape via `clipPath`, starts at height 0, fills upward
- Foam layer: `ellipse` at liquid surface top, `rgba(255,255,255,0.2)`, appears after fill completes

### Result label

`div.blend-result-label` positioned below `.glass-svg` in `.blender-container`. Contains:
- `h4.blend-result-name` — generated smoothie name (e.g., "Mango & Berry Blend")
- `p.blend-result-sub` — "Your custom smoothie"

---

## 4. Layout Changes

The `.blender-container` becomes a flex row (blender + glass side by side):

```css
.blender-container {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  gap: 0; /* glass starts offset, animates into position */
  position: relative;
}
```

`.blender-wrapper` width stays `320px`. `.glass-svg` is `120px` wide, positioned absolutely to the right — `right: -20px` relative to container, revealed during Phase 4.

On mobile (`< 768px`), the glass appears below the blender instead of beside it.

---

## 5. Files Changed

| File | Change |
|------|--------|
| `index.html` | Replace blender SVG markup; add `.glass-svg` and `.blend-result-label` elements; add new gradient defs |
| `style.css` | New keyframe animations (`liquidChurn`, `jarShake`, `splashRing`, `glassFill`, `liquidSettle`); updated `.blender-blade` blur; `.glass-svg` styles; `.blend-result-label` styles |
| `main.js` | Replace blend trigger handler with `async runBlendSequence()`; add `delay()` helper; add `resetBlender()` function; add bubble spawner logic |

No new files. No new dependencies.

---

## 6. Out of Scope

- Ingredient selector UI (grid layout and button styles remain unchanged)
- Sound effects
- Nutrition result panel after blending (existing modal system untouched)
- Any section outside of `#blender`
