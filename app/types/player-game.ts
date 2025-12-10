import type { Player } from './player'

export interface PlayerGame {
  '@id': string
  '@type': string
  player: Player
  pointChartWithoutDlc: number
  pointGame: number
  lastUpdate: string
  nbChart: number
  nbChartProven: number
  nbEqual: number
  rankMedal: number
  chartRank0: number
  chartRank1: number
  chartRank2: number
  chartRank3: number
  chartRank4: number
  chartRank5: number
  rankPointChart: number
  pointChart: number
}

export interface PlayerGameRankingApiResponse {
  '@context': string
  '@id': string
  '@type': string
  'hydra:totalItems': number
  'hydra:member': PlayerGame[]
  'hydra:search': {
    '@type': string
    'hydra:template': string
    'hydra:variableRepresentation': string
    'hydra:mapping': Array<{
      '@type': string
      variable: string
      property: string
      required: boolean
    }>
  }
}