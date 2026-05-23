# Blender Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the minimal blender SVG and basic animation with a realistic premium blender graphic and a 5-phase dramatic blend sequence that culminates in a pour-into-glass reveal.

**Architecture:** Three files change — `index.html` gets a redesigned blender SVG, a new glass SVG, a pour-stream overlay SVG, and new gradient defs; `style.css` gets new keyframes and element styles; `main.js` gets the old click handler replaced by an `async runBlendSequence()` function broken into phase helpers. No new files, no dependencies.

**Tech Stack:** Vanilla HTML/CSS/JS, SVG animations (CSS keyframes + stroke-dashoffset + requestAnimationFrame), no build tools.

> **Note on testing:** This project has no automated test framework. Every task ends with a visual verification step — open `index.html` in a browser and confirm what's described.

---

### Task 1: Add SVG Gradient Definitions

**Files:**
- Modify: `index.html` — the existing `<defs>` block (lines 13–52)

The new blender needs 6 gradients/filters not currently in the defs block. Add them inside the existing `<defs>` tag, after the last `</linearGradient>` (after `#grad-metal`).

- [ ] **Step 1: Add the new defs**

In `index.html`, find the closing `</defs>` on line 52 and insert before it:

```html
      <!-- Redesigned Blender Gradients -->
      <linearGradient id="d-jar-left" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.01)"/>
        <stop offset="20%" stop-color="rgba(255,255,255,0.10)"/>
        <stop offset="60%" stop-color="rgba(255,255,255,0.04)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0.01)"/>
      </linearGradient>
      <linearGradient id="d-base" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#475569"/>
        <stop offset="40%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <linearGradient id="d-lid" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#334155"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <linearGradient id="d-blade" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#cbd5e1"/>
        <stop offset="50%" stop-color="#64748b"/>
        <stop offset="100%" stop-color="#334155"/>
      </linearGradient>
      <filter id="d-glow-red" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="d-glow-green" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
```

- [ ] **Step 2: Verify**

Open `index.html` in a browser. The page should look unchanged — these defs are invisible until referenced. Open DevTools → Elements and confirm all 6 new IDs exist inside `<defs>`.

---

### Task 2: Replace Blender SVG Markup

**Files:**
- Modify: `index.html` — the `<svg class="blender-svg">` block (lines 369–399)

Replace the entire old blender SVG with the new realistic design. The IDs `#liquid-layer`, `#spinner-blade`, `.blender-blade`, and `#base-indicator-light` must be preserved — the JS references them.

- [ ] **Step 1: Replace the SVG**

Find `<svg class="blender-svg" viewBox="0 0 320 400">` through its closing `</svg>` (lines 369–399) and replace the entire block with:

```html
          <svg class="blender-svg" viewBox="0 0 320 420">
            <!-- Drop shadow -->
            <ellipse cx="160" cy="412" rx="75" ry="10" fill="rgba(0,0,0,0.45)"/>

            <!-- Handle -->
            <path d="M102 110 Q68 110 68 150 Q68 200 102 200"
                  fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="9" stroke-linecap="round"/>
            <path d="M102 110 Q72 110 72 150 Q72 196 102 196"
                  fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="5" stroke-linecap="round"/>

            <!-- Jar body -->
            <path d="M102 82 L218 82 L192 302 L128 302 Z"
                  fill="url(#d-jar-left)" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>
            <!-- Left highlight streak -->
            <path d="M108 90 L134 295" stroke="rgba(255,255,255,0.10)" stroke-width="10" stroke-linecap="round"/>
            <!-- Right edge reflection -->
            <path d="M208 90 L196 280" stroke="rgba(255,255,255,0.04)" stroke-width="6" stroke-linecap="round"/>

            <!-- Liquid layer (JS-controlled) -->
            <path class="blender-liquid" id="liquid-layer" d="M131 296 L189 296 L189 296 L131 296 Z"/>

            <!-- Measuring marks -->
            <line x1="200" y1="130" x2="212" y2="130" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
            <text x="214" y="134" font-size="9" fill="rgba(255,255,255,0.22)" font-family="monospace">MAX</text>
            <line x1="204" y1="180" x2="213" y2="180" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
            <line x1="206" y1="230" x2="214" y2="230" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>

            <!-- Lid -->
            <path d="M96 82 L224 82 L216 66 L104 66 Z" fill="url(#d-lid)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
            <rect x="136" y="52" width="48" height="16" rx="8" fill="#1e293b" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
            <rect x="148" y="46" width="24" height="10" rx="5" fill="#0f172a" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

            <!-- Base body -->
            <path d="M120 302 L200 302 L208 372 L112 372 Z"
                  fill="url(#d-base)" stroke="rgba(0,0,0,0.6)" stroke-width="1.5"/>
            <!-- Base panel inset -->
            <rect x="124" y="310" width="72" height="50" rx="6"
                  fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
            <!-- Speed indicator dots -->
            <circle cx="143" cy="328" r="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
            <circle cx="160" cy="328" r="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
            <circle cx="177" cy="328" r="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
            <!-- Power button ring -->
            <circle cx="160" cy="351" r="12" fill="#0f172a" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
            <!-- Power indicator (JS swaps fill and filter) -->
            <circle cx="160" cy="351" r="6" fill="#dc2626" id="base-indicator-light" filter="url(#d-glow-red)"/>
            <!-- Power symbol icon -->
            <path d="M160 346 L160 350" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M156.5 347.5 A5 5 0 1 0 163.5 347.5" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" stroke-linecap="round"/>
            <!-- Base footer strip -->
            <rect x="112" y="366" width="96" height="8" rx="4" fill="rgba(0,0,0,0.3)"/>

            <!-- Blade hub -->
            <ellipse cx="160" cy="302" rx="22" ry="7" fill="#334155" stroke="rgba(0,0,0,0.4)" stroke-width="1"/>
            <!-- Spinning blade (JS adds .blending class on parent to trigger spin) -->
            <g class="blender-blade" id="spinner-blade">
              <line x1="138" y1="300" x2="182" y2="304" stroke="url(#d-blade)" stroke-width="5" stroke-linecap="round"/>
              <line x1="141" y1="304" x2="179" y2="300" stroke="url(#d-blade)" stroke-width="5" stroke-linecap="round"/>
            </g>
            <!-- Center rivet -->
            <circle cx="160" cy="302" r="4" fill="#475569" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          </svg>
```

- [ ] **Step 2: Verify**

Open `index.html` in a browser, scroll to the Blender section. You should see the premium blender — glass jar with highlight streak, knob lid, metallic base with 3 speed dots, glowing red power button with a power icon, and a drop shadow below. The jar should look transparent-glass-like.

---

### Task 3: Add Glass SVG, Pour-Stream Overlay, and Result Label

**Files:**
- Modify: `index.html` — inside `<div class="blender-container glass-panel">` (around line 365)

Three new elements go inside `.blender-container`, alongside the existing `.blender-wrapper`:

1. `svg.glass-svg` — the output glass, hidden by default
2. `svg#pour-stream-svg` — full-container overlay for the liquid stream arc
3. `div.blend-result-label` — smoothie name shown after pour

- [ ] **Step 1: Add elements after the closing `</div>` of `.blender-wrapper`**

Find `</div>` that closes `<div class="blender-wrapper" id="blender-visual-box">` (currently around line 401) and insert after it (still inside `.blender-container`):

```html
          <!-- Glass SVG (hidden until pour phase) -->
          <svg class="glass-svg" id="glass-svg" viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <clipPath id="glass-clip">
                <path d="M18 12 L102 12 L90 168 L30 168 Z"/>
              </clipPath>
            </defs>
            <!-- Glass outline -->
            <path d="M18 12 L102 12 L90 168 L30 168 Z"
                  fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>
            <!-- Left highlight streak -->
            <path d="M24 18 L34 162" stroke="rgba(255,255,255,0.10)" stroke-width="8" stroke-linecap="round"/>
            <!-- Liquid fill (JS animates y and height attributes) -->
            <rect class="glass-liquid" id="glass-liquid" x="0" y="168" width="120" height="0"
                  fill="#ffffff" clip-path="url(#glass-clip)" opacity="0.85"/>
            <!-- Foam layer (shown after fill) -->
            <ellipse class="glass-foam" id="glass-foam" cx="60" cy="168" rx="30" ry="5"
                     fill="rgba(255,255,255,0.2)" opacity="0"/>
            <!-- Straw -->
            <line x1="82" y1="12" x2="96" y2="-12" stroke="rgba(255,255,255,0.4)"
                  stroke-width="4" stroke-dasharray="5 3" stroke-linecap="round"/>
            <!-- Base rim -->
            <line x1="30" y1="168" x2="90" y2="168" stroke="rgba(255,255,255,0.15)" stroke-width="2" stroke-linecap="round"/>
          </svg>

          <!-- Pour stream overlay (spans full container, JS sets path) -->
          <svg id="pour-stream-svg" class="pour-stream-svg" xmlns="http://www.w3.org/2000/svg">
            <path id="pour-stream-path" class="pour-stream-path" d="" fill="none"
                  stroke="rgba(255,255,255,0.6)" stroke-width="5" stroke-linecap="round" opacity="0"/>
          </svg>

          <!-- Result label (shown after pour completes) -->
          <div class="blend-result-label" id="blend-result-label">
            <h4 class="blend-result-name" id="blend-result-name"></h4>
            <p class="blend-result-sub">Your custom smoothie</p>
          </div>
```

- [ ] **Step 2: Verify**

Open the page. The blender section should look exactly the same as after Task 2 — the glass and label are hidden by CSS (added in Task 4). Check DevTools Elements panel confirms `#glass-svg`, `#pour-stream-svg`, and `#blend-result-label` exist inside `.blender-container`.

---

### Task 4: CSS — New Keyframes, Updated Blend Rules, New Element Styles

**Files:**
- Modify: `style.css`

Four sets of changes: (a) update `.blender-wrapper` height for new viewBox, (b) update blade `transform-origin` and add blur, (c) add new keyframes, (d) add styles for glass, stream, result label, and updated container layout.

- [ ] **Step 1: Update `.blender-wrapper` height and `.blender-svg`**

Find `.blender-wrapper` (around line 599) and change `height: 400px` to `height: 420px`:

```css
.blender-wrapper {
  position: relative;
  width: 320px;
  height: 420px;
}
```

- [ ] **Step 2: Update blade spin `transform-origin` and add motion blur**

Find `.blending .blender-blade` (around line 630) and update:

```css
.blending .blender-blade {
  animation: spinBlade 0.08s linear infinite;
  transform-origin: 160px 302px;
  filter: blur(1.5px);
}
```

- [ ] **Step 3: Add new keyframes after the existing `@keyframes liquidSwirl` block (around line 659)**

```css
@keyframes liquidChurn {
  0%, 100% { transform: skewX(0deg) scaleY(1); }
  20%       { transform: skewX(3deg) scaleY(1.04); }
  50%       { transform: skewX(-3deg) scaleY(0.96); }
  80%       { transform: skewX(2deg) scaleY(1.02); }
}

@keyframes jarShake {
  0%, 100% { transform: translateX(0); }
  25%       { transform: translateX(-2px); }
  75%       { transform: translateX(2px); }
}

@keyframes splashRing {
  0%   { transform: scale(0); opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
}

@keyframes liquidSettle {
  0%, 100% { transform: skewX(0deg); }
  33%       { transform: skewX(1.5deg); }
  66%       { transform: skewX(-1deg); }
}
```

- [ ] **Step 4: Update `.blending` rules to use new animations**

Find the `.blending .blender-liquid` rule (around line 625) and replace it:

```css
.blending .blender-liquid {
  animation: liquidChurn 0.15s linear infinite;
  fill: var(--blend-color, rgba(255, 255, 255, 0.1));
}
```

Find the `.blender-wrapper.blending` or `.blending` rule. If no wrapper-level shake rule exists, add after the blade rule:

```css
.blender-wrapper.blending {
  animation: jarShake 0.05s linear infinite;
}
```

- [ ] **Step 5: Add glass SVG styles**

After the `.blend-action-btn` rule (around line 664), add:

```css
/* --- Glass SVG (pour reveal) --- */
.glass-svg {
  width: 110px;
  height: auto;
  opacity: 0;
  transform: translateX(50px);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
  flex-shrink: 0;
  align-self: flex-end;
  margin-bottom: 8px;
}

.glass-svg.visible {
  opacity: 1;
  transform: translateX(0);
}

/* --- Pour stream overlay SVG --- */
.pour-stream-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

/* --- Result label --- */
.blend-result-label {
  position: absolute;
  bottom: 10px;
  right: 0;
  width: 130px;
  text-align: center;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.blend-result-label.visible {
  opacity: 1;
  transform: translateY(0);
}

.blend-result-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0 0 4px;
}

.blend-result-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
}
```

- [ ] **Step 6: Update `.blender-container` to flex row**

Find `.blender-container` (around line 590) and update:

```css
.blender-container {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  gap: 16px;
  position: relative;
  min-height: 500px;
  padding: 20px;
}
```

- [ ] **Step 7: Verify**

Open the page. The blender section should still look correct — the blender centered, no visible glass or label. The blender wrapper is slightly taller (420px vs 400px) — visually imperceptible. Check DevTools that `.blender-container` is now `display: flex; flex-direction: row`.

---

### Task 5: JS — Add Helpers, Update Constants, Replace Click Handler Shell

**Files:**
- Modify: `main.js` — the blender game section (lines 202–353)

Replace the blender section with an `async runBlendSequence()` architecture. This task sets up the skeleton — DOM refs, constants, helpers, and the click handler that calls `runBlendSequence`.

- [ ] **Step 1: Replace the blender section DOM references and constants**

Find the comment `/* --- Interactive Smoothie Blender Game --- */` (line 202) and replace everything from there through the `blendTriggerBtn.addEventListener('click', ...` closing `});` on line 353 with the following. Leave everything after line 353 (the contact form section) untouched.

```javascript
  /* --- Interactive Smoothie Blender Game --- */
  const ingredientButtons = document.querySelectorAll('.ingredient-btn');
  const blendTriggerBtn = document.getElementById('btn-blend-trigger');
  const blenderStatus = document.getElementById('blender-status');
  const liquidLayer = document.getElementById('liquid-layer');
  const baseIndicatorLight = document.getElementById('base-indicator-light');
  const blenderVisualBox = document.getElementById('blender-visual-box');
  const glassSvg = document.getElementById('glass-svg');
  const glassLiquid = document.getElementById('glass-liquid');
  const glassFoam = document.getElementById('glass-foam');
  const pourStreamSvg = document.getElementById('pour-stream-svg');
  const pourStreamPath = document.getElementById('pour-stream-path');
  const blendResultLabel = document.getElementById('blend-result-label');
  const blendResultName = document.getElementById('blend-result-name');

  // SVG path for liquid at reset (flat line at jar bottom)
  const LIQUID_RESET_PATH = 'M131 296 L189 296 L189 296 L131 296 Z';
  // SVG path for liquid when fully blended (fills jar to near top)
  const LIQUID_FULL_PATH  = 'M106 115 L214 115 L192 302 L128 302 Z';

  let selectedIngredients = [];
  let isBlending = false;

  // Resolves after `ms` milliseconds
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Color blending algorithm (calculates average of hex colors)
  const calculateBlendColor = (ingredients) => {
    if (ingredients.length === 0) return '#ffffff';
    let r = 0, g = 0, b = 0;
    ingredients.forEach(ing => {
      const hex = ing.color;
      r += parseInt(hex.substring(1, 3), 16);
      g += parseInt(hex.substring(3, 5), 16);
      b += parseInt(hex.substring(5, 7), 16);
    });
    r = Math.floor(r / ingredients.length);
    g = Math.floor(g / ingredients.length);
    b = Math.floor(b / ingredients.length);
    const toHex = (c) => { const h = c.toString(16); return h.length === 1 ? '0' + h : h; };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Ingredient selection logic (unchanged from original)
  ingredientButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isBlending) return;
      const name = btn.getAttribute('data-ingredient');
      const color = btn.getAttribute('data-color');
      const isSelected = btn.classList.contains('selected');

      if (isSelected) {
        btn.classList.remove('selected');
        selectedIngredients = selectedIngredients.filter(ing => ing.name !== name);
      } else {
        if (selectedIngredients.length >= 3) {
          blenderStatus.textContent = "Oops! Max 3 ingredients allowed at once.";
          blenderStatus.style.transform = 'scale(1.05)';
          setTimeout(() => blenderStatus.style.transform = 'scale(1)', 200);
          return;
        }
        btn.classList.add('selected');
        selectedIngredients.push({ name, color });
      }

      if (selectedIngredients.length > 0) {
        blendTriggerBtn.removeAttribute('disabled');
        const listNames = selectedIngredients.map(i => i.name.charAt(0).toUpperCase() + i.name.slice(1)).join(' + ');
        blenderStatus.textContent = `Selected: ${listNames}. Ready to blend!`;
        blenderStatus.style.color = 'var(--color-green)';
      } else {
        blendTriggerBtn.setAttribute('disabled', 'true');
        blenderStatus.textContent = "Please select at least 1 ingredient to begin.";
        blenderStatus.style.color = 'var(--accent-pink)';
      }
    });
  });

  blendTriggerBtn.addEventListener('click', () => {
    if (selectedIngredients.length === 0 || isBlending) return;
    isBlending = true;
    blendTriggerBtn.setAttribute('disabled', 'true');
    ingredientButtons.forEach(btn => btn.setAttribute('disabled', 'true'));
    runBlendSequence(selectedIngredients.slice());
  });

  async function runBlendSequence(ingredients) {
    const blendedColor = calculateBlendColor(ingredients);

    // Reset liquid to empty
    liquidLayer.setAttribute('d', LIQUID_RESET_PATH);
    liquidLayer.style.fill = blendedColor;

    await phase1DropIngredients(ingredients, blendedColor);
    await phase2Frenzy();
    await phase3Settle(blendedColor);
    await phase4Pour(blendedColor);
    await phase5Result(ingredients);
  }

  // Placeholder phase functions — implemented in Tasks 6–10
  async function phase1DropIngredients(ingredients, blendedColor) {}
  async function phase2Frenzy() {}
  async function phase3Settle(blendedColor) {}
  async function phase4Pour(blendedColor) {}
  async function phase5Result(ingredients) {}

  function resetBlender() {}
```

- [ ] **Step 2: Verify**

Open the page. Click "Blend It!" after selecting ingredients — the button should disable and nothing else should happen yet (all phase functions are empty stubs). No errors in the console. The ingredient selection logic should still work (select/deselect, max 3, status text).

---

### Task 6: JS — Phase 1: Ingredient Drop-In with Splash Rings

**Files:**
- Modify: `main.js` — replace the `phase1DropIngredients` stub

Each ingredient drops one at a time from above the lid. On landing, an SVG splash ring pulses outward from the liquid surface.

- [ ] **Step 1: Replace `phase1DropIngredients` stub**

```javascript
  async function phase1DropIngredients(ingredients, blendedColor) {
    blenderStatus.textContent = 'Adding ingredients...';
    blenderStatus.style.color = 'var(--color-citrus)';

    for (let i = 0; i < ingredients.length; i++) {
      const ing = ingredients[i];

      // Spawn falling fruit div (existing CSS animation handles the drop)
      const fruit = document.createElement('div');
      fruit.className = 'falling-fruit';
      fruit.style.left = `${90 + Math.random() * 140}px`;
      fruit.style.top = '80px';
      fruit.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill="${ing.color}" opacity="0.9"/>
        <circle cx="9" cy="9" r="3" fill="rgba(255,255,255,0.3)"/>
      </svg>`;
      blenderVisualBox.appendChild(fruit);
      setTimeout(() => fruit.remove(), 900);

      // Splash ring — appears at liquid surface level inside the blender SVG
      const blenderSvg = blenderVisualBox.querySelector('.blender-svg');
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('cx', '160');
      ring.setAttribute('cy', '295');
      ring.setAttribute('r', '18');
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', ing.color);
      ring.setAttribute('stroke-width', '3');
      ring.style.opacity = '0.8';
      ring.style.animation = 'splashRing 0.4s ease-out forwards';
      ring.style.transformOrigin = '160px 295px';
      blenderSvg.appendChild(ring);
      setTimeout(() => ring.remove(), 450);

      // Tint the liquid progressively
      const fraction = (i + 1) / ingredients.length;
      liquidLayer.style.fill = blendedColor;
      liquidLayer.style.opacity = String(0.2 + 0.6 * fraction);

      await delay(420);
    }

    // Brief pause before frenzy
    await delay(200);
  }
```

- [ ] **Step 2: Verify**

Select 2–3 ingredients and click "Blend It!". Each ingredient should visibly drop down into the blender jar one at a time (~0.42s apart), followed by a splash ring pulse at the liquid surface. The liquid should become faintly visible and tinted. Console should be error-free.

---

### Task 7: JS — Phase 2: Blade Frenzy with Bubble Spawner

**Files:**
- Modify: `main.js` — replace `phase2Frenzy` stub

Add `.blending` class to trigger jarShake + liquidChurn + blade spin animations. Run a bubble spawner that creates rising circles inside the jar. Lasts 2 seconds.

- [ ] **Step 1: Replace `phase2Frenzy` stub**

```javascript
  async function phase2Frenzy() {
    blenderStatus.textContent = 'Blending... crushing organic fruit!';
    blenderStatus.style.color = 'var(--color-citrus)';

    baseIndicatorLight.setAttribute('fill', '#eab308');
    baseIndicatorLight.setAttribute('filter', '');
    blenderVisualBox.classList.add('blending');

    const blenderSvg = blenderVisualBox.querySelector('.blender-svg');

    // Bubble spawner — creates small circles rising from blade to surface
    const bubbleInterval = setInterval(() => {
      const bubble = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const cx = 130 + Math.random() * 60;
      bubble.setAttribute('cx', String(cx));
      bubble.setAttribute('cy', '290');
      bubble.setAttribute('r', String(2 + Math.random() * 4));
      bubble.setAttribute('fill', 'rgba(255,255,255,0.4)');
      bubble.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
      blenderSvg.appendChild(bubble);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bubble.style.transform = `translateY(-${80 + Math.random() * 60}px)`;
          bubble.style.opacity = '0';
        });
      });

      setTimeout(() => bubble.remove(), 650);
    }, 180);

    await delay(2000);
    clearInterval(bubbleInterval);
    blenderVisualBox.classList.remove('blending');
  }
```

- [ ] **Step 2: Verify**

Run the sequence. During phase 2 you should see: the jar vibrates slightly side-to-side, the liquid churns with a skew motion, the blade spins fast with a slight blur, and small white bubbles rise from the blade area and fade out. This lasts ~2 seconds before stopping cleanly.

---

### Task 8: JS — Phase 3: Settle and Color Lock

**Files:**
- Modify: `main.js` — replace `phase3Settle` stub

Blade decelerates via JS stepping. Liquid fills to max and settles. Power button swaps to green.

- [ ] **Step 1: Replace `phase3Settle` stub**

```javascript
  async function phase3Settle(blendedColor) {
    blenderStatus.textContent = 'Settling...';
    blenderStatus.style.color = 'var(--color-citrus)';

    const blade = document.getElementById('spinner-blade');

    // Decelerate blade: step animation-duration from 0.08s → stop
    const durations = [0.12, 0.2, 0.35, 0.55, 0.8];
    for (const dur of durations) {
      blade.style.animationDuration = `${dur}s`;
      await delay(120);
    }
    blade.style.animation = 'none';
    blade.style.animationDuration = '';

    // Fill liquid to max and settle
    liquidLayer.setAttribute('d', LIQUID_FULL_PATH);
    liquidLayer.style.opacity = '1';
    liquidLayer.style.transition = 'fill 1.0s ease';
    liquidLayer.style.fill = blendedColor;

    // Gentle settle wave
    liquidLayer.style.animation = 'liquidSettle 0.3s ease-in-out 2';
    await delay(700);
    liquidLayer.style.animation = '';

    // Power button: red → green
    baseIndicatorLight.setAttribute('fill', '#16a34a');
    baseIndicatorLight.setAttribute('filter', 'url(#d-glow-green)');

    await delay(600);
  }
```

- [ ] **Step 2: Verify**

Run the sequence. After the frenzy, the blade should visibly slow down step-by-step (not cut off abruptly). The liquid should fill the jar to near the top and transition smoothly to the blended color. The power button should change from red/amber to green. Total phase duration ~2s.

---

### Task 9: JS — Phase 4: Pour Into Glass

**Files:**
- Modify: `main.js` — replace `phase4Pour` stub

The glass slides in, the blender tilts, a stream path draws from spout to glass, and the glass fills from the bottom up via `requestAnimationFrame`.

- [ ] **Step 1: Replace `phase4Pour` stub**

```javascript
  async function phase4Pour(blendedColor) {
    blenderStatus.textContent = 'Pouring...';
    blenderStatus.style.color = 'var(--color-green)';

    // Slide glass in
    glassSvg.classList.add('visible');
    glassLiquid.setAttribute('fill', blendedColor);

    await delay(450); // wait for glass slide-in transition

    // Tilt blender wrapper
    blenderVisualBox.style.transition = 'transform 0.5s ease-in-out';
    blenderVisualBox.style.transformOrigin = 'bottom center';
    blenderVisualBox.style.transform = 'rotate(-12deg)';

    await delay(550); // wait for 0.5s tilt transition to complete

    // Build pour stream path using element positions
    const containerEl = blenderVisualBox.closest('.blender-container');
    const containerRect = containerEl.getBoundingClientRect();
    const blenderRect = blenderVisualBox.getBoundingClientRect();
    const glassRect = glassSvg.getBoundingClientRect();

    const spoutX = blenderRect.right - containerRect.left - 15;
    const spoutY = blenderRect.top - containerRect.top + blenderRect.height * 0.22;
    const glassX = glassRect.left - containerRect.left + 15;
    const glassY = glassRect.top - containerRect.top + 12;
    const cpX = (spoutX + glassX) / 2;
    const cpY = Math.max(spoutY, glassY) + 20;

    const streamD = `M ${spoutX} ${spoutY} Q ${cpX} ${cpY} ${glassX} ${glassY}`;
    pourStreamPath.setAttribute('d', streamD);
    pourStreamPath.setAttribute('stroke', blendedColor);

    // Set dasharray to path length for draw animation
    const pathLength = pourStreamPath.getTotalLength();
    pourStreamPath.style.strokeDasharray = `${pathLength}`;
    pourStreamPath.style.strokeDashoffset = `${pathLength}`;
    pourStreamPath.style.opacity = '1';
    pourStreamPath.style.transition = `stroke-dashoffset 0.8s ease-in-out`;

    // Trigger stream draw
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        pourStreamPath.style.strokeDashoffset = '0';
      });
    });

    // Glass liquid rise via requestAnimationFrame (1.2s duration)
    await delay(100);
    const glassFillDuration = 1200;
    const glassHeight = 156; // height of liquid fill area in viewBox units (168 - 12)
    const start = performance.now();

    await new Promise(resolve => {
      function fillFrame(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / glassFillDuration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const filledH = glassHeight * eased;
        const filledY = 168 - filledH; // fill rises from bottom (y=168) upward
        glassLiquid.setAttribute('y', String(filledY));
        glassLiquid.setAttribute('height', String(filledH));
        if (progress < 1) {
          requestAnimationFrame(fillFrame);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(fillFrame);
    });

    // Show foam at top of liquid
    glassFoam.setAttribute('cy', String(12 + 5));
    glassFoam.style.opacity = '1';
    glassFoam.style.transition = 'opacity 0.4s ease';

    await delay(300);

    // Drain blender liquid
    liquidLayer.style.transition = 'fill 0.6s ease';
    const drainPath = 'M131 296 L189 296 L192 296 L128 296 Z';
    await delay(100);
    liquidLayer.setAttribute('d', drainPath);

    // Fade stream out
    pourStreamPath.style.transition = 'opacity 0.3s ease';
    pourStreamPath.style.opacity = '0';

    // Return blender to upright
    await delay(400);
    blenderVisualBox.style.transform = 'rotate(0deg)';

    await delay(500);
  }
```

- [ ] **Step 2: Verify**

Run full sequence. After settling: the glass should slide in smoothly from the right. The blender should tilt ~12 degrees. A colored stream arc should draw from the blender spout area down into the glass. The glass should fill with the blend color rising from the bottom upward. A foam layer should appear at the top. The blender tilts back upright. All transitions should be smooth. If the stream path looks off, adjust `spoutX`/`spoutY` multipliers to match the actual layout.

---

### Task 10: JS — Phase 5: Result State and Reset

**Files:**
- Modify: `main.js` — replace `phase5Result` stub and `resetBlender` stub

Show the smoothie name below the glass. Swap the button to "Blend Again". Implement `resetBlender` to restore everything.

- [ ] **Step 1: Replace `phase5Result` and `resetBlender` stubs**

```javascript
  async function phase5Result(ingredients) {
    const capitalizedNames = ingredients
      .map(i => i.name.charAt(0).toUpperCase() + i.name.slice(1))
      .join(' & ');

    blendResultName.textContent = `${capitalizedNames} Blend`;
    blendResultLabel.classList.add('visible');

    blenderStatus.innerHTML = `✓ <strong>${capitalizedNames}</strong> Smoothie ready!`;
    blenderStatus.style.color = 'var(--color-green)';

    blendTriggerBtn.textContent = 'Blend Again';
    blendTriggerBtn.removeAttribute('disabled');
    blendTriggerBtn.onclick = () => resetBlender();
  }

  function resetBlender() {
    // Hide glass and result label
    glassSvg.classList.remove('visible');
    blendResultLabel.classList.remove('visible');

    // Reset glass liquid fill
    glassLiquid.setAttribute('y', '168');
    glassLiquid.setAttribute('height', '0');
    glassFoam.style.opacity = '0';

    // Reset stream
    pourStreamPath.setAttribute('d', '');
    pourStreamPath.style.opacity = '0';

    // Reset liquid layer
    liquidLayer.setAttribute('d', LIQUID_RESET_PATH);
    liquidLayer.style.fill = 'transparent';
    liquidLayer.style.opacity = '1';
    liquidLayer.style.transition = '';

    // Reset blade
    const blade = document.getElementById('spinner-blade');
    blade.style.animation = '';
    blade.style.animationDuration = '';

    // Reset power button
    baseIndicatorLight.setAttribute('fill', '#dc2626');
    baseIndicatorLight.setAttribute('filter', 'url(#d-glow-red)');

    // Reset blender wrapper transform
    blenderVisualBox.style.transform = '';
    blenderVisualBox.style.transition = '';

    // Reset status and button
    blenderStatus.textContent = 'Please select at least 1 ingredient to begin.';
    blenderStatus.style.color = 'var(--accent-pink)';
    blendTriggerBtn.textContent = 'Blend It!';
    blendTriggerBtn.setAttribute('disabled', 'true');
    blendTriggerBtn.onclick = null; // Restore original listener

    // Re-enable and deselect ingredients
    ingredientButtons.forEach(btn => {
      btn.removeAttribute('disabled');
      btn.classList.remove('selected');
    });

    selectedIngredients = [];
    isBlending = false;
  }
```

- [ ] **Step 2: Verify**

Run the full sequence end-to-end. After the pour: the result label should fade in below the glass showing "Mango & Strawberry Blend" (or whatever was selected). The button should read "Blend Again". Clicking "Blend Again" should: hide the glass and label, clear the liquid, reset the power button to red, re-enable all ingredient buttons, and restore the "Please select at least 1 ingredient" status. Then a full new sequence should be triggerable.

---

### Task 11: Mobile Responsive CSS

**Files:**
- Modify: `style.css` — the existing mobile breakpoints section

At mobile widths the glass should appear below the blender (stacked) instead of beside it.

- [ ] **Step 1: Add glass mobile overrides**

Find the mobile blender override block at `/* Blender Game Section */` (around line 1264). After the existing `.blender-container` and `.blender-wrapper` overrides in that block, add:

```css
    .blender-container {
      flex-direction: column;
      align-items: center;
    }

    .glass-svg {
      width: 90px;
      transform: translateY(30px);
    }

    .glass-svg.visible {
      transform: translateY(0);
    }

    .blend-result-label {
      position: static;
      width: auto;
      margin-top: 8px;
    }
```

- [ ] **Step 2: Verify**

Open DevTools, switch to a mobile viewport (< 768px). The blender should be centered at the top, and after blending, the glass should appear below it rather than beside it. The result label should flow naturally below the glass.

---

### Task 12: Full End-to-End Visual Verification

**Files:** None — verification only.

- [ ] **Step 1: Full desktop run-through**

Open `index.html` in a browser at full desktop width (1200px+). Navigate to the Blender section.
1. Select 3 ingredients — status updates, button enables
2. Click "Blend It!" — button disables, ingredients disable
3. Phase 1: ingredients drop in one at a time, splash rings appear, liquid tints
4. Phase 2: jar vibrates, liquid churns, blade spins fast with blur, bubbles rise — lasts ~2s
5. Phase 3: blade decelerates step-by-step, liquid fills jar and transitions to blend color, power button turns green
6. Phase 4: glass slides in, blender tilts, stream arc draws, glass fills from bottom, foam appears, blender returns upright
7. Phase 5: result label fades in below glass, button reads "Blend Again"
8. Click "Blend Again": everything resets cleanly, no artifacts

- [ ] **Step 2: Edge cases**

- Select only 1 ingredient — full sequence should work fine (single color, single drop)
- Run two consecutive blends — second blend should be as clean as the first
- Confirm no console errors throughout

- [ ] **Step 3: Confirm other sections untouched**

- Flavor cards still open nutrition modals correctly
- Contact form still validates and shows success overlay
- Hero parallax still works on mouse move
- Navigation active link tracking still works on scroll
