import { createRoot } from 'react-dom/client';

import App from './App';
import { AppErrorBoundary } from '@/components/app-error-boundary';

import './index.css';

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>,
);
