<template>
  <NuxtLink :to="`/player/${player.id}`" class="flex items-center hover:text-blue-600 transition-colors min-w-0 w-full">
    <img 
      v-if="player.country"
      :src="`https://flagicons.lipis.dev/flags/4x3/${player.country.codeIso2.toLowerCase()}.svg`"
      :alt="player.country.name"
      class="w-3 h-2 md:w-5 md:h-4 mr-1 md:mr-2 rounded flex-shrink-0"
    >
    <span class="font-medium text-xs md:text-base truncate">{{ player.pseudo }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Player } from '@/types/player'

interface Props {
  player: Player
}

defineProps<Props>()
</script>