<template>
  <NuxtLayout name="game">
    <div v-if="pending" class="text-center py-8">
      <p>Chargement du groupe...</p>
    </div>
    
    <div v-else-if="error" class="text-center py-8 text-red-500">
      <p>Erreur lors du chargement du groupe: {{ error }}</p>
    </div>
    
    <div v-else-if="group">
      <!-- Breadcrumb -->
      <div class="mb-8">
        <nav class="flex items-center gap-2 text-sm">
          <NuxtLink to="/" class="hover:text-accent">Accueil</NuxtLink>
          <span>›</span>
          <NuxtLink :to="`/game/${gameId}`" class="hover:text-accent">
            {{ game?.name || 'Jeu' }}
          </NuxtLink>
          <span>›</span>
          <span style="color: var(--text-color);">{{ group.name }}</span>
        </nav>
      </div>
      
      
      <!-- Charts Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-6">Charts</h2>
        
        <div v-if="charts && charts.length > 0" class="rounded-lg shadow-lg border overflow-hidden" style="background-color: var(--card-bg, white); border-color: var(--border-color, #e5e7eb); color: var(--text-color, #1f2937);">
          <!-- Chart List - Simple layout -->
          <div>
            <NuxtLink 
              v-for="chart in charts" 
              :key="chart.id"
              :to="`/game/${gameId}/group/${groupId}/chart/${chart.id}`"
              class="flex items-center justify-between px-3 py-3 md:px-4 md:py-4 border-b hover:bg-gray-700 hover:bg-opacity-10 transition-colors cursor-pointer"
              style="border-color: var(--border-color); color: var(--text-color);"
            >
              <!-- Chart Name with icon -->
              <div class="flex items-center min-w-0 flex-1">
                <div class="w-5 h-5 md:w-6 md:h-6 bg-primary bg-opacity-20 rounded mr-2 md:mr-3 flex items-center justify-center flex-shrink-0">
                  <svg class="w-3 h-3 md:w-4 md:h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clip-rule="evenodd" />
                  </svg>
                </div>
                <span class="font-medium text-sm md:text-base truncate">{{ chart.name }}</span>
              </div>
              
              <!-- Posts count + arrow -->
              <div class="flex items-center gap-2 md:gap-3 flex-shrink-0">
                <span class="text-xs md:text-sm bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                  {{ chart.nbPost }}
                </span>
                <svg class="w-4 h-4 md:w-5 md:h-5 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </NuxtLink>
          </div>
        </div>
        
        <div v-else class="card p-6 text-center">
          <p class="text-lg opacity-80">Aucun chart trouvé pour ce groupe</p>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-8">
      <p>Groupe non trouvé</p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Group } from '@types/group'
import type { Game } from '@types/game'
import type { ChartsApiResponse } from '@types/chart'

const route = useRoute()

// Route: /game/[gameId]/group/[groupId]/
const gameId = route.params.gameId as string
const groupId = route.params.groupId as string

// Get game info (will be cached from layout)
const { data: game } = await useFetchApi<Game>(`/games/${gameId}`)

// Get group info  
const { data: group, pending, error } = await useFetchApi<Group>(`/groups/${groupId}`)

// Get charts for this group
const { data: chartsResponse } = await useFetchApi<ChartsApiResponse>(`/groups/${groupId}/charts`)

const charts = computed(() => {
  return chartsResponse.value?.['hydra:member'] || []
})

const { t } = useI18n()

// SEO
useHead({
  title: computed(() => group.value ? `${group.value.name} - ${game.value?.name} - Records` : 'Groupe - Records'),
  meta: [
    {
      name: 'description',
      content: computed(() => game.value ? t('meta.game_description', { game: game.value.name }) : '')
    }
  ]
})
</script>