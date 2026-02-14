import type { PlayerGameRankingApiResponse } from '@/types'

export const useGameRanking = (gameId: string, maxRank: number = 100) => {
  const { data: rankingData, pending, error, refresh } = useFetchApi<PlayerGameRankingApiResponse>(
    `/games/${gameId}/player-ranking?maxRank=${maxRank}`
  )

  const rankings = computed(() => {
    return rankingData.value?.member || []
  })

  const totalItems = computed(() => {
    return rankingData.value?.totalItems || 0
  })

  return {
    rankings,
    totalItems,
    pending,
    error,
    refresh
  }
}