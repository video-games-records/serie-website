// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  vite: {
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
