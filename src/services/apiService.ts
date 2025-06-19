import axios, { AxiosResponse } from 'axios'
import type { ApiEndpoint, ApiResponse, CustomHeader, ApiCategory } from '@/types'

class ApiService {
  private baseURL: string
  private requestCount: number = 0

  constructor(baseURL?: string) {
    this.baseURL = baseURL || import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
  }

  async makeRequest(
    endpoint: ApiEndpoint,
    customHeaders: CustomHeader[] = [],
    body?: any
  ): Promise<ApiResponse> {
    const startTime = performance.now()
    this.requestCount++

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...customHeaders.reduce((acc, header) => {
          acc[header.key] = header.value
          return acc
        }, {} as Record<string, string>)
      }

      const response: AxiosResponse = await axios({
        method: endpoint.method,
        url: `${this.baseURL}${endpoint.path}`,
        headers,
        data: body,
        timeout: 30000
      })

      const endTime = performance.now()
      const duration = endTime - startTime

      const responseSize = new Blob([JSON.stringify(response.data)]).size

      return {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>,
        data: response.data,
        duration: Math.round(duration),
        timestamp: new Date().toISOString(),
        size: responseSize
      }
    } catch (error: any) {
      const endTime = performance.now()
      const duration = endTime - startTime

      const errorResponse = error.response || {}
      
      return {
        status: errorResponse.status || 0,
        statusText: errorResponse.statusText || 'Network Error',
        headers: (errorResponse.headers || {}) as Record<string, string>,
        data: errorResponse.data || { error: error.message },
        duration: Math.round(duration),
        timestamp: new Date().toISOString(),
        size: 0
      }
    }
  }

  getCategories(): ApiCategory[] {
    return [
      {
        id: 'profile',
        name: 'Profil & Identité',
        description: 'Informations personnelles et professionnelles',
        icon: '👤',
        endpoints: [
          {
            id: 1,
            name: 'Profil de base',
            method: 'GET',
            path: '/profile/basic',
            description: 'Informations de base (nom, titre, localisation)',
            category: 'profile',
            exampleResponse: {
              name: 'Votre Nom',
              title: 'Développeur Full Stack',
              location: 'Paris, France',
              email: 'contact@exemple.com'
            }
          },
          {
            id: 2,
            name: 'Biographie',
            method: 'GET',
            path: '/profile/bio',
            description: 'Biographie détaillée',
            category: 'profile',
            exampleResponse: {
              short: 'Développeur passionné...',
              long: 'Développeur full stack avec...'
            }
          },
          {
            id: 3,
            name: 'Contact',
            method: 'GET',
            path: '/profile/contact',
            description: 'Coordonnées et réseaux sociaux',
            category: 'profile'
          },
          {
            id: 4,
            name: 'Disponibilité',
            method: 'GET',
            path: '/profile/availability',
            description: 'Disponibilité pour missions/emploi',
            category: 'profile'
          }
        ]
      },
      {
        id: 'skills',
        name: 'Compétences & Technologies',
        description: 'Compétences techniques et niveaux de maîtrise',
        icon: '🛠️',
        endpoints: [
          {
            id: 10,
            name: 'Compétences techniques',
            method: 'GET',
            path: '/skills/technical',
            description: 'Compétences techniques avec niveaux',
            category: 'skills',
            exampleResponse: {
              frontend: {
                'Vue.js': { level: 9, years: 3, projects: 15 },
                'JavaScript': { level: 8, years: 4, projects: 20 }
              },
              backend: {
                'Laravel': { level: 8, years: 2, projects: 10 },
                'PHP': { level: 7, years: 3, projects: 12 }
              }
            }
          },
          {
            id: 11,
            name: 'Soft skills',
            method: 'GET',
            path: '/skills/soft',
            description: 'Compétences interpersonnelles',
            category: 'skills'
          },
          {
            id: 12,
            name: 'Frameworks',
            method: 'GET',
            path: '/skills/frameworks',
            description: 'Frameworks maîtrisés',
            category: 'skills'
          },
          {
            id: 13,
            name: 'Bases de données',
            method: 'GET',
            path: '/skills/databases',
            description: 'Systèmes de bases de données',
            category: 'skills'
          }
        ]
      },
      {
        id: 'projects',
        name: 'Projets & Portfolio',
        description: 'Projets développés et réalisations',
        icon: '🚀',
        endpoints: [
          {
            id: 20,
            name: 'Projets en vedette',
            method: 'GET',
            path: '/projects/featured',
            description: 'Projets mis en avant',
            category: 'projects'
          },
          {
            id: 21,
            name: 'Tous les projets',
            method: 'GET',
            path: '/projects/all',
            description: 'Liste complète des projets',
            category: 'projects'
          },
          {
            id: 22,
            name: 'Détails projet',
            method: 'GET',
            path: '/projects/{id}',
            description: 'Détails d\'un projet spécifique',
            category: 'projects',
            parameters: [
              {
                name: 'id',
                type: 'number',
                required: true,
                description: 'Identifiant du projet'
              }
            ]
          },
          {
            id: 23,
            name: 'Statistiques projets',
            method: 'GET',
            path: '/projects/statistics',
            description: 'Statistiques des projets (nb, techno, dates)',
            category: 'projects'
          }
        ]
      },
      {
        id: 'experience',
        name: 'CV & Expériences',
        description: 'Parcours professionnel et formation',
        icon: '📄',
        endpoints: [
          {
            id: 30,
            name: 'CV complet',
            method: 'GET',
            path: '/cv/full',
            description: 'CV complet formaté',
            category: 'experience'
          },
          {
            id: 31,
            name: 'Expériences professionnelles',
            method: 'GET',
            path: '/experience/professional',
            description: 'Historique professionnel',
            category: 'experience'
          },
          {
            id: 32,
            name: 'Formation',
            method: 'GET',
            path: '/experience/education',
            description: 'Formation et diplômes',
            category: 'experience'
          },
          {
            id: 33,
            name: 'Timeline',
            method: 'GET',
            path: '/experience/timeline',
            description: 'Timeline chronologique',
            category: 'experience'
          }
        ]
      },
      {
        id: 'stats',
        name: 'Statistiques & Métriques',
        description: 'Analytics et métriques en temps réel',
        icon: '📊',
        endpoints: [
          {
            id: 40,
            name: 'Stats portfolio',
            method: 'GET',
            path: '/stats/portfolio',
            description: 'Statistiques du portfolio',
            category: 'stats'
          },
          {
            id: 41,
            name: 'Visiteurs',
            method: 'GET',
            path: '/stats/visitors',
            description: 'Statistiques des visiteurs',
            category: 'stats',
            exampleResponse: {
              today: 45,
              this_week: 312,
              this_month: 1250,
              total: 15420,
              popular_endpoints: [
                { path: '/api/projects/all', hits: 234 },
                { path: '/api/skills/technical', hits: 189 }
              ]
            }
          },
          {
            id: 42,
            name: 'Performance',
            method: 'GET',
            path: '/stats/performance',
            description: 'Métriques de performance',
            category: 'stats'
          }
        ]
      },
      {
        id: 'github',
        name: 'Activité GitHub',
        description: 'Statistiques et activité de développement',
        icon: '🐙',
        endpoints: [
          {
            id: 50,
            name: 'Stats GitHub',
            method: 'GET',
            path: '/github/stats',
            description: 'Statistiques GitHub générales',
            category: 'github'
          },
          {
            id: 51,
            name: 'Commits récents',
            method: 'GET',
            path: '/github/commits',
            description: 'Activité de commits récente',
            category: 'github'
          },
          {
            id: 52,
            name: 'Langages',
            method: 'GET',
            path: '/github/languages',
            description: 'Répartition des langages utilisés',
            category: 'github'
          }
        ]
      },
      {
        id: 'meta',
        name: 'Meta & Documentation',
        description: 'Informations sur l\'API elle-même',
        icon: '🔧',
        endpoints: [
          {
            id: 60,
            name: 'Endpoints',
            method: 'GET',
            path: '/meta/endpoints',
            description: 'Liste de tous les endpoints',
            category: 'meta'
          },
          {
            id: 61,
            name: 'Documentation',
            method: 'GET',
            path: '/meta/documentation',
            description: 'Documentation complète de l\'API',
            category: 'meta'
          },
          {
            id: 62,
            name: 'Version',
            method: 'GET',
            path: '/meta/version',
            description: 'Version actuelle de l\'API',
            category: 'meta'
          },
          {
            id: 63,
            name: 'Santé',
            method: 'GET',
            path: '/health',
            description: 'Status de santé de l\'API',
            category: 'meta'
          }
        ]
      }
    ]
  }

  getAllEndpoints(): ApiEndpoint[] {
    return this.getCategories().flatMap(category => category.endpoints)
  }

  getEndpointsByCategory(categoryId: string): ApiEndpoint[] {
    const category = this.getCategories().find(cat => cat.id === categoryId)
    return category?.endpoints || []
  }

  searchEndpoints(query: string): ApiEndpoint[] {
    const allEndpoints = this.getAllEndpoints()
    const lowercaseQuery = query.toLowerCase()
    
    return allEndpoints.filter(endpoint =>
      endpoint.name.toLowerCase().includes(lowercaseQuery) ||
      endpoint.description.toLowerCase().includes(lowercaseQuery) ||
      endpoint.path.toLowerCase().includes(lowercaseQuery)
    )
  }

  getRequestCount(): number {
    return this.requestCount
  }

  resetRequestCount(): void {
    this.requestCount = 0
  }
}

export const apiService = new ApiService()
export default ApiService
