<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Header avec recherche -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
      <h2 class="text-2xl font-bold mb-4">🚀 API Explorer</h2>
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un endpoint..."
          class="w-full px-4 py-2 pl-10 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          @input="handleSearch"
        >
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>

    <!-- Stats rapides -->
    <div class="px-6 py-4 bg-gray-50 border-b">
      <div class="flex justify-between items-center text-sm text-gray-600">
        <span>{{ totalEndpoints }} endpoints disponibles</span>
        <span v-if="selectedCategory">{{ filteredEndpoints.length }} dans {{ selectedCategory.name }}</span>
      </div>
    </div>

    <!-- Navigation par catégories -->
    <div class="px-6 py-4 border-b">
      <div class="flex flex-wrap gap-2">
        <button
          @click="selectCategory(null)"
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium transition-colors',
            !selectedCategory
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          Tous
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectCategory(category)"
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-1',
            selectedCategory?.id === category.id
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          <span>{{ category.icon }}</span>
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- Liste des endpoints -->
    <div class="max-h-96 overflow-y-auto">
      <div v-if="filteredEndpoints.length === 0" class="p-6 text-center text-gray-500">
        <div class="text-6xl mb-4">🔍</div>
        <p>Aucun endpoint trouvé</p>
        <p class="text-sm">Essayez de modifier votre recherche</p>
      </div>
      
      <div v-else>
        <button
          v-for="endpoint in filteredEndpoints"
          :key="endpoint.id"
          @click="selectEndpoint(endpoint)"
          :class="[
            'w-full px-6 py-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors',
            selectedEndpoint?.id === endpoint.id ? 'bg-blue-50 border-blue-200' : ''
          ]"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-1">
                <span
                  :class="[
                    'px-2 py-1 rounded text-xs font-mono font-bold',
                    getMethodColor(endpoint.method)
                  ]"
                >
                  {{ endpoint.method }}
                </span>
                <h3 class="font-semibold text-gray-900">{{ endpoint.name }}</h3>
              </div>
              <p class="text-sm text-gray-600 mb-1">{{ endpoint.description }}</p>
              <p class="text-xs text-gray-500 font-mono">{{ endpoint.path }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="endpoint.requiresAuth" class="text-yellow-500" title="Authentification requise">
                🔒
              </span>
              <span v-if="endpoint.parameters?.length" class="text-blue-500" title="Paramètres requis">
                ⚙️
              </span>
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Endpoints favoris -->
    <div v-if="favoriteEndpoints.length > 0" class="px-6 py-4 bg-yellow-50 border-t">
      <h3 class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
        ⭐ Favoris
      </h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="endpoint in favoriteEndpoints"
          :key="endpoint.id"
          @click="selectEndpoint(endpoint)"
          class="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs hover:bg-yellow-300 transition-colors"
        >
          {{ endpoint.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { ApiEndpoint, ApiCategory } from '@/types'
import { apiService } from '@/services/apiService'

// Props
interface Props {
  selectedEndpoint?: ApiEndpoint | null
}

// Pas besoin de stocker props si on ne l'utilise pas
defineProps<Props>()

// Emits
const emit = defineEmits<{
  endpointSelected: [endpoint: ApiEndpoint]
}>()

// Reactive data
const searchQuery = ref('')
const selectedCategory = ref<ApiCategory | null>(null)
const categories = ref<ApiCategory[]>([])
const favoriteEndpoints = ref<ApiEndpoint[]>([])

// Computed
const totalEndpoints = computed(() => {
  return categories.value.reduce((total, category) => total + category.endpoints.length, 0)
})

const filteredEndpoints = computed(() => {
  let endpoints = selectedCategory.value
    ? selectedCategory.value.endpoints
    : categories.value.flatMap(cat => cat.endpoints)

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    endpoints = endpoints.filter(endpoint =>
      endpoint.name.toLowerCase().includes(query) ||
      endpoint.description.toLowerCase().includes(query) ||
      endpoint.path.toLowerCase().includes(query)
    )
  }

  return endpoints
})

// Methods
const selectCategory = (category: ApiCategory | null) => {
  selectedCategory.value = category
  searchQuery.value = ''
}

const selectEndpoint = (endpoint: ApiEndpoint) => {
  emit('endpointSelected', endpoint)
}

const handleSearch = () => {
  // La recherche est gérée par le computed filteredEndpoints
  if (searchQuery.value.trim()) {
    selectedCategory.value = null // Afficher tous les résultats lors de la recherche
  }
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

// Fonction pour gérer les favoris (non utilisée actuellement)
// const toggleFavorite = (endpoint: ApiEndpoint) => {
//   const index = favoriteEndpoints.value.findIndex(fav => fav.id === endpoint.id)
//   if (index >= 0) {
//     favoriteEndpoints.value.splice(index, 1)
//   } else {
//     favoriteEndpoints.value.push(endpoint)
//   }
//   // Sauvegarder en localStorage
//   localStorage.setItem('api-favorites', JSON.stringify(favoriteEndpoints.value))
// }

const loadFavorites = () => {
  try {
    const saved = localStorage.getItem('api-favorites')
    if (saved) {
      favoriteEndpoints.value = JSON.parse(saved)
    }
  } catch (error) {
    console.warn('Erreur lors du chargement des favoris:', error)
  }
}

// Lifecycle
onMounted(() => {
  categories.value = apiService.getCategories()
  loadFavorites()
})
</script>
