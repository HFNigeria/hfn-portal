<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="min-h-[60vh] flex items-center justify-center bg-white px-4">
    <div class="text-center max-w-lg">
      <p class="text-8xl font-extrabold text-[#004d33] tracking-tight">404</p>
      <h1 class="mt-4 text-2xl sm:text-3xl font-bold text-gray-900">
        Page Not Found
      </h1>
      <p class="mt-3 text-gray-600">
        The page you are looking for doesn't exist or may have been moved.
      </p>
      <RouterLink
        to="/"
        class="inline-flex items-center mt-8 px-6 py-3 rounded-lg text-white bg-[#004d33] hover:bg-[#003824] transition-colors"
      >
        Back to Home
      </RouterLink>
    </div>
  </div>
</template>
