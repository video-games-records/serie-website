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

    <!-- Main Content -->
    <main class="container mx-auto px-6 pb-12">
      <!-- Hero Section -->
      <section class="text-center mb-12">
        <h2 class="text-5xl font-bold mb-6">{{ $t('home.title') }}</h2>
        <p class="text-xl mb-8 opacity-80">{{ $t('home.subtitle') }}</p>
        
        <div class="flex gap-4 justify-center flex-wrap">
          <button class="btn-primary">{{ $t('home.view_records') }}</button>
          <button class="btn-primary">{{ $t('home.add_score') }}</button>
        </div>
      </section>

      <!-- Theme Showcase -->
      <section class="mb-12">
        <h3 class="text-3xl font-bold mb-8 text-center">Démonstration des Thèmes</h3>
        
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
        <h3 class="text-3xl font-bold mb-8 text-center">{{ $t('games.title', { series: currentSerie?.name || 'Mario Kart' }) }}</h3>
        
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

      <!-- Racing Stripes Demo (Forza specific) -->
      <section v-if="currentSerie?.subdomain === 'forza'" class="racing-stripes p-6 card mb-8">
        <h3 class="text-2xl font-bold mb-4">Effet Racing Stripes (Thème Forza)</h3>
        <p>Cette section démontre l'effet de bandes racing spécifique au thème Forza.</p>
      </section>

      <!-- Serie Info -->
      <section class="text-center">
        <div class="card p-8 max-w-2xl mx-auto">
          <h3 class="text-2xl font-bold mb-4">Comment ça fonctionne ?</h3>
          <p class="mb-4">Notre site détecte automatiquement le sous-domaine pour charger la série appropriée :</p>
          <div class="space-y-2 text-left">
            <p><strong>mario-kart.videogamesrecords.local</strong> → Serie Mario Kart (ID: 2)</p>
            <p><strong>forza.videogamesrecords.local</strong> → Serie Forza (ID: 1)</p>
          </div>
          <p class="mt-4 text-sm opacity-70">Serie actuelle : <span class="font-bold">{{ currentSerie?.name || 'Mario Kart' }}</span> (ID: {{ currentSerie?.id || 2 }})</p>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="mt-16 p-6 border-t border-gray-300">
      <div class="container mx-auto text-center">
        <p>&copy; 2024 Video Games Records - Propulsé par Nuxt.js avec thèmes dynamiques</p>
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
