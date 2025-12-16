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
