// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  components: true,
  modules: [
      '@nuxtjs/tailwindcss',
      '@pinia/nuxt',
      '@nuxtjs/i18n',
      [
        '@nuxtjs/google-adsense',
        {
          id: process.env.GOOGLE_ADSENSE_ID,
          onPageLoad: true,
          pageLevelAds: true,
          test: process.env.NUXT_ENV === 'development'
        }
      ]
  ],
  i18n: {
    locales: [
      {
        code: 'fr',
        iso: 'fr-FR',
        name: 'Français',
        file: 'fr.json'
      },
      {
        code: 'en',
        iso: 'en-US', 
        name: 'English',
        file: 'en.json'
      }
    ],
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://backoffice.vgr.local/api',
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
      googleAdsenseId: process.env.GOOGLE_ADSENSE_ID,
      nuxtEnv: process.env.NUXT_ENV || 'development'
    }
  },
  vite: {
    resolve: {
      alias: {
        '@stores': fileURLToPath(new URL('./app/stores', import.meta.url)),
        '@types': fileURLToPath(new URL('./app/types', import.meta.url)),
        '@config': fileURLToPath(new URL('./config', import.meta.url)), 
        '@assets': fileURLToPath(new URL('./app/assets', import.meta.url)),
      }
    },
    server: {
      allowedHosts: [
        'burnout.videogamesrecords.local',
        'mario-kart.videogamesrecords.local',
        'forza.videogamesrecords.local',
        'super-smash-bros.videogamesrecords.local',
        'trackmania.videogamesrecords.local',
        'trials.videogamesrecords.local',
        'mario-sonic-olympic.videogamesrecords.local',
        'gran-turismo.videogamesrecords.local',
        'videogamesrecords.local',
        'localhost'
      ]
    }
  }
})
