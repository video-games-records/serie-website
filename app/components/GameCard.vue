<template>
  <div class="card p-6 hover:shadow-lg transition-shadow">
    <div class="mb-4 flex justify-center">
      <img 
        :src="gameImageUrl" 
        :alt="game.name"
        class="w-full max-w-[198px] h-[100px] object-cover rounded-lg"
        @error="onImageError"
      >
    </div>
    
    <h4 class="text-xl font-bold mb-2 text-accent">{{ game.name }}</h4>
    
    <div class="space-y-2 text-sm">
      <div class="flex justify-between">
        <span>Charts:</span>
        <span class="font-bold">{{ game.nbChart }}</span>
      </div>
      <div class="flex justify-between">
        <span>Posts:</span>
        <span class="font-bold">{{ game.nbPost }}</span>
      </div>
      <div class="flex justify-between">
        <span>Joueurs:</span>
        <span class="font-bold">{{ game.nbPlayer }}</span>
      </div>
    </div>
    
    <div class="mt-4">
      <div class="flex flex-wrap gap-1">
        <span 
          v-for="platform in game.platforms" 
          :key="platform.id"
          class="px-2 py-1 bg-secondary text-white text-xs rounded"
        >
          {{ platform.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Game } from '@/types/game'

interface Props {
  game: Game
}

const props = defineProps<Props>()
const config = useRuntimeConfig()

const gameImageUrl = computed(() => {
  return `${config.public.apiBaseUrl.replace('/api', '')}/game/${props.game.id}/picture`
})

const onImageError = (event: Event) => {
  const target = event.target as HTMLElement
  target.style.display = 'none'
}
</script>