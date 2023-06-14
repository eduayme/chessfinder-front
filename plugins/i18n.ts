import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import es from '../locales/es.json'
import ca from '../locales/ca.json'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    datetimeFormats: {
      en: {
        short: {
          year: 'numeric',
          month: 'short',
          weekday: 'short',
          day: 'numeric'
        }
      },
      es: {
        short: {
          year: 'numeric',
          month: 'short',
          weekday: 'long',
          day: 'numeric'
        }
      },
      ca: {
        short: {
          year: 'numeric',
          month: 'short',
          weekday: 'long',
          day: 'numeric'
        }
      }
    },
    locale: 'en',
    messages: {
      en,
      es,
      ca
    }
  })

  vueApp.use(i18n)
})