import { useLanguage } from './contexts/LanguageContext.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import GoldRatesBar from './components/GoldRatesBar.jsx';
import GoldCalculator from './components/GoldCalculator.jsx';
import VideoFAQ from './components/VideoFAQ.jsx';
import ShopCards from './components/ShopCards.jsx';
import Footer from './components/Footer.jsx';

function ArabicComingSoon() {
  const { setLangCode } = useLanguage();
  return (
    <div className="arabic-coming-soon" dir="rtl">
      <h1>النسخة العربية قريبًا</h1>
      <p>The Arabic version of this site is coming soon.</p>
      <button className="btn btn-outline" onClick={() => setLangCode('en')}>
        Switch to English
      </button>
    </div>
  );
}

export default function App() {
  const { langCode } = useLanguage();

  return (
    <>
      <Nav />
      {langCode === 'ar' ? (
        <ArabicComingSoon />
      ) : (
        <>
          <Hero />
          <GoldRatesBar />
          <GoldCalculator />
          <VideoFAQ />
          <ShopCards />
          <Footer />
        </>
      )}
    </>
  );
}
