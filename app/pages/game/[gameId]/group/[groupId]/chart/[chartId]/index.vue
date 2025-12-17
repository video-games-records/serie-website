<template>
  <NuxtLayout name="game">
    <div v-if="pending || rankingPending" class="text-center py-8">
      <p>Chargement du chart...</p>
    </div>
    
    <div v-else-if="error || rankingError" class="text-center py-8 text-red-500">
      <p>Erreur lors du chargement du chart</p>
    </div>
    
    <div v-else-if="chart">
      <!-- Breadcrumb -->
      <div class="mb-8">
        <nav class="flex items-center gap-2 text-sm">
          <NuxtLink to="/" class="hover:text-accent">Accueil</NuxtLink>
          <span>›</span>
          <NuxtLink :to="`/game/${gameId}`" class="hover:text-accent">
            {{ game?.name || 'Jeu' }}
          </NuxtLink>
          <span>›</span>
          <NuxtLink :to="`/game/${gameId}/group/${groupId}`" class="hover:text-accent">
            {{ group?.name || 'Groupe' }}
          </NuxtLink>
          <span>›</span>
          <span style="color: var(--text-color);">{{ chart.name }}</span>
        </nav>
      </div>
      
      
      <!-- Submit Score Button -->
      <div class="mb-8 text-center">
        <NuxtLink 
          :to="`/game/${gameId}/group/${groupId}/chart/${chartId}/submit`"
          class="inline-flex items-center px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Soumettre un score
        </NuxtLink>
      </div>

      <!-- Ranking Section -->
      <div class="mb-8">
        <h3 class="text-xl font-bold mb-6">Classement ({{ ranking.length }} joueurs)</h3>
        
        <div v-if="ranking && ranking.length > 0" class="card overflow-hidden !p-0">
          <!-- Table Header -->
          <div class="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 px-2 py-2 md:px-3 md:py-3 border-b border-gray-600 font-medium text-sm">
            <div class="text-center">Rang</div>
            <div>Joueur</div>
            <div class="text-center">Score</div>
            <div class="text-center hidden md:block">Plateforme</div>
          </div>
          
          <!-- Table Body -->
          <div>
            <div 
              v-for="entry in ranking" 
              :key="entry[0].id"
              class="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 px-2 py-2 md:px-3 md:py-3 border-b border-gray-600 hover:bg-gray-700 hover:bg-opacity-30 transition-colors items-center"
              :class="{
                'bg-yellow-500 bg-opacity-20': entry[0].rank === 1,
                'bg-gray-400 bg-opacity-20': entry[0].rank === 2,
                'bg-amber-600 bg-opacity-20': entry[0].rank === 3
              }"
            >
              <!-- Rank -->
              <div class="text-center">
                <span
                  class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold" 
                  :class="{
                    'bg-gradient-to-b from-yellow-300 to-yellow-500 text-yellow-900': entry[0].rank === 1,
                    'bg-gradient-to-b from-gray-200 to-gray-400 text-gray-800': entry[0].rank === 2,
                    'bg-gradient-to-b from-amber-500 to-amber-700 text-amber-100': entry[0].rank === 3,
                    'bg-gray-100 text-gray-700': entry[0].rank > 3
                  }">
                  {{ entry[0].rank }}
                </span>
              </div>
              
              <!-- Player -->
              <div class="flex items-center">
                <PlayerLink :player="entry[0].player" />
                <span v-if="entry[0].status === 'proved'" class="ml-2 text-green-500" title="Score prouvé">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
              
              <!-- Time -->
              <div class="text-center font-mono font-bold">
                {{ entry.values[0] }}
              </div>
              
              <!-- Platform -->
              <div class="text-center hidden md:block">
                <span v-if="entry[0].platform" class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {{ entry[0].platform.name }}
                </span>
                <span v-else class="opacity-60">-</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="card p-8 text-center">
          <p class="text-lg opacity-80">Aucun score pour ce chart</p>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-8">
      <p>Chart non trouvé</p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Chart, PlayerRankingResponse } from '@types/chart'
import type { Group } from '@types/group'
import type { Game } from '@types/game'

const route = useRoute()

// Route: /game/[gameId]/group/[groupId]/chart/[chartId]/
const gameId = route.params.gameId as string
const groupId = route.params.groupId as string
const chartId = route.params.chartId as string

// Get game info (will be cached from layout)
const { data: game } = await useFetchApi<Game>(`/games/${gameId}`)

// Get group info (will be cached)
const { data: group } = await useFetchApi<Group>(`/groups/${groupId}`)

// Get chart info
const { data: chart, pending, error } = await useFetchApi<Chart>(`/charts/${chartId}`)

// Get player ranking for this chart
const { data: rankingResponse, pending: rankingPending, error: rankingError } = await useFetchApi<PlayerRankingResponse>(`/charts/${chartId}/player-ranking`)

const ranking = computed(() => {
  return rankingResponse.value?.['hydra:member'] || []
})

const { t } = useI18n()

// SEO
useHead({
  title: computed(() => chart.value ? `${chart.value.name} - ${group.value?.name} - ${game.value?.name} - Records` : 'Chart - Records'),
  meta: [
    {
      name: 'description',
      content: computed(() => game.value ? t('meta.game_description', { game: game.value.name }) : '')
    }
  ]
})
</script>