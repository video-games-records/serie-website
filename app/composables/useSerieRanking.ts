import type { PlayerSerieRankingApiResponse } from '@/types'

export const useSerieRanking = (serieId: MaybeRefOrGetter<string | number>, maxRank: number = 100) => {
  const { data: rankingData, pending, error, refresh } = useFetchApi<PlayerSerieRankingApiResponse>(
    computed(() => `/series/${toValue(serieId)}/player-ranking-points?maxRank=${maxRank}`),
    {
      key: computed(() => `serie-ranking-${toValue(serieId)}-${maxRank}`)
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