<template>
  <div class="fade-in min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold mb-6">
          🚀 API Demo - CV Interactif
        </h1>
        <p class="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
          Explorez mon profil professionnel à travers une API REST complète. 
          Testez les endpoints, visualisez les données en temps réel et découvrez 
          une approche moderne de présentation CV.
        </p>
        <div class="flex justify-center items-center gap-6 text-sm">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
            <span>API En ligne</span>
          </div>
          <div class="flex items-center gap-2">
            <span>📊</span>
            <span>{{ totalEndpoints }} Endpoints disponibles</span>
          </div>
          <div class="flex items-center gap-2">
            <span>⚡</span>
            <span>Temps de réponse moyen: {{ averageResponseTime }}ms</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Navigation des onglets -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <span class="text-lg">{{ tab.icon }}</span>
            {{ tab.name }}
            <span v-if="tab.badge" class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {{ tab.badge }}
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Vue Explorer (par défaut) -->
      <div v-if="activeTab === 'explorer'" class="space-y-8">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Explorer -->
          <div class="lg:col-span-1">
            <EndpointExplorer
              :selected-endpoint="selectedEndpoint"
              @endpoint-selected="handleEndpointSelected"
            />
          </div>
          
          <!-- Tester -->
          <div class="lg:col-span-2">
            <ApiTester
              :selected-endpoint="selectedEndpoint"
              :base-url="baseUrl"
              @response-received="handleResponseReceived"
            />
          </div>
        </div>

        <!-- Response Viewer -->
        <div v-if="currentResponse">
          <ResponseViewer :response="currentResponse" />
        </div>
      </div>

      <!-- Vue Historique -->
      <div v-if="activeTab === 'history'">
        <RequestHistoryComponent
          :current-response="currentResponse"
          :current-endpoint="selectedEndpoint"
          @history-item-selected="handleHistoryItemSelected"
        />
      </div>

      <!-- Vue Statistiques -->
      <div v-if="activeTab === 'stats'">
        <StatsVisualizer :history="requestHistory" />
      </div>

      <!-- Vue Documentation -->
      <div v-if="activeTab === 'docs'" class="space-y-8">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white">
            <h2 class="text-2xl font-bold mb-2">📖 Documentation API</h2>
            <p class="text-gray-300">Guide complet pour utiliser l'API Portfolio</p>
          </div>
          
          <div class="p-6 space-y-6">
            <!-- Introduction -->
            <section>
              <h3 class="text-xl font-semibold mb-4">🎯 Vue d'ensemble</h3>
              <div class="prose max-w-none">
                <p class="text-gray-600 leading-relaxed">
                  Cette API REST transforme un portfolio traditionnel en <strong>CV interactif nouvelle génération</strong>. 
                  Elle expose toutes les informations professionnelles via des endpoints structurés, 
                  permettant une exploration dynamique et une intégration facile dans d'autres applications.
                </p>
              </div>
            </section>

            <!-- URL de base -->
            <section class="border-t pt-6">
              <h3 class="text-xl font-semibold mb-4">🌐 URL de base</h3>
              <div class="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono">
                <div class="flex items-center justify-between">
                  <span>{{ baseUrl }}</span>
                  <button
                    @click="copyBaseUrl"
                    class="text-gray-400 hover:text-white transition-colors"
                    title="Copier l'URL"
                  >
                    📋
                  </button>
                </div>
              </div>
            </section>

            <!-- Exemples de requêtes -->            
            <section class="border-t pt-6">
              <h3 class="text-xl font-semibold mb-4">🛠 Exemples de requêtes</h3>
              
              <div class="space-y-4">
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-100 px-4 py-2 font-semibold text-gray-800">
                    Obtenir le profil de base
                  </div>
                  <div class="p-4">
                    <div class="bg-gray-900 text-gray-100 p-3 rounded font-mono text-sm">
                      <div class="text-green-400">GET</div>
                      <div class="mt-1">{{ baseUrl }}/profile/basic</div>
                    </div>
                    <div class="mt-3 text-sm text-gray-600">
                      Retourne les informations de base : nom, titre, localisation, email
                    </div>
                  </div>
                </div>
                
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-100 px-4 py-2 font-semibold text-gray-800">
                    Obtenir les compétences techniques
                  </div>
                  <div class="p-4">
                    <div class="bg-gray-900 text-gray-100 p-3 rounded font-mono text-sm">
                      <div class="text-green-400">GET</div>
                      <div class="mt-1">{{ baseUrl }}/skills/technical</div>
                    </div>
                    <div class="mt-3 text-sm text-gray-600">
                      Retourne les compétences avec niveaux, années d'expérience et nombre de projets
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <!-- Vue Playground -->      
      <div v-if="activeTab === 'playground'" class="space-y-8">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
            <h2 class="text-2xl font-bold mb-2">🎮 Playground API</h2>
            <p class="text-green-100">Combinez plusieurs endpoints pour créer des vues personnalisées</p>
          </div>
          
          <div class="p-6">
            <div class="text-center py-12 text-gray-500">
              <div class="text-6xl mb-4">🚧</div>
              <h3 class="text-xl font-semibold mb-2">Playground en développement</h3>
              <p class="mb-4">Cette fonctionnalité avancée sera bientôt disponible</p>
              
              <div class="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
                <h4 class="font-semibold text-blue-900 mb-2">Fonctionnalités prévues :</h4>
                <ul class="text-sm text-blue-800 space-y-1 text-left">
                  <li>• Combinaison de plusieurs endpoints</li>
                  <li>• Création de dashboards personnalisés</li>
                  <li>• Export des données combinées</li>
                  <li>• Partage de configurations</li>
                  <li>• Templates de requêtes prédéfinies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer avec stats globales -->    
    <footer class="bg-gray-800 text-white py-8 mt-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div class="text-2xl font-bold text-blue-400">{{ totalRequests }}</div>
            <div class="text-sm text-gray-400">Requêtes effectuées</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-green-400">{{ successRate }}%</div>
            <div class="text-sm text-gray-400">Taux de succès</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-purple-400">{{ averageResponseTime }}ms</div>
            <div class="text-sm text-gray-400">Temps moyen</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-yellow-400">{{ totalEndpoints }}</div>
            <div class="text-sm text-gray-400">Endpoints disponibles</div>
          </div>
        </div>
        
        <div class="mt-6 pt-6 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2025 API Portfolio Demo - Développé avec Vue.js 3 & Laravel</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ApiEndpoint, ApiResponse, RequestHistory } from '@/types'
import { 
  EndpointExplorer, 
  ApiTester, 
  ResponseViewer, 
  RequestHistory as RequestHistoryComponent,
  StatsVisualizer 
} from '@/components/ApiDemo'
import { apiService } from '@/services/apiService'

// Reactive data
const activeTab = ref('explorer')
const selectedEndpoint = ref<ApiEndpoint | null>(null)
const currentResponse = ref<ApiResponse | null>(null)
const requestHistory = ref<RequestHistory[]>([])
const baseUrl = ref('http://localhost:8000/api')

// Computed
const tabs = computed(() => [
  { 
    id: 'explorer', 
    name: 'Explorer & Tester', 
    icon: '🚀',
    badge: selectedEndpoint.value ? '1' : ''
  },
  { 
    id: 'history', 
    name: 'Historique', 
    icon: '📜',
    badge: requestHistory.value.length > 0 ? requestHistory.value.length.toString() : ''
  },
  { 
    id: 'stats', 
    name: 'Statistiques', 
    icon: '📊',
    badge: ''
  },
  { 
    id: 'docs', 
    name: 'Documentation', 
    icon: '📖',
    badge: ''
  },
  { 
    id: 'playground', 
    name: 'Playground', 
    icon: '🎮',
    badge: 'Soon'
  }
])

const totalEndpoints = computed(() => {
  return apiService.getAllEndpoints().length
})

const totalRequests = computed(() => {
  return requestHistory.value.length
})

const successRate = computed(() => {
  if (requestHistory.value.length === 0) return 0
  const successful = requestHistory.value.filter(item => 
    item.response.status >= 200 && item.response.status < 300
  ).length
  return Math.round((successful / requestHistory.value.length) * 100)
})

const averageResponseTime = computed(() => {
  if (requestHistory.value.length === 0) return 0
  const total = requestHistory.value.reduce((sum, item) => sum + item.response.duration, 0)
  return Math.round(total / requestHistory.value.length)
})

// Methods
const handleEndpointSelected = (endpoint: ApiEndpoint) => {
  selectedEndpoint.value = endpoint
}

const handleResponseReceived = (response: ApiResponse) => {
  currentResponse.value = response
  
  // Ajouter à l'historique
  if (selectedEndpoint.value) {
    const historyItem: RequestHistory = {
      id: generateId(),
      endpoint: selectedEndpoint.value,
      response,
      timestamp: new Date().toISOString(),
      duration: response.duration
    }
    
    requestHistory.value.unshift(historyItem)
    
    // Limiter à 100 requêtes max
    if (requestHistory.value.length > 100) {
      requestHistory.value = requestHistory.value.slice(0, 100)
    }
    
    // Sauvegarder en localStorage
    try {
      localStorage.setItem('api-demo-history', JSON.stringify(requestHistory.value))
    } catch (error) {
      console.warn('Impossible de sauvegarder l\'historique:', error)
    }
  }
}

const handleHistoryItemSelected = (item: RequestHistory) => {
  selectedEndpoint.value = item.endpoint
  currentResponse.value = item.response
  activeTab.value = 'explorer'
}

const copyBaseUrl = async () => {
  try {
    await navigator.clipboard.writeText(baseUrl.value)
    // TODO: Ajouter une notification toast
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
  }
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Load history on mount
const loadHistory = () => {
  try {
    const saved = localStorage.getItem('api-demo-history')
    if (saved) {
      requestHistory.value = JSON.parse(saved)
    }
  } catch (error) {
    console.warn('Erreur lors du chargement de l\'historique:', error)
  }
}

// Initialize
loadHistory()
</script>
