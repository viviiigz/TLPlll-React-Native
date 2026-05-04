import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { MaquillajesProvider } from './context/MaquillajesContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MaquillajesProvider>
      <App />
    </MaquillajesProvider>
  </StrictMode>
);