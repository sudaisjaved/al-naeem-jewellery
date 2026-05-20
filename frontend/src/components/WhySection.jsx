import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useInView } from '../hooks/useInView.js';

const ICONS = [
  /* Transparent pricing — eye */
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>,
  /* Family / handshake — users */
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>,
  /* Community — map pin / heart */
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>,
];

export default function WhySection() {
  const { t } = useLanguage();
  const why = t.why;
  const [titleRef, titleVisible] = useInView();
  const [gridRef, gridVisible] = useInView({ threshold: 0.1 });

  return (
    <section className="why-section">
      <div className="why-inner">
        <h2
          className={`section-title reveal-up${titleVisible ? ' is-visible' : ''}`}
          ref={titleRef}
        >
          {why.title}
        </h2>
        <div className="why-grid" ref={gridRef}>
          {why.items.map((item, i) => (
            <div
              key={i}
              className={`why-card reveal-up${gridVisible ? ' is-visible' : ''}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="why-icon">{ICONS[i]}</div>
              <h3 className="why-heading">{item.heading}</h3>
              <p className="why-body">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
