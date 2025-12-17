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
      />
      
      <!-- Dark overlay for better text readability -->
      <div class="absolute inset-0 bg-black bg-opacity-30"/>
      
      <div class="container mx-auto relative z-10 p-6 flex flex-col justify-between h-[192px] md:h-[240px] lg:h-[288px]">
        <!-- Top Navigation -->
        <nav class="flex justify-between items-center">
          <!-- Social Links (Left) -->
          <SocialLinks 
            :links="currentSerie?.links" 
            variant="header" 
            :icon-size="18"
          />
          
          <!-- User Menu (Right) -->
          <div v-if="isAuthenticated" class="flex items-center space-x-3">
            <span class="text-sm">{{ user?.username }}</span>
            <div class="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
              <span class="text-xs font-semibold text-white">{{ getUserInitials() }}</span>
            </div>
            <button class="text-sm hover:text-gray-300" @click="handleLogout">
              Déconnexion
            </button>
          </div>
          <div v-else>
            <NuxtLink 
              to="/login" 
              class="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
            >
              <span>→</span>
              <span>Login</span>
            </NuxtLink>
          </div>
        </nav>
        
        <!-- Title -->
        <div class="flex-1 flex items-center">
          <NuxtLink to="/" class="hover:text-gray-300 transition-colors">
            <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg">{{ getGameTitle() }} Records</h1>
          </NuxtLink>
        </div>
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

const serieStore = useSerieStore()
const currentSerie = useState('currentSerie', () => ({ name: 'Mario Kart', id: 2 }))

// Auth
const { user, isAuthenticated, logout } = useAuth()

function getGameTitle() {
  return currentSerie.value?.name || 'Mario Kart'
}

function getUserInitials() {
  if (!user.value?.username) return '?'
  return user.value.username.charAt(0).toUpperCase()
}

async function handleLogout() {
  logout()
  await navigateTo('/')
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
    } catch {
      console.log('❌ Theme CSS failed, using fallback')
      await import('@assets/styles/mario-kart.css')
    }
  }
})
</script>
