interface AuthUser {
    id: number
    username: string
    roles: string[]
    slug: string
}

interface AuthTeam {
    id: number
    slug: string
    tag: string
    libTeam: string
}

interface AuthPlayer {
    id: number
    slug: string
    pseudo: string
    team: AuthTeam
}

interface AuthResponse {
    token: string
    user: AuthUser
    player: AuthPlayer
    friends: number[]
    refresh_token: string
}

export const useAuth = () => {
    const tokenCookie = useCookie('vgr_token')
    const refreshTokenCookie = useCookie('vgr_refresh_token')
    const userCookie = useCookie<AuthUser | null>('vgr_user', { default: () => null })
    const playerCookie = useCookie<AuthPlayer | null>('vgr_player', { default: () => null })

    const login = async (username: string, password: string) => {
        const config = useRuntimeConfig()
        const baseURL = config?.public?.apiBaseUrl || 'http://backoffice.vgr.local/api'
        
        const response = await $fetch<AuthResponse>('/login_check', {
            baseURL,
            method: 'POST',
            body: { username, password },
        })

        tokenCookie.value = response.token
        refreshTokenCookie.value = response.refresh_token
        userCookie.value = response.user
        playerCookie.value = response.player
    }

    const refreshAuthToken = async () => {
        if (!refreshTokenCookie.value) {
            throw new Error('No refresh token available')
        }

        const config = useRuntimeConfig()
        const baseURL = config?.public?.apiBaseUrl || 'http://backoffice.vgr.local/api'

        try {
            const response = await $fetch<AuthResponse>('/token/refresh', {
                baseURL,
                method: 'POST',
                body: { refresh_token: refreshTokenCookie.value },
            })

            tokenCookie.value = response.token
            refreshTokenCookie.value = response.refresh_token
            userCookie.value = response.user
            playerCookie.value = response.player

            return response
        } catch (error) {
            // If refresh fails, clear all auth data
            logout()
            throw error
        }
    }

    const logout = () => {
        tokenCookie.value = null
        refreshTokenCookie.value = null
        userCookie.value = null
        playerCookie.value = null
    }

    const isTokenExpired = () => {
        if (!tokenCookie.value) return true

        try {
            const payload = JSON.parse(atob(tokenCookie.value.split('.')[1]))
            const currentTime = Math.floor(Date.now() / 1000)
            return payload.exp <= currentTime
        } catch {
            return true
        }
    }

    const willTokenExpireSoon = (thresholdMinutes = 5) => {
        if (!tokenCookie.value) return true

        try {
            const payload = JSON.parse(atob(tokenCookie.value.split('.')[1]))
            const currentTime = Math.floor(Date.now() / 1000)
            const thresholdSeconds = thresholdMinutes * 60
            return payload.exp <= (currentTime + thresholdSeconds)
        } catch {
            return true
        }
    }

    const isAuthenticated = computed(() => !!tokenCookie.value && !isTokenExpired())

    return {
        token: tokenCookie,
        refreshToken: refreshTokenCookie,
        user: userCookie,
        player: playerCookie,
        login,
        logout,
        refreshAuthToken,
        isTokenExpired,
        willTokenExpireSoon,
        isAuthenticated,
    }
}
