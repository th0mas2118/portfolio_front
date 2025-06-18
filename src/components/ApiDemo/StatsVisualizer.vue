<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
      <h2 class="text-2xl font-bold mb-2">📈 Statistiques & Métriques</h2>
      <p class="text-orange-100">Analytics en temps réel de l'API</p>
    </div>

    <div class="p-6 space-y-6">
      <!-- Métriques principales -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center border border-blue-200">
          <div class="text-3xl font-bold text-blue-600">{{ stats.totalRequests }}</div>
          <div class="text-sm text-blue-700 font-medium">Requêtes totales</div>
          <div class="text-xs text-blue-600 mt-1">+{{ recentRequests }} aujourd'hui</div>
        </div>
        
        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center border border-green-200">
          <div class="text-3xl font-bold text-green-600">{{ successRate }}%</div>
          <div class="text-sm text-green-700 font-medium">Taux de succès</div>
          <div class="text-xs text-green-600 mt-1">{{ stats.successfulRequests }}/{{ stats.totalRequests }}</div>
        </div>
        
        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center border border-purple-200">
          <div class="text-3xl font-bold text-purple-600">{{ stats.averageResponseTime }}ms</div>
          <div class="text-sm text-purple-700 font-medium">Temps moyen</div>
          <div class="text-xs text-purple-600 mt-1">{{ getPerformanceText() }}</div>
        </div>
        
        <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 text-center border border-yellow-200">
          <div class="text-3xl font-bold text-yellow-600">{{ activeEndpoints }}</div>
          <div class="text-sm text-yellow-700 font-medium">Endpoints actifs</div>
          <div class="text-xs text-yellow-600 mt-1">{{ totalEndpoints }} au total</div>
        </div>
      </div>

      <!-- Graphiques -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Répartition des status codes -->
        <div class="border rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            🎯 Répartition des codes de statut
          </h3>
          <div class="space-y-3">
            <div
              v-for="(count, status) in statusDistribution"
              :key="status"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-4 h-4 rounded',
                    getStatusColorBg(Number(status))
                  ]"
                ></div>
                <span class="text-sm font-medium">{{ getStatusLabel(Number(status)) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">{{ count }}</span>
                <div class="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    :class="[
                      'h-2 rounded-full',
                      getStatusColorBg(Number(status))
                    ]"
                    :style="{ width: `${(count / stats.totalRequests) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Endpoints populaires -->
        <div class="border rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            🔥 Endpoints populaires
          </h3>
          <div class="space-y-3">
            <div
              v-for="(endpoint, index) in stats.popularEndpoints.slice(0, 5)"
              :key="endpoint.path"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <div class="text-lg">{{ getPopularityIcon(index) }}</div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ endpoint.path }}</div>
                  <div class="text-xs text-gray-500">{{ endpoint.count }} requêtes</div>
                </div>
              </div>
              <div class="w-16 bg-gray-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500"
                  :style="{ width: `${(endpoint.count / stats.popularEndpoints[0]?.count || 1) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline des performances -->
      <div class="border rounded-lg p-4">
        <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          ⚡ Performance dans le temps
        </h3>
        <div class="space-y-4">
          <!-- Graphique simple avec barres -->
          <div class="flex items-end justify-between h-32 bg-gray-50 rounded p-4">
            <div
              v-for="(time, index) in performanceHistory"
              :key="index"
              class="flex flex-col items-center gap-1"
            >
              <div
                :class="[
                  'w-8 rounded-t',
                  getPerformanceColor(time)
                ]"
                :style="{ height: `${Math.max((time / maxResponseTime) * 80, 8)}px` }"
                :title="`${time}ms`"
              ></div>
              <div class="text-xs text-gray-500">{{ index + 1 }}</div>
            </div>
          </div>
          <div class="flex justify-between text-xs text-gray-500">
            <span>Dernières requêtes</span>
            <span>Max: {{ maxResponseTime }}ms</span>
          </div>
        </div>
      </div>

      <!-- Métriques détaillées -->
      <div class="grid md:grid-cols-3 gap-4">
        <div class="border rounded-lg p-4 text-center">
          <div class="text-2xl mb-2">📊</div>
          <div class="text-lg font-bold text-gray-900">{{ totalDataTransferred }}</div>
          <div class="text-sm text-gray-600">Données transférées</div>
        </div>
        
        <div class="border rounded-lg p-4 text-center">
          <div class="text-2xl mb-2">🕒</div>
          <div class="text-lg font-bold text-gray-900">{{ formatTime(lastRequestTime) }}</div>
          <div class="text-sm text-gray-600">Dernière requête</div>
        </div>
        
        <div class="border rounded-lg p-4 text-center">
          <div class="text-2xl mb-2">⚖️</div>
          <div class="text-lg font-bold text-gray-900">{{ averageSize }}</div>
          <div class="text-sm text-gray-600">Taille moyenne</div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-center gap-4 pt-4 border-t">
        <button
          @click="refreshStats"
          :disabled="isRefreshing"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <span v-if="isRefreshing">🔄 Actualisation...</span>
          <span v-else">🔄 Actualiser</span>
        </button>
        
        <button
          @click="exportStats"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          📊 Exporter CSV
        </button>
        
        <button
          @click="resetStats"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          🗑️ Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { ApiStats, RequestHistory } from '@/types'

// Props
interface Props {
  history?: RequestHistory[]
}

const props = withDefaults(defineProps<Props>(), {
  history: () => []
})

// Reactive data
const isRefreshing = ref(false)
const performanceHistory = ref<number[]>([])

// Computed
const stats = computed((): ApiStats => {
  const history = props.history
  if (!history || history.length === 0) {
    return {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      popularEndpoints: []
    }
  }

  const successful = history.filter(item => item.response.status >= 200 && item.response.status < 300).length
  const failed = history.filter(item => item.response.status >= 400).length
  const totalTime = history.reduce((sum, item) => sum + item.response.duration, 0)
  
  // Compter les endpoints populaires
  const endpointCounts: Record<string, number> = {}
  history.forEach(item => {
    const path = item.endpoint.path
    endpointCounts[path] = (endpointCounts[path] || 0) + 1
  })
  
  const popularEndpoints = Object.entries(endpointCounts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)

  return {
    totalRequests: history.length,
    successfulRequests: successful,
    failedRequests: failed,
    averageResponseTime: history.length > 0 ? Math.round(totalTime / history.length) : 0,
    popularEndpoints
  }
})

const successRate = computed(() => {
  if (stats.value.totalRequests === 0) return 0
  return Math.round((stats.value.successfulRequests / stats.value.totalRequests) * 100)
})

const recentRequests = computed(() => {
  const today = new Date().toDateString()
  return props.history.filter(item => 
    new Date(item.timestamp).toDateString() === today
  ).length
})

const activeEndpoints = computed(() => {
  const uniquePaths = new Set(props.history.map(item => item.endpoint.path))
  return uniquePaths.size
})

const totalEndpoints = computed(() => {
  // Simulé - dans un vrai projet, cela viendrait de l'API
  return 63
})

const statusDistribution = computed(() => {
  const distribution: Record<string, number> = {}
  props.history.forEach(item => {
    const statusRange = getStatusRange(item.response.status)
    distribution[statusRange] = (distribution[statusRange] || 0) + 1
  })
  return distribution
})

const totalDataTransferred = computed(() => {
  const bytes = props.history.reduce((sum, item) => sum + (item.response.size || 0), 0)
  return formatSize(bytes)
})

const lastRequestTime = computed(() => {
  if (props.history.length === 0) return null
  return props.history[0].timestamp // Le plus récent en premier
})

const averageSize = computed(() => {
  if (props.history.length === 0) return '0 B'
  const totalBytes = props.history.reduce((sum, item) => sum + (item.response.size || 0), 0)
  return formatSize(totalBytes / props.history.length)
})

const maxResponseTime = computed(() => {
  return Math.max(...performanceHistory.value, 100)
})

// Watchers
watch(() => props.history, (newHistory) => {
  updatePerformanceHistory(newHistory)
}, { immediate: true })

// Methods
const getStatusRange = (status: number): string => {
  if (status >= 200 && status < 300) return '2xx'
  if (status >= 300 && status < 400) return '3xx'
  if (status >= 400 && status < 500) return '4xx'
  if (status >= 500) return '5xx'
  return 'Other'
}

const getStatusLabel = (status: number): string => {
  const labels: Record<string, string> = {
    '2xx': 'Succès',
    '3xx': 'Redirections',
    '4xx': 'Erreurs client',
    '5xx': 'Erreurs serveur',
    'Other': 'Autres'
  }
  return labels[getStatusRange(status)] || 'Inconnu'
}

const getStatusColorBg = (status: number): string => {
  const range = getStatusRange(status)
  const colors: Record<string, string> = {
    '2xx': 'bg-green-500',
    '3xx': 'bg-yellow-500',
    '4xx': 'bg-orange-500',
    '5xx': 'bg-red-500',
    'Other': 'bg-gray-500'
  }
  return colors[range] || 'bg-gray-500'
}

const getPopularityIcon = (index: number): string => {
  const icons = ['🥇', '🥈', '🥉', '📌', '📍']
  return icons[index] || '📍'
}

const getPerformanceText = (): string => {
  const avgTime = stats.value.averageResponseTime
  if (avgTime < 200) return 'Excellent'
  if (avgTime < 500) return 'Bon'
  if (avgTime < 1000) return 'Moyen'
  return 'Lent'
}

const getPerformanceColor = (time: number): string => {
  if (time < 200) return 'bg-green-500'
  if (time < 500) return 'bg-yellow-500'
  if (time < 1000) return 'bg-orange-500'
  return 'bg-red-500'
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

const formatTime = (timestamp: string | null): string => {
  if (!timestamp) return 'Jamais'
  return new Date(timestamp).toLocaleTimeString()
}

const updatePerformanceHistory = (history: RequestHistory[]) => {
  // Prendre les 20 dernières requêtes pour le graphique
  performanceHistory.value = history
    .slice(0, 20)
    .reverse() // Pour afficher chronologiquement
    .map(item => item.response.duration)
}

const refreshStats = async () => {
  isRefreshing.value = true
  // Simuler un délai de chargement
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Dans un vrai projet, on ferait un appel API ici
  // const newStats = await apiService.getStats()
  
  isRefreshing.value = false
}

const exportStats = () => {
  const csvData = [
    ['Métrique', 'Valeur'],
    ['Requêtes totales', stats.value.totalRequests],
    ['Requêtes réussies', stats.value.successfulRequests],
    ['Requêtes échouées', stats.value.failedRequests],
    ['Taux de succès (%)', successRate.value],
    ['Temps de réponse moyen (ms)', stats.value.averageResponseTime],
    ['Endpoints actifs', activeEndpoints.value],
    ['Données transférées', totalDataTransferred.value],
    ['Taille moyenne', averageSize.value]
  ]
  
  const csvContent = csvData.map(row => row.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `api-stats-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const resetStats = () => {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les statistiques ?')) {
    // Dans un vrai projet, on enverrait une requête API pour reset les stats
    performanceHistory.value = []
    // Emit event to parent to clear history
    // emit('resetRequested')
  }
}

// Lifecycle
onMounted(() => {
  updatePerformanceHistory(props.history)
})
</script>
