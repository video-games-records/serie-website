<template>
  <div class="card p-6">
    <h3 class="text-2xl font-bold mb-4 text-accent">{{ $t('home.latestScores') }}</h3>
    
    <div v-if="isLatestScoresLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="h-20 bg-gray-200 rounded-lg" />
      </div>
    </div>

    <div v-else-if="latestScores.length === 0" class="text-gray-500 text-center py-8">
      {{ $t('home.noLatestScores') }}
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="score in latestScores" 
        :key="score.id"
        class="border rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-1">
              <span class="text-sm text-gray-600">{{ score.player.pseudo }}</span>
              <span class="bg-primary text-white px-2 py-1 rounded text-xs">
                #{{ score.rank }}
              </span>
            </div>
            
            <div class="text-lg font-semibold text-accent mb-1">
              {{ score.chart.name }}
            </div>
            
            <div class="text-sm text-gray-600 mb-2">
              {{ score.chart.group.game.name }} - {{ score.chart.group.name }}
            </div>
            
            <div class="flex items-center justify-between">
              <div class="font-mono text-lg font-bold text-primary">
                {{ score.libs[0]?.formatValue || score.libs[0]?.value }}
              </div>
              <div class="text-xs text-gray-500">
                {{ formatDate(score.lastUpdate) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  latestScores: Array<{
    id: number
    rank: number
    player: {
      pseudo: string
    }
    chart: {
      name: string
      group: {
        name: string
        game: {
          name: string
        }
      }
    }
    libs: Array<{
      value: string
      formatValue?: string
    }>
    lastUpdate: string
  }>
  isLatestScoresLoading: boolean
}

defineProps<Props>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>