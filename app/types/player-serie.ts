export interface PlayerSerieRanking {
  '@id': string
  '@type': 'PlayerRanking'
  id: number
  rank: number
  pointChart: number
  nbChart: number
  nbChartProven: number
  platinum: number
  gold: number
  silver: number
  bronze: number
  player: {
    id: number
    pseudo: string
    slug: string
    country: {
      id: number
      name: string
      codeIso2: string
    } | null
    team: {
      id: number
      name: string
      slug: string
    } | null
  }
}

export interface PlayerSerieRankingApiResponse {
  '@context': string
  '@id': string
  '@type': string
  totalItems: number
  member: PlayerSerieRanking[]
}

export interface PlayerSerieDTO {
  '@context': string
  '@id': string
  '@type': string
  platinum: number
  gold: number
  silver: number
  bronze: number
  rank: number
  pointChart: number
  nbChart: number
  nbChartProven: number
  nbGame: number
}
