<template>
  <div class="mb-8">
    <h2 class="text-2xl font-bold mb-6">{{ $t('ranking.title') }}</h2>
    
    <div v-if="pending" class="card p-6 text-center">
      <div class="animate-pulse">
        <div class="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-2"/>
        <div class="h-4 bg-gray-700 rounded w-1/2 mx-auto"/>
      </div>
    </div>
    
    <div v-else-if="error" class="card p-6 text-center text-red-400">
      <p>{{ $t('ranking.error') }}</p>
      <button class="mt-2 px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark" @click="refresh">
        {{ $t('ranking.retry') }}
      </button>
    </div>
    
    <div v-else-if="rankings && rankings.length > 0" class="card overflow-hidden">
      <!-- Table Header -->
      <div class="grid grid-cols-5 gap-4 p-4 border-b border-gray-600 font-medium text-sm">
        <div class="text-center">{{ $t('ranking.rank') }}</div>
        <div>{{ $t('ranking.player') }}</div>
        <div class="text-center">{{ $t('ranking.points_chart') }}</div>
        <div class="text-center">{{ $t('ranking.medals') }}</div>
        <div class="text-center">{{ $t('ranking.last_update') }}</div>
      </div>
      
      <!-- Table Body -->
      <div>
        <div 
          v-for="playerGame in rankings" 
          :key="playerGame.player.id"
          class="grid grid-cols-5 gap-4 p-4 border-b border-gray-600 hover:bg-gray-700 hover:bg-opacity-30 transition-colors items-center"
          :class="{
            'bg-yellow-500 bg-opacity-20': playerGame.rankPointChart === 1,
            'bg-gray-400 bg-opacity-20': playerGame.rankPointChart === 2,
            'bg-amber-600 bg-opacity-20': playerGame.rankPointChart === 3
          }"
        >
          <!-- Rank -->
          <div class="text-center">
            <div class="flex items-center justify-center">
              <span 
                class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
                :class="{
                  'bg-gradient-to-b from-yellow-300 to-yellow-500 text-yellow-900': playerGame.rankPointChart === 1,
                  'bg-gradient-to-b from-gray-200 to-gray-400 text-gray-800': playerGame.rankPointChart === 2,
                  'bg-gradient-to-b from-amber-500 to-amber-700 text-amber-100': playerGame.rankPointChart === 3,
                  'bg-gray-100 text-gray-700': playerGame.rankPointChart > 3
                }"
              >
                {{ playerGame.rankPointChart }}
              </span>
            </div>
          </div>
          
          <!-- Player -->
          <div class="flex items-center">
            <PlayerLink :player="playerGame.player" />
          </div>
          
          <!-- Chart Points -->
          <div class="text-center">
            <span class="font-medium">{{ playerGame.pointChart.toLocaleString() }}</span>
          </div>
          
          <!-- Médailles -->
          <div class="text-center">
            <div class="flex items-center justify-center gap-1 text-sm">
              <span class="text-purple-300 font-medium" :title="$t('ranking.medals_platinum')">{{ playerGame.chartRank0 }}</span>
              <span class="text-yellow-400 font-medium" :title="$t('ranking.medals_gold')">{{ playerGame.chartRank1 }}</span>
              <span class="text-gray-400 font-medium" :title="$t('ranking.medals_silver')">{{ playerGame.chartRank2 }}</span>
              <span class="text-orange-400 font-medium" :title="$t('ranking.medals_bronze')">{{ playerGame.chartRank3 }}</span>
              <span class="opacity-60">/{{ playerGame.nbChart }}</span>
            </div>
          </div>
          
          <!-- Last Update -->
          <div class="text-center text-sm opacity-80">
            {{ new Date(playerGame.lastUpdate).toLocaleDateString('fr-FR') }}
          </div>
        </div>
      </div>
      
      <!-- Footer with total count -->
      <div v-if="totalItems > rankings.length" class="p-4 border-t border-gray-600 text-center text-sm opacity-80">
        {{ $t('ranking.displaying', { count: rankings.length, total: totalItems }) }}
      </div>
    </div>
    
    <div v-else class="card p-6 text-center">
      <p class="text-lg opacity-80">{{ $t('ranking.no_ranking_game') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  gameId: string
}

const props = defineProps<Props>()

const { rankings, totalItems, pending, error, refresh } = useGameRanking(props.gameId)
</script>