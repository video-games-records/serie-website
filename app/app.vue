<template>
  <div class="min-h-screen">
    <NuxtRouteAnnouncer />
    
    <!-- Header/Navbar -->
    <header class="navbar text-white mb-8 relative overflow-hidden h-[192px] md:h-[240px] lg:h-[288px]">
      <!-- Banner Background -->
      <div 
        v-if="currentSerie?.subdomain" 
        class="absolute inset-0 bg-no-repeat opacity-40"
        :style="{ 
          backgroundImage: `url(/banners/${currentSerie.subdomain}.webp)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }"
      ></div>
      
      <!-- Dark overlay for better text readability -->
      <div class="absolute inset-0 bg-black bg-opacity-30"></div>
      
      <div class="container mx-auto relative z-10 p-6 flex flex-col justify-center h-[192px] md:h-[240px] lg:h-[288px]">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg">{{ getGameTitle() }} Records</h1>
      </div>
    </header>

    <!-- Markup shared across all pages, ex: NavBar -->
    <NuxtPage />

    <!-- Footer -->
    <footer class="mt-16 p-6 border-t border-gray-300">
      <div class="container mx-auto text-center">
        <p>&copy; 2025 Video Games Records - Propulsé par Nuxt.js avec thèmes dynamiques</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useSerieStore } from '@stores/serieStore'
import { storeToRefs } from 'pinia'

const serieStore = useSerieStore()
const { games, serie, isLoading, isLoaded, isSerieLoading } = storeToRefs(serieStore)
const currentSerie = useState('currentSerie', () => ({ name: 'Mario Kart', id: 2 }))
const config = useRuntimeConfig()

function getGameTitle() {
  return currentSerie.value?.name || 'Mario Kart'
}

// Détection de thème avec config complète
onMounted(async () => {
  console.log('🔧 Theme detection starting')
  console.log('🌐 Host:', window.location.hostname)
  
  // Import config
  const { getSerieFromHostname } = await import('@config/series')
  const detectedSerie = getSerieFromHostname(window.location.hostname)
  
  if (detectedSerie) {
    currentSerie.value = detectedSerie
    serieStore.fetchAll(currentSerie.value.id)
    console.log(`🎮 Serie detected: ${detectedSerie.name} (ID: ${detectedSerie.id})`)
    
    // Load theme CSS
    try {
      await import(`@assets/styles/${detectedSerie.theme}.css`)
      console.log(`✅ Theme CSS loaded: ${detectedSerie.theme}`)
    } catch (error) {
      console.log('❌ Theme CSS failed, using fallback')
      await import('@assets/styles/mario-kart.css')
    }
  }
})
</script>
