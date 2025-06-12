import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { ModalProvider } from './ModalWrapper';

import './style.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ModalProvider>
    <App />
  </ModalProvider>
);