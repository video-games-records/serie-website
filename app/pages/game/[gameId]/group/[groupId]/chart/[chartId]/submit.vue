<template>
  <NuxtLayout name="game">
    <!-- Breadcrumb -->
    <div v-if="!isLoading && !error && gameData && chartData && groupData" class="mb-8">
      <nav class="flex items-center gap-2 text-sm">
        <NuxtLink to="/" class="hover:text-accent">Accueil</NuxtLink>
        <span>›</span>
        <NuxtLink :to="`/game/${gameId}`" class="hover:text-accent">
          {{ gameData.name }}
        </NuxtLink>
        <span>›</span>
        <NuxtLink :to="`/game/${gameId}/group/${groupId}`" class="hover:text-accent">
          {{ groupData.name }}
        </NuxtLink>
        <span>›</span>
        <NuxtLink :to="`/game/${gameId}/group/${groupId}/chart/${chartId}`" class="hover:text-accent">
          {{ chartData.name }}
        </NuxtLink>
        <span>›</span>
        <span style="color: var(--text-color);">{{ $t('chart.submit.title') }}</span>
      </nav>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <p>{{ $t('chart.submit.loading') }}</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="text-center py-8 text-red-500">
      <p>{{ $t('chart.submit.error.title') }}: {{ error }}</p>
    </div>

    <!-- Main Content -->
    <div v-else-if="!isLoading && !error && charts.length > 0">
      <!-- Submission Form -->
      <div class="card">
        <div class="p-6">
          <PlayerChartList
            :charts="charts"
            :game="gameData"
            :display-group-name="false"
            :display-platform="true"
            @submission-success="handleSubmissionSuccess"
            @reload-data="loadData"
          />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PlayerChartList from '~/components/PlayerChartList.vue'
import type { ChartFormData, FormDataResponse } from '~/types/score-submission'
import type { Game } from '~/types/game'
import type { Chart } from '~/types/chart'
import type { Group } from '~/types/group'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

// Local state
const charts = ref<ChartFormData[]>([])
const gameData = ref<Game | null>(null)
const chartData = ref<Chart | null>(null)
const groupData = ref<Group | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

// Route params
const chartId = computed(() => route.params.chartId as string)
const gameId = computed(() => route.params.gameId as string)
const groupId = computed(() => route.params.groupId as string)


// Load chart data and game data
const loadData = async () => {
  try {
    isLoading.value = true
    error.value = null

    // Check if user is authenticated
    const { token } = useAuth()
    
    if (!token.value) {
      // Redirect to login if not authenticated
      await navigateTo('/login')
      return
    }

    // Load chart form data
    const formDataResponse = await $fetch<FormDataResponse>(
      `${config.public.apiBaseUrl}/charts/${chartId.value}/form-data`,
      {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      }
    )
    charts.value = formDataResponse['hydra:member']

    // Load game data (from layout)
    const gameResponse = await $fetch<Game>(
      `${config.public.apiBaseUrl}/games/${gameId.value}`
    )
    gameData.value = gameResponse

    // Load chart data for breadcrumb
    const chartResponse = await $fetch(
      `${config.public.apiBaseUrl}/charts/${chartId.value}`
    )
    chartData.value = chartResponse

    // Load group data for breadcrumb
    const groupResponse = await $fetch(
      `${config.public.apiBaseUrl}/groups/${groupId.value}`
    )
    groupData.value = groupResponse

  } catch (err) {
    error.value = err instanceof Error ? err.message : t('chart.submit.error.loadFailed')
    console.error('Erreur lors du chargement des données:', err)
  } finally {
    isLoading.value = false
  }
}

// Handle successful submission - redirect to chart ranking
const handleSubmissionSuccess = () => {
  // Show success message briefly, then redirect
  setTimeout(() => {
    router.push({
      name: 'game-gameId-group-groupId-chart-chartId-index',
      params: {
        gameId: route.params.gameId,
        groupId: route.params.groupId,
        chartId: route.params.chartId
      }
    })
  }, 2000)
}

// SEO
watchEffect(() => {
  if (chartData.value && groupData.value && gameData.value) {
    useSeoMeta({
      title: `${t('chart.submit.title')} - ${chartData.value.name} - ${groupData.value.name} - ${gameData.value.name} - Records`,
      description: t('meta.chart_description', { 
        chart: chartData.value.name,
        group: groupData.value.name, 
        game: gameData.value.name 
      }),
      robots: 'noindex, follow'
    })
  }
})

// Lifecycle
onMounted(() => {
  loadData()
})
</script>