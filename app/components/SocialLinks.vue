<template>
  <div v-if="links?.length" class="flex items-center space-x-3">
    <a 
      v-for="link in links" 
      :key="link.url"
      :href="link.url" 
      target="_blank" 
      rel="noopener noreferrer"
      :title="link.name"
      class="social-link"
      :class="getLinkClasses(link.type)"
    >
      <SocialIcon :type="link.type" :size="iconSize" />
      <span v-if="showLabels" class="ml-2">{{ link.name }}</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import type { SerieLink } from '~/types/serie'

interface Props {
  links?: SerieLink[]
  iconSize?: number
  showLabels?: boolean
  variant?: 'header' | 'footer' | 'sidebar'
}

const props = withDefaults(defineProps<Props>(), {
  links: () => [],
  iconSize: 20,
  showLabels: false,
  variant: 'header'
})

const getLinkClasses = (type: string) => {
  const baseClasses = 'transition-colors duration-200'
  
  if (props.variant === 'header') {
    return `${baseClasses} text-white hover:text-gray-300`
  }
  
  if (props.variant === 'footer') {
    return `${baseClasses} text-gray-600 hover:text-gray-800`
  }
  
  // Sidebar ou default
  const typeColors: Record<string, string> = {
    discord: 'text-blue-500 hover:text-blue-600',
    youtube: 'text-red-500 hover:text-red-600',
    website: 'text-gray-600 hover:text-gray-800',
    twitch: 'text-purple-500 hover:text-purple-600',
    twitter: 'text-blue-400 hover:text-blue-500',
    reddit: 'text-orange-500 hover:text-orange-600',
    other: 'text-gray-600 hover:text-gray-800'
  }
  
  return `${baseClasses} ${typeColors[type] || typeColors.other}`
}
</script>

<style scoped>
.social-link {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.375rem;
}

.social-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>