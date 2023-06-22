import { resolve, dirname } from "node:path";
import { fileURLToPath } from "url";
import VueI18nVitePlugin from "@intlify/unplugin-vue-i18n/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
    }
  },
  modules: ["@nuxthq/ui", "nuxt-gtag"],
  ui: {
    icons: ["heroicons", "circle-flags"],
  },
  i18n: {
    // ...
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    }
  },
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_URL,
      posthogPublicKey: process.env.POSTHOG_KEY,
      posthogHost: process.env.POSTHOG_HOST
    },
  },
  plugins: ["~/plugins/posthog.client.js", "~/plugins/i18n.ts"],
  vite: {
    plugins: [
      VueI18nVitePlugin({
        include: [
          resolve(dirname(fileURLToPath(import.meta.url)), "./locales/*.json"),
        ],
      }),
    ],
  }
});
