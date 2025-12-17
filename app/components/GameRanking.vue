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
    
    <div v-else-if="rankings && rankings.length > 0" class="rounded-lg shadow-lg border overflow-hidden" style="background-color: var(--card-bg, white); border-color: var(--border-color, #e5e7eb); color: var(--text-color, #1f2937);">
      <!-- Table Header - Mobile: 3 cols, Desktop: 5 cols -->
      <div class="grid grid-cols-3 md:grid-cols-5 gap-1 md:gap-4 px-1 py-2 md:p-4 border-b border-gray-600 font-medium text-sm">
        <div class="text-center">{{ $t('ranking.rank') }}</div>
        <div class="pl-1">{{ $t('ranking.player') }}</div>
        <div class="text-center">{{ $t('ranking.points_chart') }}</div>
        <div class="text-center hidden md:block">{{ $t('ranking.medals') }}</div>
        <div class="text-center hidden md:block">{{ $t('ranking.last_update') }}</div>
      </div>
      
      <!-- Table Body -->
      <div>
        <div 
          v-for="playerGame in rankings" 
          :key="playerGame.player.id"
          class="border-b border-gray-600 hover:bg-gray-700 hover:bg-opacity-30 transition-colors"
          :class="{
            'bg-yellow-500 bg-opacity-20': playerGame.rankPointChart === 1,
            'bg-gray-400 bg-opacity-20': playerGame.rankPointChart === 2,
            'bg-amber-600 bg-opacity-20': playerGame.rankPointChart === 3
          }"
        >
          <div class="grid grid-cols-3 md:grid-cols-5 gap-1 md:gap-4 px-1 py-2 md:p-4 items-center">
            <!-- Rank -->
            <div class="text-center">
              <span 
                class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full text-xs md:text-sm font-bold"
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
            
            <!-- Player -->
            <div class="flex items-center min-w-0 pl-1">
              <PlayerLink :player="playerGame.player" class="truncate" />
            </div>
            
            <!-- Chart Points -->
            <div class="text-center">
              <span class="font-medium text-xs md:text-base">{{ playerGame.pointChart.toLocaleString() }}</span>
            </div>
            
            <!-- Médailles - Hidden on mobile -->
            <div class="text-center hidden md:block">
              <div class="flex items-center justify-center gap-1 text-sm">
                <span class="text-purple-300 font-medium" :title="$t('ranking.medals_platinum')">{{ playerGame.chartRank0 }}</span>
                <span class="text-yellow-400 font-medium" :title="$t('ranking.medals_gold')">{{ playerGame.chartRank1 }}</span>
                <span class="text-gray-400 font-medium" :title="$t('ranking.medals_silver')">{{ playerGame.chartRank2 }}</span>
                <span class="text-orange-400 font-medium" :title="$t('ranking.medals_bronze')">{{ playerGame.chartRank3 }}</span>
                <span class="opacity-60">/{{ playerGame.nbChart }}</span>
              </div>
            </div>
            
            <!-- Last Update - Hidden on mobile -->
            <div class="text-center text-sm opacity-80 hidden md:block">
              {{ new Date(playerGame.lastUpdate).toLocaleDateString('fr-FR') }}
            </div>
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