<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
      <h2 class="text-2xl font-bold mb-2">🧪 API Tester</h2>
      <p class="text-green-100">Testez les endpoints en temps réel</p>
    </div>

    <div v-if="!selectedEndpoint" class="p-8 text-center text-gray-500">
      <div class="text-6xl mb-4">👆</div>
      <p class="text-lg">Sélectionnez un endpoint dans l'explorer</p>
      <p class="text-sm">pour commencer à tester l'API</p>
    </div>

    <div v-else class="p-6 space-y-6">
      <!-- Endpoint sélectionné -->
      <div class="border rounded-lg p-4 bg-gray-50">
        <div class="flex items-center gap-3 mb-2">
          <span
            :class="[
              'px-3 py-1 rounded text-sm font-mono font-bold',
              getMethodColor(selectedEndpoint.method)
            ]"
          >
            {{ selectedEndpoint.method }}
          </span>
          <h3 class="text-lg font-semibold">{{ selectedEndpoint.name }}</h3>
          <button
            @click="toggleFavorite"
            :class="[
              'p-1 rounded transition-colors',
              isFavorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'
            ]"
            title="Ajouter aux favoris"
          >
            ⭐
          </button>
        </div>
        <p class="text-gray-600 mb-2">{{ selectedEndpoint.description }}</p>
        <div class="flex items-center gap-2 text-sm">
          <span class="font-mono bg-white px-2 py-1 rounded border">{{ baseUrl }}{{ selectedEndpoint.path }}</span>
          <button
            @click="copyEndpointUrl"
            class="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            title="Copier l'URL"
          >
            📋
          </button>
        </div>
      </div>

      <!-- Paramètres -->
      <div v-if="selectedEndpoint.parameters?.length" class="space-y-4">
        <h4 class="font-semibold text-gray-900">Paramètres</h4>
        <div
          v-for="param in selectedEndpoint.parameters"
          :key="param.name"
          class="border rounded-lg p-3"
        >
          <div class="flex items-center gap-2 mb-2">
            <label class="font-medium text-gray-700">{{ param.name }}</label>
            <span v-if="param.required" class="text-red-500 text-xs">*</span>
            <span class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{{ param.type }}</span>
          </div>
          <p class="text-sm text-gray-600 mb-2">{{ param.description }}</p>
          <input
            v-model="parameters[param.name]"
            :type="getInputType(param.type)"
            :placeholder="param.defaultValue || `Entrez ${param.name}...`"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
        </div>
      </div>

      <!-- Headers personnalisés -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h4 class="font-semibold text-gray-900">Headers personnalisés</h4>
          <button
            @click="addCustomHeader"
            class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            + Ajouter
          </button>
        </div>
        
        <div v-if="customHeaders.length === 0" class="text-sm text-gray-500 italic">
          Aucun header personnalisé
        </div>
        
        <div
          v-for="(header, index) in customHeaders"
          :key="index"
          class="flex gap-3 items-center"
        >
          <input
            v-model="header.key"
            placeholder="Nom du header"
            class="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
          <input
            v-model="header.value"
            placeholder="Valeur"
            class="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
          <button
            @click="removeCustomHeader(index)"
            class="p-2 text-red-500 hover:text-red-700 transition-colors"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>

      <!-- Body (pour POST/PUT) -->
      <div v-if="['POST', 'PUT'].includes(selectedEndpoint.method)" class="space-y-4">
        <h4 class="font-semibold text-gray-900">Corps de la requête (JSON)</h4>
        <textarea
          v-model="requestBody"
          placeholder='{"key": "value"}'
          class="w-full h-32 px-3 py-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        ></textarea>
        <div class="flex gap-2">
          <button
            @click="formatJson"
            class="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            Formater JSON
          </button>
          <button
            @click="clearBody"
            class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Vider
          </button>
        </div>
      </div>

      <!-- Bouton d'envoi -->
      <div class="flex items-center gap-4">
        <button
          @click="sendRequest"
          :disabled="isLoading"
          :class="[
            'px-6 py-3 rounded-lg font-semibold transition-all',
            isLoading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 transform hover:scale-105'
          ]"
        >
          <span v-if="isLoading" class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Envoi en cours...
          </span>
          <span v-else>🚀 Envoyer la requête</span>
        </button>

        <div v-if="lastResponse" class="text-sm text-gray-600">
          Dernière requête: {{ formatDuration(lastResponse.duration) }}
        </div>
      </div>

      <!-- Exemple de réponse -->
      <div v-if="selectedEndpoint.exampleResponse" class="border rounded-lg p-4 bg-blue-50">
        <h4 class="font-semibold text-blue-900 mb-2">📋 Exemple de réponse</h4>
        <pre class="text-sm bg-white p-3 rounded border overflow-x-auto"><code>{{ JSON.stringify(selectedEndpoint.exampleResponse, null, 2) }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ApiEndpoint, ApiResponse, CustomHeader } from '@/types'
import { apiService } from '@/services/apiService'

// Props
interface Props {
  selectedEndpoint: ApiEndpoint | null
  baseUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  baseUrl: 'http://localhost:8000/api'
})

// Emits
const emit = defineEmits<{
  responseReceived: [response: ApiResponse]
}>()

// Reactive data
const isLoading = ref(false)
const parameters = ref<Record<string, any>>({})
const customHeaders = ref<CustomHeader[]>([])
const requestBody = ref('')
const lastResponse = ref<ApiResponse | null>(null)
const favorites = ref<number[]>([])

// Computed
const isFavorite = computed(() => {
  return props.selectedEndpoint ? favorites.value.includes(props.selectedEndpoint.id) : false
})

// Watchers
watch(() => props.selectedEndpoint, (newEndpoint) => {
  if (newEndpoint) {
    // Reset parameters when endpoint changes
    parameters.value = {}
    requestBody.value = ''
    
    // Initialize parameters with default values
    if (newEndpoint.parameters) {
      newEndpoint.parameters.forEach(param => {
        if (param.defaultValue !== undefined) {
          parameters.value[param.name] = param.defaultValue
        }
      })
    }
  }
}, { immediate: true })

// Methods
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

const getInputType = (paramType: string) => {
  switch (paramType) {
    case 'number':
      return 'number'
    case 'boolean':
      return 'checkbox'
    default:
      return 'text'
  }
}

const addCustomHeader = () => {
  customHeaders.value.push({ key: '', value: '' })
}

const removeCustomHeader = (index: number) => {
  customHeaders.value.splice(index, 1)
}

const formatJson = () => {
  try {
    const parsed = JSON.parse(requestBody.value)
    requestBody.value = JSON.stringify(parsed, null, 2)
  } catch (error) {
    alert('JSON invalide')
  }
}

const clearBody = () => {
  requestBody.value = ''
}

const copyEndpointUrl = () => {
  if (props.selectedEndpoint) {
    const url = `${props.baseUrl}${props.selectedEndpoint.path}`
    navigator.clipboard.writeText(url)
    // TODO: Ajouter une notification toast
  }
}

const toggleFavorite = () => {
  if (!props.selectedEndpoint) return
  
  const index = favorites.value.indexOf(props.selectedEndpoint.id)
  if (index >= 0) {
    favorites.value.splice(index, 1)
  } else {
    favorites.value.push(props.selectedEndpoint.id)
  }
  
  // Sauvegarder en localStorage (simulation)
  try {
    localStorage.setItem('api-favorites', JSON.stringify(favorites.value))
  } catch (error) {
    console.warn('Impossible de sauvegarder les favoris:', error)
  }
}

const validateRequiredParams = (): boolean => {
  if (!props.selectedEndpoint?.parameters) return true
  
  for (const param of props.selectedEndpoint.parameters) {
    if (param.required && (!parameters.value[param.name] || parameters.value[param.name] === '')) {
      alert(`Le paramètre "${param.name}" est requis`)
      return false
    }
  }
  return true
}

const buildRequestEndpoint = (): ApiEndpoint => {
  if (!props.selectedEndpoint) throw new Error('Aucun endpoint sélectionné')
  
  let path = props.selectedEndpoint.path
  
  // Replace path parameters
  if (props.selectedEndpoint.parameters) {
    props.selectedEndpoint.parameters.forEach(param => {
      const value = parameters.value[param.name]
      if (value !== undefined && value !== '') {
        path = path.replace(`{${param.name}}`, encodeURIComponent(value.toString()))
      }
    })
  }
  
  return {
    ...props.selectedEndpoint,
    path
  }
}

const sendRequest = async () => {
  if (!props.selectedEndpoint) return
  
  if (!validateRequiredParams()) return
  
  isLoading.value = true
  
  try {
    const endpoint = buildRequestEndpoint()
    
    // Filter out empty headers
    const validHeaders = customHeaders.value.filter(h => h.key.trim() && h.value.trim())
    
    let body = undefined
    if (['POST', 'PUT'].includes(endpoint.method) && requestBody.value.trim()) {
      try {
        body = JSON.parse(requestBody.value)
      } catch (error) {
        alert('Corps de requête JSON invalide')
        return
      }
    }
    
    const response = await apiService.makeRequest(endpoint, validHeaders, body)
    lastResponse.value = response
    emit('responseReceived', response)
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la requête:', error)
    alert('Erreur lors de l\'envoi de la requête')
  } finally {
    isLoading.value = false
  }
}

const formatDuration = (ms: number): string => {
  if (ms < 1000) {
    return `${ms}ms`
  }
  return `${(ms / 1000).toFixed(2)}s`
}

// Load favorites on mount
const loadFavorites = () => {
  try {
    const saved = localStorage.getItem('api-favorites')
    if (saved) {
      favorites.value = JSON.parse(saved)
    }
  } catch (error) {
    console.warn('Erreur lors du chargement des favoris:', error)
  }
}

// Initialize
loadFavorites()
</script>
