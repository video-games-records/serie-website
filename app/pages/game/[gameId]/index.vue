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
      
      <div v-if="groups && groups.length > 0" class="card overflow-hidden">
        <!-- Table Header -->
        <div class="grid grid-cols-4 gap-4 p-4 border-b font-medium text-sm" style="border-color: var(--border-color); color: var(--text-color);">
          <div>{{ $t('game.group') }}</div>
          <div class="text-center">{{ $t('game.records') }}</div>
          <div class="text-center">{{ $t('game.players') }}</div>
          <div class="text-center">{{ $t('game.scores') }}</div>
        </div>
        
        <!-- Table Body -->
        <div>
          <NuxtLink 
            v-for="groupItem in groups" 
            :key="groupItem.id"
            :to="`/game/${gameId}/group/${groupItem.id}`"
            class="grid grid-cols-4 gap-4 p-4 border-b hover:bg-opacity-10 transition-colors cursor-pointer items-center"
            style="border-color: var(--border-color); color: var(--text-color);"
          >
            <!-- Group Name -->
            <div class="flex items-center">
              <div class="w-6 h-6 bg-accent bg-opacity-20 rounded mr-3 flex items-center justify-center">
                <svg class="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                </svg>
              </div>
              <span>{{ groupItem.name }}</span>
            </div>
            
            <!-- Records -->
            <div class="text-center">
              <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800">
                {{ groupItem.nbChart }}
              </span>
            </div>
            
            <!-- Players -->
            <div class="text-center">
              <span class="inline-flex items-center opacity-80">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM5 8a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V8z" />
                </svg>
                {{ groupItem.nbPlayer }}
              </span>
            </div>
            
            <!-- Scores -->
            <div class="text-center flex items-center justify-between">
              <span class="font-medium">{{ groupItem.nbPost }}</span>
              <svg class="w-5 h-5 opacity-60" fill="currentColor" viewBox="0 0 20 20">
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
useHead({
  title: computed(() => game.value ? `${game.value.name} - Records` : 'Jeu - Records'),
  meta: [
    {
      name: 'description',
      content: computed(() => game.value ? t('meta.game_description', { game: game.value.name }) : '')
    }
  ]
})
</script>