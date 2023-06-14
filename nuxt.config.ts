import { resolve, dirname } from "node:path";
import { fileURLToPath } from "url";
import VueI18nVitePlugin from "@intlify/unplugin-vue-i18n/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxthq/ui"],
  ui: {
    icons: ["heroicons", "circle-flags"],
  },
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_URL,
    },
  },
  plugins: ["~/plugins/i18n.ts"],
  vite: {
    plugins: [
      VueI18nVitePlugin({
        include: [
          resolve(dirname(fileURLToPath(import.meta.url)), "./locales/*.json"),
        ],
      }),
    ],
  },
});
