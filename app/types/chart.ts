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

export interface Country {
  "@id": string
  "@type": "Country"
  codeIso2: string
  slug: string
  id: number
  name: string
}

export interface Player {
  "@id": string
  "@type": "Player"
  id: number
  pseudo: string
  slug: string
  country: Country
}

export interface Platform {
  "@id": string
  "@type": "Platform"
  id: number
  name: string
  picture: string
  slug: string
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

export interface PlayerSerie {
  "@type": "PlayerSerie"
  "@id": string
  player: Player
  pointChartWithoutDlc: number
  pointGame: number
  rankMedal: number
  chartRank0: number
  chartRank1: number
  chartRank2: number
  chartRank3: number
  chartRank4: number
  chartRank5: number
  rankPointChart: number
  pointChart: number
  nbChart: number
  nbChartProven: number
}

export interface PlayerRankingPointsResponse {
  "@context": string
  "@id": string
  "@type": "hydra:Collection"
  "hydra:totalItems": number
  "hydra:member": PlayerSerie[]
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