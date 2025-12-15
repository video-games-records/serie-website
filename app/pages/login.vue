<template>
  <div class="flex justify-center pt-16 pb-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="card">
        <div class="text-center mb-6">
          <h1 class="text-3xl font-bold text-accent mb-2">{{ getGameTitle() }} Records</h1>
          <h2 class="text-xl font-semibold mb-2">
            {{ $t('auth.login') }}
          </h2>
          <p class="text-sm opacity-80">
            {{ $t('auth.login_subtitle') }}
          </p>
        </div>
          
        <form class="space-y-4" @submit.prevent="handleLogin">
          <div class="space-y-4">
            <div>
              <label for="username" class="block text-sm font-medium mb-2">{{ $t('auth.username') }}</label>
              <input
                id="username"
                v-model="form.username"
                name="username"
                type="text"
                autocomplete="username"
                required
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                :class="{ 'border-red-500': error }"
                :placeholder="$t('auth.username_placeholder')"
              >
            </div>
            <div>
              <label for="password" class="block text-sm font-medium mb-2">{{ $t('auth.password') }}</label>
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                :class="{ 'border-red-500': error }"
                :placeholder="$t('auth.password_placeholder')"
              >
            </div>
          </div>

          <div v-if="error" class="card bg-red-50 border-red-200">
            <div class="text-red-800">
              <h3 class="text-sm font-medium mb-1">
                {{ $t('auth.login_error') }}
              </h3>
              <p class="text-sm">{{ error }}</p>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">{{ $t('auth.logging_in') }}</span>
            <span v-else>{{ $t('auth.login_button') }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login } = useAuth()
const router = useRouter()

// Serie management (same as app.vue)
const currentSerie = useState('currentSerie', () => ({ name: 'Mario Kart', id: 2 }))

function getGameTitle() {
  return currentSerie.value?.name || 'Mario Kart'
}

// Theme detection (same as app.vue)
onMounted(async () => {
  if (import.meta.client && !currentSerie.value?.id) {
    const { getSerieFromHostname } = await import('@config/series')
    const detectedSerie = getSerieFromHostname(window.location.hostname)
    if (detectedSerie) {
      currentSerie.value = detectedSerie
      
      // Load theme CSS
      try {
        await import(`@assets/styles/${detectedSerie.theme}.css`)
      } catch {
        await import('@assets/styles/mario-kart.css')
      }
    }
  }
})

const form = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await login(form.username, form.password)
    await router.push('/')
  } catch (err: unknown) {
    error.value = (err as Error).message || $t('auth.login_error_default')
  } finally {
    loading.value = false
  }
}

// SEO
useHead({
  title: computed(() => `${$t('auth.login')} - ${currentSerie.value?.name || 'Mario Kart'} Records`),
  meta: [
    {
      name: 'description',
      content: computed(() => `${$t('auth.seo_description')} ${currentSerie.value?.name || 'Mario Kart'}. ${$t('auth.seo_description_2')}`)
    },
    {
      name: 'robots',
      content: 'noindex, nofollow'
    },
    {
      property: 'og:title',
      content: computed(() => `${$t('auth.login')} - ${currentSerie.value?.name || 'Mario Kart'} Records`)
    },
    {
      property: 'og:description',
      content: computed(() => `${$t('auth.og_description')} ${currentSerie.value?.name || 'Mario Kart'}`)
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})

definePageMeta({
  layout: false
})
</script>