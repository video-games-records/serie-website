import { ref, computed } from 'vue'
import type {
  ChartFormData,
  SubmissionResponse,
  PlayerChart,
  ChartSubmissionData
} from '~/types/score-submission'

export const useScoreSubmission = () => {
  const charts = ref<ChartFormData[]>([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)
  const chartsToUpdate = ref(0)
  const chartsUpdated = ref(0)

  // Construire le payload pour un chart
  const buildChartPayload = (chartId: number, playerChart: PlayerChart) => ({
    id: chartId,
    playerChart: {
      platform: playerChart.platform,
      libs: playerChart.libs.map(lib => ({
        libChartId: lib.libChartId,
        parseValue: lib.parseValue
      }))
    }
  })

  // Soumission d'un score pour un chart spécifique
  const submitPlayerChart = async (chartId: number, playerChart: PlayerChart): Promise<SubmissionResponse> => {
    isSubmitting.value = true
    error.value = null

    try {
      const { token } = useAuth()

      if (!token.value) {
        throw new Error('Authentication required')
      }

      const config = useRuntimeConfig()
      const response = await $fetch(`${config.public.apiBaseUrl}/player-charts/bulk-upsert`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        },
        body: { playerCharts: [buildChartPayload(chartId, playerChart)] }
      })

      chartsUpdated.value++

      return {
        success: true,
        message: 'Score soumis avec succès',
        data: response,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      error.value = errorMessage

      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      isSubmitting.value = false
    }
  }

  // Soumission de tous les charts modifiés avec la route bulk
  const submitAllChartsBulk = async (modifiedCharts: ChartSubmissionData[]): Promise<SubmissionResponse> => {
    chartsUpdated.value = 0
    isSubmitting.value = true
    error.value = null

    try {
      // Get authentication token
      const { token } = useAuth()
      
      if (!token.value) {
        throw new Error('Authentication required')
      }

      // Filtrer les charts à soumettre
      const chartsToSubmit = modifiedCharts
        .filter(({ isModified, chart }) => isModified && !isNullScore(chart.playerChart))

      if (chartsToSubmit.length === 0) {
        return {
          success: false,
          message: 'Aucun chart modifié à soumettre'
        }
      }

      // Préparer les données pour l'API bulk
      const playerChartsForAPI = chartsToSubmit.map(({ chart }) =>
        buildChartPayload(chart.id, chart.playerChart)
      )

      // Appel à l'API bulk
      const config = useRuntimeConfig()
      const result = await $fetch(`${config.public.apiBaseUrl}/player-charts/bulk-upsert`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        },
        body: { playerCharts: playerChartsForAPI }
      })

      chartsUpdated.value = result.total

      return {
        success: true,
        message: result.message,
        data: result
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la soumission en lot'
      error.value = errorMessage

      return {
        success: false,
        message: errorMessage
      }
    } finally {
      isSubmitting.value = false
    }
  }

  // Vérifier si le score est vide
  const isNullScore = (playerChart: PlayerChart): boolean => {
    return playerChart.libs.every(lib =>
      lib.parseValue.every(element => element.value === '')
    )
  }

  // Reset des compteurs
  const reset = () => {
    chartsToUpdate.value = 0
    chartsUpdated.value = 0
  }

  // Ajouter un chart à mettre à jour
  const addChartToUpdate = () => {
    chartsToUpdate.value++
  }

  return {
    // State
    charts: computed(() => charts.value),
    isLoading: computed(() => isLoading.value),
    isSubmitting: computed(() => isSubmitting.value),
    error: computed(() => error.value),
    isInitialized: computed(() => isInitialized.value),
    chartsToUpdate: computed(() => chartsToUpdate.value),
    chartsUpdated: computed(() => chartsUpdated.value),

    // Methods
    submitPlayerChart,
    submitAllChartsBulk,
    isNullScore,
    reset,
    addChartToUpdate,
  }
}