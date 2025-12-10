import type { Country } from './country'
import type { Team } from './team'

export interface Player {
  '@id': string
  '@type': string
  id: number
  pseudo: string
  team: Team | null
  slug: string
  country: Country
}