<template>
  <a 
    :href="href" 
    :target="external ? '_blank' : '_self'"
    :rel="external ? 'noopener noreferrer' : undefined"
    :class="[
      'group flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-gray-200',
      disabled ? 'pointer-events-none opacity-75' : 'cursor-pointer'
    ]"
  >
    <div class="relative">
      <div :class="[
        'w-12 h-12 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg',
        iconBackground
      ]">
        <!-- Slot pour l'icône personnalisée -->
        <slot name="icon">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
          </svg>
        </slot>
      </div>
      
      <!-- Indicateur de statut (point coloré) -->
      <div 
        v-if="statusColor" 
        :class="[
          'absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white group-hover:scale-125 transition-transform duration-300',
          statusColor
        ]"
      ></div>
    </div>
    
    <div class="ml-4 flex-1">
      <h3 class="font-bold text-gray-800 group-hover:text-gray-900 transition-colors flex items-center">
        {{ title }}
        <!-- Icône de lien externe -->
        <svg 
          v-if="external && showExternalIcon" 
          class="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
        </svg>
      </h3>
      
      <p :class="[
        'font-medium transition-colors',
        linkColorClass
      ]">
        {{ subtitle }}
      </p>
      
      <p v-if="description" class="text-sm text-gray-500 mt-1">
        {{ description }}
      </p>
    </div>
    
    <!-- Slot pour contenu supplémentaire à droite -->
    <div v-if="$slots.extra" class="ml-auto">
      <slot name="extra"></slot>
    </div>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  subtitle: string
  description?: string
  href: string
  external?: boolean
  showExternalIcon?: boolean
  disabled?: boolean
  iconBackground?: string
  statusColor?: string
  linkColor?: 'blue' | 'green' | 'purple' | 'red' | 'gray'
}

const props = withDefaults(defineProps<Props>(), {
  external: true,
  showExternalIcon: true,
  disabled: false,
  iconBackground: 'bg-gradient-to-br from-gray-500 to-gray-700',
  linkColor: 'blue'
})

// Classes CSS dynamiques pour les couleurs de lien
const linkColorClass = computed(() => {
  const colors = {
    blue: 'text-gray-600 group-hover:text-blue-600',
    green: 'text-gray-600 group-hover:text-green-600',
    purple: 'text-gray-600 group-hover:text-purple-600',
    red: 'text-gray-600 group-hover:text-red-600',
    gray: 'text-gray-600 group-hover:text-gray-700'
  }
  return colors[props.linkColor]
})
</script>

<script lang="ts">
export default {
  name: 'SocialCard'
}
</script>
