<template>
  <div class="fade-in py-20">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-4xl font-bold text-center mb-12">Contact</h1>
      
      <div class="grid md:grid-cols-2 gap-12">
        <!-- Informations de contact -->
        <div>
          <h2 class="text-2xl font-semibold mb-6">Restons en contact</h2>
          <p class="text-gray-600 mb-8">
            N'hésitez pas à me contacter pour discuter d'un projet, 
            d'une collaboration ou simplement pour échanger sur le développement web.
          </p>
          
          <div class="space-y-6">
            <!-- GitHub -->
            <SocialCard
              title="GitHub"
              subtitle="github.com/th0mas2118"
              description="Mes projets et contributions"
              href="https://github.com/th0mas2118"
              icon-background="bg-gradient-to-br from-gray-700 to-gray-900"
              status-color="bg-green-400"
              link-color="blue"
            >
              <template #icon>
                <GitHubIcon />
              </template>
            </SocialCard>
            
            <!-- LinkedIn -->
            <SocialCard
              title="LinkedIn"
              subtitle="thomas-pierson-88a99b229"
              description="Mon profil professionnel"
              href="https://linkedin.com/in/thomas-pierson-88a99b229"
              icon-background="bg-gradient-to-br from-blue-600 to-blue-800"
              status-color="bg-blue-400"
              link-color="blue"
            >
              <template #icon>
                <LinkedInIcon />
              </template>
            </SocialCard>

            <!-- Info supplémentaire -->
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-white">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 class="font-bold">Réponse rapide</h3>
              </div>
              <p class="text-white/90 text-sm leading-relaxed">
                Je réponds généralement dans les 24h. Pour les projets urgents, n'hésitez pas à le mentionner.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Formulaire de contact -->
        <div>
          <!-- Messages d'état -->
          <div v-if="status.success" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="font-medium text-green-800">Message envoyé avec succès !</span>
            </div>
            <p class="text-green-700 text-sm mt-1">Je vous répondrai dans les plus brefs délais.</p>
          </div>
          
          <div v-if="status.error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="font-medium text-red-800">Erreur</span>
            </div>
            <p class="text-red-700 text-sm mt-1">{{ status.error }}</p>
          </div>

          <form @submit.prevent="sendMessage" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <input 
                type="text" 
                id="name"
                v-model="form.name"
                @input="clearError('name')"
                :class="[
                  'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                  validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
                :disabled="status.loading"
                required
              >
              <p v-if="validationErrors.name" class="text-red-600 text-sm mt-1">{{ validationErrors.name }}</p>
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input 
                type="email" 
                id="email"
                v-model="form.email"
                @input="clearError('email')"
                :class="[
                  'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                  validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
                :disabled="status.loading"
                required
              >
              <p v-if="validationErrors.email" class="text-red-600 text-sm mt-1">{{ validationErrors.email }}</p>
            </div>
            
            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                Sujet *
              </label>
              <input 
                type="text" 
                id="subject"
                v-model="form.subject"
                @input="clearError('subject')"
                :class="[
                  'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                  validationErrors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
                :disabled="status.loading"
                required
              >
              <p v-if="validationErrors.subject" class="text-red-600 text-sm mt-1">{{ validationErrors.subject }}</p>
            </div>
            
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea 
                id="message"
                v-model="form.message"
                @input="clearError('message')"
                rows="5"
                :class="[
                  'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                  validationErrors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
                :disabled="status.loading"
                placeholder="Décrivez votre projet ou votre demande..."
                required
              ></textarea>
              <p v-if="validationErrors.message" class="text-red-600 text-sm mt-1">{{ validationErrors.message }}</p>
              <p v-else class="text-gray-500 text-sm mt-1">Minimum 10 caractères</p>
            </div>
            
            <button 
              type="submit"
              :disabled="status.loading"
              :class="[
                'w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200',
                status.loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:transform hover:scale-105 shadow-lg hover:shadow-xl'
              ]"
              class="text-white"
            >
              <span v-if="status.loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi en cours...
              </span>
              <span v-else>Envoyer le message</span>
            </button>
          </form>
          
          <p class="text-gray-500 text-sm mt-4 text-center">
            * Champs obligatoires
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { ContactForm } from '@/types'
import { useN8n } from '@/composables/useN8n'
import { SocialCard, GitHubIcon, LinkedInIcon } from '@/components'

const { status, sendContactForm, resetStatus } = useN8n()

const form = reactive<ContactForm>({
  name: '',
  email: '',
  subject: '',
  message: ''
})

// Validation simple
const isFormValid = ref(true)
const validationErrors = ref<Record<string, string>>({})

const validateForm = (): boolean => {
  const errors: Record<string, string> = {}
  
  if (!form.name.trim()) errors.name = 'Le nom est requis'
  if (!form.email.trim()) errors.email = 'L\'email est requis'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Format d\'email invalide'
  }
  if (!form.subject.trim()) errors.subject = 'Le sujet est requis'
  if (!form.message.trim()) errors.message = 'Le message est requis'
  else if (form.message.length < 10) {
    errors.message = 'Le message doit contenir au moins 10 caractères'
  }
  
  validationErrors.value = errors
  isFormValid.value = Object.keys(errors).length === 0
  
  return isFormValid.value
}

const sendMessage = async (): Promise<void> => {
  if (!validateForm()) return
  
  const success = await sendContactForm(form)
  
  if (success) {
    // Reset du formulaire en cas de succès
    Object.assign(form, {
      name: '',
      email: '',
      subject: '',
      message: ''
    })
    validationErrors.value = {}
    
    // Auto-reset du message de succès après 5 secondes
    setTimeout(() => {
      resetStatus()
    }, 5000)
  }
}

// Reset des erreurs quand on tape
const clearError = (field: keyof ContactForm) => {
  if (validationErrors.value[field]) {
    delete validationErrors.value[field]
  }
  if (status.value.error) {
    resetStatus()
  }
}
</script>
