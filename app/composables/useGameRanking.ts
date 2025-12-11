import type { PlayerGameRankingApiResponse } from '@/types'

export const useGameRanking = (gameId: string, maxRank: number = 100) => {
  const { data: rankingData, pending, error, refresh } = useFetchApi<PlayerGameRankingApiResponse>(
    `/games/${gameId}/player-ranking-points?maxRank=${maxRank}`
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