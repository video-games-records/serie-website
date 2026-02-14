import type { Game } from './game'
import type { LatestScore } from './latest-score'

export interface ApiResponse<T> {
  "@context": string
  "@id": string
  "@type": "Collection"
  totalItems: number
  member: T[]
}

export type GamesApiResponse = ApiResponse<Game>
export type LatestScoresApiResponse = ApiResponse<LatestScore>