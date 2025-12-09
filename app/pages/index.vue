<template>
  <div class="container mx-auto px-6 pb-12">
    <!-- Theme Showcase -->
    <section class="mb-12">
      
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
      <h3 class="text-3xl font-bold mb-8 text-center">Jeux</h3>
      
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

  </div>
</template>

<script setup lang="ts">
import { useSerieStore } from '@stores/serieStore'
import { storeToRefs } from 'pinia'

const serieStore = useSerieStore()
const { games, serie, isLoading, isSerieLoading } = storeToRefs(serieStore)
const currentSerie = useState('currentSerie', () => ({ name: 'Mario Kart', id: 2 }))
const { t } = useI18n()

// SEO
useHead({
  title: computed(() => `${currentSerie.value?.name || 'Mario Kart'} Records - Video Games Records`),
  meta: [
    {
      name: 'description',
      content: computed(() => t('meta.home_description', { series: currentSerie.value?.name || 'Mario Kart' }))
    }
  ]
})
</script>