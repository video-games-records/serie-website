<template>
  <NuxtLink :to="`/player/${player.id}`" class="flex items-center hover:text-blue-600 transition-colors">
    <img 
      v-if="player.country"
      :src="`https://flagicons.lipis.dev/flags/4x3/${player.country.codeIso2.toLowerCase()}.svg`"
      :alt="player.country.name"
      class="w-5 h-4 mr-2 rounded"
    >
    <span class="font-medium">{{ player.pseudo }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Player } from '@/types/player'

interface Props {
  player: Player
}

defineProps<Props>()
</script>