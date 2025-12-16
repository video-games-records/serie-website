import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Game } from '~/types/game'
import type { Serie } from '~/types/serie'
import type { GamesApiResponse, LatestScoresApiResponse } from '~/types/api'
import type { PlayerChart } from '~/types/player-chart'

export const useSerieStore = defineStore('serie', () => {
    const games = ref<Game[]>([])
    const serie = ref<Serie | null>(null)
    const latestScores = ref<PlayerChart[]>([])
    const isLoaded = ref(false)
    const isLoading = ref(false)
    const isSerieLoaded = ref(false)
    const isSerieLoading = ref(false)
    const isLatestScoresLoaded = ref(false)
    const isLatestScoresLoading = ref(false)

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

    const fetchLatestScores = async (serieId: number, limit = 3) => {
        if (isLatestScoresLoaded.value) return

        isLatestScoresLoading.value = true
        try {
            const config = useRuntimeConfig()
            const response = await $fetch<LatestScoresApiResponse>(`${config.public.apiBaseUrl}/series/${serieId}/latest-scores?limit=${limit}`)
            latestScores.value = response["hydra:member"]
            isLatestScoresLoaded.value = true
        } catch (error) {
            console.error('Error fetching latest scores:', error)
        } finally {
            isLatestScoresLoading.value = false
        }
    }

    const fetchAll = async (serieId: number) => {
        await Promise.all([
            fetchSerie(serieId),
            fetchGames(serieId),
            fetchLatestScores(serieId)
        ])
    }

    return {
        games,
        serie,
        latestScores,
        isLoaded,
        isLoading,
        isSerieLoaded,
        isSerieLoading,
        isLatestScoresLoaded,
        isLatestScoresLoading,
        fetchSerie,
        fetchGames,
        fetchLatestScores,
        fetchAll,
    }
})
