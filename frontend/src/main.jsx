import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { inject } from '@vercel/analytics';
import './styles/global.css';
import './styles/calculator.css';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import App from './App.jsx';

inject();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
);
