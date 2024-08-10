// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  head: {
    title: 'ChessFinder',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'The only website to find any chess tournament worlwide.' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
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
