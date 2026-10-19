<script setup>
import pagesApi from '@/api/pageManagement';
import DashboardLoader from '@/components/layout/DashboardLoader.vue';
import { customPageSchema } from '@/schemas/pages/custom.schema';
import NotFound from '@/views/NotFound.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const pageFromApi = ref(null);
const loading = ref(true);
const notFound = ref(false);

const loadPage = async (slug) => {
  loading.value = true;
  notFound.value = false;

  try {
    const response = await pagesApi.getPageByType(slug);
    pageFromApi.value = response?.content || null;
  } catch (error) {
    pageFromApi.value = null;
    
    notFound.value = error?.response?.status === 404;
    if (!notFound.value) {
      console.warn('Using local custom page schema fallback');
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => loadPage(route.params.slug));
watch(() => route.params.slug, loadPage);

const page = computed(() => ({
  ...customPageSchema,
  ...(pageFromApi.value || {}),
  layout: pageFromApi.value?.layout || customPageSchema.layout,
  hero: { ...customPageSchema.hero, ...(pageFromApi.value?.hero || {}) },
  main: { ...customPageSchema.main, ...(pageFromApi.value?.main || {}) },
}));

const iconGlyphs = {
  star: '★',
  check: '✓',
  heart: '♥',
  info: 'ℹ',
  arrow: '➜',
};
</script>

<template>
  <NotFound v-if="!loading && notFound" />
  <DashboardLoader v-else-if="loading" message="Loading page..." />
  <div v-else>
    <section
      v-if="!loading && page.layout !== 'content' && !page.hero?.is_hidden"
      :style="{ backgroundColor: page.hero.backgroundColor || '#f0f7f5' }"
      class="relative pb-16 pt-16 overflow-hidden"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="lg:grid lg:grid-cols-12 lg:gap-12 items-center"
        >
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
          <div
            v-if="page.hero.image"
            class="lg:col-span-6 xl:col-span-7 relative flex justify-center lg:justify-end"
          >
            <div class="w-full max-w-lg p-4 overflow-hidden shadow-2xl" style="background-color: #f0f7f5; border-radius: 2rem">
              <img :src="page.hero.image" alt="Healthcare Federation of Nigeria" class="w-full h-auto object-cover rounded-[2rem]" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="!loading && !page.main?.is_hidden"
      class="py-16 lg:py-24"
      :style="{ backgroundColor: page.main.backgroundColor || '#ffffff' }"
    >
      <div
        class="mx-auto px-4 sm:px-6 lg:px-8"
        :class="page.layout === 'centered' ? 'max-w-7xl text-center' : 'max-w-7xl'"
      >
        <h2
          class="font-extrabold mb-10"
          :style="{
            color: page.main.headingColor || '#111827',
            fontSize: `${page.main.headingFontSize || 36}px`,
            textDecoration: page.main.headingUnderline ? 'underline' : 'none',
            textDecorationColor: page.main.headingUnderlineColor || '#111827',
            textDecorationThickness: '2px',
          }"
        >
          {{ page.main.sectionTitle }}
        </h2>

        <div v-if="page.main.rows?.length" class="space-y-8">
          <div
            v-for="row in page.main.rows"
            :key="row.id"
            class="custom-content-columns"
            :style="{ '--column-count': row.columns.length }"
          >
            <div v-for="column in row.columns" :key="column.id" class="space-y-6">
              <template v-for="block in column.blocks" :key="block.id">
                <div v-if="block.type === 'text'" class="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                  <h3 v-if="block.heading" class="mb-3 text-2xl font-bold text-gray-900">
                    {{ block.heading }}
                  </h3>
                  <p>{{ block.content }}</p>
                </div>
                <img
                  v-else-if="block.type === 'image' && block.src"
                  :src="block.src"
                  :alt="block.alt || ''"
                  class="h-auto w-full object-contain"
                />
              </template>
            </div>
          </div>
        </div>

        <div v-else class="text-lg leading-relaxed text-gray-700 space-y-6">
          <p v-for="(paragraph, index) in page.main.paragraphs" :key="index">
            {{ paragraph }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.custom-content-columns {
  display: grid;
  grid-template-columns: repeat(var(--column-count, 1), minmax(0, 1fr));
  gap: 2rem;
}

@media (max-width: 767px) {
  .custom-content-columns {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>