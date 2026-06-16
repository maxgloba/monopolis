export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  srcDir: '.',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
  ],
  css: ['@/assets/scss/main.scss'],
  typescript: { strict: true },
  runtimeConfig: {
    public: {
      apiBaseUrl: '',
      wsUrl: process.env.WS_URL || 'http://192.168.1.101:3001',
      appName: 'Монополис',
    }
  },
  nitro: {
    routeRules: {
      '/api/**': {
        proxy: `${process.env.API_BASE_URL || 'http://localhost:3001'}/api/**`,
      },
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/scss/variables" as *;`
        }
      }
    }
  },
  pwa: {
    manifest: {
      name: 'Монополис',
      short_name: 'Монополис',
      theme_color: '#0A0A0A',
      background_color: '#0A0A0A',
      display: 'standalone',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,svg,png,ico,woff2}'],
      runtimeCaching: [
        { urlPattern: /\/pieces\/.*\.svg$/, handler: 'CacheFirst' },
        { urlPattern: /\/api\/.*/, handler: 'NetworkOnly' },
      ],
    },
  },
  app: {
    head: {
      title: 'Монополис — Онлайн настольная игра',
      meta: [
        { name: 'description', content: 'Монополис — премиальная онлайн игра с российскими тематиками' },
        { name: 'theme-color', content: '#0A0A0A' }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap'
        }
      ]
    }
  }
})
