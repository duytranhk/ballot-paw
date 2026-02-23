import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BallotProvider } from './context/BallotProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BallotProvider>
      <App />
    </BallotProvider>
  </StrictMode>,
);

