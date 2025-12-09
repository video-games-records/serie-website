import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Game } from '~/types/game'
import type { Serie } from '~/types/serie'
import type { GamesApiResponse } from '~/types/api'

export const useSerieStore = defineStore('serie', () => {
    const games = ref<Game[]>([])
    const serie = ref<Serie | null>(null)
    const isLoaded = ref(false)
    const isLoading = ref(false)
    const isSerieLoaded = ref(false)
    const isSerieLoading = ref(false)

    const fetchSerie = async (serieId: number) => {
        if (isSerieLoaded.value) return

        isSerieLoading.value = true
        try {
            const config = useRuntimeConfig()
            const response = await $fetch<Serie>(`${config.public.apiBaseUrl}/series/${serieId}`)
            serie.value = response
            isSerieLoaded.value = true
        } catch (error) {
            console.error('Error fetching serie:', error)
        } finally {
            isSerieLoading.value = false
        }
    }

    const fetchGames = async (serieId: number) => {
        if (isLoaded.value) return

        isLoading.value = true
        try {
            const config = useRuntimeConfig()
            const response = await $fetch<GamesApiResponse>(`${config.public.apiBaseUrl}/series/${serieId}/games`)
            games.value = response["hydra:member"]
            isLoaded.value = true
        } catch (error) {
            console.error('Error fetching games:', error)
        } finally {
            isLoading.value = false
        }
    }

    const fetchAll = async (serieId: number) => {
        await Promise.all([
            fetchSerie(serieId),
            fetchGames(serieId)
        ])
    }

    return {
        games,
        serie,
        isLoaded,
        isLoading,
        isSerieLoaded,
        isSerieLoading,
        fetchSerie,
        fetchGames,
        fetchAll,
    }
})
