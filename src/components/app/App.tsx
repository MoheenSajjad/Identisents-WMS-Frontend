import { NotificationProvider } from '@/components/parts/notifications/NotificationProvider';
import { Router } from './router';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { PWAInstallPrompt } from '@/components/parts/pwa-install-prompt';
import { PWAStatus, PWAUpdateNotification } from '@/components/parts/pwa-status';

export const App = () => {
  return (
    <NotificationProvider>
      <Provider store={store}>
        <Router />
        <PWAInstallPrompt />
        <PWAStatus />
        <PWAUpdateNotification />
      </Provider>
    </NotificationProvider>
  );
};
