// Force-clear all known market cache keys on every startup
['market_data_v7','market_data_cache_v6','market_data_cache_v5','market_data_cache_v4','market_data_cache_v3','market_cache'].forEach(k => localStorage.removeItem(k));

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if ('serviceWorker' in navigator) {
  // UNREGISTER service workers to prevent aggressive caching issues during updates
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
