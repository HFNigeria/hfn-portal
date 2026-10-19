<script setup>
import pagesApi from '@/api/pageManagement';
import { customPageSchema } from '@/schemas/pages/custom.schema';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const pageFromApi = ref(null);

const loadPage = async (slug) => {
  pageFromApi.value = null;

  try {
    const response = await pagesApi.getPageByType(slug);
    pageFromApi.value = response?.content || null;
  } catch (error) {
    console.warn('Using local custom page schema fallback');
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
  <div>
    <section
      v-if="page.layout !== 'content' && !page.hero?.is_hidden"
      :style="{ backgroundColor: page.hero.backgroundColor || '#f0f7f5' }"
      class="relative pb-16 pt-16 overflow-hidden"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="lg:grid lg:grid-cols-12 lg:gap-12 items-center"
          :class="page.layout === 'centered' ? 'text-center' : ''"
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
            v-if="page.layout !== 'centered'"
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
      v-if="!page.main?.is_hidden"
      class="py-16 lg:py-24"
      :style="{ backgroundColor: page.main.backgroundColor || '#ffffff' }"
    >
      <div
        class="mx-auto px-4 sm:px-6 lg:px-8"
        :class="page.layout === 'centered' ? 'max-w-4xl text-center' : 'max-w-4xl'"
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
        <div
          class="custom-main-content grid gap-6"
          :style="{
            '--content-columns': Math.min(3, Math.max(1, Number(page.main.columns) || 1)),
          }"
        >
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
              v-if="iconGlyphs[page.main.paragraphIcons?.[index]]"
              class="mr-2"
              :style="{ color: page.main.iconColor || '#004d33' }"
              aria-hidden="true"
            >{{ iconGlyphs[page.main.paragraphIcons[index]] }}</span>
            {{ paragraph }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.custom-main-content {
  grid-template-columns: repeat(var(--content-columns), minmax(0, 1fr));
}

@media (max-width: 640px) {
  .custom-main-content {
    grid-template-columns: 1fr;
  }
}
</style>