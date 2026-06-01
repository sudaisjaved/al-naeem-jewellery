import { useState, useEffect, useCallback } from 'react';
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
  const [ratesData, setRatesData] = useState({ rates: null, fetchedAt: null, source: null, loading: true, error: false });
  const [refreshing, setRefreshing] = useState(false);

  const fetchRates = useCallback(async (forceRefresh = false) => {
    const base = import.meta.env.VITE_API_URL || '';
    const url = forceRefresh ? `${base}/api/gold-rates?refresh=true` : `${base}/api/gold-rates`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('non-200');
      const data = await res.json();
      setRatesData({ rates: data.rates, fetchedAt: data.fetchedAt, source: data.source, loading: false, error: false });
    } catch {
      setRatesData((s) => ({ ...s, loading: false, error: true }));
    }
  }, []);

  useEffect(() => { fetchRates(false); }, [fetchRates]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchRates(true);
    setRefreshing(false);
  }

  return (
    <>
      <Nav />
      {langCode === 'ar' ? (
        <ArabicComingSoon />
      ) : (
        <>
          <Hero />
          <GoldRatesBar ratesData={ratesData} refreshing={refreshing} onRefresh={handleRefresh} />
          <GoldCalculator rates={ratesData.rates} />
          <VideoFAQ />
          <ShopCards />
          <Footer />
        </>
      )}
    </>
  );
}
