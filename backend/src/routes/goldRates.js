const express = require('express');
const { scrapeGoldRates, getLatestCachedRates, isCacheStale } = require('../services/scraper');

const router = express.Router();

// GET /api/gold-rates
// Returns live rates (or cache if fresh). Triggers a fresh scrape if cache is stale.
router.get('/', async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';

    if (!forceRefresh && !isCacheStale()) {
      const cached = getLatestCachedRates();
      return res.json({
        success: true,
        source: 'cache',
        fetchedAt: cached.fetchedAt,
        rates: cached.rates,
      });
    }

    const result = await scrapeGoldRates();
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('[gold-rates] Error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch gold rates' });
  }
});

// GET /api/gold-rates/health — used by Cypress and monitoring
router.get('/health', (req, res) => {
  const cached = getLatestCachedRates();
  res.json({
    status: 'ok',
    hasCachedRates: !!cached,
    fetchedAt: cached?.fetchedAt ?? null,
  });
});

module.exports = router;
