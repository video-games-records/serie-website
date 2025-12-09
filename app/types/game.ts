import type { Platform } from './platform'

export interface Game {
  "@id": string
  "@type": "Game"
  id: number
  downloadUrl: string | null
  status: "ACTIVE" | "INACTIVE"
  publishedAt: string
  platforms: Platform[]
  slug: string
  nbChart: number
  nbPost: number
  nbPlayer: number
  picture: string
  isRank: boolean
  lastUpdate: string | null
  name: string
  releaseDate: string | null
}