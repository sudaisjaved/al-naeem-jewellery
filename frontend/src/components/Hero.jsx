import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useInView } from '../hooks/useInView.js';

export default function Hero() {
  const { t } = useLanguage();
  const h = t.hero;
  const [ref, visible] = useInView({ threshold: 0.05 });

  return (
    <section className="hero" aria-label="About Al Naeem Jewellery">
      <div className="hero-dots" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-layout" ref={ref}>
        <div className={`hero-content reveal-up${visible ? ' is-visible' : ''}`}>
          <p className="hero-eyebrow">Dubai Gold Souk · Est. 1989</p>
          <h1 className="hero-headline" data-testid="hero-headline">
            {h.headline}
          </h1>
          <p className="hero-subtext">{h.subtext}</p>
          <blockquote className="hero-quote">
            <span>"{h.legacyQuote}"</span>
            <cite>{h.legacyFounder}</cite>
          </blockquote>
        </div>

        <div className="hero-stamp" aria-hidden="true">
          <span className="hero-stamp-est">Est.</span>
          <span className="hero-stamp-year">1989</span>
          <span className="hero-stamp-line" />
          <span className="hero-stamp-name">Al Naeem Jewellery</span>
          <span className="hero-stamp-location">Dubai Gold Souk · Deira</span>
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span className="hero-scroll-label">Scroll</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  );
}
