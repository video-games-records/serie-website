// plugins/analytics.ts
import { defineNuxtPlugin } from '#app'
import { createGtag } from 'vue-gtag'
import type { RouteLocationNormalized } from 'vue-router'

interface WindowWithGtag extends Window {
    gtag?: (command: string, action: string, parameters: Record<string, unknown>) => void
}


export default defineNuxtPlugin(async (nuxtApp) => {
    const config = useRuntimeConfig()
    const { $router } = nuxtApp

    // Skip on server
    if (!import.meta.client) return

    const hostname = window.location.hostname
    const subdomain = hostname.split('.')[0]

    // Maintenant c'est async, tu peux await
    const { SERIES_CONFIG } = await import('../../config/series')
    const serie = SERIES_CONFIG[subdomain as keyof typeof SERIES_CONFIG] || SERIES_CONFIG['mario-kart']

    const gaId = config.public.nuxtEnv === 'staging'
        ? config.public.googleAnalyticsId
        : (serie?.gaId || config.public.googleAnalyticsId)

    if (!gaId) {
        console.warn('Google Analytics not initialized: Missing measurement ID')
        return
    }

    // Initialize vue-gtag without automatic page tracking
    const gtag = createGtag({
        tagId: gaId,
        config: {
            send_page_view: false  // Disable automatic page view tracking
        }
    })

    nuxtApp.vueApp.use(gtag)
    
    // Custom page tracking with only title, no path
    if ($router && typeof $router === 'object' && 'afterEach' in $router) {
        interface Router {
            afterEach: (callback: (to: RouteLocationNormalized) => void) => void
        }

        (($router as unknown) as Router).afterEach((to: RouteLocationNormalized) => {
            // Use global gtag function

            const windowWithGtag = window as WindowWithGtag
            if (typeof window !== 'undefined' && windowWithGtag.gtag) {
                // Extraire le screen name de la route
                const pathSegments = to.path.split('/').filter(Boolean)
                const screenName = pathSegments[0] || 'home'

                windowWithGtag.gtag('event', 'page_view', {
                    page_title: document.title,
                    page_location: window.location.href,
                    screen_name: screenName.toUpperCase() // 'GAME', 'GROUP', 'HOME', etc.
                })
            }
        })
    }
    
    console.info(`Google Analytics initialized with ID: ${gaId}`)
})