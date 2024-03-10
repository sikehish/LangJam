import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthContextProvider } from './context/AuthContext';
import React from 'react';

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
