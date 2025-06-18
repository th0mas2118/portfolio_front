<template>
  <div class="fixed top-4 right-4 z-50 space-y-3">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'max-w-sm bg-white rounded-lg shadow-lg border transform transition-all duration-300 ease-in-out',
        toast.visible
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95',
        getToastClasses(toast.type)
      ]"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <span class="text-xl">{{ getToastIcon(toast.type) }}</span>
          </div>
          <div class="ml-3 w-0 flex-1">
            <p class="text-sm font-medium" :class="getTextColor(toast.type)">
              {{ toast.title }}
            </p>
            <p v-if="toast.message" class="mt-1 text-sm text-gray-500">
              {{ toast.message }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="removeToast(toast.id)"
              class="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span class="sr-only">Fermer</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Progress bar -->
      <div class="h-1 w-full bg-gray-200 rounded-b-lg overflow-hidden">
        <div
          :class="[
            'h-full transition-all ease-linear',
            getProgressColor(toast.type)
          ]"
          :style="{ 
            width: '100%',
            animation: `shrink ${toast.duration}ms linear forwards`
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

const getToastIcon = (type: string): string => {
  switch (type) {
    case 'success':
      return '✅'
    case 'error':
      return '❌'
    case 'warning':
      return '⚠️'
    case 'info':
      return 'ℹ️'
    default:
      return 'ℹ️'
  }
}

const getToastClasses = (type: string): string => {
  switch (type) {
    case 'success':
      return 'border-green-200'
    case 'error':
      return 'border-red-200'
    case 'warning':
      return 'border-yellow-200'
    case 'info':
      return 'border-blue-200'
    default:
      return 'border-gray-200'
  }
}

const getTextColor = (type: string): string => {
  switch (type) {
    case 'success':
      return 'text-green-800'
    case 'error':
      return 'text-red-800'
    case 'warning':
      return 'text-yellow-800'
    case 'info':
      return 'text-blue-800'
    default:
      return 'text-gray-800'
  }
}

const getProgressColor = (type: string): string => {
  switch (type) {
    case 'success':
      return 'bg-green-500'
    case 'error':
      return 'bg-red-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'info':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}
</script>

<style scoped>
@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
