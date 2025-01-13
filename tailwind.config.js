/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                pulsate: {
                    '0%': { transform: 'scale(0.1)', opacity: '0' },
                    '50%': { opacity: '1' },
                    '100%': { transform: 'scale(1.2)', opacity: '0' },
                },
            },
            animation: {
                pulsate: 'pulsate 2.5s ease-out infinite',
            },
            clipPath: { 'polygon-shape': 'polygon(0 0, 0 100%, 100% 50%)', },
            colors: {
			    dark : "#0e4a2c",
                bg_default: '#F0F0F0',
                green_default: "#00b14f",
                green_nga: "#25b849",
                green_sidebar: "#39a251",
                modern_default: "#636466",
                modern_border: "#608abf",
                bg_secondary: "#D9D9D9FF",
                blue_light: "#E8F6F9",
                green_light: "#D3FFDE",
                text_color: "#263a4d",
                highlight_default: "#f2fbf6",
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                chat_me: '#e5efff',
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            fontSize: {
                14: "14px",
                16: "16px",
                18: "18px",
            },
            fontFamily: {
                inter: 'Inter'
            },
            backgroundImage: {
                'company': "url('https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/topcv-pro/banner-top-company-v1.png')",
                'impress': "url('https://static.topcv.vn/v4/image/welcome/home/impressive_numbers_cover_new.png')",
                'impress-item': "url('https://static.topcv.vn/v4/image/welcome/home/impressive_numbers_list_item.png')",
                'custom-gradient': 'linear-gradient(259.43deg, #ffb94b -3.83%, #ffe7bf 29.35%, #ffb94b 92.22%)',
                'modern': "url('public/cv/modern/background.png')"
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
}

