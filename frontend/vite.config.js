import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        // Don't wait for all modules to be pre-bundled before serving
        warmup: {
            // Pre-transform these critical files immediately on server start
            clientFiles: [
                './src/main.jsx',
                './src/App.jsx',
                './src/components/Login.jsx',
                './src/components/Home.jsx',
                './src/components/HorizontalNav.jsx',
                './src/context/AuthContext.jsx',
            ],
        },
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            }
        }
    },
    optimizeDeps: {
        // Pre-bundle ALL heavy deps at startup so first page load is instant
        include: [
            'react',
            'react-dom',
            'react-dom/client',
            'react-router-dom',
            'recharts',
            'lucide-react',
            'framer-motion',
            'date-fns',
        ],
        // Don't wait indefinitely for the crawl to complete
        holdUntilCrawlEnd: false,
    },
    // Speed up builds by caching
    cacheDir: './node_modules/.vite',
})
