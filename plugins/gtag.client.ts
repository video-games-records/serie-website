import { VueGtagNext } from 'vue-gtag-next'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const gtagId = config.public.googleAnalyticsId

  if (!gtagId) {
    console.warn('Google Analytics ID not found')
    return
  }

  nuxtApp.vueApp.use(VueGtagNext, {
    property: {
      id: gtagId
    }
  })
})