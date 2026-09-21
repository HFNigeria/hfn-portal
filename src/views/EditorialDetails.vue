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
        <div v-if="editorialMediaUrl" class="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          <img
            v-if="editorialIsImage"
            :src="editorialMediaUrl"
            :alt="editorial.title"
            class="max-h-[32rem] w-full object-contain"
          />
          <iframe
            v-else
            :src="`https://docs.google.com/viewer?url=${encodeURIComponent(editorialMediaUrl)}&embedded=true`"
            class="h-[32rem] w-full"
            frameborder="0"
            title="Editorial document preview"
          ></iframe>
        </div>
        <p v-if="editorialExcerpt" class="text-lg text-gray-600 mb-8">
          {{ editorialExcerpt }}
        </p>
        <div
          class="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line"
        >
          {{ articleContent || 'No article content available.' }}
        </div>
      </div>

      <div v-else class="text-center text-gray-500 py-16">
        Editorial not found.
      </div>
    </article>
  </main>
</template>

<script setup>
import api from "@/api/axios";
import contentUploadApi from "@/api/contentUploadsApi";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const editorial = ref(null);
const loading = ref(true);

const articleContent = computed(() =>
  editorial.value?.summary ||
  editorial.value?.content ||
  editorial.value?.description ||
  ""
);

const getMediaUrl = (value) => {
  if (!value) return "";

  try {
    const url = new URL(value, new URL(api.defaults.baseURL).origin);
    if (url.protocol === "http:") url.protocol = "https:";
    return url.toString();
  } catch {
    return value;
  }
};

const editorialMediaUrl = computed(() =>
  getMediaUrl(
    editorial.value?.featured_image ||
      editorial.value?.file ||
      editorial.value?.pdf ||
      editorial.value?.document
  )
);

const editorialIsImage = computed(
  () =>
    Boolean(editorial.value?.featured_image) ||
    /\.(avif|gif|jpe?g|png|svg|webp)(?:[?#]|$)/i.test(editorialMediaUrl.value)
);

const editorialExcerpt = computed(() => {
  const words = articleContent.value.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 10) return words.join(" ");
  return `${words.slice(0, 10).join(" ")}...`;
});

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
