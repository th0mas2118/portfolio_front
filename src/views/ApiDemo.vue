<template>
  <div class="fade-in py-20">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <h1 class="text-4xl font-bold mb-8">API Demo</h1>
      <p class="text-lg text-gray-600 mb-8">
        Cette page sera développée plus tard pour tester l'API Laravel en temps réel.
      </p>
      <div class="bg-blue-50 rounded-lg p-8">
        <h2 class="text-xl font-semibold mb-4">Fonctionnalités prévues :</h2>
        <ul class="text-left max-w-md mx-auto space-y-2 text-gray-700">
          <li>• Interface de test des endpoints API</li>
          <li>• Visualisation des réponses JSON</li>
          <li>• Documentation interactive</li>
          <li>• Gestion des headers personnalisés</li>
        </ul>
      </div>
      <button @click="sendApiRequest">Test API</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ApiResponse, ApiEndpoint } from '@/types';
import { ref, reactive } from 'vue'
import axios from 'axios';

const apiUrl = 'http://localhost:8000/api'

const endpoint = ref<ApiEndpoint>({
  id: 1,
  name: 'Test',
  method: 'GET',
  path: '/profile/basic',
  description: 'Test de l\'API'
})

const sendApiRequest = async(): Promise<ApiResponse> => {
  const response: ApiResponse = await axios.request({
    method: endpoint.value.method,
    url: apiUrl + endpoint.value.path,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  console.log(response)

  return response
}
</script>
