# Al Naeem Jewellery — Full Stack Website

A real business website for **Al Naeem Jewellery**, a family-run gold jewellery shop in the **Dubai Gold Souk, Deira** — operating for 35 years. Built as a portfolio project demonstrating full-stack skills.

> Showcase only — no online sales. Two physical shops in Dubai Gold Souk.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18 + Vite                     |
| Backend    | Node.js + Express                   |
| Database   | SQLite (via better-sqlite3)         |
| Scraping   | Axios + Cheerio                     |
| Scheduling | node-cron (2-hour auto-refresh)     |
| Testing    | Cypress (E2E)                       |

---

## Features

### Live Gold Rates Bar
- Scrapes live AED/gram rates from dubaicityofgold.com (24K, 22K, 21K, 18K, 14K)
- Cached in SQLite with timestamp
- Auto-refreshes every 2 hours via cron
- Falls back to cached or last-known rates if scrape fails
- Exposed via `GET /api/gold-rates`

### Language Switcher + Visual Themes
Switching language changes both the content **and** the colour theme:

| Language | Theme              | Direction |
|----------|--------------------|-----------|
| 🇬🇧 English  | Warm gold (#C9A84C) | LTR |
| 🇵🇰 Urdu     | Pakistani green     | RTL |
| 🇮🇳 Hindi    | Saffron/navy        | LTR |
| 🇧🇩 Bengali  | Green/red           | LTR |
| 🇦🇪 Arabic   | Coming soon         | RTL |

### Video FAQ
Four common gold-buying questions with video placeholders (videos to be added). Questions translate per language.

### Shop Location Cards
Two shop cards with hours, WhatsApp contact, and Google Maps directions.

---

## Project Structure

```
al-naeem-jewellery/
├── backend/
│   ├── src/
│   │   ├── server.js          # Express app + cron
│   │   ├── db/database.js     # SQLite schema + connection
│   │   ├── routes/goldRates.js
│   │   └── services/scraper.js
│   ├── data/                  # SQLite DB (gitignored)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Nav, GoldRatesBar, Hero, VideoFAQ, ShopCards, Footer
│   │   ├── contexts/          # LanguageContext (theme + i18n)
│   │   ├── translations/      # en, ur, hi, bn, ar strings
│   │   ├── styles/global.css  # CSS variables per theme
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── cypress/
│   ├── e2e/
│   │   ├── gold-rates.cy.js
│   │   ├── language-switcher.cy.js
│   │   └── shop-cards.cy.js
│   └── support/e2e.js
├── cypress.config.js
└── package.json
```

---

## Getting Started

### 1. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install

# Cypress (from root)
cd .. && npm install
```

### 2. Configure environment

```bash
# backend/.env (already provided)
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### 3. Start the backend

```bash
cd backend
npm run dev
# API running at http://localhost:3001
# Gold rates fetched on boot, refreshed every 2 hours
```

### 4. Start the frontend

```bash
cd frontend
npm run dev
# Site running at http://localhost:5173
```

### 5. Run Cypress tests

Both servers must be running first.

```bash
# Interactive mode
npm run cypress:open

# Headless CI mode
npm run cypress:run
```

---

## API Endpoints

| Method | Path                   | Description                          |
|--------|------------------------|--------------------------------------|
| GET    | `/api/gold-rates`      | Returns latest gold rates (AED/gram) |
| GET    | `/api/gold-rates?refresh=true` | Force re-scrape           |
| GET    | `/api/gold-rates/health` | Cache status + timestamp           |
| GET    | `/api/health`          | Server health check                  |

### Example response

```json
{
  "success": true,
  "source": "live",
  "fetchedAt": "2024-01-15T08:30:00.000Z",
  "rates": {
    "24K": 317.25,
    "22K": 290.75,
    "21K": 277.50,
    "18K": 238.00,
    "14K": 185.00
  }
}
```

---

## Phase 2 (Planned)

- Customer bill portal (phone → OTP → PDF bills)
- Full Arabic translation
- AI video mascot ("Karat") in FAQ
- Products page (weight selector, live price calculation)

---

## Business Context

Al Naeem Jewellery was founded 35 years ago in the Dubai Gold Souk by a grandfather who believed gold should be accessible to working-class families — not just the wealthy. The shop serves South Asian communities (Indian, Pakistani, Bangladeshi) and tourists, with a philosophy of low margins and honest pricing.

**No online sales.** Two physical shops only. WhatsApp is the primary contact method.
