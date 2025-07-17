import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './components/app';
import { NotifyProvider } from './components/parts/notifications/Notify';
import { initializePWA } from './utils/pwa';

// Initialize PWA functionality
initializePWA();

createRoot(document.getElementById('root')!).render(
  <NotifyProvider>
    <App />
  </NotifyProvider>
);
