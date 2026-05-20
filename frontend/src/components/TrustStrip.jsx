import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useInView } from '../hooks/useInView.js';

export default function TrustStrip() {
  const { t } = useLanguage();
  const [ref, visible] = useInView({ threshold: 0.2 });
  const tr = t.trust;

  const stats = [tr.stat1, tr.stat2, tr.stat3, tr.stat4];

  return (
    <div
      className={`trust-strip reveal-up${visible ? ' is-visible' : ''}`}
      ref={ref}
    >
      <div className="trust-inner">
        {stats.map((stat, i) => (
          <div key={i} className="trust-stat">
            <div className="trust-value">{stat.value}</div>
            <div className="trust-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
