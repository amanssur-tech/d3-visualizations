# 🧭 D3 Visualizations — React + D3 + Tailwind

A sleek, modern data visualization dashboard built with **React**, **Vite**, **D3.js**, and **Tailwind CSS**.  
Originally inspired by a university project, it has evolved into a professional-grade template for interactive data dashboards with smooth animations, dark mode, and export capabilities.

---

## 🚀 Live Demo

**[https://viz.amanssur.com](https://viz.amanssur.com)**

---

## 📸 Preview (coming soon)

![Dashboard Screenshot](https://github.com/amanssur-tech/d3-visualizations/assets/preview.png)

> Responsive, animated dashboard built with React, D3.js, Tailwind, and Vite.

---

## ✨ Highlights

- ⚛️ **Modern React architecture** — modular components, reusable charts, and clean routing (dashboard, case-study index, and deep links for each visualization).
- 📊 **D3.js inside React** — a custom `useD3` hook bridges the gap between React’s virtual DOM and D3’s SVG rendering.
- 🎨 **Tailwind CSS styling** — consistent design tokens, light/dark mode, and responsive layouts.
- 🌀 **Framer Motion** — subtle page and chart transitions for a smooth, app-like experience.
- 💾 **Export-ready charts** — one click to download all visualizations in SVG/PNG.
- 🧩 **TypeScript migration** — strongly typed components for scalability and long-term maintainability.

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
npm install

# start the local dev server
npm run dev

# build production files
npm run build

# preview the production build
npm run preview
```

---

## 🌐 Deployment

Deployed live at **[viz.amanssur.com](https://viz.amanssur.com)** via **Vercel**.  
For local or alternative hosting:

1. Run `npm run build` to generate optimized assets in `/dist`.
2. Deploy to your preferred platform (Vercel, Netlify, or GitHub Pages).
3. Ensure SPA fallback is enabled so routes (`/`, `/case-studies`, and each `/case-studies/...` deep link) work properly.

---

## 🧠 Tech Stack

| Category   | Tools                             |
| ---------- | --------------------------------- |
| Framework  | React + Vite                      |
| Charts     | D3.js                             |
| Styling    | Tailwind CSS                      |
| Animations | Framer Motion                     |
| Language   | TypeScript                        |
| Hosting    | Vercel (https://viz.amanssur.com) |

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
