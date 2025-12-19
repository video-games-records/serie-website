// Extend global Window interface
declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const { $router } = useNuxtApp()
  
  // Skip on server
  if (!import.meta.client) return
  
  // Get current serie configuration to determine GA ID
  const hostname = window.location.hostname
  const subdomain = hostname.split('.')[0]
  
  // Import series config
  const { SERIES_CONFIG } = await import('../../config/series')
  const serie = SERIES_CONFIG[subdomain as keyof typeof SERIES_CONFIG] || SERIES_CONFIG['mario-kart']
  const gaId = serie?.gaId || config.public.googleAnalyticsId
  
  if (!gaId) return
  
  // Load Google Analytics script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  document.head.appendChild(script)
  
  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }
  
  window.gtag('js', new Date())
  window.gtag('config', gaId, {
    page_title: document.title,
    page_location: window.location.href
  })
  
  // Track route changes
  $router.afterEach((to) => {
    window.gtag('config', gaId, {
      page_title: document.title,
      page_location: window.location.origin + to.fullPath
    })
  })
})