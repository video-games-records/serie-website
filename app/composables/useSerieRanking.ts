import type { PlayerSerieRankingApiResponse } from '@/types'

export const useSerieRanking = (serieId: string | number, maxRank: number = 100) => {
  const { data: rankingData, pending, error, refresh } = useFetchApi<PlayerSerieRankingApiResponse>(
    `/series/${serieId}/player-ranking-points?maxRank=${maxRank}`,
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