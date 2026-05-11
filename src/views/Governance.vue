<template>
  <div class="bg-[#f8fdf9] min-h-screen">
    <section v-if="!page.hero?.is_hidden" class="bg-[#F2F9F3] py-16 lg:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div class="mb-12 lg:mb-0">
            <h2
              class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4"
            >
              <span class="text-orange-500 block">{{ page.hero.titleHighlight }}</span>
              <span class="text-green-700 block mt-2"></span>
            </h2>
            <p class="mt-6 text-lg text-gray-600 max-w-xl">
              {{ page.hero.description }}
            </p>
          </div>

          <div class="flex justify-center lg:justify-end">
            <div
              class="relative w-[320px] h-[240px] sm:w-[400px] sm:h-[300px] lg:w-[500px] lg:h-[375px] rounded-[30px] overflow-hidden shadow-2xl"
            >
              <img
                :src="page.hero.image"
                alt="Diverse hands joining in a heart shape, symbolizing unity and healthcare"
                class="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="!page.boardOfTrustees?.is_hidden" class="py-24 max-w-7xl mx-auto px-4">
      <div class="flex items-center gap-4 mb-16">
        <h2 class="text-3xl font-black text-gray-900 uppercase tracking-tight">
          {{ page.boardOfTrustees.title }}
        </h2>
        <div class="h-[2px] flex-grow bg-gray-100"></div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <div class="lg:col-span-3 flex justify-center mb-10">
          <RouterLink
:to="`/team/${page.boardOfTrustees.chair.slug}`"
            class="group relative w-full max-w-md"
          >
            <div
              class="bg-white p-8 rounded-[3.5rem] shadow-2xl border-2 border-orange-400/20 transform hover:-translate-y-2 transition-all duration-500"
            >
              <div
                class="absolute -top-5 left-1/2 -translate-x-1/2 bg-orange-400 text-white px-8 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg z-20"
              >
                Chair
              </div>
              <div
                class="aspect-square rounded-[2.5rem] overflow-hidden bg-gray-100 mb-6 border-4 border-[#f2f9f3]"
              >
                <img
                  :src="page.boardOfTrustees.chair.image"
                  alt="Bola Adesola"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div class="text-center">
                <h3 class="text-3xl font-black text-[#004d33]">{{ page.boardOfTrustees.chair.name }}</h3>
                <p
                  class="text-orange-600 font-bold text-sm uppercase tracking-[0.2em] mt-2"
                >
                  {{ page.boardOfTrustees.chair.role }}
                </p>
              </div>
            </div>
          </RouterLink>
        </div>

        <div v-for="trustee in page.boardOfTrustees.trustees" :key="trustee.name">
          <RouterLink :to="`/team/${trustee.slug}`">
            <div
              class="bg-white p-6 rounded-[3rem] shadow-lg border border-gray-50 hover:shadow-2xl transition-all group"
            >
              <div
                class="aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-100 mb-6"
              >
                <img
                  :src="trustee.image"
                  :alt="trustee.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div class="text-center">
                <h4 class="text-xl font-black text-gray-900">
                  {{ trustee.name }}
                </h4>
                <p
                  class="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1"
                >
                  {{ trustee.title }}
                </p>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <section v-if="!page.executiveCommittee?.is_hidden"
      class="py-24 bg-white rounded-t-[5rem] shadow-[-20px_0_60px_rgba(0,0,0,0.05)]"
    >
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center gap-4 mb-16 justify-end text-right">
          <div class="h-[2px] flex-grow bg-gray-100"></div>
          <h2
            class="text-3xl font-black text-[#004d33] uppercase tracking-tight"
          >
            {{ page.executiveCommittee.title }}
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RouterLink
            v-for="exec in page.executiveCommittee.executives"
            :key="exec.name"
            :to="`/team/${exec.slug}`"
            class="flex flex-col sm:flex-row gap-8 p-8 rounded-[2.5rem] bg-[#f8fdf9] border border-gray-50 hover:bg-white hover:shadow-xl transition-all group"
          >
            <div
              class="w-full sm:w-44 h-56 rounded-[2rem] overflow-hidden bg-gray-200 shrink-0 shadow-md"
            >
              <img
                :src="exec.image"
                :alt="exec.name"
                class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
              />
            </div>

            <div class="flex flex-col justify-center text-left">
              <h4 class="text-2xl font-black text-gray-900 leading-tight">
                {{ exec.name }}
              </h4>
              <p
                class="text-orange-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1 mb-4"
              >
                {{ exec.role }}
              </p>
              <div v-if="exec.socials" class="flex gap-2 mb-3">
                <a
                  v-for="link in exec.socials"
                  :key="link.platform"
                  :href="link.url"
                  target="_blank"
                  @click.stop
                  class="text-gray-400 hover:text-[#0077b5] transition-colors"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    />
                  </svg>
                </a>
              </div>
              <p
                class="text-gray-600 text-sm leading-relaxed font-medium italic"
              >
                {{ exec.profile }}
              </p>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// import { trustees, executives, chair } from "@/data/leadership.js";
import { governanceSchema } from "@/schemas/pages/governance.schema";
import { ref, computed, onMounted } from "vue";
import pagesApi from "@/api/pageManagement";

const pageFromApi = ref(null); 
const page = computed(() => {
  const api = pageFromApi.value || {};

  return {
    hero: {
      ...governanceSchema.hero,
      ...(api.hero || {}),
    },

    boardOfTrustees: {
      ...governanceSchema.boardOfTrustees,
      ...(api.boardOfTrustees || {}),
      chair: {
        ...governanceSchema.boardOfTrustees.chair,
        ...(api.boardOfTrustees?.chair || {}),
      },
      trustees:
        api.boardOfTrustees?.trustees ||
        governanceSchema.boardOfTrustees.trustees,
    },

    executiveCommittee: {
      ...governanceSchema.executiveCommittee,
      ...(api.executiveCommittee || {}),
      executives:
        api.executiveCommittee?.executives ||
        governanceSchema.executiveCommittee.executives,
    },
  };
});
  
const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

const handsJoining =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769896360/IMG_9238_vxq385.jpg";
const chairImage =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769894247/Bola_Adesola_lr8vif.png";

onMounted(async () => {
  try {
    const res = await pagesApi.getPageByType("governance");
    const content = res?.content || null;
    if (content?._hidden) {
      for (const key of content._hidden) {
        if (content[key]) {
          content[key].is_hidden = true;
        }
      }
      delete content._hidden;
    }
    pageFromApi.value = content;
  } catch (e) {
    console.warn("Using local governance schema fallback");
  }
});
</script>
