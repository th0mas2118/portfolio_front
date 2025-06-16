<template>
  <div class="fade-in py-20">
    <div class="max-w-7xl mx-auto px-4">
      <h1 class="text-4xl font-bold text-center mb-12">Mes Projets</h1>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="project in projects" 
          :key="project.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div class="h-48 bg-gradient-to-br from-blue-400 to-purple-500"></div>
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-3">{{ project.title }}</h3>
            <p class="text-gray-600 mb-4">{{ project.description }}</p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="tech in project.technologies" 
                :key="tech"
                class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {{ tech }}
              </span>
            </div>
            <div class="flex space-x-4">
              <a 
                href="#" 
                class="text-blue-600 hover:text-blue-800 font-medium"
              >
                Voir le code
              </a>
              <a 
                href="#" 
                class="text-green-600 hover:text-green-800 font-medium"
              >
                Demo live
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Project } from '@/types'

const projects = ref<Project[]>([
  {
    id: 1,
    title: 'E-commerce API',
    description: 'API REST complète pour une boutique en ligne avec gestion des produits, commandes et paiements.',
    technologies: ['Laravel', 'MySQL', 'JWT', 'Stripe']
  },
  {
    id: 2,
    title: 'Dashboard Analytics',
    description: 'Interface d\'administration avec graphiques et statistiques temps réel.',
    technologies: ['Vue.js', 'Chart.js', 'Tailwind', 'WebSockets']
  },
  {
    id: 3,
    title: 'Blog Personnel',
    description: 'CMS personnalisé avec éditeur de contenu et système de commentaires.',
    technologies: ['Laravel', 'Vue.js', 'TinyMCE', 'Redis']
  },
  {
    id: 4,
    title: 'Application Mobile',
    description: 'App hybride de gestion de tâches avec synchronisation cloud.',
    technologies: ['Vue.js', 'Capacitor', 'Laravel API', 'PWA']
  },
  {
    id: 5,
    title: 'Système de Réservation',
    description: 'Plateforme de réservation en ligne avec calendrier interactif.',
    technologies: ['Vue.js', 'Laravel', 'FullCalendar', 'Payment']
  },
  {
    id: 6,
    title: 'Chat en Temps Réel',
    description: 'Application de messagerie instantanée avec notifications push.',
    technologies: ['Vue.js', 'Socket.io', 'Laravel', 'Redis']
  }
])
</script>
