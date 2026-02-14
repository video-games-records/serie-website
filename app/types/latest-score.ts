export interface LatestScore {
  "@id": string
  "@type": "LatestScore"
  id: number
  rank: number
  pointChart: number
  player: {
    id: number
    pseudo: string
    slug: string
  }
  platform: {
    id: number
    name: string
    slug: string
  }
  values: Array<{
    libChartName: string | null
    value: string
  }>
  chart: {
    id: number
    name: string
    slug: string
    group: {
      id: number
      name: string
      slug: string
      game: {
        id: number
        name: string
        slug: string
      }
    }
  }
  lastUpdate: string
}
