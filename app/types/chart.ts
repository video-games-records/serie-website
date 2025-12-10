export interface Chart {
  "@id": string
  "@type": "Chart"
  id: number
  isProofVideoOnly: boolean
  slug: string
  nbPost: number
  isDlc: boolean
  name: string
  libs?: ChartLib[]
}

export interface ChartLib {
  "@id": string
  "@type": "ChartLib"
  id: number
  name: string
  type: ChartType
}

export interface ChartType {
  "@id": string
  "@type": "ChartType"
  id: number
  mask: string
  parseMask: ParseMaskItem[]
}

export interface ParseMaskItem {
  size: number
  suffixe: string
}

import type { Player } from './player'
import type { Platform } from './platform'

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
  player: Player
  proof?: Proof | null
  status: string
  platform?: Platform | null
  libs: string[]
  nbEqual: number
  lastUpdate: string
}

export interface PlayerRankingEntry {
  "0": PlayerChart
  [key: string]: any // for value_X properties
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

export interface ChartsApiResponse {
  "@context": string
  "@id": string
  "@type": "hydra:Collection"
  "hydra:totalItems": number
  "hydra:member": Chart[]
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
