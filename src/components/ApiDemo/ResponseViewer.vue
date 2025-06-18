<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
      <h2 class="text-2xl font-bold mb-2">📊 Réponse API</h2>
      <p class="text-purple-100">Visualisation et analyse des réponses</p>
    </div>

    <div v-if="!response" class="p-8 text-center text-gray-500">
      <div class="text-6xl mb-4">📡</div>
      <p class="text-lg">Aucune réponse pour le moment</p>
      <p class="text-sm">Envoyez une requête pour voir la réponse ici</p>
    </div>

    <div v-else class="p-6 space-y-6">
      <!-- Métriques de la réponse -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-gray-50 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold" :class="getStatusColor(response.status)">
            {{ response.status }}
          </div>
          <div class="text-sm text-gray-600">Status</div>
        </div>
        <div class="bg-gray-50 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-blue-600">{{ formatDuration(response.duration) }}</div>
          <div class="text-sm text-gray-600">Durée</div>
        </div>
        <div class="bg-gray-50 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-green-600">{{ formatSize(response.size) }}</div>
          <div class="text-sm text-gray-600">Taille</div>
        </div>
        <div class="bg-gray-50 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-purple-600">{{ formatTime(response.timestamp) }}</div>
          <div class="text-sm text-gray-600">Heure</div>
        </div>
      </div>

      <!-- Onglets -->
      <div class="border-b">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }} {{ tab.badge }}
          </button>
        </nav>
      </div>

      <!-- Contenu des onglets -->
      <div class="space-y-4">
        <!-- Body/Data -->
        <div v-if="activeTab === 'body'">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-gray-900">Corps de la réponse</h3>
            <div class="flex gap-2">
              <button
                @click="copyResponse"
                class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                title="Copier la réponse"
              >
                📋 Copier
              </button>
              <button
                @click="downloadResponse"
                class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                title="Télécharger en JSON"
              >
                ⬇️ Télécharger
              </button>
              <button
                @click="togglePrettyPrint"
                :class="[
                  'px-3 py-1 text-sm rounded transition-colors',
                  prettyPrint
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                ✨ {{ prettyPrint ? 'Compact' : 'Formater' }}
              </button>
            </div>
          </div>
          
          <div class="relative">
            <pre
              :class="[
                'bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm font-mono',
                'max-h-96 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800'
              ]"
            ><code>{{ formattedResponse }}</code></pre>
            
            <!-- Overlay de loading pour le formatage -->
            <div v-if="isFormatting" class="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-lg">
              <div class="text-white">Formatage en cours...</div>
            </div>
          </div>
        </div>

        <!-- Headers -->
        <div v-if="activeTab === 'headers'">
          <h3 class="font-semibold text-gray-900 mb-4">Headers de réponse</h3>
          <div v-if="Object.keys(response.headers).length === 0" class="text-gray-500 italic">
            Aucun header disponible
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="(value, key) in response.headers"
              :key="key"
              class="flex items-start gap-4 p-3 bg-gray-50 rounded border"
            >
              <div class="font-mono text-sm font-semibold text-purple-600 min-w-0 flex-shrink-0">
                {{ key }}:
              </div>
              <div class="font-mono text-sm text-gray-900 break-all">
                {{ value }}
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div v-if="activeTab === 'stats'">
          <h3 class="font-semibold text-gray-900 mb-4">Statistiques détaillées</h3>
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Informations de base -->
            <div class="space-y-4">
              <h4 class="font-medium text-gray-700">Informations de la réponse</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Status Code:</span>
                  <span :class="getStatusColor(response.status)" class="font-semibold">
                    {{ response.status }} {{ response.statusText }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Temps de réponse:</span>
                  <span class="font-semibold text-blue-600">{{ formatDuration(response.duration) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Taille:</span>
                  <span class="font-semibold text-green-600">{{ formatSize(response.size) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Timestamp:</span>
                  <span class="font-semibold text-gray-900">{{ new Date(response.timestamp).toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <!-- Analyse du contenu -->
            <div class="space-y-4">
              <h4 class="font-medium text-gray-700">Analyse du contenu</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Type de données:</span>
                  <span class="font-semibold text-gray-900">{{ getDataType() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Nombre de propriétés:</span>
                  <span class="font-semibold text-gray-900">{{ getPropertyCount() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Profondeur:</span>
                  <span class="font-semibold text-gray-900">{{ getObjectDepth() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Headers count:</span>
                  <span class="font-semibold text-gray-900">{{ Object.keys(response.headers).length }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Performance indicator -->
          <div class="mt-6 p-4 rounded-lg" :class="getPerformanceClass()">
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ getPerformanceIcon() }}</span>
              <div>
                <div class="font-semibold">{{ getPerformanceText() }}</div>
                <div class="text-sm opacity-90">{{ getPerformanceDescription() }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Raw -->
        <div v-if="activeTab === 'raw'">
          <h3 class="font-semibold text-gray-900 mb-4">Données brutes</h3>
          <div class="bg-gray-900 text-gray-100 p-4 rounded-lg">
            <pre class="text-xs font-mono overflow-auto max-h-96"><code>{{ JSON.stringify(response, null, 2) }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ApiResponse } from '@/types'

// Props
interface Props {
  response: ApiResponse | null
}

const props = defineProps<Props>()

// Reactive data
const activeTab = ref('body')
const prettyPrint = ref(true)
const isFormatting = ref(false)

// Computed
const tabs = computed(() => [
  { id: 'body', name: 'Corps', badge: '' },
  { id: 'headers', name: 'Headers', badge: props.response ? `(${Object.keys(props.response.headers).length})` : '' },
  { id: 'stats', name: 'Stats', badge: '' },
  { id: 'raw', name: 'Raw', badge: '' }
])

const formattedResponse = computed(() => {
  if (!props.response) return ''
  
  try {
    if (prettyPrint.value) {
      return JSON.stringify(props.response.data, null, 2)
    } else {
      return JSON.stringify(props.response.data)
    }
  } catch (error) {
    return String(props.response.data)
  }
})

// Methods
const getStatusColor = (status: number) => {
  if (status >= 200 && status < 300) return 'text-green-600'
  if (status >= 300 && status < 400) return 'text-yellow-600'
  if (status >= 400 && status < 500) return 'text-orange-600'
  if (status >= 500) return 'text-red-600'
  return 'text-gray-600'
}

const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

const formatTime = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString()
}

const getDataType = (): string => {
  if (!props.response) return 'Unknown'
  const data = props.response.data
  if (Array.isArray(data)) return 'Array'
  if (data === null) return 'Null'
  return typeof data
}

const getPropertyCount = (): number => {
  if (!props.response) return 0
  const data = props.response.data
  if (Array.isArray(data)) return data.length
  if (typeof data === 'object' && data !== null) return Object.keys(data).length
  return 0
}

const getObjectDepth = (): number => {
  if (!props.response) return 0
  
  const getDepth = (obj: any): number => {
    if (typeof obj !== 'object' || obj === null) return 0
    return 1 + Math.max(0, ...Object.values(obj).map(getDepth))
  }
  
  return getDepth(props.response.data)
}

const getPerformanceClass = (): string => {
  if (!props.response) return 'bg-gray-100'
  const duration = props.response.duration
  if (duration < 200) return 'bg-green-100'
  if (duration < 1000) return 'bg-yellow-100'
  return 'bg-red-100'
}

const getPerformanceIcon = (): string => {
  if (!props.response) return '⏱️'
  const duration = props.response.duration
  if (duration < 200) return '🚀'
  if (duration < 1000) return '⚡'
  return '🐌'
}

const getPerformanceText = (): string => {
  if (!props.response) return 'Aucune donnée'
  const duration = props.response.duration
  if (duration < 200) return 'Excellente performance'
  if (duration < 1000) return 'Performance correcte'
  return 'Performance lente'
}

const getPerformanceDescription = (): string => {
  if (!props.response) return ''
  const duration = props.response.duration
  if (duration < 200) return 'Réponse très rapide (< 200ms)'
  if (duration < 1000) return 'Réponse acceptable (< 1s)'
  return 'Réponse lente (> 1s)'
}

const copyResponse = async () => {
  if (!props.response) return
  
  try {
    const text = JSON.stringify(props.response.data, null, 2)
    await navigator.clipboard.writeText(text)
    // TODO: Ajouter une notification toast
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
  }
}

const downloadResponse = () => {
  if (!props.response) return
  
  const dataStr = JSON.stringify(props.response.data, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `api-response-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const togglePrettyPrint = async () => {
  isFormatting.value = true
  await new Promise(resolve => setTimeout(resolve, 100)) // Simule le formatage
  prettyPrint.value = !prettyPrint.value
  isFormatting.value = false
}

// Reset active tab when response changes
watch(() => props.response, () => {
  if (props.response) {
    activeTab.value = 'body'
  }
})
</script>
