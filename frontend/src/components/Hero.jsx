import { useLanguage } from '../contexts/LanguageContext.jsx';

const WHATSAPP_NUMBER = '971501234567';
const MAPS_URL = 'https://maps.google.com/?q=Dubai+Gold+Souk+Deira';

export default function Hero() {
  const { t } = useLanguage();
  const h = t.hero;

  return (
    <section className="hero" aria-label="About Al Naeem Jewellery">
      <div className="hero-content">
        <h1 className="hero-headline" data-testid="hero-headline">{h.headline}</h1>
        <p className="hero-subtext">{h.subtext}</p>
        <div className="hero-cta">
          <a
            className="btn btn-whatsapp"
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.525 5.847L0 24l6.334-1.503A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.796 9.796 0 01-5.031-1.389l-.361-.215-3.761.893.952-3.657-.236-.376A9.796 9.796 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
            </svg>
            {t.nav.whatsapp}
          </a>
          <a
            className="btn btn-outline"
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.nav.findUs}
          </a>
        </div>
      </div>

      <div className="legacy-card" data-testid="legacy-card">
        <div className="legacy-years">{h.legacyTitle}</div>
        <p className="legacy-quote">{h.legacyQuote}</p>
        <p className="legacy-founder">{h.legacyFounder}</p>
      </div>
    </section>
  );
}
