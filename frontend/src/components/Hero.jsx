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
        </div>

        <div className="hero-decor" aria-hidden="true">
          <div className="hero-ring hero-ring--1" />
          <div className="hero-ring hero-ring--2" />
          <div className="hero-ring hero-ring--3" />
          <div className="hero-ring hero-ring--4" />
          <div className="hero-ring-center">
            <span className="hero-ring-year">1989</span>
            <span className="hero-ring-label">Est.</span>
          </div>
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span className="hero-scroll-label">Scroll</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  );
}
