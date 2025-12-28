<template>
  <NuxtLayout name="game">
    <!-- Breadcrumb -->
    <div class="mb-8">
      <nav class="flex items-center gap-2 text-sm">
        <NuxtLink to="/" class="hover:text-accent">Accueil</NuxtLink>
        <span>›</span>
        <span style="color: var(--text-color);">{{ game?.name || 'Jeu' }}</span>
      </nav>
    </div>

    <!-- Groups Section -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-6">{{ $t('game.groups_title') }}</h2>
      
      <div v-if="groups && groups.length > 0" class="rounded-lg shadow-lg border overflow-hidden" style="background-color: var(--card-bg, white); border-color: var(--border-color, #e5e7eb); color: var(--text-color, #1f2937);">
        <!-- Table Body - Only group names on mobile -->
        <div>
          <NuxtLink 
            v-for="groupItem in groups" 
            :key="groupItem.id"
            :to="`/game/${gameId}/group/${groupItem.id}`"
            class="flex items-center justify-between px-3 py-3 md:px-4 md:py-4 border-b hover:bg-gray-700 hover:bg-opacity-10 transition-colors cursor-pointer"
            style="border-color: var(--border-color); color: var(--text-color);"
          >
            <!-- Group Name with icon -->
            <div class="flex items-center min-w-0 flex-1">
              <div class="w-5 h-5 md:w-6 md:h-6 bg-accent bg-opacity-20 rounded mr-2 md:mr-3 flex items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3 md:w-4 md:h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                </svg>
              </div>
              <span class="font-medium text-sm md:text-base truncate">{{ groupItem.name }}</span>
            </div>
            
            <!-- Charts + Posts count + arrow -->
            <div class="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <span class="text-xs md:text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded font-medium">
                {{ groupItem.nbChart }}
              </span>
              <span class="text-xs md:text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                {{ groupItem.nbPost }}
              </span>
              <svg class="w-4 h-4 md:w-5 md:h-5 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </NuxtLink>
        </div>
      </div>
      
      <div v-else class="card p-6 text-center">
        <p class="text-lg opacity-80">{{ $t('game.no_groups') }}</p>
      </div>
    </div>

    <!-- Player Ranking Section -->
    <GameRanking :game-id="gameId" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { GroupsApiResponse, Game  } from '@types'

const route = useRoute()

// Get gameId from route params directly
const gameId = route.params.gameId as string

// Get game info (will be cached from layout)
const { data: game } = await useFetchApi<Game>(`/games/${gameId}`)

// Get groups for this game
const { data: groupsResponse } = await useFetchApi<GroupsApiResponse>(`/games/${gameId}/groups`)

const groups = computed(() => {
  return groupsResponse.value?.['hydra:member'] || []
})

const { t } = useI18n()

// SEO
watchEffect(() => {
  if (game.value) {
    const gameData = game.value as Game
    
    useSeoMeta({
      title: `${gameData.name} - Records`,
      description: t('meta.game_description', { game: gameData.name }),
      robots: 'index, follow',
      ogTitle: `${gameData.name} - Records`,
      ogDescription: t('meta.game_description', { game: gameData.name }),
      ogType: 'website'
    })
  }
})
</script>