import type { Game } from './game'
import type { PlayerChart } from './player-chart'

export interface ApiResponse<T> {
  "@context": string
  "@id": string
  "@type": "hydra:Collection"
  "hydra:totalItems": number
  "hydra:member": T[]
}

export type GamesApiResponse = ApiResponse<Game>
export type LatestScoresApiResponse = ApiResponse<PlayerChart>