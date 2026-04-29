const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/al_naeem.db');

let db;

function getDb() {
  if (!db) {
    const fs = require('fs');
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS gold_rates (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      karat     TEXT    NOT NULL,
      price_aed REAL    NOT NULL,
      fetched_at TEXT   NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_gold_rates_fetched ON gold_rates (fetched_at DESC);

    CREATE TABLE IF NOT EXISTS scrape_log (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      success    INTEGER NOT NULL,
      message    TEXT,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

module.exports = { getDb };
