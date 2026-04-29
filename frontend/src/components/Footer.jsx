import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div>{t.footer.text}</div>
      <div>{t.footer.noOnlineSales}</div>
    </footer>
  );
}
