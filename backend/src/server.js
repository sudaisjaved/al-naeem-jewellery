require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const goldRatesRouter = require('./routes/goldRates');
const { scrapeGoldRates } = require('./services/scraper');
const { getDb } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialise DB on startup
getDb();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(o => o.trim());
app.use(cors({ origin: (origin, cb) => (!origin || allowedOrigins.some(o => origin.startsWith(o)) ? cb(null, true) : cb(new Error('Not allowed'))) }));
app.use(express.json());

// Routes
app.use('/api/gold-rates', goldRatesRouter);

app.get('/api/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// Cron: refresh gold rates every 2 hours
cron.schedule('0 */2 * * *', async () => {
  console.log('[cron] Refreshing gold rates...');
  try {
    const result = await scrapeGoldRates();
    console.log(`[cron] Done — source: ${result.source}, rates:`, result.rates);
  } catch (err) {
    console.error('[cron] Failed:', err.message);
  }
});

// Warm the cache on first boot
(async () => {
  console.log('[boot] Fetching initial gold rates...');
  try {
    const result = await scrapeGoldRates();
    console.log(`[boot] Rates ready — source: ${result.source}`);
  } catch (err) {
    console.error('[boot] Initial scrape failed:', err.message);
  }
})();

app.listen(PORT, () => {
  console.log(`Al Naeem Jewellery API running on http://localhost:${PORT}`);
});

module.exports = app;
