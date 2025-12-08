// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
      '@nuxtjs/tailwindcss',
      '@pinia/nuxt',
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://backoffice.vgr.local/api'
    }
  },
  vite: {
    resolve: {
      alias: {
        '@stores': fileURLToPath(new URL('./stores', import.meta.url)),
        '@config': fileURLToPath(new URL('./config', import.meta.url)), 
        '@assets': fileURLToPath(new URL('./assets', import.meta.url))
      }
    },
    server: {
      allowedHosts: [
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
