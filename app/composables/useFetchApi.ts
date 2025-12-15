import type { UseFetchOptions } from '#app'

export function useFetchApi<T>(url: string, options: UseFetchOptions<T> = {}) {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie('vgr_token')
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>
  }
  
  if (tokenCookie.value) {
    headers.Authorization = `Bearer ${tokenCookie.value}`
  }
  
  return useFetch<T>(url, {
    baseURL: config.public.apiBaseUrl,
    headers,
    ...options
  })
}