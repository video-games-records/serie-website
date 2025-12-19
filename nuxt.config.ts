// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  components: true,
  modules: [
      '@nuxtjs/tailwindcss',
      '@pinia/nuxt',
      '@nuxtjs/i18n'
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
  nitro: {
    hooks: {
      async 'close'() {
        const fs = await import('fs')
        const path = await import('path')
        
        // Check environment
        const isStaging = process.env.NUXT_ENV === 'staging' || 
                         process.env.NUXT_ENV === 'development'
        
        // Environment-specific content (siteUrl removed as it's not used)
        
        // Generate robots.txt
        let robotsContent
        if (isStaging) {
          robotsContent = `User-agent: *
Disallow: /

# This is a staging/development environment
# No indexing allowed`
        } else {
          robotsContent = `User-agent: *
Allow: /

# Sitemap
Sitemap: /sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/

# Allow important pages
Allow: /game/
Allow: /player/

# Crawl delay
Crawl-delay: 1`
        }
        
        // Generate global sitemap.xml with relative URLs
        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
        
        // Write files to public directory
        const publicDir = path.join(process.cwd(), '.output', 'public')
        if (fs.existsSync(publicDir)) {
          fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent)
          fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent)
        }
      }
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
