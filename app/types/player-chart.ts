export interface PlayerChartRanking {
  "@id": string
  "@type": "PlayerChart"
  id: number
  rank: number
  pointChart: number
  player: {
    id: number
    pseudo: string
    slug: string
  }
  platform: {
    id: number
    name: string
    slug: string
  } | null
  values: Array<{
    libChartName: string | null
    value: string
  }>
}

export interface PlayerRankingResponse {
  "@context": string
  "@id": string
  "@type": "Collection"
  totalItems: number
  member: PlayerChartRanking[]
}
