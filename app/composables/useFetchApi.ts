import type { UseFetchOptions } from '#app'

export function useFetchApi<T>(url: string, options: UseFetchOptions<T> = {}) {
  const config = useRuntimeConfig()
  
  return useFetch<T>(url, {
    baseURL: config.public.apiBaseUrl,
    ...options
  })
}