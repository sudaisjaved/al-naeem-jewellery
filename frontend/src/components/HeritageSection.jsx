import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useInView } from '../hooks/useInView.js';

export default function HeritageSection() {
  const { t } = useLanguage();
  const h = t.hero;
  const [ref, visible] = useInView({ threshold: 0.2 });

  return (
    <section className="heritage-section" aria-labelledby="heritage-heading">
      <div
        className={`heritage-inner reveal-up${visible ? ' is-visible' : ''}`}
        ref={ref}
      >
        <span className="heritage-badge">{h.legacyTitle}</span>
        <blockquote className="heritage-quote" id="heritage-heading">
          {h.legacyQuote}
        </blockquote>
        <p className="heritage-founder">{h.legacyFounder}</p>
      </div>
    </section>
  );
}
