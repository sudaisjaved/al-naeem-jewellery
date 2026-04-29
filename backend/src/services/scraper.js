const axios = require('axios');
const { getDb } = require('../db/database');

const SCRAPE_URL = 'https://gulfnews.com/gold-forex';

// Fallback rates — DJG retail prices (AED per gram)
const FALLBACK_RATES = {
  '24K': 551.75,
  '22K': 510.75,
  '21K': 489.75,
  '18K': 419.75,
  '14K': 327.50,
};

const KARAT_LABELS = ['24K', '22K', '21K', '18K', '14K'];

async function scrapeGoldRates() {
  const db = getDb();

  try {
    const { data: html } = await axios.get(SCRAPE_URL, {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36' },
    });

    // Rates are embedded as JSON in the page: carat24, carat22, carat21, carat18, carat14
    const karatMap = { carat24: '24K', carat22: '22K', carat21: '21K', carat18: '18K', carat14: '14K' };
    const rates = {};

    for (const [key, label] of Object.entries(karatMap)) {
      const full = html.match(new RegExp(`"${key}":\\{([^}]+)}`));
      if (!full) return;
      const field = ['evening','afternoon','morning'].find(f => full[1].includes(`"${f}"`));
      const m = field ? full[1].match(new RegExp(`"${field}":"([\\d.]+)"`)) : null;
      if (m) rates[label] = parseFloat(m[1]);
    }

    if (Object.keys(rates).length === 0) {
      throw new Error('No rates found in page JSON');
    }

    persistRates(rates);
    logScrape(true, `Scraped ${Object.keys(rates).length} karats successfully`);
    return { rates, source: 'live', fetchedAt: new Date().toISOString() };
  } catch (err) {
    logScrape(false, err.message);

    // Return last cached rates if available, otherwise fallback constants
    const cached = getLatestCachedRates();
    if (cached) {
      return { rates: cached.rates, source: 'cache', fetchedAt: cached.fetchedAt };
    }

    persistRates(FALLBACK_RATES);
    return { rates: FALLBACK_RATES, source: 'fallback', fetchedAt: new Date().toISOString() };
  }
}

function persistRates(rates) {
  const db = getDb();
  const now = new Date().toISOString();
  const insert = db.prepare(
    'INSERT INTO gold_rates (karat, price_aed, fetched_at) VALUES (?, ?, ?)'
  );

  const insertMany = db.transaction((rateMap) => {
    for (const [karat, price] of Object.entries(rateMap)) {
      insert.run(karat, price, now);
    }
  });

  insertMany(rates);
}

function getLatestCachedRates() {
  const db = getDb();

  const rows = db
    .prepare(
      `SELECT karat, price_aed, fetched_at
       FROM gold_rates
       WHERE fetched_at = (SELECT MAX(fetched_at) FROM gold_rates)`
    )
    .all();

  if (!rows.length) return null;

  const rates = {};
  rows.forEach((r) => (rates[r.karat] = r.price_aed));
  return { rates, fetchedAt: rows[0].fetched_at };
}

function isCacheStale(maxAgeMinutes = 120) {
  const cached = getLatestCachedRates();
  if (!cached) return true;
  const ageMs = Date.now() - new Date(cached.fetchedAt).getTime();
  return ageMs > maxAgeMinutes * 60 * 1000;
}

function logScrape(success, message) {
  const db = getDb();
  db.prepare('INSERT INTO scrape_log (success, message) VALUES (?, ?)').run(
    success ? 1 : 0,
    message
  );
}

module.exports = { scrapeGoldRates, getLatestCachedRates, isCacheStale };
