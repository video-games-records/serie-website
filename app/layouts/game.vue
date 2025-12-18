<template>
  <div class="container mx-auto px-6 py-8">
    <div v-if="pending" class="text-center py-8">
      <p>{{ $t('game.loading') }}</p>
    </div>
    
    <div v-else-if="error" class="text-center py-8 text-red-500">
      <p>{{ $t('game.error') }}: {{ error }}</p>
    </div>
    
    <div v-else-if="game">
      <!-- Game Header -->
      <div class="mb-8">
        <div class="card p-6">
          <div class="flex flex-col md:flex-row gap-6">
            <div v-if="game.picture" class="flex-shrink-0">
              <img 
                :src="getGameImageUrl(game.id)" 
                :alt="game.name"
                class="w-full md:w-64 object-contain rounded-lg"
              >
            </div>
            
            <div class="flex-1">
              <NuxtLink :to="`/game/${gameId}`" class="text-3xl font-bold text-accent mb-4 hover:text-accent-dark transition-colors cursor-pointer block">
                {{ game.name }}
              </NuxtLink>
              
              <!-- Stats Cards -->
              <div class="grid grid-cols-3 gap-4 mb-4">
                <div class="card p-4 text-center">
                  <div class="text-2xl font-bold text-primary mb-1">{{ game.nbChart || 0 }}</div>
                  <div class="text-sm opacity-80">{{ $t('stats.charts') }}</div>
                </div>
                <div class="card p-4 text-center">
                  <div class="text-2xl font-bold text-secondary">{{ game.nbPlayer || 0 }}</div>
                  <div class="text-sm opacity-70">{{ $t('stats.players') }}</div>
                </div>
                <div class="card p-4 text-center">
                  <div class="text-2xl font-bold text-accent mb-1">{{ game.nbPost || 0 }}</div>
                  <div class="text-sm opacity-80">{{ $t('stats.posts') }}</div>
                </div>
              </div>
              
              <div v-if="game.releaseDate" class="text-sm opacity-80 mb-4">
                <strong>{{ $t('game.release_date') }}:</strong> {{ formatDate(game.releaseDate) }}
              </div>
              
              <div v-if="game.platforms && game.platforms.length" class="mb-4">
                <strong class="block mb-2">{{ $t('game.platforms') }}:</strong>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="platform in game.platforms" 
                    :key="platform.id"
                    class="px-3 py-1 bg-secondary text-sm rounded-full"
                  >
                    {{ platform.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Page Content -->
      <slot />
    </div>
    
    <div v-else class="text-center py-8">
      <p>{{ $t('game.not_found') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Game } from '@types/game'

const route = useRoute()

// Extract gameId from route params
const gameId = computed(() => {
  // For routes like /game/[gameId] or /game/[gameId]/group/[groupId]
  return route.params.gameId as string
})

// Get current serie from state (already initialized in app.vue)
const currentSerie = useState('currentSerie', () => ({ name: 'Mario Kart', id: 2 }))

// Get game info with validation
const { data: game, pending, error } = await useFetchApi<Game>(`/games/${gameId.value}`, {
  key: `game-${gameId.value}-${currentSerie.value?.id}`, // Add serie to cache key
  transform: (game: Game) => {
    // Validate serie: game must belong to current serie
    if (currentSerie.value?.id) {
      if (!game.serie || game.serie.id !== currentSerie.value.id) {
        throw createError({ statusCode: 404, statusMessage: 'Game not found in current serie' })
      }
    }
    return game
  }
})

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Helper function to get game image URL
const getGameImageUrl = (gameId: number) => {
  const config = useRuntimeConfig()
  const baseUrl = config?.public?.apiBaseUrl || 'http://backoffice.vgr.local/api'
  return `${baseUrl.replace('/api', '')}/game/${gameId}/picture`
}

// SEO
useHead({
  title: computed(() => game.value ? `${game.value.name} - Records` : 'Jeu - Records')
})
</script>