# 🧭 D3 Visualizations — React + D3 + Tailwind

A sleek, modern data visualization dashboard built with **React**, **Vite**, **D3.js**, and **Tailwind CSS**.  
Originally inspired by a university project, it has evolved into a professional-grade template for interactive data dashboards with smooth animations, dark mode, and export capabilities.

---

## 🚀 Live Demo
**[https://viz.amanssur.com](https://viz.amanssur.com)**

---

## 📸 Preview

![Dashboard Screenshot](https://github.com/amanssur-tech/d3-visualizations/assets/preview.png)
> Responsive, animated dashboard built with React, D3.js, Tailwind, and Vite.

---

## ✨ Highlights

- ⚛️ **Modern React architecture** — modular components, reusable charts, and clean routing (`/`, `/exercise1`, `/exercise2`).
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
│   └── data/               # JSON datasets for visualizations
├── src/
│   ├── components/         # React components (UI + charts)
│   │   ├── charts/         # BarChart + LineChart
│   ├── context/            # ThemeContext for dark/light mode
│   ├── hooks/              # useD3 hook
│   ├── styles/             # Tailwind global styles
│   ├── utils/              # config, export, tooltip helpers
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx
├── index.html
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
3. Ensure SPA fallback is enabled so routes (`/`, `/exercise1`, `/exercise2`) work properly.

---

## 🧠 Tech Stack

| Category | Tools |
|-----------|-------|
| Framework | React + Vite |
| Charts | D3.js |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Language | TypeScript |
| Hosting | Vercel (https://viz.amanssur.com) |

---

## 💡 How It Works

Each chart (Bar, Line, etc.) is a standalone React component that:
- Loads JSON data from `/public/data`
- Uses D3.js for rendering and scaling
- Animates into view with Framer Motion
- Supports export through shared utility functions

This setup allows adding new visualizations easily — just drop a new chart file in `/src/components/charts` and add a route.

---

## 🌈 Future Enhancements

- 🌍 Deploy with a custom domain (e.g. **viz.manssurmedia.com**)
- 🧮 Add filtering and sorting interactions
- ⚙️ Integrate mock APIs for live data updates
- 🎛️ Add a dashboard “About” card showcasing stack and deployment

---

## 🌟 Author

Built with ❤️ by **[Amanullah Manssur](https://amanssur.com)**  

---

## 🪪 License

Released under the [MIT License](./LICENSE).