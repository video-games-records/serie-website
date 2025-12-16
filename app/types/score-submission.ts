export interface ChartType {
  '@id': string
  '@type': string
  id: number
  mask: string
  parseMask: Array<{
    size: number
    suffixe: string
  }>
}

export interface ChartLib {
  '@id': string
  '@type': string
  id: number
  name: string
  type: ChartType
}

export type PlayerChartStatus = 
  | 'none'
  | 'request-pending'
  | 'request-validated'
  | 'request-proof-sent'
  | 'proof-sent'
  | 'proved'
  | 'unproved'

export interface PlayerChartLib {
  '@id': string
  '@type': string
  id: number
  value: string
  libChart: ChartLib
  parseValue: Array<{
    value: string
  }>
  formatValue: string
}

export interface PlayerChart {
  '@id': string
  '@type': string
  id: number
  rank: number
  pointChart: number
  dateInvestigation: string | null
  chart: string
  status: PlayerChartStatus
  platform: string
  libs: PlayerChartLib[]
  player: string
  nbEqual: number
  lastUpdate: string
}

export interface Group {
  '@id': string
  '@type': string
  id: number
  slug: string
  nbChart: number
  nbPost: number
  nbPlayer: number
  isDlc: boolean
  name: string
}

export interface ChartFormData {
  '@id': string
  '@type': string
  id: number
  isProofVideoOnly: boolean
  group?: Group
  libs: ChartLib[]
  playerCharts: PlayerChart[]
  slug: string
  nbPost: number
  isDlc: boolean
  name: string
}

export interface FormDataResponse {
  '@context': string
  '@id': string
  '@type': string
  'hydra:totalItems': number
  'hydra:member': ChartFormData[]
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

export interface SubmissionResponse {
  success: boolean
  message: string
  data?: PlayerChart | {
    message: string
    created: number
    updated: number
    total: number
    ranking_updates_dispatched: number
  } | null
  errors?: Record<string, string[]>
}

export interface ChartSubmissionData {
  chart: ChartFormData
  isModified: boolean
}