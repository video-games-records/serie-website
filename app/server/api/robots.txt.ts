export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const hostname = getHeader(event, 'host') || 'videogamesrecords.com'
  const protocol = hostname.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${hostname}`

  // Check if staging environment
  const isStaging = config.public.nuxtEnv === 'staging' || 
                   hostname.includes('staging') || 
                   hostname.includes('dev') ||
                   hostname.includes('localhost') ||
                   hostname.includes('.local')

  setHeader(event, 'content-type', 'text/plain')

  if (isStaging) {
    // Disallow all indexing in staging/development
    return `User-agent: *
Disallow: /

# This is a staging/development environment
# No indexing allowed`
  }

  // Production robots.txt
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/api/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/

# Allow important pages
Allow: /game/
Allow: /player/

# Crawl delay (optional)
Crawl-delay: 1`
})