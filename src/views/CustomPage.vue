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

const getIcon = (name) => iconGlyphs[name] || '';
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
            textUnderlineOffset: '0.2em',
          }"
        >
          {{ page.main.sectionTitle }}
        </h2>

        <div v-if="page.main.rows?.length" class="space-y-8">
          <div
            v-for="row in page.main.rows"
            :key="row.id"
            class="custom-content-columns"
            :style="{
              '--column-count': row.columns.length,
              backgroundColor: row.backgroundColor || 'transparent',
            }"
          >
            <div
              v-for="column in row.columns"
              :key="column.id"
              class="space-y-6 p-4"
              :style="{ backgroundColor: column.backgroundColor || 'transparent' }"
            >
              <template v-for="block in column.blocks" :key="block.id">
                <div
                  v-if="block.type === 'text'"
                  class="rounded-lg p-4 leading-relaxed whitespace-pre-line"
                  :style="{
                    color: block.textColor || page.main.textColor || '#374151',
                    fontSize: `${block.fontSize || page.main.textFontSize || 18}px`,
                    backgroundColor: block.backgroundColor || 'transparent',
                  }"
                >
                  <h3
                    v-if="block.heading"
                    class="mb-3 font-bold"
                    :style="{
                      color: block.headingColor || page.main.headingColor || '#111827',
                      fontSize: `${block.headingFontSize || 24}px`,
                      textDecoration: block.headingUnderline ? 'underline' : 'none',
                      textDecorationColor: block.headingUnderlineColor || '#111827',
                      textUnderlineOffset: '0.2em',
                    }"
                  >
                    {{ block.heading }}
                  </h3>
                  <span
                    v-if="getIcon(block.icon)"
                    class="mr-2"
                    :style="{ color: block.iconColor || page.main.iconColor || '#004d33' }"
                    aria-hidden="true"
                  >{{ getIcon(block.icon) }}</span>
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

      <div v-else class="grid gap-6 custom-content-columns" :style="{ '--column-count': page.main.columns || 1 }">
        <div
          v-for="(paragraph, index) in page.main.paragraphs"
          :key="index"
          class="rounded-lg p-4 leading-relaxed"
          :style="{
            color: page.main.textColor || '#374151',
            fontSize: `${page.main.textFontSize || 18}px`,
            backgroundColor: page.main.paragraphBackgroundColors?.[index] || 'transparent',
          }"
        >
          <span
            v-if="getIcon(page.main.paragraphIcons?.[index])"
            class="mr-2"
            :style="{ color: page.main.iconColor || '#004d33' }"
            aria-hidden="true"
          >{{ getIcon(page.main.paragraphIcons[index]) }}</span>
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
  padding: 1rem;
  border-radius: 0.5rem;
}

@media (max-width: 767px) {
  .custom-content-columns {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>