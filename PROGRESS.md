# Progress Tracker

> Living document tracking the development of the personal website.

---

## Phase 1: Foundation ✅
*Completed: Feb 11, 2026*

- [x] Analyze reference site (duering.tech) — full UI/UX breakdown
- [x] Design token system (`base.css`) — colors, typography, spacing, shadows
- [x] Layout system (`layout.css`) — nav, hero, grid, footer
- [x] Component library (`components.css`) — cards, buttons, modals, timeline
- [x] Animation system (`animations.css`) — reveals, stagger, accessibility
- [x] React 18 app (`main.js`) — all sections with filler content
- [x] GitHub repo created & initial push

---

## Phase 2: Content & Personalization 🏗️
*Status: In Progress*

- [x] Integrate Contentful CMS (`js/contentful.js`)
- [x] Create content models (Site Settings, Projects, etc.) via CMA script
- [x] Implement dynamic data loading in `main.js`
- [x] Add rich text & YouTube embed support
- [x] Add real profile photo support (custom field in Site Settings)
- [ ] Replace filler name, title, tagline with real info
- [ ] Update pillar cards with actual specialties
- [ ] Add real project descriptions and tags
- [ ] Upload project screenshots/media
- [ ] Update experience timeline with real positions
- [ ] Update tech stack to reflect actual tools
- [ ] Add real social links (GitHub, LinkedIn, email)

---

## Phase 3: Polish & Enhancement 🔲
*Status: Not started*

- [ ] Add project hover preview cards (rich tooltips)
- [ ] Add project modal navigation (prev/next arrows)
- [ ] Add canvas-based data visualization (embeddings scatter plot)
- [ ] Add "Custom View" editorial mode (Merriweather serif, narrow column)
- [ ] Add "Copy for AI" button
- [ ] Add page transition animations
- [ ] Performance audit (Lighthouse score)
- [ ] SEO meta tags, Open Graph, favicon

---

## Phase 4: Deployment & Domain 🔲
*Status: Not started*

- [x] Deploy to GitHub Pages
- [ ] Enable GitHub Pages in repo settings
- [ ] Verify live URL works
- [ ] Custom domain setup (optional)
- [ ] SSL certificate verification

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (ESM, no bundler) |
| Templating | HTM (JSX alternative) |
| Styling | Vanilla CSS (4 modular files) |
| Module System | Native ESM Import Maps |
| Hosting | GitHub Pages |

---

## Design Reference

- **Inspiration**: [duering.tech](https://duering.tech)
- **Design Guide**: See [`UI_UX_GUIDE.md`](UI_UX_GUIDE.md)
