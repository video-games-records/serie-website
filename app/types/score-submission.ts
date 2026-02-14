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
  libChartId: number
  value: string | null
  parseValue: Array<{
    value: string
  }>
}

export interface PlayerChart {
  '@id': string
  '@type': string
  id: number
  rank: number | null
  pointChart: number
  status: PlayerChartStatus
  platform: string | null
  lastUpdate: string | null
  libs: PlayerChartLib[]
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
  name: string
  slug: string
  isProofVideoOnly: boolean
  libs: ChartLib[]
  playerChart: PlayerChart
  group: Group | null
}

export interface FormDataResponse {
  '@context': string
  '@id': string
  '@type': string
  totalItems: number
  member: ChartFormData[]
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