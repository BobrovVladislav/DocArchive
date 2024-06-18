import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext.jsx";
import { DocumentProvider } from "./context/DocumentContext.jsx";
import './assets/styles/globals.scss';
import App from './App.jsx';

// eslint-disable-next-line react/prop-types
const CombinedProvider = ({ children }) => (
  <AuthProvider>
    <DocumentProvider>
      {children}
    </DocumentProvider>
  </AuthProvider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CombinedProvider>
        <App />
      </CombinedProvider>
    </BrowserRouter>
  </React.StrictMode>
);
