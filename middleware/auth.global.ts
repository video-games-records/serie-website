export default defineNuxtRouteMiddleware(async (to) => {
  // Skip auth check for public routes
  const publicRoutes = ['/', '/login', '/register', '/forgot-password']
  const isPublicRoute = publicRoutes.includes(to.path) || 
                       to.path.startsWith('/game/') && !to.path.includes('/submit')

  if (isPublicRoute) {
    return
  }

  // Only run on client side to avoid server-side issues
  if (import.meta.server) {
    return
  }

  const { token, refreshToken, user, refreshAuthToken, logout } = useAuth()

  // If no token, redirect to login
  if (!token.value) {
    return navigateTo('/login')
  }

  // Check if token is expired or will expire soon (within 5 minutes)
  try {
    const tokenPayload = JSON.parse(atob(token.value.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    const expirationTime = tokenPayload.exp
    const timeUntilExpiry = expirationTime - currentTime

    // If token is expired or will expire in less than 5 minutes, try to refresh
    if (timeUntilExpiry <= 300) { // 5 minutes = 300 seconds
      if (refreshToken.value) {
        try {
          await refreshAuthToken()
        } catch (error) {
          // Refresh failed, logout and redirect to login
          console.error('Token refresh failed:', error)
          logout()
          return navigateTo('/login')
        }
      } else {
        // No refresh token available, logout
        logout()
        return navigateTo('/login')
      }
    }

    // If no user data, redirect to login (shouldn't happen if token is valid)
    if (!user.value) {
      logout()
      return navigateTo('/login')
    }

  } catch (error) {
    // Invalid token format, logout
    console.error('Invalid token format:', error)
    logout()
    return navigateTo('/login')
  }
})