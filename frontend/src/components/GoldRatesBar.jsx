import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useInView } from '../hooks/useInView.js';

const KARAT_ORDER = ['24K', '22K', '21K', '18K', '14K'];

function formatTime(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function GoldRatesBar() {
  const { t } = useLanguage();
  const [state, setState] = useState({ rates: null, fetchedAt: null, source: null, loading: true, error: false });
  const [refreshing, setRefreshing] = useState(false);
  const [ref, visible] = useInView({ threshold: 0.1 });

  const fetchRates = useCallback(async (forceRefresh = false) => {
    const base = import.meta.env.VITE_API_URL || '';
    const url = forceRefresh ? `${base}/api/gold-rates?refresh=true` : `${base}/api/gold-rates`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('non-200');
      const data = await res.json();
      setState({ rates: data.rates, fetchedAt: data.fetchedAt, source: data.source, loading: false, error: false });
    } catch {
      setState((s) => ({ ...s, loading: false, error: true }));
    }
  }, []);

  useEffect(() => {
    fetchRates(false);
  }, [fetchRates]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchRates(true);
    setRefreshing(false);
  }

  const gr = t.goldRates;

  return (
    <section className="rates-section" aria-label={gr.title} data-testid="gold-rates-bar">
      <div
        className={`rates-section-inner reveal-up${visible ? ' is-visible' : ''}`}
        ref={ref}
      >
        <div className="rates-section-header">
          <h2 className="rates-section-title">{gr.title}</h2>
          <div className="rates-live">
            <span className="live-dot" />
            {state.source === 'live' ? gr.live : state.source === 'fallback' ? gr.fallback : ''}
          </div>
        </div>

        {state.loading && <div className="rates-loading-dark">{gr.loading}</div>}
        {state.error && !state.rates && <div className="rates-error-dark">{gr.error}</div>}

        {state.rates && (
          <>
            <div className="rates-big-grid">
              {KARAT_ORDER.filter((k) => state.rates[k]).map((karat) => (
                <div className="rate-big-item" key={karat} data-testid={`rate-${karat}`}>
                  <div className="rate-big-karat">{karat}</div>
                  <div className="rate-big-price">{state.rates[karat].toFixed(2)}</div>
                  <div className="rate-big-unit">{gr.aed} / gram</div>
                </div>
              ))}
            </div>
            <div className="rates-footer-row">
              {state.fetchedAt && (
                <div className="rates-meta-dark">
                  {gr.lastUpdated}: {formatTime(state.fetchedAt)}
                </div>
              )}
              <button
                className={`rates-refresh-btn${refreshing ? ' spinning' : ''}`}
                onClick={handleRefresh}
                disabled={refreshing}
                aria-label="Refresh gold rates"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0114.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0020.49 15" />
                </svg>
                {refreshing ? 'Updating…' : 'Refresh rates'}
              </button>
            </div>
            <div className="rates-source-note">
              Rates sourced from Dubai Gold &amp; Jewellery Group. Indicative only — actual rates may vary at time of purchase.
            </div>
          </>
        )}
      </div>
    </section>
  );
}
