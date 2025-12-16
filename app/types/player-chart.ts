import type { Player } from './player'
import type { Platform } from './platform'
import type { Chart } from './chart'
import type { Game } from './game'
import type { Group } from './group'

export interface PlayerChartLib {
  "@id": string
  "@type": "PlayerChartLib"
  id: number
  value: string
  libChart: string
  parseValue: Array<{
    value: string
  }>
  formatValue: string
}

export interface Proof {
  "@id": string
  "@type": "Proof"
  id: number
  picture?: {
    "@type": string
    "@id": string
    id: number
    path: string
  }
  status: string[]
}

export interface PlayerChart {
  "@id": string
  "@type": "PlayerChart"
  id: number
  rank: number
  pointChart: number
  dateInvestigation: string | null
  chart?: Chart & {
    group?: Group & {
      game?: Game & {
        nbTeam?: number
      }
    }
  }
  player: Player | {
    "@id": string
    "@type": "Player" 
    id: number
    pseudo: string
    slug: string
  }
  proof?: Proof | null
  status: string
  platform?: Platform | null
  libs: string[] | PlayerChartLib[]
  nbEqual: number
  lastUpdate: string
}

export interface PlayerRankingEntry {
  "0": PlayerChart
  [key: string]: string | PlayerChart | string[] // for value_X properties
  values: string[]
}

export interface PlayerRankingResponse {
  "@context": string
  "@id": string
  "@type": "hydra:Collection"
  "hydra:totalItems": number
  "hydra:member": PlayerRankingEntry[]
  "hydra:search": {
    "@type": string
    "hydra:template": string
    "hydra:variableRepresentation": string
    "hydra:mapping": Array<{
      "@type": string
      variable: string
      property: string
      required: boolean
    }>
  }
}