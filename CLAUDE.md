# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Real business website for **Al Naeem Jewellery**, a family-run gold shop in the Dubai Gold Souk, Deira — operating since 1989. Showcase only (no online sales). Built as a portfolio project. Two physical shops; WhatsApp is the primary customer contact method.

## Dev Commands

All commands are run from the repo root unless stated otherwise.

```bash
# Install all deps (first time)
npm run install:all

# Start backend (http://localhost:3001)
npm run dev:backend          # runs nodemon in backend/

# Start frontend (http://localhost:5173)
npm run dev:frontend         # runs vite in frontend/

# Cypress E2E tests (both servers must be running)
npm run cypress:open         # interactive
npm run cypress:run          # headless

# Frontend production build
cd frontend && npm run build
```

Backend env: `backend/.env` — `PORT=3001`, `CORS_ORIGIN=http://localhost:5173`.

## Architecture

```
al-naeem-jewellery/
├── backend/              # Node.js / Express API
│   └── src/
│       ├── server.js         # Entry: Express app, CORS, cron, boot scrape
│       ├── db/database.js    # SQLite singleton (better-sqlite3), schema init
│       ├── routes/goldRates.js
│       └── services/scraper.js
├── frontend/             # React 18 + Vite SPA
│   └── src/
│       ├── App.jsx           # Top-level layout, Arabic gate
│       ├── contexts/LanguageContext.jsx   # Global lang + theme state
│       ├── translations/index.js          # All i18n strings + LANGUAGE_OPTIONS
│       ├── hooks/useInView.js             # IntersectionObserver for scroll animations
│       ├── styles/
│       │   ├── global.css                 # CSS variables per theme (data-theme attr)
│       │   └── calculator.css             # Styles for the GoldCalculator component
│       └── components/      # Nav, Hero, GoldRatesBar, GoldCalculator, WhySection, VideoFAQ, ShopCards, Footer
└── cypress/e2e/          # gold-rates.cy.js, language-switcher.cy.js, shop-cards.cy.js
```

## Gold Rates Pipeline

The scraper (`backend/src/services/scraper.js`) fetches AED/gram rates for 24K/22K/21K/18K/14K from **gulfnews.com/gold-forex** by parsing embedded JSON in the HTML (fields: `carat24`, `carat22`, etc.; prefers `evening` → `afternoon` → `morning` sub-field).

Rates are persisted to SQLite (`gold_rates` table). On boot, the server warms the cache immediately. A cron job re-scrapes every 2 hours. If the scrape fails, it falls back to the latest DB cache, then to hardcoded `FALLBACK_RATES` constants.

Cache staleness threshold: 120 minutes. `GET /api/gold-rates?refresh=true` forces a re-scrape.

SQLite lives at `backend/data/al_naeem.db` (gitignored; WAL mode enabled).

## Language + Theme System

`LanguageContext` is the single source of truth for both language and visual theme. Switching language:
1. Updates `document.documentElement.lang`, `dir` (rtl/ltr), and `data-theme` attribute.
2. CSS variables in `global.css` are scoped to `[data-theme="en"]`, `[data-theme="ur"]`, etc.
3. All UI strings come from `translations/index.js` via the `t` object from `useLanguage()`.

Supported languages: `en` (gold), `ur` (Pakistani green, RTL), `hi` (saffron/navy), `bn` (green/red), `ar` (RTL — currently shows a "coming soon" screen, strings exist but `_comingSoon: true`).

To add a new language: add an entry to `translations/index.js` and `LANGUAGE_OPTIONS`, create the matching `[data-theme]` block in `global.css`.

## Deployment

Backend is deployed on **Railway** (`backend/railway.json`). Start command: `node src/server.js`. No frontend deployment config is present — frontend is a static Vite build.

## Recent Updates (May 2026)

- **Backend Fix:** Started the local API server and verified the Vite proxy correctly routes `/api` requests to `localhost:3001`, resolving a 500 error on the live gold rates.
- **Gold Calculator Feature:** Built a new `GoldCalculator.jsx` component that calculates live payout estimates (with a 6% deduction) and projects investment growth. Styled via `calculator.css` to match the site's premium aesthetic.
- **Inclusive Copy Update:** Updated the English translations in `index.js` to use more inclusive language ("serving all communities" instead of targeting specific demographics).

## Phase 2 (Planned)

- Customer bill portal (phone → OTP → PDF bills)
- Full Arabic translation (strings are already in `translations/index.js`)
- AI video mascot ("Karat") in FAQ section
- Products page with weight selector and live price calculation
