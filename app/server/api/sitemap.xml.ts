export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const hostname = getHeader(event, 'host') || 'videogamesrecords.com'
  const protocol = hostname.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${hostname}`

  // Check if staging environment
  const isStaging = config.public.nuxtEnv === 'staging' || hostname.includes('staging')
  
  if (isStaging) {
    // Return minimal sitemap for staging
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
  }

  try {
    // Fetch games from API for production sitemap
    const apiResponse = await $fetch<{
      'hydra:member': Array<{ id: number, slug?: string, name: string }>
    }>('/games', {
      baseURL: config.public.apiBaseUrl
    })

    const games = apiResponse['hydra:member'] || []
    
    const urls = [
      {
        loc: baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '1.0'
      }
    ]

    // Add game URLs
    games.forEach(game => {
      urls.push({
        loc: `${baseUrl}/game/${game.id}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8'
      })
    })

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    setHeader(event, 'content-type', 'application/xml')
    return sitemap

  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Fallback minimal sitemap
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

    setHeader(event, 'content-type', 'application/xml')
    return fallbackSitemap
  }
})