<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="text-xl font-bold text-gray-800">
              Portfolio
            </router-link>
          </div>
          <div class="flex items-center space-x-8">
            <router-link to="/" class="text-gray-600 hover:text-gray-900 transition-colors">
              Accueil
            </router-link>
            <router-link to="/projects" class="text-gray-600 hover:text-gray-900 transition-colors">
              Projets
            </router-link>
            <router-link to="/api" class="text-gray-600 hover:text-gray-900 transition-colors">
              API Demo
            </router-link>
            <router-link to="/contact" class="text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <main>
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8 mt-20">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p>&copy; 2025 Portfolio - Développeur Full Stack</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// App component
</script>
