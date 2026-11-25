# 🧭 D3 Visualizations

An interactive data visualization dashboard built with React, TypeScript, D3.js, Vite, and Tailwind CSS.

Originally inspired by an academic project, it has evolved into an extensible dashboard with reusable chart components, responsive layouts, bilingual support (EN/DE), light and dark themes, and SVG/PNG exports.

---

## 🚀 Demo & Case Study

- **[Live Dashboard](https://viz.amanssur.com)**
- **[Technical Case Study](https://amanssur.com/portfolio/viz-dashboard)**

---

## 📸 Preview

<img width="1920" height="1080" alt="Dashboard Screenshot" src="https://github.com/user-attachments/assets/16231b24-855d-421e-a0ed-c01dc751612c" />

---

## ✨ Highlights

- ⚛️ **Modular React architecture:** Reusable chart components, shared UI primitives, and dedicated visualization routes.
- 📊 **D3.js integration:** Custom `useD3` hook synchronizing SVG rendering with React's component lifecycle.
- 🎨 **Responsive UI:** Tailwind CSS, consistent design tokens, and light/dark themes.
- 🌀 **Framer Motion:** Animated page and chart transitions.
- 💾 **Chart exports:** SVG/PNG downloads through shared export utilities.
- 🧩 **TypeScript:** Strongly typed components and reusable interfaces.
- 🌐 **Internationalization:** English and German localization using i18next with persistent language preferences.

---

## 🗂️ Project Overview

```
d3-visualizations/
├── public/
│   ├── favicons/            # Brand icons and PWA assets
│   ├── manifest.webmanifest # PWA metadata
│   ├── robots.txt           # Crawling rules + IndexNow key
│   └── sitemap.xml          # Sitemap for all routes
├── src/
│   ├── charts/              # D3 renderers (bar, line, donut, time-of-day, etc.)
│   ├── components/          # React components (UI + dashboard views)
│   ├── content/             # Case study metadata
│   ├── context/             # ThemeContext for dark/light mode
│   ├── data/                # JSON datasets bundled with the app
│   ├── hooks/               # useD3 and other UI/data hooks
│   ├── i18n/                # Bilingual EN/DE translations and helpers
│   ├── pages/               # Dashboard + case-study pages
│   ├── styles/              # Tailwind global styles
│   ├── ui/                  # Reusable UI primitives (buttons, surfaces, pills)
│   ├── utils/               # Config, export, tooltip helpers
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx
├── index.html
├── vercel.json              # SPA deep-link rewrites for React Router
├── package.json
├── tsconfig.json
└── vite.config.js
```

---

## ⚡️ Quick Start

> **Requirements:** Node.js ≥ 18

```bash
# install dependencies
pnpm install

# start the local dev server
pnpm run dev

# build production files
pnpm run build

# preview the production build
pnpm run preview
```

---

## 🌐 Deployment

Deployed live at **[viz.amanssur.com](https://viz.amanssur.com)** via **Vercel**.  
For local or alternative hosting:

1. Run `pnpm run build` to generate optimized assets in `/dist`.
2. Deploy to your preferred platform (Vercel, Netlify, or GitHub Pages).
3. Ensure SPA fallback is enabled so routes (`/`, `/case-studies`, and each `/case-studies/...` deep link) work properly.

---

## 🧠 Tech Stack

| Category   | Tools                               |
| ---------- | ----------------------------------- |
| Frontend   | React                               |
| Build Tool | Vite                                |
| Charts     | D3.js                               |
| Styling    | Tailwind CSS                        |
| Animations | Framer Motion                       |
| Language   | TypeScript                          |
| Hosting    | Vercel (<https://viz.amanssur.com>) |
| i18n       | i18next                             |
| Testing    | Playwright                          |
| Routing    | React Router                        |

---

## 💡 How It Works

Each chart (Bar, Line, etc.) is a standalone React component that:

- Loads JSON data from the bundled `src/data` directory
- Uses D3.js for rendering and scaling
- Animates into view with Framer Motion
- Supports export through shared utility functions

This setup allows adding new visualizations easily — drop a new D3 renderer in `src/charts`, a page in `src/pages/case-studies`, and wire it up in `router.tsx`.

---

## 🌟 Author

Built with ❤️ by **[Amanullah Manssur](https://amanssur.com)**

---

## 🪪 License and Branding Notice

All source code in this repository is released under the [MIT License](./LICENSE).  
Logos, monograms, and brand assets belonging to Amanullah Manssur or Manssur Media are **not covered** by this license and may not be reused or redistributed without explicit written permission.
