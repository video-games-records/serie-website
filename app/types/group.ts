export interface Group {
  "@id": string
  "@type": "Group"
  id: number
  slug: string
  nbChart: number
  nbPost: number
  nbPlayer: number
  isDlc: boolean
  name: string
}

export interface GroupsApiResponse {
  "@context": string
  "@id": string
  "@type": "hydra:Collection"
  "hydra:totalItems": number
  "hydra:member": Group[]
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