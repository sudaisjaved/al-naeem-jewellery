import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useInView } from '../hooks/useInView.js';

const KARAT_ORDER = ['24K', '22K', '21K', '18K', '14K'];

function formatTime(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function GoldRatesBar({ ratesData, refreshing, onRefresh }) {
  const { t } = useLanguage();
  const [ref, visible] = useInView({ threshold: 0.1 });
  const { rates, fetchedAt, source, loading, error } = ratesData;
  const gr = t.goldRates;

  return (
    <section className="rates-section" aria-label={gr.title} data-testid="gold-rates-bar">
      <div className={`rates-section-inner reveal-up${visible ? ' is-visible' : ''}`} ref={ref}>
        <div className="rates-section-header">
          <h2 className="rates-section-title">{gr.title}</h2>
          <div className="rates-live">
            <span className="live-dot" />
            {source === 'live' ? gr.live : source === 'fallback' ? gr.fallback : ''}
          </div>
        </div>

        {loading && <div className="rates-loading-dark">{gr.loading}</div>}
        {error && !rates && <div className="rates-error-dark">{gr.error}</div>}

        {rates && (
          <>
            <div className="rates-big-grid">
              {KARAT_ORDER.filter((k) => rates[k]).map((karat) => (
                <div className="rate-big-item" key={karat} data-testid={`rate-${karat}`}>
                  <div className="rate-big-karat">{karat}</div>
                  <div className="rate-big-price">{rates[karat].toFixed(2)}</div>
                  <div className="rate-big-unit">{gr.aed} / gram</div>
                </div>
              ))}
            </div>
            <div className="rates-footer-row">
              {fetchedAt && (
                <div className="rates-meta-dark">
                  {gr.lastUpdated}: {formatTime(fetchedAt)}
                </div>
              )}
              <button
                className={`rates-refresh-btn${refreshing ? ' spinning' : ''}`}
                onClick={onRefresh}
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
