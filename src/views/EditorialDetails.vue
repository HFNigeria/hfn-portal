<template>
  <main class="min-h-screen bg-gray-50">
    <article class="max-w-4xl mx-auto px-4 py-10 md:py-16">
      <div v-if="loading" class="text-center text-gray-500 py-16">
        Loading editorial...
      </div>

      <div v-else-if="editorial" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10">
        <p class="text-sm text-orange-600 mb-3">{{ formatDate(editorial.created_at) }}</p>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          {{ editorial.title }}
        </h1>
        <div
          class="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line"
        >
          {{ editorial.summary || editorial.content || editorial.description || 'No article content available.' }}
        </div>
      </div>

      <div v-else class="text-center text-gray-500 py-16">
        Editorial not found.
      </div>
    </article>
  </main>
</template>

<script setup>
import contentUploadApi from "@/api/contentUploadsApi";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const editorial = ref(null);
const loading = ref(true);

const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

onMounted(async () => {
  try {
    editorial.value = await contentUploadApi.retrieveEditorials(route.params.slug);
  } catch (error) {
    console.error("Failed to load editorial", error);
  } finally {
    loading.value = false;
  }
});
</script>
