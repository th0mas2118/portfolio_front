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
          
          <div class="space-y-4">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <p class="font-medium">Email</p>
                <p class="text-gray-600">contact@exemple.com</p>
              </div>
            </div>
            
            <div class="flex items-center">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </div>
              <div>
                <p class="font-medium">GitHub</p>
                <p class="text-gray-600">github.com/username</p>
              </div>
            </div>
            
            <div class="flex items-center">
              <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"></path>
                </svg>
              </div>
              <div>
                <p class="font-medium">LinkedIn</p>
                <p class="text-gray-600">linkedin.com/in/username</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Formulaire de contact -->
        <div>
          <form @submit.prevent="sendMessage" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <input 
                type="text" 
                id="name"
                v-model="form.name"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input 
                type="email" 
                id="email"
                v-model="form.email"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
            </div>
            
            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                Sujet
              </label>
              <input 
                type="text" 
                id="subject"
                v-model="form.subject"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
            </div>
            
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea 
                id="message"
                v-model="form.message"
                rows="5"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              ></textarea>
            </div>
            
            <button 
              type="submit"
              class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Envoyer le message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ContactForm } from '@/types'

const form = ref<ContactForm>({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const sendMessage = (): void => {
  // Pour l'instant, juste un log
  console.log('Message envoyé:', form.value)
  alert('Message envoyé avec succès ! (Simulation)')
  
  // Reset du formulaire
  form.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }
}
</script>
