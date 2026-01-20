import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { NotificationProvider } from './context/NotificationProvider.tsx';
import { LoadingProvider } from './context/LoadingContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </NotificationProvider>
  </StrictMode>
);
