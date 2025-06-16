<template>
  <div class="fade-in">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold mb-6">
          Développeur Full Stack
        </h1>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          Passionné par la création d'applications web modernes avec Vue.js et Laravel.
          Spécialisé dans le développement d'APIs robustes et d'interfaces utilisateur intuitives.
        </p>
        <div class="space-x-4">
          <router-link 
            to="/projects" 
            class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Voir mes projets
          </router-link>
          <router-link 
            to="/api" 
            class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Tester l'API
          </router-link>
        </div>
      </div>
    </section>

    <!-- Compétences -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Mes Compétences</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-4 text-blue-600">Frontend</h3>
            <ul class="space-y-2 text-gray-600">
              <li>• Vue.js 3 & Composition API</li>
              <li>• JavaScript ES6+</li>
              <li>• Tailwind CSS</li>
              <li>• Responsive Design</li>
            </ul>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-4 text-green-600">Backend</h3>
            <ul class="space-y-2 text-gray-600">
              <li>• Laravel & PHP</li>
              <li>• API REST</li>
              <li>• Base de données MySQL</li>
              <li>• Architecture MVC</li>
            </ul>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-4 text-purple-600">Outils</h3>
            <ul class="space-y-2 text-gray-600">
              <li>• Git & GitHub</li>
              <li>• Vite & Webpack</li>
              <li>• Postman</li>
              <li>• Docker</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- À propos -->
    <section class="bg-gray-100 py-20">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-8">À propos de moi</h2>
        <p class="text-lg text-gray-600 leading-relaxed">
          Développeur passionné avec une expertise en Vue.js et Laravel. 
          J'aime créer des applications web performantes et élégantes qui résolvent des problèmes concrets. 
          Mon approche combine rigueur technique et créativité pour livrer des solutions de qualité.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Home component
</script>
