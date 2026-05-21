import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

axios.defaults.withCredentials = true;

// Configure global API base URL swapping for production/development
axios.interceptors.request.use((config) => {
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  if (config.url && config.url.startsWith('http://localhost:4000')) {
    config.url = config.url.replace('http://localhost:4000', apiBase);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
