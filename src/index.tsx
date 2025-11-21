import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner@2.0.3';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  </StrictMode>
);
