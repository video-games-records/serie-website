import type { PlayerSerieRankingApiResponse } from '@/types'

export const useSerieRanking = (serieId: string | number, maxRank: number = 100) => {
  const config = useRuntimeConfig()
  
  const { data: rankingData, pending, error, refresh } = useFetch<PlayerSerieRankingApiResponse>(
    `${config.public.apiBaseUrl}/series/${serieId}/player-ranking-points?maxRank=${maxRank}`,
    {
      key: `serie-ranking-${serieId}-${maxRank}`
    }
  )

  const rankings = computed(() => {
    return rankingData.value?.['hydra:member'] || []
  })

  const totalItems = computed(() => {
    return rankingData.value?.['hydra:totalItems'] || 0
  })

  return {
    rankings,
    totalItems,
    pending,
    error,
    refresh
  }
}