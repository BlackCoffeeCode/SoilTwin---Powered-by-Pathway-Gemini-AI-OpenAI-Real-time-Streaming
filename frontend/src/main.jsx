import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Safe Mount
try {
    const root = createRoot(document.getElementById('root'));
    root.render(
        <StrictMode>
            <App />
        </StrictMode>
    );
} catch (e) {
    console.error("CRITICAL MOUNT ERROR:", e);
    document.body.innerHTML = `<div style="color:red; padding:20px;"><h1>App Crashed at Mount</h1><pre>${e.message}</pre></div>`;
}
