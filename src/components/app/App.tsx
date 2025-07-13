import { NotificationProvider } from '@/components/parts/notifications/NotificationProvider';
import { Router } from './router';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';

export const App = () => {
  return (
    <NotificationProvider>
      <Provider store={store}>
        <Router />
      </Provider>
    </NotificationProvider>
  );
};
