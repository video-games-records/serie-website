<template>
  <div class="container mx-auto px-6 py-8">
    <!-- Loading State -->
    <div v-if="pending" class="text-center py-8">
      <p>{{ $t('player.loading') }}</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8 text-red-500">
      <p>{{ $t('player.error') }}: {{ error }}</p>
    </div>
    
    <!-- Player Profile -->
    <div v-else-if="player">
      <!-- Header Section -->
      <div class="card mb-8 p-6">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <PlayerAvatar :player="player" size="xl" />
          </div>
          
          <!-- Player Info -->
          <div class="flex-1">
            <div class="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 class="text-4xl font-bold" style="color: var(--text-color);">{{ player?.pseudo }}</h1>
              <div v-if="player.team" class="flex items-center gap-2">
                <span class="text-sm bg-secondary text-white px-2 py-1 rounded">{{ player.team.tag }}</span>
                <span class="text-sm opacity-80">{{ player.team.libTeam }}</span>
              </div>
            </div>
            
            <!-- Status and Country -->
            <div class="flex flex-wrap gap-4 mb-4">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium">{{ $t('player.status') }}:</span>
                <span class="px-2 py-1 rounded text-xs font-medium bg-primary text-white">{{ player.status }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium">{{ $t('player.country') }}:</span>
                <span class="text-sm">{{ player.country.name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium">{{ $t('player.member_since') }}:</span>
                <span class="text-sm">{{ formatDate(player.createdAt) }}</span>
              </div>
            </div>

            <!-- Social Links -->
            <div v-if="hasSocialLinks" class="flex flex-wrap gap-3">
              <a v-if="player.website" :href="player.website" target="_blank" class="social-link">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                Website
              </a>
              <a v-if="player.youtube" :href="player.youtube" target="_blank" class="social-link">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube
              </a>
              <a v-if="player.twitch" :href="player.twitch" target="_blank" class="social-link">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
                Twitch
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div v-if="playerSerie" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div class="stat-card">
          <div class="text-2xl font-bold text-primary">{{ playerSerie.rankPointChart }}</div>
          <div class="text-sm opacity-80">{{ $t('player.rank_chart') }}</div>
        </div>
        <div class="stat-card">
          <div class="text-2xl font-bold text-secondary">{{ playerSerie.rankMedal }}</div>
          <div class="text-sm opacity-80">{{ $t('player.rank_medal') }}</div>
        </div>
        <div class="stat-card">
          <div class="text-2xl font-bold text-accent">{{ formatNumber(playerSerie.pointChart) }}</div>
          <div class="text-sm opacity-80">{{ $t('player.points_chart') }}</div>
        </div>
        <div class="stat-card">
          <div class="text-2xl font-bold text-primary">{{ formatNumber(playerSerie.pointGame) }}</div>
          <div class="text-sm opacity-80">{{ $t('player.points_game') }}</div>
        </div>
        <div class="stat-card">
          <div class="text-2xl font-bold text-secondary">{{ playerSerie.nbChart }}</div>
          <div class="text-sm opacity-80">{{ $t('player.nb_charts') }}</div>
        </div>
        <div class="stat-card">
          <div class="text-2xl font-bold text-accent">{{ playerSerie.nbGame }}</div>
          <div class="text-sm opacity-70">{{ $t('player.nb_games') }}</div>
        </div>
      </div>

      <!-- Medals Charts Only -->
      <div v-if="playerSerie" class="card p-6 mb-8">
        <h3 class="text-xl font-bold mb-4">{{ $t('player.medals') }}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="medal-item">
            <span class="medal platinum">🏆</span>
            <div>
              <div class="font-bold">{{ playerSerie.chartRank0 }}</div>
              <div class="text-sm opacity-80">{{ $t('player.platinum_charts') }}</div>
            </div>
          </div>
          <div class="medal-item">
            <span class="medal gold">🥇</span>
            <div>
              <div class="font-bold">{{ playerSerie.chartRank1 }}</div>
              <div class="text-sm opacity-80">{{ $t('player.gold_charts') }}</div>
            </div>
          </div>
          <div class="medal-item">
            <span class="medal silver">🥈</span>
            <div>
              <div class="font-bold">{{ playerSerie.chartRank2 }}</div>
              <div class="text-sm opacity-80">{{ $t('player.silver_charts') }}</div>
            </div>
          </div>
          <div class="medal-item">
            <span class="medal bronze">🥉</span>
            <div>
              <div class="font-bold">{{ playerSerie.chartRank3 }}</div>
              <div class="text-sm opacity-80">{{ $t('player.bronze_charts') }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Presentation -->
      <div v-if="player.presentation && player.displayPersonalInfos" class="card p-6 mb-8">
        <h3 class="text-xl font-bold mb-4">{{ $t('player.presentation') }}</h3>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="prose max-w-none" v-html="player.presentation"/>
      </div>

      <!-- Collection -->
      <div v-if="player.collection && player.displayPersonalInfos" class="card p-6">
        <h3 class="text-xl font-bold mb-4">{{ $t('player.collection') }}</h3>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="prose max-w-none" v-html="player.collection"/>
      </div>
    </div>
    
    <!-- Player not found -->
    <div v-else class="text-center py-8">
      <p>{{ $t('player.not_found') }}</p>
      <NuxtLink to="/" class="btn-primary inline-block mt-4">{{ $t('player.back_home') }}</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '~/types/player'
import type { PlayerSerieRankingApiResponse } from '~/types/player-serie'

const route = useRoute()
const playerId = route.params.id as string

// Serie management (shared state, managed by app.vue)
const currentSerie = useState('currentSerie', () => ({ name: 'Mario Kart', id: 2 }))

// Fetch player data
const { data: player, pending, error } = await useFetchApi<Player>(`/players/${playerId}`)

// Wait for serie detection before fetching serie stats
const playerSerieData = ref<PlayerSerieRankingApiResponse | null>(null)
const playerSerie = computed(() => playerSerieData.value?.['hydra:member']?.[0])

// Watch for serie changes and fetch data
watch(() => currentSerie.value.id, async (newSerieId) => {
  if (newSerieId) {
    const { data } = await useFetchApi<PlayerSerieRankingApiResponse>(`/player_series?player=${playerId}&serie=${newSerieId}`)
    playerSerieData.value = data.value
  }
}, { immediate: true })

// Helper functions
const { formatDate, formatNumber } = useFormatting()

const hasSocialLinks = computed(() => {
  return player.value?.website || player.value?.youtube || player.value?.twitch || player.value?.discord
})

// SEO
useHead({
  title: computed(() => player.value ? `${player.value.pseudo} - Profil Joueur` : 'Profil Joueur'),
  meta: [
    {
      name: 'description',
      content: computed(() => player.value && playerSerie.value ? 
        `Profil de ${player.value.pseudo} sur VideoGamesRecords. Rang: ${playerSerie.value.rankPointChart}, Points: ${formatNumber(playerSerie.value.pointChart)}, Records: ${playerSerie.value.nbChart}` :
        'Profil joueur VideoGamesRecords'
      )
    },
    {
      property: 'og:title',
      content: computed(() => player.value ? `${player.value.pseudo} - Profil Joueur` : 'Profil Joueur')
    },
    {
      property: 'og:description',
      content: computed(() => player.value ? 
        `Découvrez le profil de ${player.value.pseudo} avec ses statistiques, records et classements.` :
        'Profil joueur VideoGamesRecords'
      )
    },
    {
      property: 'og:type',
      content: 'profile'
    }
  ]
})

// Use default app.vue layout which handles theme loading
</script>

<style scoped>
/* Base styles using CSS variables from themes */
.card {
  @apply rounded-lg shadow-lg border p-6;
  background-color: var(--card-bg, white);
  border-color: var(--border-color, #e5e7eb);
  color: var(--text-color, #1f2937);
}

.btn-primary {
  @apply inline-block px-6 py-3 font-semibold rounded-lg cursor-pointer transition-all duration-300;
  background-color: var(--primary-color, #3b82f6);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.stat-card {
  @apply rounded-lg shadow-lg border p-4 text-center;
  background-color: var(--card-bg, white);
  border-color: var(--border-color, #e5e7eb);
  color: var(--text-color, #1f2937);
}

.medal-item {
  @apply flex items-center gap-3;
}

.prose {
  color: var(--text-color, #1f2937);
  max-width: none;
}

.prose p {
  margin-bottom: 1rem;
  color: var(--text-color, #1f2937);
}

.prose ul {
  list-style-type: disc;
  list-style-position: inside;
  margin-bottom: 1rem;
  color: var(--text-color, #1f2937);
}

.prose li {
  color: var(--text-color, #1f2937);
}

.prose a {
  color: var(--accent-color, #3b82f6);
  text-decoration: underline;
}

.prose a:hover {
  opacity: 0.8;
}

.medal {
  @apply text-2xl w-8 h-8 flex items-center justify-center;
}

.social-link {
  @apply flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium;
  background-color: var(--card-bg, #f3f4f6);
  color: var(--text-color, #374151);
  border: 1px solid var(--border-color, #e5e7eb);
}

.social-link:hover {
  opacity: 0.8;
}
</style>