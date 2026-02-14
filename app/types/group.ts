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
  "@type": "Collection"
  totalItems: number
  member: Group[]
  search: {
    "@type": string
    template: string
    variableRepresentation: string
    mapping: Array<{
      "@type": string
      variable: string
      property: string
      required: boolean
    }>
  }
}