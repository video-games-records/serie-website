<template>
  <div 
    class="rounded-full overflow-hidden flex items-center justify-center"
    :class="sizeClasses"
  >
    <img 
      v-if="player.avatar"
      :src="getAvatarUrl()" 
      :alt="player.pseudo"
      class="w-full h-full object-cover"
      @error="showFallback = true"
      v-show="!showFallback"
    >
    <div 
      v-if="!player.avatar || showFallback"
      class="w-full h-full flex items-center justify-center font-bold text-white"
      :class="fallbackTextClasses"
      :style="{ backgroundColor: getInitialColor() }"
    >
      {{ player.initial?.toUpperCase() || player.pseudo?.charAt(0)?.toUpperCase() || '?' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '@types/player'

interface Props {
  player: Player
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const showFallback = ref(false)

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': return 'w-6 h-6'
    case 'sm': return 'w-8 h-8' 
    case 'md': return 'w-16 h-16'
    case 'lg': return 'w-24 h-24'
    case 'xl': return 'w-32 h-32'
    default: return 'w-16 h-16'
  }
})

const fallbackTextClasses = computed(() => {
  switch (props.size) {
    case 'xs': return 'text-xs'
    case 'sm': return 'text-sm'
    case 'md': return 'text-xl'
    case 'lg': return 'text-2xl'
    case 'xl': return 'text-4xl'
    default: return 'text-xl'
  }
})

function getAvatarUrl() {
  const config = useRuntimeConfig()
  const baseUrl = config?.public?.apiBaseUrl || 'http://backoffice.vgr.local/api'
  return `${baseUrl.replace('/api', '')}/users/${props.player.id}/avatar`
}

function getInitialColor() {
  // Generate a color based on the player's name for consistency
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9CA24', '#6C5CE7',
    '#A0E7E5', '#FFC312', '#C4E538', '#12CBC4', '#FDA7DF'
  ]
  const index = props.player.pseudo.charCodeAt(0) % colors.length
  return colors[index]
}
</script>