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
        userCookie.value = response.user
        playerCookie.value = response.player
    }

    const logout = () => {
        tokenCookie.value = null
        userCookie.value = null
        playerCookie.value = null
    }


    const isAuthenticated = computed(() => !!tokenCookie.value)

    return {
        token: tokenCookie,
        user: userCookie,
        player: playerCookie,
        login,
        logout,
        isAuthenticated,
    }
}
