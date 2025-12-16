import type { UseFetchOptions } from '#app'

export function useFetchApi<T>(url: string, options: UseFetchOptions<T> = {}) {
  const config = useRuntimeConfig()
  const { token, willTokenExpireSoon, refreshAuthToken, logout } = useAuth()

  // Ensure we refresh token if needed before the request
  const refreshTokenIfNeeded = async () => {
    if (token.value && willTokenExpireSoon()) {
      try {
        await refreshAuthToken()
      } catch (error) {
        console.error('Token refresh failed:', error)
        logout()
        throw error
      }
    }
  }

  return useLazyFetch<T>(url, {
    baseURL: config.public.apiBaseUrl,
    ...options,
    async onRequest({ options: requestOptions }) {
      // Refresh token if needed before request
      await refreshTokenIfNeeded()

      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...requestOptions.headers as Record<string, string>
      }

      // Add Authorization header if we have a token
      if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
      }

      requestOptions.headers = headers

      // Call user's onRequest hook if provided
      if (options.onRequest) {
        if (typeof options.onRequest === 'function') {
          await options.onRequest({ options: requestOptions })
        }
      }
    },
    async onResponseError({ response }) {
      // Handle 401 responses by refreshing token and retrying
      if (response.status === 401 && token.value) {
        try {
          await refreshAuthToken()
          // The retry will be handled automatically by the useLazyFetch refresh mechanism
        } catch (error) {
          console.error('Token refresh failed on 401:', error)
          logout()
          throw error
        }
      }

      // Call user's onResponseError hook if provided
      if (options.onResponseError) {
        if (typeof options.onResponseError === 'function') {
          await options.onResponseError({ response })
        }
      }
    },
  })
}