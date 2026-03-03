import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App.jsx'
import './index.css'

// API base: runtime (window.__API_URL__) overrides build-time (VITE_API_URL). On production host, never use localhost or empty (so /api and /uploads hit backend, not frontend).
const PRODUCTION_API_URL = 'https://whitesmoke-armadillo-865654.hostingersite.com';
let apiBase = (typeof window !== 'undefined' && window.__API_URL__)
  ? window.__API_URL__.replace(/\/$/, '')
  : (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && !window.location.hostname.startsWith('127.');
if (isProduction && (!apiBase || apiBase.includes('localhost') || apiBase.startsWith('http://127.'))) {
  apiBase = PRODUCTION_API_URL;
}
if (apiBase) {
  axios.defaults.baseURL = apiBase;
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
