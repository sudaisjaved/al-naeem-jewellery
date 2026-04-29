import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const KARAT_ORDER = ['24K', '22K', '21K', '18K', '14K'];

function formatTime(isoString, dir) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function GoldRatesBar() {
  const { t } = useLanguage();
  const [state, setState] = useState({ rates: null, fetchedAt: null, source: null, loading: true, error: false });

  useEffect(() => {
    let cancelled = false;

    async function fetchRates() {
      try {
        const base = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${base}/api/gold-rates`);
        if (!res.ok) throw new Error('non-200');
        const data = await res.json();
        if (!cancelled) {
          setState({ rates: data.rates, fetchedAt: data.fetchedAt, source: data.source, loading: false, error: false });
        }
      } catch {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: true }));
      }
    }

    fetchRates();
    return () => { cancelled = true; };
  }, []);

  const gr = t.goldRates;

  return (
    <section className="rates-bar" aria-label={gr.title} data-testid="gold-rates-bar">
      <div className="rates-bar-inner">
        <div className="rates-bar-title">{gr.title}</div>

        {state.loading && <div className="rates-loading">{gr.loading}</div>}

        {state.error && !state.rates && (
          <div className="rates-error">{gr.error}</div>
        )}

        {state.rates && (
          <>
            <div className="rates-grid">
              {KARAT_ORDER.filter((k) => state.rates[k]).map((karat) => (
                <div className="rate-item" key={karat} data-testid={`rate-${karat}`}>
                  <span className="rate-karat">{karat}</span>
                  <span className="rate-price">{state.rates[karat].toFixed(2)}</span>
                  <span className="rate-unit">{gr.aed}</span>
                </div>
              ))}
            </div>
            <div className="rates-meta">
              {state.fetchedAt && (
                <span>{gr.lastUpdated}: {formatTime(state.fetchedAt)}</span>
              )}
              {state.source === 'fallback' && <span>({gr.fallback})</span>}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
