// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
    }
  },

  modules: [
    "@nuxthq/ui",
    "@nuxtjs/i18n"
  ],

  ui: {
    icons: ["heroicons", "circle-flags"],
  },

  site: {
    url: 'https://chessfinder.app',
  },

  i18n: {
    baseUrl: 'https://chessfinder.app',
    locales: [
      {
        code: 'en',
        iso: 'en-US'
      },
      {
        code: 'es',
        iso: 'es-ES'
      },
      {
        code: 'ca',
        iso: 'ca-ES'
      },
      {
        code: 'fr',
        iso: 'fr-FR'
      }
    ],
    defaultLocale: 'en',
    vueI18n: './i18n.config.ts'
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
      posthogPublicKey: process.env.POSTHOG_KEY,
      posthogHost: process.env.POSTHOG_HOST,
      mapboxKey: process.env.MAPBOX_API_KEY
    },
  },

  colorMode: {
    preference: 'dark'
  },

  plugins: ['~/plugins/vercel.ts'],

  ssr: false,
});
