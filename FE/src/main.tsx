import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';
import { ToastProvider } from './components/Toast';
import { AuthProvider } from './features/auth/AuthProvider';
import { listenForInstall } from './lib/install';
import { applyTheme, watchSystemTheme } from './lib/theme';
import './styles/tokens.css';
import './styles/app.css';

applyTheme();
watchSystemTheme();
listenForInstall();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
