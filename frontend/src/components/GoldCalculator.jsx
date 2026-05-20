import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useInView } from '../hooks/useInView.js';

const KARATS = ['24K', '22K', '21K', '18K', '14K'];

export default function GoldCalculator() {
  const { t } = useLanguage();
  const [ref, visible] = useInView({ threshold: 0.1 });
  const [grams, setGrams] = useState(10);
  const [karat, setKarat] = useState('22K');
  const [rates, setRates] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchRates() {
      try {
        const base = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${base}/api/gold-rates`);
        if (!res.ok) throw new Error('non-200');
        const data = await res.json();
        if (!cancelled) setRates(data.rates);
      } catch { /* shows placeholder */ }
    }
    fetchRates();
    return () => { cancelled = true; };
  }, []);

  const liveRate = rates && rates[karat];
  const deduction = liveRate ? liveRate * 0.06 : null;
  const yourRate = liveRate ? liveRate * 0.94 : null;
  const payout = yourRate && grams > 0 ? yourRate * grams : null;

  function handleGramsChange(val) {
    const n = parseFloat(val);
    if (!isNaN(n) && n >= 0) setGrams(n);
  }

  return (
    <section className="calculator-section" aria-label="Gold sell-back calculator">
      <div className={`calculator-container reveal-up${visible ? ' is-visible' : ''}`} ref={ref}>

        {/* Header row — full width */}
        <div className="calc-header-row">
          <div>
            <h2 className="calc-title">Sell Your Gold Back</h2>
            <p className="calc-intro-question">
              Want to know how much cash you will get if you sell your gold back to us?
            </p>
            <p className="calc-intro-note">
              Pick your karat. Type in your grams. We show you the number right away.
            </p>
          </div>
          <div className="calc-intro-disclaimer">
            ⚠️ We only buy gold that was bought from us.
          </div>
        </div>

        <div className="calc-body">
          {/* Left col — inputs */}
          <div className="calc-col">
            <div className="calc-field">
              <label className="calc-label">What karat is your gold?</label>
              <div className="calc-karat-pills">
                {KARATS.map((k) => (
                  <button
                    key={k}
                    className={`calc-karat-pill${karat === k ? ' active' : ''}`}
                    onClick={() => setKarat(k)}
                    type="button"
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            <div className="calc-field">
              <label className="calc-label">How many grams do you have?</label>
              <div className="calc-stepper">
                <button
                  className="calc-step-btn"
                  onClick={() => setGrams((g) => Math.max(0, parseFloat((g - 1).toFixed(2))))}
                  type="button"
                  aria-label="Decrease grams"
                >−</button>
                <input
                  type="number"
                  className="calc-gram-input"
                  value={grams}
                  min="0"
                  step="0.01"
                  onChange={(e) => handleGramsChange(e.target.value)}
                />
                <button
                  className="calc-step-btn"
                  onClick={() => setGrams((g) => parseFloat((g + 1).toFixed(2)))}
                  type="button"
                  aria-label="Increase grams"
                >+</button>
              </div>
            </div>
          </div>

          {/* Right col — breakdown */}
          <div className="calc-col">
          {liveRate ? (
            <div className="calc-breakdown-card">
              <div className="calc-breakdown-title">Here is how we work it out</div>

              <div className="calc-breakdown-steps">
                <div className="calc-step">
                  <div className="calc-step-label">Today's {karat} gold rate</div>
                  <div className="calc-step-value">{liveRate.toFixed(2)} AED / gram</div>
                </div>

                <div className="calc-step calc-step--deduct">
                  <div className="calc-step-label">
                    We take off 6%
                    <span className="calc-step-why"> — this covers our cost to melt and refine the gold</span>
                  </div>
                  <div className="calc-step-value calc-step-value--red">− {deduction.toFixed(2)} AED / gram</div>
                </div>

                <div className="calc-step calc-step--your-rate">
                  <div className="calc-step-label">Your rate per gram</div>
                  <div className="calc-step-value calc-step-value--accent">{yourRate.toFixed(2)} AED / gram</div>
                </div>

                <div className="calc-step-divider" />

                <div className="calc-step">
                  <div className="calc-step-label">Your grams</div>
                  <div className="calc-step-value">{grams} g</div>
                </div>

                <div className="calc-step calc-step--total">
                  <div className="calc-step-label">You get (approx.)</div>
                  <div className="calc-step-value calc-step-value--big">
                    {payout > 0
                      ? `${payout.toLocaleString(undefined, { maximumFractionDigits: 0 })} AED`
                      : '—'}
                  </div>
                </div>
              </div>

              <p className="calc-footer-note">
                This is an estimate. The exact amount may change slightly if your gold is damaged or mixed with other metals.
              </p>
            </div>
          ) : (
            <div className="calc-result-card">
              <div className="calc-result-label">Estimated Payout</div>
              <div className="calc-result-amount">—</div>
              <p className="calc-disclaimer">Rates loading…</p>
            </div>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}
