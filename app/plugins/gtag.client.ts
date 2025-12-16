interface GtagWindow extends Window {
  dataLayer: unknown[]
  gtag: (...args: unknown[]) => void
}

declare const window: GtagWindow

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const gtagId = config.public.googleAnalyticsId

  if (!gtagId) {
    console.warn('Google Analytics ID not found')
    return
  }

  // Load Google Analytics script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`
  document.head.appendChild(script)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function(...args: unknown[]) {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', gtagId)
})