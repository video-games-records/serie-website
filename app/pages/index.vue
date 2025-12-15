<template>
  <div class="container mx-auto px-6 pb-12">
    <!-- Theme Showcase -->
    <section class="mb-12">
      
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Cards -->
        <div class="card p-6">
          <h4 class="text-2xl font-bold mb-4 text-accent">Records du Jour</h4>
          <p class="mb-4">Découvrez les derniers records établis par la communauté.</p>
          <div class="bg-primary text-white p-3 rounded mb-2">Record #1: 1:23.456</div>
          <div class="bg-secondary text-white p-3 rounded mb-2">Record #2: 1:24.123</div>
          <div class="bg-accent text-black p-3 rounded">Record #3: 1:25.789</div>
        </div>

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

    <!-- Leaderboard Section -->
    <section class="mb-12">
      <h3 class="text-3xl font-bold mb-8 text-center">{{ $t('ranking.title') }}</h3>
      
      <div v-if="isLeaderboardLoading" class="text-center py-8">
        <p>{{ $t('ranking.loading') }}</p>
      </div>
      
      <div v-else-if="leaderboard && leaderboard.length > 0" class="card overflow-hidden">
        <!-- Table Header -->
        <div class="grid grid-cols-5 gap-4 p-4 border-b border-gray-600 font-medium text-sm">
          <div class="text-center">{{ $t('ranking.rank') }}</div>
          <div>{{ $t('ranking.player') }}</div>
          <div class="text-center">{{ $t('ranking.points') }}</div>
          <div class="text-center">{{ $t('ranking.charts') }}</div>
          <div class="text-center">{{ $t('ranking.proven') }}</div>
        </div>
        
        <!-- Table Body -->
        <div>
          <div 
            v-for="playerSerie in leaderboard" 
            :key="playerSerie.player.id"
            class="grid grid-cols-5 gap-4 p-4 border-b border-gray-600 hover:bg-gray-700 hover:bg-opacity-30 transition-colors items-center"
            :class="{
              'bg-yellow-500 bg-opacity-20': playerSerie.rankPointChart === 1,
              'bg-gray-400 bg-opacity-20': playerSerie.rankPointChart === 2,
              'bg-amber-600 bg-opacity-20': playerSerie.rankPointChart === 3
            }"
          >
            <!-- Rank -->
            <div class="text-center">
              <span
class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold" 
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
            <div class="flex items-center">
              <PlayerLink :player="playerSerie.player" />
            </div>
            
            <!-- Points -->
            <div class="text-center font-mono font-bold">
              {{ playerSerie.pointChart.toLocaleString() }}
            </div>
            
            <!-- Charts -->
            <div class="text-center">
              <span class="font-medium">{{ playerSerie.nbChart }}</span>
            </div>
            
            <!-- Proven -->
            <div class="text-center">
              <span class="font-medium">{{ playerSerie.nbChartProven }}</span>
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
const { games, serie, isLoading, isSerieLoading } = storeToRefs(serieStore)
const currentSerie = useState('currentSerie', () => ({ name: 'Mario Kart', id: 2 }))
const { t } = useI18n()

// Get leaderboard for current serie using composable
const { rankings: leaderboard, pending: isLeaderboardLoading } = useSerieRanking(currentSerie.value?.id || 2)

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