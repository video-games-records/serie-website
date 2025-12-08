import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSerieStore = defineStore('serie', () => {
    const games = ref([])
    const isLoaded = ref(false)

    const fetchGames = async (serieId: number) => {
        if (isLoaded.value) return

        const config = useRuntimeConfig()
        games.value = await $fetch(`${config.public.apiBaseUrl}/series/${serieId}/games`)
        isLoaded.value = true
    }

    return {
        games,
        isLoaded,
        fetchGames,
    }
})
