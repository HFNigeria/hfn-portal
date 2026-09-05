<script setup>
import pagesApi from '@/api/pageManagement';
import { customPageSchema } from '@/schemas/pages/custom.schema';
import { computed, onMounted, ref } from 'vue';

const pageFromApi = ref(null);

onMounted(async () => {
  try {
    const response = await pagesApi.getPageByType('others');
    pageFromApi.value = response?.content || null;
  } catch (error) {
    console.warn('Using local custom page schema fallback');
  }
});

const page = computed(() => ({
  ...customPageSchema,
  ...(pageFromApi.value || {}),
  hero: { ...customPageSchema.hero, ...(pageFromApi.value?.hero || {}) },
  main: { ...customPageSchema.main, ...(pageFromApi.value?.main || {}) },
}));
</script>

<template>
  <div>
    <section
      v-if="!page.hero?.is_hidden"
      :style="{ backgroundColor: page.hero.backgroundColor || '#f0f7f5' }"
      class="relative pb-16 pt-16 overflow-hidden"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          <div class="lg:col-span-6 xl:col-span-5 mb-10 lg:mb-0">
            <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              <span class="text-orange-600">{{ page.hero.titleHighlight }}</span><br />
              <span class="text-green-700">{{ page.hero.titleMain }}</span>
            </h1>
            <p class="mt-6 text-lg text-gray-700">
              <span class="font-semibold text-green-700">{{ page.hero.descriptionTop }}</span>
              {{ page.hero.descriptionText }}
            </p>
            <p v-if="page.hero.descriptionBottom" class="mt-4 text-gray-700 text-lg">
              {{ page.hero.descriptionBottom }}
            </p>
            <RouterLink
              v-if="page.hero.ctaLabel"
              :to="page.hero.ctaLink"
              class="inline-flex items-center mt-10 px-6 py-3 rounded-lg text-white bg-green-700 hover:bg-green-800"
            >
              {{ page.hero.ctaLabel }}
            </RouterLink>
          </div>
          <div class="lg:col-span-6 xl:col-span-7 relative flex justify-center lg:justify-end">
            <div class="w-full max-w-lg p-4 overflow-hidden shadow-2xl" style="background-color: #f0f7f5; border-radius: 2rem">
              <img :src="page.hero.image" alt="Healthcare Federation of Nigeria" class="w-full h-auto object-cover rounded-[2rem]" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="!page.main?.is_hidden" class="bg-white py-16 lg:py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-10">
          {{ page.main.sectionTitle }}
        </h2>
        <div class="text-lg leading-relaxed text-gray-700 space-y-6">
          <p v-for="(paragraph, index) in page.main.paragraphs" :key="index">
            {{ paragraph }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>