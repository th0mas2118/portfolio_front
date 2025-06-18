<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold mb-2">📜 Historique des requêtes</h2>
          <p class="text-indigo-100">Vos dernières requêtes API</p>
        </div>
        <div class="text-right">
          <div class="text-3xl font-bold">{{ history.length }}</div>
          <div class="text-sm text-indigo-200">Requêtes</div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="p-4 bg-gray-50 border-b flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="text-sm text-gray-600">
          {{ history.length }} requête(s) enregistrée(s)
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">Filtrer par status:</label>
          <select
            v-model="statusFilter"
            class="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Tous</option>
            <option value="success">Succès (2xx)</option>
            <option value="error">Erreurs (4xx, 5xx)</option>
            <option value="redirect">Redirections (3xx)</option>
          </select>
        </div>
      </div>
      <div class="flex gap-2">
        <button
          @click="clearHistory"
          :disabled="history.length === 0"
          class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          🗑️ Vider
        </button>
        <button
          @click="exportHistory"
          :disabled="history.length === 0"
          class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          📥 Exporter
        </button>
      </div>
    </div>

    <!-- Liste des requêtes -->
    <div class="max-h-96 overflow-y-auto">
      <div v-if="filteredHistory.length === 0" class="p-8 text-center text-gray-500">
        <div class="text-6xl mb-4">📝</div>
        <p class="text-lg">{{ history.length === 0 ? 'Aucune requête dans l\'historique' : 'Aucune requête correspondant au filtre' }}</p>
        <p class="text-sm">{{ history.length === 0 ? 'Envoyez votre première requête API' : 'Essayez de modifier le filtre' }}</p>
      </div>

      <div v-else class="divide-y divide-gray-100">
        <div
          v-for="(item, index) in filteredHistory"
          :key="item.id"
          class="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          @click="selectHistoryItem(item)"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-mono font-bold',
                  getMethodColor(item.endpoint.method)
                ]"
              >
                {{ item.endpoint.method }}
              </span>
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-bold',
                  getStatusColor(item.response.status)
                ]"
              >
                {{ item.response.status }}
              </span>
              <span class="text-sm font-medium text-gray-900">
                {{ item.endpoint.name }}
              </span>
            </div>
            <div class="flex items-center gap-3 text-sm text-gray-500">
              <span>{{ formatDuration(item.response.duration) }}</span>
              <span>{{ formatTime(item.timestamp) }}</span>
              <button
                @click.stop="removeHistoryItem(index)"
                class="text-red-500 hover:text-red-700 transition-colors"
                title="Supprimer"
              >
                🗑️
              </button>
            </div>
          </div>
          
          <div class="text-sm text-gray-600 mb-1">
            {{ item.endpoint.description }}
          </div>
          
          <div class="text-xs text-gray-500 font-mono">
            {{ item.endpoint.path }}
          </div>
          
          <!-- Preview des données de réponse -->
          <div v-if="item.response.data" class="mt-2">
            <div class="text-xs text-gray-500 mb-1">Aperçu de la réponse:</div>
            <div class="bg-gray-100 rounded p-2 text-xs font-mono text-gray-700 max-h-16 overflow-hidden">
              {{ getResponsePreview(item.response.data) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats rapides -->
    <div v-if="history.length > 0" class="p-4 bg-gray-50 border-t">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div class="text-lg font-bold text-green-600">{{ successCount }}</div>
          <div class="text-xs text-gray-600">Succès</div>
        </div>
        <div>
          <div class="text-lg font-bold text-red-600">{{ errorCount }}</div>
          <div class="text-xs text-gray-600">Erreurs</div>
        </div>
        <div>
          <div class="text-lg font-bold text-blue-600">{{ averageResponseTime }}ms</div>
          <div class="text-xs text-gray-600">Temps moyen</div>
        </div>
        <div>
          <div class="text-lg font-bold text-purple-600">{{ totalSize }}</div>
          <div class="text-xs text-gray-600">Données totales</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { RequestHistory, ApiResponse, ApiEndpoint } from '@/types'

// Props
interface Props {
  currentResponse?: ApiResponse | null
  currentEndpoint?: ApiEndpoint | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  historyItemSelected: [item: RequestHistory]
}>()

// Reactive data
const history = ref<RequestHistory[]>([])
const statusFilter = ref('')

// Computed
const filteredHistory = computed(() => {
  if (!statusFilter.value) return history.value
  
  return history.value.filter(item => {
    const status = item.response.status
    switch (statusFilter.value) {
      case 'success':
        return status >= 200 && status < 300
      case 'error':
        return status >= 400
      case 'redirect':
        return status >= 300 && status < 400
      default:
        return true
    }
  })
})

const successCount = computed(() => {
  return history.value.filter(item => item.response.status >= 200 && item.response.status < 300).length
})

const errorCount = computed(() => {
  return history.value.filter(item => item.response.status >= 400).length
})

const averageResponseTime = computed(() => {
  if (history.value.length === 0) return 0
  const total = history.value.reduce((sum, item) => sum + item.response.duration, 0)
  return Math.round(total / history.value.length)
})

const totalSize = computed(() => {
  const bytes = history.value.reduce((sum, item) => sum + (item.response.size || 0), 0)
  return formatSize(bytes)
})

// Watchers
watch([() => props.currentResponse, () => props.currentEndpoint], ([response, endpoint]) => {
  if (response && endpoint) {
    addToHistory(endpoint, response)
  }
})

// Methods
const addToHistory = (endpoint: ApiEndpoint, response: ApiResponse) => {
  const historyItem: RequestHistory = {
    id: generateId(),
    endpoint,
    response,
    timestamp: new Date().toISOString(),
    duration: response.duration
  }
  
  // Ajouter au début de la liste
  history.value.unshift(historyItem)
  
  // Limiter à 50 requêtes max
  if (history.value.length > 50) {
    history.value = history.value.slice(0, 50)
  }
  
  // Sauvegarder en localStorage
  saveHistory()
}

const selectHistoryItem = (item: RequestHistory) => {
  emit('historyItemSelected', item)
}

const removeHistoryItem = (index: number) => {
  history.value.splice(index, 1)
  saveHistory()
}

const clearHistory = () => {
  if (confirm('Êtes-vous sûr de vouloir vider l\'historique ?')) {
    history.value = []
    saveHistory()
  }
}

const exportHistory = () => {
  const dataStr = JSON.stringify(history.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `api-history-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET':
      return 'bg-green-100 text-green-800'
    case 'POST':
      return 'bg-blue-100 text-blue-800'
    case 'PUT':
      return 'bg-yellow-100 text-yellow-800'
    case 'DELETE':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusColor = (status: number) => {
  if (status >= 200 && status < 300) return 'bg-green-100 text-green-800'
  if (status >= 300 && status < 400) return 'bg-yellow-100 text-yellow-800'
  if (status >= 400 && status < 500) return 'bg-orange-100 text-orange-800'
  if (status >= 500) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

const formatTime = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString()
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

const getResponsePreview = (data: any): string => {
  try {
    const str = JSON.stringify(data)
    return str.length > 100 ? str.substring(0, 100) + '...' : str
  } catch (error) {
    return String(data).substring(0, 100)
  }
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

const saveHistory = () => {
  try {
    localStorage.setItem('api-request-history', JSON.stringify(history.value))
  } catch (error) {
    console.warn('Impossible de sauvegarder l\'historique:', error)
  }
}

const loadHistory = () => {
  try {
    const saved = localStorage.getItem('api-request-history')
    if (saved) {
      history.value = JSON.parse(saved)
    }
  } catch (error) {
    console.warn('Erreur lors du chargement de l\'historique:', error)
  }
}

// Lifecycle
onMounted(() => {
  loadHistory()
})
</script>
