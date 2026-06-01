import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useInView } from '../hooks/useInView.js';

const BUY_KARATS = ['24K', '22K', '21K', '18K', '14K'];
const SELL_KARATS = ['24K', '22K'];

export default function GoldCalculator({ rates }) {
  const { t } = useLanguage();
  const [ref, visible] = useInView({ threshold: 0.1 });
  const [tab, setTab] = useState('buy');

  // Buy state
  const [buyGrams, setBuyGrams] = useState('');
  const [buyKarat, setBuyKarat] = useState('22K');
  const [makingType, setMakingType] = useState('flat');
  const [makingFlat, setMakingFlat] = useState('');
  const [makingPct, setMakingPct] = useState('');

  // Sell state
  const [sellGrams, setSellGrams] = useState(10);
  const [sellKarat, setSellKarat] = useState('22K');

  // Buy calculations
  const buyRate = rates && rates[buyKarat];
  const buyGramsNum = parseFloat(buyGrams) || 0;
  const goldAmt = buyRate && buyGramsNum > 0 ? buyGramsNum * buyRate : null;
  let makingAmt = 0;
  if (goldAmt !== null) {
    makingAmt = makingType === 'flat'
      ? parseFloat(makingFlat) || 0
      : goldAmt * ((parseFloat(makingPct) || 0) / 100);
  }
  const subtotal = goldAmt !== null ? goldAmt + makingAmt : null;
  const isVATExempt = buyKarat === '24K';
  const vat = subtotal !== null && !isVATExempt ? subtotal * 0.05 : 0;
  const buyTotal = subtotal !== null ? subtotal + vat : null;
  const fmtBuy = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Sell calculations
  const sellRate = rates && rates[sellKarat];
  const deduction = sellRate ? sellRate * 0.06 : null;
  const yourRate = sellRate ? sellRate * 0.94 : null;
  const sellPayout = yourRate && sellGrams > 0 ? yourRate * sellGrams : null;

  function handleSellGrams(val) {
    const n = parseFloat(val);
    if (!isNaN(n) && n >= 0) setSellGrams(n);
  }

  return (
    <section className="calculator-section" aria-label="Gold calculator">
      <div className={`calculator-container reveal-up${visible ? ' is-visible' : ''}`} ref={ref}>

        {/* Header */}
        <div className="calc-header-row">
          <div>
            <h2 className="calc-title">Gold Calculator</h2>
            <p className="calc-intro-note">Get a price estimate before you visit — no surprises at the counter.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="calc-tabs-row">
          <button
            type="button"
            className={`calc-tab-btn${tab === 'buy' ? ' active' : ''}`}
            onClick={() => setTab('buy')}
          >
            <span className="calc-tab-icon">🛍️</span>
            Buying gold?
          </button>
          <button
            type="button"
            className={`calc-tab-btn${tab === 'sell' ? ' active' : ''}`}
            onClick={() => setTab('sell')}
          >
            <span className="calc-tab-icon">💰</span>
            Selling gold back?
          </button>
        </div>

        {/* Buy Panel */}
        {tab === 'buy' && (
          <div className="calc-body">
            <div className="calc-col">
              <p className="calc-panel-context">
                See exactly what you'll pay — gold cost, making charges, and VAT — before you walk in.
              </p>

              <div className="calc-field">
                <label className="calc-label">What karat are you buying?</label>
                <div className="calc-karat-pills">
                  {BUY_KARATS.map((k) => (
                    <button
                      key={k}
                      type="button"
                      className={`calc-karat-pill${buyKarat === k ? ' active' : ''}`}
                      onClick={() => setBuyKarat(k)}
                    >{k}</button>
                  ))}
                </div>
              </div>

              <div className="calc-field">
                <label className="calc-label">How many grams?</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 10"
                  value={buyGrams}
                  onChange={(e) => setBuyGrams(e.target.value)}
                  className="calc-text-input"
                />
              </div>

              <div className="calc-field">
                <label className="calc-label">Making charges (optional)</label>
                <div className="calc-making-row">
                  <div className="calc-toggle">
                    <button type="button" className={makingType === 'flat' ? 'active' : ''} onClick={() => setMakingType('flat')}>AED</button>
                    <button type="button" className={makingType === 'pct' ? 'active' : ''} onClick={() => setMakingType('pct')}>%</button>
                  </div>
                  {makingType === 'flat'
                    ? <input type="number" min="0" placeholder="e.g. 150" value={makingFlat} onChange={(e) => setMakingFlat(e.target.value)} className="calc-text-input" />
                    : <input type="number" min="0" max="100" placeholder="e.g. 10" value={makingPct} onChange={(e) => setMakingPct(e.target.value)} className="calc-text-input" />
                  }
                </div>
              </div>
            </div>

            <div className="calc-col">
              {buyRate && (
                <div className="calc-live-rate-pill">
                  Live {buyKarat} rate: <strong>{buyRate.toFixed(2)} AED/g</strong>
                </div>
              )}
              {buyTotal !== null && buyGramsNum > 0 ? (
                <div className="calc-breakdown-card">
                  <div className="calc-breakdown-title">Price breakdown</div>
                  <div className="calc-breakdown-steps">
                    <div className="calc-step">
                      <span className="calc-step-label">Gold ({buyGramsNum}g × {buyRate?.toFixed(2)})</span>
                      <span className="calc-step-value">{fmtBuy(goldAmt)} AED</span>
                    </div>
                    {makingAmt > 0 && (
                      <div className="calc-step">
                        <span className="calc-step-label">Making charges</span>
                        <span className="calc-step-value">{fmtBuy(makingAmt)} AED</span>
                      </div>
                    )}
                    <div className="calc-step">
                      <span className="calc-step-label">VAT (5%){isVATExempt ? ' — exempt (24K)' : ''}</span>
                      <span className="calc-step-value">{vat > 0 ? `${fmtBuy(vat)} AED` : '—'}</span>
                    </div>
                    <div className="calc-step-divider" />
                    <div className="calc-step calc-step--total">
                      <span className="calc-step-label">Total you pay</span>
                      <span className="calc-step-value calc-step-value--big">{fmtBuy(buyTotal)} AED</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="calc-empty-state">
                  Enter the grams on the left to see your price breakdown.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sell Panel */}
        {tab === 'sell' && (
          <div className="calc-body">
            <div className="calc-col">
              <p className="calc-panel-context">
                We buy back 24K and 22K gold purchased from us. Our rate is the live price minus 6%.
              </p>

              <div className="calc-field">
                <label className="calc-label">What karat is your gold?</label>
                <div className="calc-karat-pills">
                  {SELL_KARATS.map((k) => (
                    <button
                      key={k}
                      type="button"
                      className={`calc-karat-pill${sellKarat === k ? ' active' : ''}`}
                      onClick={() => setSellKarat(k)}
                    >{k}</button>
                  ))}
                </div>
              </div>

              <div className="calc-field">
                <label className="calc-label">How many grams do you have?</label>
                <div className="calc-stepper">
                  <button className="calc-step-btn" type="button" onClick={() => setSellGrams((g) => Math.max(0, parseFloat((g - 1).toFixed(2))))} aria-label="Decrease">−</button>
                  <input
                    type="number"
                    className="calc-gram-input"
                    value={sellGrams}
                    min="0"
                    step="0.01"
                    onChange={(e) => handleSellGrams(e.target.value)}
                  />
                  <button className="calc-step-btn" type="button" onClick={() => setSellGrams((g) => parseFloat((g + 1).toFixed(2)))} aria-label="Increase">+</button>
                </div>
              </div>

              <div className="calc-intro-disclaimer">
                ⚠️ We only buy back gold purchased from us.
              </div>
            </div>

            <div className="calc-col">
              {sellRate ? (
                <div className="calc-breakdown-card">
                  <div className="calc-breakdown-title">Here is how we work it out</div>
                  <div className="calc-breakdown-steps">
                    <div className="calc-step">
                      <span className="calc-step-label">Today's {sellKarat} rate</span>
                      <span className="calc-step-value">{sellRate.toFixed(2)} AED/g</span>
                    </div>
                    <div className="calc-step">
                      <span className="calc-step-label">
                        We take off 6%
                        <span className="calc-step-why">Al Naeem standard buy-back rate</span>
                      </span>
                      <span className="calc-step-value calc-step-value--red">− {deduction.toFixed(2)} AED/g</span>
                    </div>
                    <div className="calc-step calc-step--your-rate">
                      <span className="calc-step-label">Your rate per gram</span>
                      <span className="calc-step-value calc-step-value--accent">{yourRate.toFixed(2)} AED/g</span>
                    </div>
                    <div className="calc-step-divider" />
                    <div className="calc-step">
                      <span className="calc-step-label">Your grams</span>
                      <span className="calc-step-value">{sellGrams} g</span>
                    </div>
                    <div className="calc-step calc-step--total">
                      <span className="calc-step-label">You get (approx.)</span>
                      <span className="calc-step-value calc-step-value--big">
                        {sellPayout > 0 ? `${sellPayout.toLocaleString(undefined, { maximumFractionDigits: 0 })} AED` : '—'}
                      </span>
                    </div>
                  </div>
                  <p className="calc-footer-note">
                    That's what we'd pay you — in cash, same day. Amount may vary slightly if the piece is damaged or mixed metal.
                  </p>
                </div>
              ) : (
                <div className="calc-empty-state">Rates loading…</div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
