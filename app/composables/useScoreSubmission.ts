import { ref, computed } from 'vue'
import type {
  ChartFormData,
  SubmissionResponse,
  PlayerChartLib as SubmissionPlayerChartLib,
  PlayerChart as SubmissionPlayerChart,
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

  // Soumission d'un score pour un chart spécifique
  const submitPlayerChart = async (playerChart: SubmissionPlayerChart): Promise<SubmissionResponse> => {
    isSubmitting.value = true
    error.value = null

    try {
      // Get authentication token
      const { token } = useAuth()
      
      if (!token.value) {
        throw new Error('Authentication required')
      }

      // Préparer les données selon le format attendu par l'API
      const payload = JSON.parse(JSON.stringify(playerChart))

      // Remplacer les objets libChart par leurs URLs
      payload.libs.forEach((lib: SubmissionPlayerChartLib) => {
        lib.libChart = lib.libChart['@id']
      })

      let response
      const config = useRuntimeConfig()
      const headers = {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }

      // Vérifier si c'est un nouveau score ou une mise à jour
      if (isNewPlayerChart(playerChart)) {
        // Nouveau score
        delete payload.id
        delete payload['@id']
        payload.libs.forEach((lib: SubmissionPlayerChartLib) => {
          delete lib.id
          lib.value = '0'
          delete lib['@id']
        })

        response = await $fetch(`${config.public.apiBaseUrl}/player_charts`, {
          method: 'POST',
          headers,
          body: payload
        })
      } else {
        // Mise à jour
        response = await $fetch(`${config.public.apiBaseUrl}/player_charts/${playerChart.id}`, {
          method: 'PUT',
          headers,
          body: payload
        })
      }

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
        .filter(({ isModified, chart }) => isModified && !isNullScore(chart.playerCharts[0]))
        .map(({ chart }) => chart.playerCharts[0])

      if (chartsToSubmit.length === 0) {
        return {
          success: false,
          message: 'Aucun chart modifié à soumettre'
        }
      }

      // Préparer les données pour l'API bulk
      const playerChartsForAPI = chartsToSubmit.map(playerChart => {
        const payload = JSON.parse(JSON.stringify(playerChart))

        // Remplacer les objets libChart par leurs URLs
        payload.libs.forEach((lib: SubmissionPlayerChartLib) => {
          lib.libChart = lib.libChart['@id']
        })

        // Si c'est un nouveau PlayerChart, nettoyer les IDs
        if (isNewPlayerChart(playerChart)) {
          delete payload.id
          delete payload['@id']
          payload.libs.forEach((lib: SubmissionPlayerChartLib) => {
            delete lib.id
            lib.value = '0'
            delete lib['@id']
          })
        }

        return payload
      })

      // Appel à l'API bulk
      const config = useRuntimeConfig()
      const result = await $fetch(`${config.public.apiBaseUrl}/player_charts/bulk`, {
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

  // Soumission de tous les charts modifiés (méthode avec requêtes individuelles)
  const submitAllCharts = async (modifiedCharts: ChartSubmissionData[]): Promise<void> => {
    chartsUpdated.value = 0

    // Filtrer les charts à soumettre
    const chartsToSubmit = modifiedCharts
      .filter(({ isModified, chart }) => isModified && !isNullScore(chart.playerCharts[0]))
      .map(({ chart }) => chart.playerCharts[0])

    // Soumission par batch pour éviter les deadlocks
    const BATCH_SIZE = 5
    for (let i = 0; i < chartsToSubmit.length; i += BATCH_SIZE) {
      const batch = chartsToSubmit.slice(i, i + BATCH_SIZE)
      
      // Traiter le batch en parallèle avec un délai entre chaque requête
      const promises = batch.map((playerChart, index) => 
        new Promise<void>(resolve => {
          setTimeout(async () => {
            await submitPlayerChart(playerChart)
            resolve()
          }, index * 100) // Délai de 100ms entre chaque requête
        })
      )
      
      // Attendre que toutes les requêtes du batch soient terminées
      await Promise.all(promises)
      
      // Pause entre les batches pour réduire la charge sur la DB
      if (i + BATCH_SIZE < chartsToSubmit.length) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
  }

  // Vérifier si c'est un nouveau PlayerChart
  const isNewPlayerChart = (playerChart: SubmissionPlayerChart): boolean => {
    return playerChart.id === -1
  }

  // Vérifier si le score est vide
  const isNullScore = (playerChart: SubmissionPlayerChart): boolean => {
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
    submitAllCharts,
    submitAllChartsBulk,
    isNewPlayerChart,
    isNullScore,
    reset,
    addChartToUpdate,
  }
}