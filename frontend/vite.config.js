import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            }
        }
    },
    optimizeDeps: {
        // Exclude large packages that cause Vite 7 pre-bundling to hang on Node v24
        exclude: ['framer-motion', 'lucide-react'],
        // Speed up pre-bundling by including known heavy deps explicitly
        include: ['react', 'react-dom', 'react-router-dom', 'recharts'],
    },
})
