export interface Serie {
  "@id"?: string
  "@type"?: "Serie"
  id: number
  name: string
  subdomain?: string
  theme?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  // Données de l'API
  status?: "ACTIVE" | "INACTIVE"
  slug?: string
  nbChart?: number
  nbGame?: number
  nbPlayer?: number
  description?: string
}