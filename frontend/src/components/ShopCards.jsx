import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useInView } from '../hooks/useInView.js';

const WA_MSG = encodeURIComponent('Hi, I saw your website and wanted to ask about gold prices.');

const SHOPS_CONTACT = {
  shop1: {
    whatsapp: '971552562336',
    whatsappDisplay: '+971 55 256 2336',
    phone: '+971 4 225 7643',
    mapsUrl: 'https://maps.app.goo.gl/hhQoZHBr6a5Uv6co9',
    instagram: 'https://www.instagram.com/alnaeemjewellery/',
    tiktok: 'https://www.tiktok.com/@alnaeemjewellery',
  },
  shop2: {
    whatsapp: '971555597080',
    whatsappDisplay: '+971 55 559 7080',
    mapsUrl: 'https://maps.app.goo.gl/J6HijAyAqBZWKdtr9',
  },
};

function ShopCard({ shop, badge, contact, t }) {
  return (
    <div className="shop-card" data-testid="shop-card">
      <div className="shop-badge">{badge}</div>
      <h3 className="shop-name">{shop.name}</h3>
      <p className="shop-area">{shop.area}</p>
      <p className="shop-desc">{shop.desc}</p>
      <p className="shop-hours">{shop.hours}</p>
      <div className="shop-contact-info">
        {contact.phone && (
          <a className="shop-contact-number" href={`tel:${contact.phone}`}>{contact.phone}</a>
        )}
        {!contact.phone && contact.whatsappDisplay && (
          <a className="shop-contact-number" href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">{contact.whatsappDisplay}</a>
        )}
      </div>
      <p className="shop-invite">Come in, look around — no pressure. Or message us first.</p>
      <div className="shop-actions">
        <a
          className="btn btn-whatsapp"
          href={`https://wa.me/${contact.whatsapp}?text=${WA_MSG}`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="shop-whatsapp-btn"
        >
          {t.shops.whatsapp}
        </a>
        <a
          className="btn btn-outline"
          href={contact.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="shop-directions-btn"
        >
          {t.shops.directions}
        </a>
      </div>
    </div>
  );
}

export default function ShopCards() {
  const { t } = useLanguage();
  const [titleRef, titleVisible] = useInView();
  const [gridRef, gridVisible] = useInView({ threshold: 0.1 });

  return (
    <section className="shops-section" aria-labelledby="shops-title" data-testid="shops-section">
      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <h2
          className={`section-title reveal-up${titleVisible ? ' is-visible' : ''}`}
          id="shops-title"
          ref={titleRef}
        >
          {t.shops.title}
        </h2>
      </div>
      <div className="shops-grid" ref={gridRef}>
        <div className={`reveal-from-left${gridVisible ? ' is-visible' : ''}`}>
          <ShopCard shop={t.shops.shop1} badge="Shop 1" contact={SHOPS_CONTACT.shop1} t={t} />
        </div>
        <div
          className={`reveal-from-right${gridVisible ? ' is-visible' : ''}`}
          style={{ transitionDelay: '0.12s' }}
        >
          <ShopCard shop={t.shops.shop2} badge="Shop 2" contact={SHOPS_CONTACT.shop2} t={t} />
        </div>
      </div>
      <div className="shops-social">
        <a href={SHOPS_CONTACT.shop1.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
          <span className="social-icon">📷</span> Instagram
        </a>
        <a href={SHOPS_CONTACT.shop1.tiktok} target="_blank" rel="noopener noreferrer" className="social-link">
          <span className="social-icon">🎵</span> TikTok
        </a>
      </div>
    </section>
  );
}
