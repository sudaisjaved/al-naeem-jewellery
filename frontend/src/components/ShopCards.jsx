import { useLanguage } from '../contexts/LanguageContext.jsx';

const SHOPS_CONTACT = {
  shop1: {
    whatsapp: '971552562336',
    whatsappDisplay: '+971 55 256 2336',
    phone: '+971 4 225 7643',
    mapsUrl: 'https://maps.google.com/?q=77CX%2BCF+Dubai',
    instagram: 'https://www.instagram.com/alnaeemjewellery/',
    tiktok: 'https://www.tiktok.com/@alnaeemjewellery',
  },
  shop2: {
    whatsapp: '971555597080',
    whatsappDisplay: '+971 55 559 7080',
    mapsUrl: 'https://maps.google.com/?q=77CX%2BC4+Dubai',
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
      <div className="shop-actions">
        <a
          className="btn btn-whatsapp"
          href={`https://wa.me/${contact.whatsapp}`}
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

  return (
    <section className="shops-section" aria-labelledby="shops-title" data-testid="shops-section">
      <h2 className="section-title" id="shops-title">{t.shops.title}</h2>
      <div className="shops-grid">
        <ShopCard shop={t.shops.shop1} badge="Shop 1" contact={SHOPS_CONTACT.shop1} t={t} />
        <ShopCard shop={t.shops.shop2} badge="Shop 2" contact={SHOPS_CONTACT.shop2} t={t} />
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
