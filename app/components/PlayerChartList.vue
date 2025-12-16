<template>
  <div class="space-y-4">
    <!-- Charts List -->
    <div class="space-y-8">
      <PlayerChartForm
        v-for="(chart, index) in localCharts"
        :key="chart.id"
        :ref="el => setChartRef(el, index)"
        :chart="chart"
        :game="game"
        :display-group-name="displayGroupName"
        :display-platform="displayPlatform"
        class="border-b border-dashed last:border-b-0 pb-4 last:pb-0"
        @change="handleChartChange(index)"
        @submitted="handleChartSubmitted(index, $event)"
      />
    </div>

    <!-- Submission Summary -->
    <div v-if="localCharts.length > 0" class="card p-6 space-y-4">
      <div class="text-center text-sm opacity-70">
        {{ $t('chart.list.summary.progress', [chartsUpdated, chartsToUpdate]) }}
      </div>

      <div class="flex justify-center">
        <button
          :disabled="globalSubmitting || chartsToUpdate === 0"
          class="px-6 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors min-w-[160px]"
          @click="submitAll"
        >
          <span v-if="globalSubmitting" class="flex items-center justify-center">
            <div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
            {{ $t('chart.list.summary.submitting') }}
          </span>
          <span v-else class="flex items-center justify-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {{ $t('chart.list.summary.submitAll') }}
          </span>
        </button>
      </div>

      <!-- Progress indicator -->
      <div v-if="globalSubmitting" class="space-y-2">
        <div class="flex justify-between text-sm opacity-70">
          <span>{{ $t('chart.list.progress') }}</span>
          <span>{{ chartsUpdated }}/{{ chartsToUpdate }}</span>
        </div>
        <div class="w-full bg-secondary bg-opacity-30 rounded-full h-2">
          <div
            class="bg-accent h-2 rounded-full transition-all duration-300 ease-out"
            :style="{ width: `${(chartsUpdated / Math.max(chartsToUpdate, 1)) * 100}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Global Messages -->
    <div v-if="globalMessage" class="card p-4" :class="globalSuccess ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'">
      <span :class="globalSuccess ? 'text-green-800' : 'text-red-800'">{{ globalMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScoreSubmission } from '~/composables/useScoreSubmission'
import PlayerChartForm from './PlayerChartForm.vue'
import type { 
  ChartFormData,
  PlayerChart as SubmissionPlayerChart 
} from '~/types/score-submission'
import type { Game } from '~/types/game'
import type { ComputedRef } from 'vue'

const { t } = useI18n()

// Props
interface Props {
  charts: ChartFormData[]
  game?: Game
  displayGroupName?: boolean
  displayPlatform?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  game: undefined,
  displayGroupName: false,
  displayPlatform: true,
})

// Emits
const emit = defineEmits<{
  'submission-success': [message: string]
  'reload-data': []
}>()

interface PlayerChartFormRef {
  submit: () => Promise<void>
  isModified: ComputedRef<boolean>
  isSubmitting: ComputedRef<boolean>
  chart: ChartFormData
  resetForm: () => void
}

// Local state
const localCharts = ref<ChartFormData[]>(reactive([...props.charts]))
const chartRefs = ref<(PlayerChartFormRef | null)[]>([])
const modifiedCharts = ref<Set<number>>(new Set())
const globalSubmitting = ref(false)
const globalMessage = ref<string | null>(null)
const globalSuccess = ref(false)
const chartsUpdated = ref(0)

// Computed
const chartsToUpdate = computed(() => modifiedCharts.value.size)

// Methods
const setChartRef = (el: PlayerChartFormRef | null, index: number) => {
  if (el) {
    chartRefs.value[index] = el
  }
}

const handleChartChange = (index: number) => {
  modifiedCharts.value.add(index)
}

const handleChartSubmitted = (index: number, data: SubmissionPlayerChart) => {
  // Update local chart data
  if (data) {
    localCharts.value[index].playerCharts[0] = data
  }

  // Remove from modified charts
  modifiedCharts.value.delete(index)
  chartsUpdated.value++
}

const submitAll = async () => {
  if (modifiedCharts.value.size === 0) {
    globalMessage.value = t('chart.list.noModifications')
    globalSuccess.value = false
    return
  }

  globalMessage.value = null
  globalSubmitting.value = true
  chartsUpdated.value = 0

  try {
    // Préparer les données pour la soumission en lot
    const modifiedChartsData = Array.from(modifiedCharts.value).map(index => {
      const chartRef = chartRefs.value[index]
      const chartData = chartRef?.chart || localCharts.value[index]
      
      return {
        chart: chartData,
        isModified: true
      }
    })

    // Utiliser le composable pour la soumission en lot
    const { submitAllChartsBulk } = useScoreSubmission()
    const result = await submitAllChartsBulk(modifiedChartsData)

    globalMessage.value = result.message
    globalSuccess.value = result.success
    
    if (result.success) {
      const bulkData = result.data as { total: number } | null
      chartsUpdated.value = bulkData?.total || 0

      // Emit success event for parent component
      if (globalMessage.value) {
        emit('submission-success', globalMessage.value)
      }

      // Wait a bit to let the success message display, then reload data
      setTimeout(() => {
        emit('reload-data')
        setTimeout(() => {
          globalMessage.value = null
        }, 5000)
      }, 100)

      // Clear modified charts after API refresh
      modifiedCharts.value.clear()
    }

  } catch (error) {
    globalMessage.value = t('chart.list.submitError')
    globalSuccess.value = false
    console.error('Erreur lors de la soumission:', error)
  } finally {
    globalSubmitting.value = false
  }
}

const resetAll = () => {
  chartsUpdated.value = 0
  modifiedCharts.value.clear()
  globalMessage.value = null
}

// Watch for changes in props.charts and update localCharts
watch(() => props.charts, async (newCharts) => {
  const currentMessage = globalMessage.value
  const currentSuccess = globalSuccess.value
  
  localCharts.value = reactive([...newCharts])
  
  // Clear refs array to ensure fresh refs
  chartRefs.value = []
  
  // Use nextTick to ensure the DOM is updated before restoring the message
  await nextTick()
  
  // Restore the message after the component update
  if (currentMessage) {
    globalMessage.value = currentMessage
    globalSuccess.value = currentSuccess
  }
}, { immediate: true })

// Expose methods for parent component
defineExpose({
  submitAll,
  resetAll,
  charts: computed(() => localCharts.value),
  chartsToUpdate,
  chartsUpdated: computed(() => chartsUpdated.value),
})
</script>