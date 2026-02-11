# Personal Website

A clean, token-driven personal portfolio site inspired by [duering.tech](https://duering.tech).

Built with **React 18**, **HTM**, and **vanilla CSS** — zero bundler, deployed via GitHub Pages.

---

## 🚀 Live Site

**[mahmoudramdane.com](https://mahmoudramdane.com)**
*(DNS propagation may take up to 24h)*

---

## ✨ Features

- **Glassmorphism navigation** — transparent → frosted glass on scroll
- **Full-viewport hero** — avatar, fluid title, CTA buttons, stats
- **Pillar cards** — "What I Do" section with keyword tags
- **Bubble chips** — interactive project clusters grouped by domain
- **Project grid** — 3-column card layout with click-to-open modals
- **Experience timeline** — vertical timeline + tech stack grid
- **Auto dark mode** — `prefers-color-scheme` media query
- **Scroll reveal animations** — staggered fade-in-up with IntersectionObserver
- **Dot-grid background** — subtle engineering-paper texture
- **Accessibility** — `prefers-reduced-motion`, focus-visible, keyboard nav

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18 via ESM |
| Templates | HTM (no JSX / no build step) |
| Styling | Vanilla CSS with custom properties |
| Modules | Native Import Maps |
| UI | React 18 via ESM |
| CMS | Contentful (Headless) |
| Templates | HTM (no JSX / no build step) |
| Styling | Vanilla CSS with custom properties |
| Modules | Native Import Maps |
| Hosting | GitHub Pages |

**Zero bundler** — no Webpack, Vite, or build tools. Everything loads via `<script type="importmap">` and ESM `import` statements.

---

## 📁 Structure

```
├── index.html          # Entry point + ESM import map
├── css/
│   ├── base.css        # Design tokens, reset, dark mode
│   ├── layout.css      # Nav, hero, grid, footer
│   ├── components.css  # Cards, buttons, modals, timeline
│   └── animations.css  # Scroll reveals, keyframes
├── js/
│   └── main.js         # React app (all components + data)
├── UI_UX_GUIDE.md      # Design system documentation
├── PROGRESS.md         # Development progress tracker
└── README.md           # This file
├── index.html          # Entry point + ESM import map
├── css/
│   ├── base.css        # Design tokens, reset, dark mode
│   ├── layout.css      # Nav, hero, grid, footer
│   ├── components.css  # Cards, buttons, modals, timeline
│   └── animations.css  # Scroll reveals, keyframes
├── js/
│   ├── main.js         # React app (all components + data)
│   └── contentful.js   # CMS client & rich text renderer
├── scripts/            # Node.js scripts for CMS management
├── UI_UX_GUIDE.md      # Design system documentation
├── PROGRESS.md         # Development progress tracker
└── README.md           # This file
```

---

## 🛠️ Local Development

```bash
# Serve locally (any static server works)
npx serve . -l 3000

# Open in browser
open http://localhost:3000
```

No install, no build, no compile — just serve the files.

---

## 📖 Documentation

- **[UI/UX Design Guide](UI_UX_GUIDE.md)** — Colors, typography, spacing, components, interaction patterns
- **[Progress Tracker](PROGRESS.md)** — Phase-by-phase development roadmap

---

## 📝 License

MIT
