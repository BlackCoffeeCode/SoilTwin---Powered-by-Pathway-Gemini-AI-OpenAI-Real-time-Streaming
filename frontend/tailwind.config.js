/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'soil-brown': '#8B4513',
                'leaf-green': '#228B22',
                'sky-blue': '#87CEEB',
            }
        },
    },
    plugins: [],
}
