interface FetchError {
  status?: number
  statusCode?: number
}

export default defineNuxtPlugin(() => {
  const { token, refreshToken, refreshAuthToken, logout, willTokenExpireSoon } = useAuth()

  // Interceptor pour les requêtes $fetch
  const originalFetch = globalThis.$fetch

  globalThis.$fetch = new Proxy(originalFetch, {
    async apply(target, thisArg, argArray) {
      // Vérifier si on a besoin de rafraîchir le token avant de faire la requête
      if (token.value && willTokenExpireSoon()) {
        try {
          await refreshAuthToken()
        } catch (error) {
          console.error('Token refresh failed before API call:', error)
          logout()
          throw error
        }
      }

      try {
        // Exécuter la requête originale
        return await target.apply(thisArg, argArray)
      } catch (error: unknown) {
        const fetchError = error as FetchError
        // Si la requête échoue avec une erreur 401, essayer de rafraîchir le token
        if (fetchError?.status === 401 || fetchError?.statusCode === 401) {
          if (refreshToken.value) {
            try {
              await refreshAuthToken()
              
              // Réessayer la requête avec le nouveau token
              const [_input, options = {}] = argArray
              if (options && typeof options === 'object' && 'headers' in options) {
                options.headers = {
                  ...options.headers,
                  Authorization: `Bearer ${token.value}`
                }
              }
              
              return await target.apply(thisArg, argArray)
            } catch (refreshError) {
              console.error('Token refresh failed after 401:', refreshError)
              logout()
              throw refreshError
            }
          } else {
            logout()
            throw error
          }
        }
        
        throw error
      }
    }
  })
})