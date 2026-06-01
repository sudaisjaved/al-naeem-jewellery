import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useInView } from '../hooks/useInView.js';

const PURITY_DATA = [
  { k: '24K', pct: 99.9, hallmark: '999', label: 'Pure investment gold' },
  { k: '22K', pct: 91.6, hallmark: '916', label: 'Most popular for jewellery' },
  { k: '21K', pct: 87.5, hallmark: '875', label: 'Common in Gulf jewellery' },
  { k: '18K', pct: 75.0, hallmark: '750', label: 'Durable, ideal for diamonds' },
  { k: '14K', pct: 58.3, hallmark: '585', label: 'Hard-wearing everyday wear' },
];

function KaratPurityGuide() {
  return (
    <div className="faq-card">
      <h3 className="faq-card-title">What do 24K, 22K, 18K actually mean?</h3>
      <p className="faq-card-subtitle">
        The number tells you how much of the piece is pure gold. The rest is other metals mixed in for strength.
      </p>

      <div className="purity-guide">
        {PURITY_DATA.map(({ k, pct, hallmark, label }) => (
          <div key={k} className="purity-col">
            <div className="purity-karat">{k}</div>
            <div className="purity-label-text">{label}</div>
            <div className="purity-bar-wrap">
              <div className="purity-bar-fill" style={{ width: `${pct}%` }} />
              <div className="purity-bar-rest" style={{ width: `${100 - pct}%` }} />
            </div>
            <div className="purity-pct">{pct}%</div>
            <div className="purity-stamp">
              <span className="purity-stamp-label">Hallmark</span>
              <span className="purity-stamp-value">{hallmark}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="purity-tip-inline">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Every genuine piece has one of these stamps. Before you buy anywhere — check for the hallmark. <strong>No stamp? Don't buy it.</strong>
      </div>
    </div>
  );
}

function GoldPriceCalculator({ rates }) {
  const [grams, setGrams] = useState('');
  const [karat, setKarat] = useState('22K');
  const [makingType, setMakingType] = useState('flat');
  const [makingFlat, setMakingFlat] = useState('');
  const [makingPct, setMakingPct] = useState('');

  const rate = rates && rates[karat];
  const gramsNum = parseFloat(grams) || 0;
  const goldAmt = rate && gramsNum > 0 ? gramsNum * rate : null;

  let makingAmt = 0;
  if (goldAmt !== null) {
    makingAmt = makingType === 'flat'
      ? parseFloat(makingFlat) || 0
      : goldAmt * ((parseFloat(makingPct) || 0) / 100);
  }

  const subtotal = goldAmt !== null ? goldAmt + makingAmt : null;
  const isVATExempt = karat === '24K';
  const vat = subtotal !== null && !isVATExempt ? subtotal * 0.05 : 0;
  const total = subtotal !== null ? subtotal + vat : null;
  const fmt = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="faq-card">
      <h3 className="faq-card-title">How much will my gold jewellery cost?</h3>
      {rate && (
        <div className="faq-calc-live-rate">
          Live {karat} rate: <strong>{rate.toFixed(2)} AED/g</strong>
        </div>
      )}

      <div className="faq-calc-inputs">
        <div className="faq-calc-field">
          <label className="faq-calc-label">Weight (grams)</label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 10"
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
            className="faq-calc-input"
          />
        </div>
        <div className="faq-calc-field">
          <label className="faq-calc-label">Karat</label>
          <select value={karat} onChange={(e) => setKarat(e.target.value)} className="faq-calc-input">
            {KARATS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      </div>

      <div className="faq-calc-making-section">
        <label className="faq-calc-label">Making charges (optional)</label>
        <div className="faq-calc-making-row">
          <div className="faq-calc-toggle">
            <button type="button" className={makingType === 'flat' ? 'active' : ''} onClick={() => setMakingType('flat')}>AED</button>
            <button type="button" className={makingType === 'pct' ? 'active' : ''} onClick={() => setMakingType('pct')}>%</button>
          </div>
          {makingType === 'flat'
            ? <input type="number" min="0" placeholder="e.g. 150" value={makingFlat} onChange={(e) => setMakingFlat(e.target.value)} className="faq-calc-input" />
            : <input type="number" min="0" max="100" placeholder="e.g. 10" value={makingPct} onChange={(e) => setMakingPct(e.target.value)} className="faq-calc-input" />
          }
        </div>
      </div>

      {total !== null && gramsNum > 0 ? (
        <div className="faq-calc-breakdown">
          <div className="faq-calc-line">
            <span>Gold ({gramsNum}g × {rate?.toFixed(2)})</span>
            <span>{fmt(goldAmt)} AED</span>
          </div>
          {makingAmt > 0 && (
            <div className="faq-calc-line">
              <span>Making charges</span>
              <span>{fmt(makingAmt)} AED</span>
            </div>
          )}
          <div className="faq-calc-line">
            <span>VAT (5%){isVATExempt ? ' — exempt' : ''}</span>
            <span>{vat > 0 ? `${fmt(vat)} AED` : '—'}</span>
          </div>
          <div className="faq-calc-line faq-calc-total">
            <span>Total</span>
            <span>{fmt(total)} AED</span>
          </div>
        </div>
      ) : (
        <div className="faq-calc-placeholder">
          Enter weight above to see the full breakdown.
        </div>
      )}
    </div>
  );
}

export default function VideoFAQ() {
  const { t } = useLanguage();
  const faq = t.faq;
  const [rates, setRates] = useState(null);
  const [titleRef, titleVisible] = useInView();
  const [bodyRef, bodyVisible] = useInView({ threshold: 0.05 });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const base = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${base}/api/gold-rates`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled) setRates(data.rates);
      } catch { /* calculator shows placeholder */ }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const textQAs = [
    { q: faq.questions[0], a: faq.answers[0] },
    { q: faq.questions[2], a: faq.answers[2] },
    { q: faq.questions[3], a: faq.answers[3] },
  ];

  return (
    <section className="faq-section" aria-labelledby="faq-title" data-testid="faq-section">
      <h2
        className={`section-title section-title--center reveal-up${titleVisible ? ' is-visible' : ''}`}
        id="faq-title"
        ref={titleRef}
      >
        {faq.title}
      </h2>

      <div
        className={`faq-body reveal-up${bodyVisible ? ' is-visible' : ''}`}
        ref={bodyRef}
        style={{ transitionDelay: '0.08s' }}
      >
        {/* Karat guide — full width */}
        <div className="faq-cards-grid">
          <KaratPurityGuide />
        </div>

        {/* Text Q&As — open, no accordion needed */}
        <div className="faq-qa-list" data-testid="faq-list">
          {textQAs.map((item, i) => (
            <div key={i} className="faq-qa-item" data-testid={`faq-card-${i}`}>
              <div className="faq-qa-q">{item.q}</div>
              <div className="faq-qa-a">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
