import type { Player } from './player'
import type { Serie } from './serie'

export interface PlayerSerie {
  '@id': string
  '@type': string
  player: Player
  serie: Serie
  pointChart: number
  pointGame: number
  lastUpdate: string
  nbChart: number
  nbChartProven: number
  nbGame: number
  rankMedal: number
  chartRank0: number
  chartRank1: number
  chartRank2: number
  chartRank3: number
  chartRank4: number
  chartRank5: number
  rankPointChart: number
}

export interface PlayerSerieRankingApiResponse {
  '@context': string
  '@id': string
  '@type': string
  'hydra:totalItems': number
  'hydra:member': PlayerSerie[]
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