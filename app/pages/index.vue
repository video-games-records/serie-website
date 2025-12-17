<template>
  <div class="container mx-auto px-3 md:px-6 pb-12">
    <!-- Games List -->
    <section class="mb-12">
      <h3 class="text-3xl font-bold mb-8 text-center">Jeux</h3>
      
      <div v-if="isLoading" class="text-center py-8">
        <p>{{ $t('games.loading') }}</p>
      </div>
      
      <div v-else-if="games.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GameCard 
          v-for="game in games" 
          :key="game.id" 
          :game="game" 
        />
      </div>
      
      <div v-else class="text-center py-8">
        <p>{{ $t('games.none_found') }}</p>
      </div>
    </section>

    <!-- Latest Scores and Stats -->
    <section class="mb-12">
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Latest Scores -->
        <LatestScores 
          :latest-scores="latestScores" 
          :is-latest-scores-loading="isLatestScoresLoading" 
        />

        <div class="card p-6">
          <h4 class="text-2xl font-bold mb-4 text-accent">{{ $t('stats.title') }}</h4>
          <div v-if="isSerieLoading" class="text-center py-4">
            <p>{{ $t('stats.loading') }}</p>
          </div>
          <div v-else-if="serie" class="space-y-3">
            <div class="flex justify-between">
              <span>{{ $t('stats.games') }}:</span>
              <span class="font-bold">{{ serie.nbGame || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span>{{ $t('stats.charts') }}:</span>
              <span class="font-bold">{{ serie.nbChart || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span>{{ $t('stats.players') }}:</span>
              <span class="font-bold">{{ serie.nbPlayer || 0 }}</span>
            </div>
          </div>
          <div v-else class="text-center py-4">
            <p>{{ $t('stats.not_available') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Leaderboard Section -->
    <section class="mb-12">
      <h3 class="text-3xl font-bold mb-8 text-center">{{ $t('ranking.title') }}</h3>
      
      <div v-if="isLeaderboardLoading" class="text-center py-8">
        <p>{{ $t('ranking.loading') }}</p>
      </div>
      
      <div v-else-if="leaderboard && leaderboard.length > 0" class="rounded-lg shadow-lg border overflow-hidden" style="background-color: var(--card-bg, white); border-color: var(--border-color, #e5e7eb); color: var(--text-color, #1f2937);">
        <!-- Table Header - Mobile: 3 cols, Desktop: 5 cols -->
        <div class="grid grid-cols-3 md:grid-cols-5 gap-1 md:gap-4 px-1 py-2 md:p-4 border-b border-gray-600 font-medium text-sm">
          <div class="text-center">{{ $t('ranking.rank') }}</div>
          <div class="pl-1">{{ $t('ranking.player') }}</div>
          <div class="text-center">{{ $t('ranking.points') }}</div>
          <div class="text-center hidden md:block">{{ $t('ranking.charts') }}</div>
          <div class="text-center hidden md:block">{{ $t('ranking.proven') }}</div>
        </div>
        
        <!-- Table Body -->
        <div>
          <div 
            v-for="playerSerie in leaderboard" 
            :key="playerSerie.player.id"
            class="border-b border-gray-600 hover:bg-gray-700 hover:bg-opacity-30 transition-colors"
            :class="{
              'bg-yellow-500 bg-opacity-20': playerSerie.rankPointChart === 1,
              'bg-gray-400 bg-opacity-20': playerSerie.rankPointChart === 2,
              'bg-amber-600 bg-opacity-20': playerSerie.rankPointChart === 3
            }"
          >
            <div class="grid grid-cols-3 md:grid-cols-5 gap-1 md:gap-4 px-1 py-2 md:p-4 items-center">
              <!-- Rank -->
              <div class="text-center">
                <span
                  class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full text-xs md:text-sm font-bold" 
                  :class="{
                    'bg-gradient-to-b from-yellow-300 to-yellow-500 text-yellow-900': playerSerie.rankPointChart === 1,
                    'bg-gradient-to-b from-gray-200 to-gray-400 text-gray-800': playerSerie.rankPointChart === 2,
                    'bg-gradient-to-b from-amber-500 to-amber-700 text-amber-100': playerSerie.rankPointChart === 3,
                    'bg-gray-100 text-gray-700': playerSerie.rankPointChart > 3
                  }">
                  {{ playerSerie.rankPointChart }}
                </span>
              </div>
              
              <!-- Player -->
              <div class="flex items-center min-w-0 pl-1">
                <PlayerLink :player="playerSerie.player" class="truncate" />
              </div>
              
              <!-- Points -->
              <div class="text-center font-mono font-bold text-xs md:text-base">
                {{ playerSerie.pointChart.toLocaleString() }}
              </div>
              
              <!-- Charts - Hidden on mobile -->
              <div class="text-center hidden md:block">
                <span class="font-medium">{{ playerSerie.nbChart }}</span>
              </div>
              
              <!-- Proven - Hidden on mobile -->
              <div class="text-center hidden md:block">
                <span class="font-medium">{{ playerSerie.nbChartProven }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="card p-8 text-center">
        <p class="text-lg opacity-80">{{ $t('ranking.no_ranking') }}</p>
      </div>
    </section>

    <!-- Racing Stripes Demo (Forza specific) -->
    <section v-if="currentSerie?.subdomain === 'forza'" class="racing-stripes p-6 card mb-8">
      <h3 class="text-2xl font-bold mb-4">Effet Racing Stripes (Thème Forza)</h3>
      <p>Cette section démontre l'effet de bandes racing spécifique au thème Forza.</p>
    </section>

  </div>
</template>

<script setup lang="ts">
import { useSerieStore } from '@stores/serieStore'
import { storeToRefs } from 'pinia'

const serieStore = useSerieStore()
const { games, serie, latestScores, isLoading, isSerieLoading, isLatestScoresLoading } = storeToRefs(serieStore)
const currentSerie = useState('currentSerie', () => ({ name: 'Mario Kart', id: 2 }))
const { t } = useI18n()

// Get leaderboard for current serie using composable (reactive to serie changes)
const { rankings: leaderboard, pending: isLeaderboardLoading } = useSerieRanking(
  computed(() => currentSerie.value?.id || 2)
)

// SEO
useHead({
  title: computed(() => `${currentSerie.value?.name || 'Mario Kart'} Records - Video Games Records`),
  meta: [
    {
      name: 'description',
      content: computed(() => t('meta.home_description', { series: currentSerie.value?.name || 'Mario Kart' }))
    }
  ]
})
</script>