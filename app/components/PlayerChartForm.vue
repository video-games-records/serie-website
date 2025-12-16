<template>
  <div class="space-y-6 card p-6">
    <!-- Chart Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-xl font-semibold">{{ chart.name }}</h3>
        <p v-if="displayGroupName && chart.group" class="text-sm opacity-70">
          {{ chart.group.name }}
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <span v-if="chart.isProofVideoOnly" class="px-2 py-1 bg-yellow-500 bg-opacity-20 text-yellow-800 text-xs rounded">
          Proof Required
        </span>
        <span v-if="chart.isDlc" class="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-800 text-xs rounded">
          DLC
        </span>
      </div>
    </div>


    <!-- Score Form -->
    <form class="space-y-4" @submit.prevent="submitScore">
      <!-- Score Inputs -->
      <div class="space-y-4">
        <div v-for="(lib, libIndex) in chart.libs" :key="lib.id" class="space-y-2">
          <label class="block text-sm font-medium">
            {{ lib.name }}
          </label>
          
          <div class="flex items-center space-x-2">
            <div 
              v-for="(element, elementIndex) in lib.type.parseMask" 
              :key="elementIndex"
              class="flex items-center space-x-1"
            >
              <input
                v-model="formData[libIndex].parseValue[elementIndex].value"
                type="text"
                :placeholder="element.size > 10 ? 'MM' : '0'.repeat(Math.min(element.size, 4))"
                :maxlength="element.size > 10 ? 10 : element.size"
                :class="getInputClasses(element.size, libIndex)"
                @input="handleInputChange"
              >
              <span v-if="element.suffixe" class="text-sm text-gray-500">
                {{ element.suffixe }}
              </span>
            </div>
          </div>
          
        </div>
      </div>

      <!-- Platform Selection -->
      <div v-if="displayPlatform && game?.platforms && game.platforms.length > 1" class="space-y-2">
        <label class="block text-sm font-medium">Platform</label>
        <select 
          v-model="selectedPlatform"
          class="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 focus:border-accent focus:ring-1 focus:ring-accent"
          @change="handleInputChange"
        >
          <option value="" class="text-gray-900">Select platform</option>
          <option 
            v-for="platform in game.platforms" 
            :key="platform.id"
            :value="platform['@id']"
            class="text-gray-900"
          >
            {{ platform.name }}
          </option>
        </select>
      </div>

    </form>

    <!-- Success/Error Messages -->
    <div v-if="submitMessage" class="p-4 rounded-lg" :class="submitSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
      {{ submitMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, nextTick } from 'vue'
import { useScoreSubmission } from '~/composables/useScoreSubmission'
import type { 
  ChartFormData, 
  PlayerChart as SubmissionPlayerChart
} from '~/types/score-submission'
import type { Game } from '~/types/game'

interface Props {
  chart: ChartFormData
  game?: Game
  displayGroupName?: boolean
  displayPlatform?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  game: undefined,
  displayGroupName: false,
  displayPlatform: true
})

const emit = defineEmits<{
  change: []
  submitted: [data: SubmissionPlayerChart]
}>()

const { submitPlayerChart } = useScoreSubmission()

// Local state
const playerChart = computed(() => props.chart.playerCharts[0])
const isSubmitting = ref(false)
const submitMessage = ref<string | null>(null)
const submitSuccess = ref(false)
const selectedPlatform = ref(playerChart.value?.platform || '')

// Form data - reactive copy of the player chart libs
const formData = reactive(
  props.chart.libs.map((lib, libIndex) => ({
    id: playerChart.value?.libs[libIndex]?.id || -1,
    value: '',
    libChart: lib,
    parseValue: lib.type.parseMask.map((element, index) => ({ 
      value: playerChart.value?.libs[libIndex]?.parseValue[index]?.value || '' 
    })),
    formatValue: playerChart.value?.libs[libIndex]?.formatValue || ''
  }))
)

// Initialize form data
const initializeFormData = () => {
  if (playerChart.value && playerChart.value.libs) {
    playerChart.value.libs.forEach((playerLib, index) => {
      if (formData[index]) {
        formData[index].id = playerLib.id
        formData[index].value = playerLib.value
        formData[index].parseValue = [...playerLib.parseValue]
        formData[index].formatValue = playerLib.formatValue
      }
    })
  }
}

// Computed properties
const isModified = computed(() => {
  return formData.some((lib, index) => {
    const originalLib = playerChart.value?.libs[index]
    if (!originalLib) return lib.parseValue.some(el => el.value !== '')
    
    return lib.parseValue.some((element, elemIndex) => 
      element.value !== (originalLib.parseValue[elemIndex]?.value || '')
    )
  }) || (selectedPlatform.value !== (playerChart.value?.platform || ''))
})


// Methods
const getInputClasses = (size: number, libIndex: number) => {
  const lib = props.chart.libs[libIndex]
  const isSingleInput = lib.type.parseMask.length === 1
  
  // For very large sizes (like 30), treat as flexible input
  if (size > 10) {
    const width = isSingleInput ? 'w-32' : 'w-16'
    return `${width} px-2 py-1 border border-gray-400 rounded text-center bg-white text-gray-900 focus:border-accent focus:ring-1 focus:ring-accent`
  }
  
  // For normal sizes, adjust width accordingly - larger if single input
  let width
  if (isSingleInput) {
    width = size <= 2 ? 'w-20' : size <= 3 ? 'w-24' : 'w-32'
  } else {
    width = size <= 2 ? 'w-12' : size <= 3 ? 'w-16' : 'w-20'
  }
  
  return `${width} px-2 py-1 border border-gray-400 rounded text-center bg-white text-gray-900 focus:border-accent focus:ring-1 focus:ring-accent`
}

const getFormattedValue = (libIndex: number) => {
  const lib = formData[libIndex]
  if (!lib || lib.parseValue.every(el => el.value === '')) return ''
  
  const mask = props.chart.libs[libIndex]?.type.parseMask
  if (!mask) return ''
  
  let result = ''
  
  mask.forEach((element, index) => {
    const value = lib.parseValue[index]?.value || ''
    result += value
    if (element.suffixe && (index < mask.length - 1 || value)) {
      result += element.suffixe
    }
  })
  
  return result
}

const handleInputChange = () => {
  emit('change')
}

const submitScore = async () => {
  if (!playerChart.value) return
  
  isSubmitting.value = true
  submitMessage.value = null

  try {
    // Préparer les données du PlayerChart
    const updatedPlayerChart: SubmissionPlayerChart = {
      '@id': playerChart.value['@id'] || '',
      '@type': 'PlayerChart',
      id: playerChart.value.id,
      rank: playerChart.value.rank,
      pointChart: playerChart.value.pointChart,
      dateInvestigation: playerChart.value.dateInvestigation,
      chart: playerChart.value.chart,
      player: playerChart.value.player,
      status: playerChart.value.status,
      platform: selectedPlatform.value,
      nbEqual: playerChart.value.nbEqual,
      lastUpdate: playerChart.value.lastUpdate,
      libs: formData.map((lib, index) => ({
        '@id': lib.id > 0 ? `/api/player_chart_libs/${lib.id}` : '',
        '@type': 'PlayerChartLib',
        id: lib.id,
        value: lib.parseValue.map(el => el.value).join(''),
        libChart: lib.libChart,
        parseValue: lib.parseValue,
        formatValue: getFormattedValue(index)
      }))
    }

    const result = await submitPlayerChart(updatedPlayerChart)
    
    if (result.success) {
      submitMessage.value = result.message
      submitSuccess.value = true
      emit('submitted', result.data as SubmissionPlayerChart)
    } else {
      submitMessage.value = result.message
      submitSuccess.value = false
    }
  } catch (error) {
    submitMessage.value = error instanceof Error ? error.message : 'Erreur lors de la soumission'
    submitSuccess.value = false
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  initializeFormData()
  selectedPlatform.value = playerChart.value?.platform || ''
  submitMessage.value = null
}

// Watch for chart changes
watch(() => props.chart, () => {
  nextTick(() => {
    initializeFormData()
  })
}, { deep: true, immediate: true })

// Expose methods
defineExpose({
  submit: submitScore,
  isModified,
  isSubmitting: computed(() => isSubmitting.value),
  chart: computed(() => props.chart),
  resetForm
})
</script>