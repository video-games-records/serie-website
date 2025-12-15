import type { Country } from './country'
import type { Team } from './team'

export interface Player {
  '@context': string
  '@id': string
  '@type': string
  id: number
  pseudo: string
  avatar: string
  rankProof: number
  rankCountry: number
  nbChartMax: number
  nbChartWithPlatform: number
  nbChartDisabled: number
  lastLogin: string
  nbConnexion: number
  team: Team | null
  status: string
  slug: string
  createdAt: string
  rankCup: number
  gameRank0: number
  gameRank1: number
  gameRank2: number
  gameRank3: number
  rankMedal: number
  chartRank0: number
  chartRank1: number
  chartRank2: number
  chartRank3: number
  rankBadge: number
  pointBadge: number
  rankPointChart: number
  pointChart: number
  rankPointGame: number
  pointGame: number
  averageChartRank: number
  averageGameRank: number
  website?: string | null
  youtube?: string | null
  twitch?: string | null
  discord?: string | null
  presentation?: string | null
  collection?: string | null
  birthDate?: string | null
  gender?: string | null
  country: Country
  displayPersonalInfos: boolean
  nbChart: number
  nbChartProven: number
  nbGame: number
  nbVideo: number
  nbMasterBadge: number
  initial: string
}