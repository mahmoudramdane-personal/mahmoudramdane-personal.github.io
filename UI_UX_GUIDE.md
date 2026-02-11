# UI/UX Design Guide

> Design system and patterns powering this personal website — inspired by [duering.tech](https://duering.tech).

---

## 1. Design Philosophy

**Systematic Minimalism with a Developer Aesthetic**

| Principle | How It's Applied |
|---|---|
| **Token-driven** | Every color, spacing, shadow, and radius uses CSS custom properties — zero magic numbers |
| **High contrast** | Near-black text on near-white background (light), inverted in dark mode |
| **Monospace identity** | JetBrains Mono for all labels, nav links, tags — gives a technical/coded feel |
| **Progressive disclosure** | Minimal surface → hover reveals detail → click opens full modal |
| **Accessibility-first** | `prefers-reduced-motion`, `:focus-visible`, auto dark mode |

---

## 2. Color System

### Semantic Tokens (auto-switch light/dark)

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-bg` | `#fafafa` | `#09090b` | Page background |
| `--color-bg-elevated` | `#ffffff` | `#18181b` | Cards, modals, nav |
| `--color-bg-subtle` | `#f0f0f2` | `#27272a` | Tags, code blocks |
| `--color-text` | `#0a0a0b` | `#fafafa` | Headings, primary text |
| `--color-text-muted` | `#52525b` | `#a1a1aa` | Body text, descriptions |
| `--color-text-subtle` | `#71717a` | `#71717a` | Labels, metadata |
| `--color-border` | `#d4d4d8` | `#3f3f46` | Card borders, dividers |

### Accent Palette

| Variable | Color | Hex | Use |
|---|---|---|---|
| `--color-primary` | Indigo | `#6366f1` | Links, focus rings, selection |
| `--color-accent-1` | Cyan | `#0891b2` | Cluster 1 indicator |
| `--color-accent-2` | Violet | `#7c3aed` | Cluster 2 indicator |
| `--color-accent-3` | Emerald | `#059669` | Cluster 3 indicator |
| `--color-accent-4` | Orange | `#ea580c` | Tech tools |
| `--color-accent-5` | Pink | `#db2777` | Workshops |
| `--color-accent-6` | Sky | `#0284c7` | Teaching |

### Rules
- **Never** use raw hex values — always reference tokens
- Accent colors are for **categorical indicators only** (dots, cluster badges), not backgrounds
- Use `color-mix()` for subtle tinted section backgrounds (3–8% opacity max)

---

## 3. Typography

### Font Stack

| Role | Font | Fallback |
|---|---|---|
| **Body / UI** | Inter | `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto` |
| **Code / Labels** | JetBrains Mono | `Fira Code, Consolas, monospace` |

### Scale

| Token | Size | Use |
|---|---|---|
| `--text-xs` | 0.75rem (12px) | Tags, meta labels |
| `--text-sm` | 0.875rem (14px) | Navigation, descriptions |
| `--text-base` | 1rem (16px) | Body text |
| `--text-lg` | 1.125rem (18px) | Subheadings |
| `--text-xl` | 1.25rem (20px) | Hero subtitle |
| `--text-2xl` | 1.5rem (24px) | Section titles |
| `--text-5xl` | 3rem (48px) | Hero title |

### Rules
- **Hero title**: Use `clamp(2.5rem, 5vw, 3.5rem)` for fluid scaling
- **Headings**: `letter-spacing: -0.02em` to `-0.03em` for tightness
- **Labels/Nav**: Always `uppercase`, `letter-spacing: 0.1em`, `font-mono`
- **Body**: `line-height: 1.5` (normal), descriptions `1.625` (relaxed)
- Enable `-webkit-font-smoothing: antialiased` globally

---

## 4. Spacing Scale

All spacing uses `--space-*` tokens based on a `0.25rem` (4px) base:

```
1 → 4px    2 → 8px    3 → 12px   4 → 16px
5 → 20px   6 → 24px   8 → 32px   10 → 40px
12 → 48px  16 → 64px  20 → 80px  24 → 96px
```

### Rules
- Section padding: `--space-20` (80px) top/bottom
- Card internal padding: `--space-6` (24px)
- Gap between cards in grid: `--space-6`
- Tags internal padding: `6px 12px`

---

## 5. Elevation & Shadows

| Level | Token | Use |
|---|---|---|
| Resting | `--shadow-sm` | Default card state |
| Hover | `--shadow-md` | Card hover |
| Float | `--shadow-lg` | Modal, popover |
| Overlay | `--shadow-xl` | Tech stack preview |

### Rules
- Cards at rest have **no shadow** — only `border`
- Shadow appears **on hover** paired with `border-color` change
- Modals use `backdrop-filter: blur(4px)` + `rgba(0,0,0,0.5)` overlay

---

## 6. Interactive Patterns

### Hover States

| Element | Effect |
|---|---|
| Cards | `border-color` → muted, `box-shadow: md` |
| Bubbles/Chips | `translateY(-2px)`, deeper shadow |
| Buttons (primary) | Fill inverts → outline |
| Buttons (secondary) | Border darkens |
| Nav links | Color: muted → full |
| Contact links | `translateY(-2px)` + shadow |

### Active/Press States
- Cards: `scale(0.99)` press-down
- Bubbles: `scale(0.98)`

### Scroll Reveals
- Elements start at `opacity: 0; translateY(30px)`
- Transition to `opacity: 1; translateY(0)` over `0.6s ease`
- Triggered by `IntersectionObserver` at `threshold: 0.1`
- Stagger using `.stagger-1` through `.stagger-5` (100ms increments)

### Modal Transitions
- Overlay: `opacity 0→1`
- Content: `scale(0.95→1)` with `0.2s ease`
- Close on: ESC key, clicking backdrop, close button
- `body.overflow: hidden` while open

---

## 7. Component Inventory

| Component | File | Key CSS Class |
|---|---|---|
| Navigation | `layout.css` | `.nav`, `.nav.scrolled` |
| Hero | `layout.css` | `.hero`, `.hero-title` |
| Pillar Card | `components.css` | `.pillar-card` |
| Project Card | `components.css` | `.project-card` |
| Bubble Chip | `components.css` | `.bubble` |
| Timeline | `components.css` | `.timeline`, `.timeline-item` |
| Tech Stack | `components.css` | `.tech-grid`, `.tech-item` |
| Tags/Pills | `components.css` | `.tag` |
| Buttons | `components.css` | `.btn`, `.btn-primary` |
| Modal | `components.css` | `.modal-overlay`, `.modal-content` |
| Contact Link | `components.css` | `.contact-link` |

---

## 8. Responsive Breakpoints

| Breakpoint | Layout Changes |
|---|---|
| `> 1024px` | Full desktop: 3-col grids, side-by-side layouts |
| `768px – 1024px` | 4-col → 2-col grid, adjusted spacing |
| `< 768px` | Single column, hamburger menu, stacked hero meta |
| `< 640px` | Reduced container padding |

### Mobile-Specific Rules
- Hide hover previews (tap-based interaction only)
- Stack hero CTAs vertically, full-width
- Hamburger menu replaces nav links
- Contact links stack vertically

---

## 9. Background Texture

The site uses a **dot-grid pattern** as a subtle background texture:

```css
background-image: radial-gradient(circle, var(--color-border) 1px, transparent 1px);
background-size: 24px 24px;
```

This creates an engineering-paper feel. Section dividers use a gradient line:

```css
background: linear-gradient(90deg, transparent, var(--color-border), transparent);
```

---

## 10. Key Don'ts

| ❌ Don't | ✅ Do Instead |
|---|---|
| Use raw hex colors | Use `var(--color-*)` tokens |
| Add heavy drop shadows at rest | Use border only; shadow on hover |
| Use colored backgrounds for sections | Use `color-mix()` at 3–8% opacity max |
| Mix serif and sans-serif | Stick to Inter + JetBrains Mono |
| Skip reduced-motion | Always wrap animations in media query |
| Use arbitrary spacing | Use `var(--space-*)` tokens exclusively |
| Create inline styles for layout | Use utility classes or CSS grid/flex |
