export const useGoogleAnalytics = () => {
  const config = useRuntimeConfig()
  const currentSerie = useState('currentSerie')

  const getAnalyticsId = computed(() => {
    // En staging, utiliser l'ID par défaut depuis les variables d'environnement
    if (config.public.nuxtEnv === 'staging') {
      return config.public.googleAnalyticsId || 'G-HSFLH2YTF0'
    }

    // En production, utiliser l'ID spécifique de la série ou fallback sur l'ID global
    return currentSerie.value?.gaId || config.public.googleAnalyticsId
  })

  const isAnalyticsEnabled = computed(() => {
    return !!getAnalyticsId.value && config.public.nuxtEnv !== 'development'
  })

  return {
    analyticsId: getAnalyticsId,
    isEnabled: isAnalyticsEnabled
  }
}