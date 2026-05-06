<script setup>
import pagesApi from "@/api/pageManagement";
// import aboutImage from "@/assets/about-us.png";
import ayodele from "@/assets/ayodele.png";
import babarinde from "@/assets/babarinde.png";
import chinyere from "@/assets/chinyere.png";
import jennifer from "@/assets/jennifer.png";
import njide from "@/assets/njide.png";
import partnership from "@/assets/partnership-01.png";
import reagan from "@/assets/reagan.png";
import { aboutPageSchema } from "@/schemas/pages/about.schema";
import { computed, onMounted, onUnmounted, ref } from "vue";

const map =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769847486/243A8753_zohyft.jpg";
const aboutImage =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769801806/IMG_8324_vikc7v.jpg";
const scrollY = ref(0);
const parallaxContainer = ref(null);

const handleScroll = () => {
  if (parallaxContainer.value) {
    const rect = parallaxContainer.value.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      scrollY.value = window.scrollY - parallaxContainer.value.offsetTop;
    }
  }
};



onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});



const imageMap = {
  "about-us.png": aboutImage,
  "ayodele.png": ayodele,
  "babarinde.png": babarinde,
  "chinyere.png": chinyere,
  "jennifer.png": jennifer,
  "map.jpg": map,
  "njide.png": njide,
  "partnership-01.png": partnership,
  "reagan.png": reagan,
};

const pageFromApi = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await pagesApi.getPageByType("about");
    pageFromApi.value = res?.content || null;
  } catch (e) {
    console.warn("Using local About schema fallback");
  } finally {
    loading.value = false;
  }
});


const page = computed(() => {
  return {
    ...aboutPageSchema,
    ...(pageFromApi.value || {}),
    hero: {
      ...aboutPageSchema.hero,
      ...(pageFromApi.value?.hero || {}),
    },
    story: {
      ...aboutPageSchema.story,
      ...(pageFromApi.value?.story || {}),
    },
    roleSection: {
      ...aboutPageSchema.roleSection,
      ...(pageFromApi.value?.roleSection || {}),
    },

    history: {
      ...aboutPageSchema.history,
      ...(pageFromApi.value?.history || {}),
    },

    governance: {
      ...aboutPageSchema.governance,
      ...(pageFromApi.value?.governance || {}),
    },
    ctaSection: {
      ...aboutPageSchema.ctaSection,
      ...(pageFromApi.value?.ctaSection || {}),
    },
    commitment: {
      ...aboutPageSchema.commitment,
      ...(pageFromApi.value?.commitment || {}),
    },
  };
});

const resolveImage = (image) => imageMap[image] || image;
</script>
<template>
  <div>
    <section class="relative bg-green-50 pb-16 pt-16 sm:pb-24 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          <div class="lg:col-span-6 xl:col-span-5 mb-10 lg:mb-0">
            <h1
              class="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight"
            >
              <span class="text-orange-600"
                >{{ page.hero.titleHighlight }} </span
              ><br />
              <span class="text-green-700">{{ page.hero.titleMain }}</span>
            </h1>

            <p class="mt-6 text-lg text-gray-700">
              <span class="font-semibold text-green-700"
                >{{ page.hero.descriptionTop }}
              </span>
              {{ page.hero.descriptionText }}
            </p>
            <p class="mt-4 text-gray-700 text-lg">
              {{ page.hero.descriptionBottom }}
            </p>

            <div class="mt-10">
              <RouterLink
                :to="page.hero.ctaLink"
                class="inline-flex items-center px-6 py-3 rounded-lg text-white bg-green-700 hover:bg-green-800"
              >
                {{ page.hero.ctaLabel }}
              </RouterLink>
            </div>
          </div>

          <div
            class="lg:col-span-6 xl:col-span-7 relative flex justify-center lg:justify-end"
          >
            <div
              class="w-full max-w-lg lg:max-w-none p-4 overflow-hidden shadow-2xl"
              style="background-color: #f0f7f5; border-radius: 2rem"
            >
              <img
                :src="map"
                alt="World Map of Growing Greenery representing global health"
                class="w-full h-auto object-cover rounded-[2rem] transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    
    <section class="bg-white py-16 lg:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
        <div class="mb-16">
          <div
            class="w-full px-4 py-4 sm:px-6 rounded-2xl border-2 border-green-50 bg-white shadow-md text-center"
          >
            <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">
              {{ page.story.sectionTitle }}
            </h2>
          </div>
        </div>

        <div class="lg:grid lg:grid-cols-12 lg:gap-16 items-center mb-20">
          <div class="lg:col-span-5 flex justify-center mb-10 lg:mb-0">
            <div class="relative group">
              <div
                class="absolute -inset-4 bg-[#f2f9f3] rounded-[2rem] rotate-3 group-hover:rotate-0 transition-transform duration-500"
              ></div>
              <div
                class="relative overflow-hidden rounded-[2rem] shadow-xl bg-white"
              >
                <img
                  :src="aboutImage"
                  alt="HFN advocacy"
                  class="w-full h-auto object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
            </div>
          </div>

          <div
            class="lg:col-span-7 text-gray-600 text-lg leading-relaxed space-y-6"
          >
            <p
              v-for="(p, i) in page.story.paragraphs"
              :key="i"
              class="first-letter:text-4xl first-letter:font-bold first-letter:text-[#004d33]"
            >
              {{ p }}
            </p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-8 mt-12">
          <div
            class="relative p-8 rounded-[3rem] shadow-xl overflow-hidden cursor-pointer transition-all duration-700 group bg-[#004d33] hover:bg-[#f8fdf9] border-2 border-transparent hover:border-[#004d33]/10"
          >
            <div
              class="absolute top-0 right-0 p-4 transition-all duration-700 opacity-10 group-hover:opacity-10 text-white group-hover:text-[#004d33]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>

            <div class="relative z-10">
              <h3
                class="font-black uppercase tracking-widest text-sm mb-4 transition-colors duration-700 text-orange-400 group-hover:text-[#004d33]"
              >
                Our Mission
              </h3>
              <p
                class="text-xl md:text-2xl font-medium leading-snug italic transition-colors duration-700 text-white group-hover:text-gray-800"
              >
                "{{ page.story.mission }}"
              </p>
            </div>
          </div>

          <div
            class="relative p-8 rounded-[3rem] shadow-lg overflow-hidden cursor-pointer transition-all duration-700 group bg-[#f8fdf9] hover:bg-[#004d33] border-2 border-[#004d33]/10 hover:border-transparent"
          >
            <div
              class="absolute top-0 right-0 p-4 transition-all duration-700 opacity-5 group-hover:opacity-20 text-[#004d33] group-hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="2" x2="12" y2="4" />
                <line x1="12" y1="20" x2="12" y2="22" />
                <line x1="2" y1="12" x2="4" y2="12" />
                <line x1="20" y1="12" x2="22" y2="12" />
              </svg>
            </div>

            <div class="relative z-10">
              <h3
                class="font-black uppercase tracking-widest text-sm mb-4 transition-colors duration-700 text-[#004d33] group-hover:text-orange-400"
              >
                Our Vision
              </h3>
              <p
                class="text-xl md:text-2xl font-medium leading-snug italic transition-colors duration-700 text-gray-800 group-hover:text-white"
              >
                "{{ page.story.vision }}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-6">
            <h2
              class="text-3xl md:text-4xl font-black text-[#004d33] leading-tight"
            >
              Our Role in Nigeria’s <br />
              Health System
            </h2>
            <p class="text-gray-600 text-lg leading-relaxed">
              {{ page.roleSection.description }}
              <span
                class="text-[#004d33] font-bold underline decoration-orange-400"
                >{{ page.roleSection.highlightText }}</span
              >
            </p>

            <ul class="space-y-4 pt-4">
              <li
                v-for="(item, i) in page.roleSection.points"
                :key="i"
                class="flex items-start gap-4 group"
              >
                <div
                  class="w-6 h-6 rounded-full bg-[#f2f9f3] flex items-center justify-center shrink-0 group-hover:bg-[#004d33] transition-colors"
                >
                  <svg
                    class="w-4 h-4 text-[#004d33] group-hover:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span class="text-gray-700 font-medium">{{ item }}</span>
              </li>
            </ul>
          </div>

          <div
            class="relative mt-12 lg:mt-0 p-8 bg-[#f2f9f3] rounded-[3rem] border border-[#004d33]/5 shadow-inner"
          >
            <p class="text-sm italic text-gray-500 mb-6 font-medium">
             {{ page.roleSection.tagDescription}}             
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div
                v-for="tag in page.roleSection.tags"
                :key="tag"
                class="bg-white p-4 rounded-2xl shadow-sm text-center font-bold text-[#004d33] border border-white hover:border-[#004d33]/20 transition-all"
              >
                {{ tag }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-[#004d33] text-white overflow-hidden relative">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

    <div class="space-y-16">
      <div
        v-for="(milestone, index) in page.history.milestones"
        :key="index"
        class="flex flex-col md:flex-row gap-12 items-center"
      >
        <!-- YEAR -->
        <div class="text-8xl font-black opacity-20 select-none">
          {{ milestone.year }}
        </div>

        <!-- CONTENT -->
        <div class="space-y-4">
          <h3
            v-if="index === 0"
            class="text-orange-400 font-black uppercase tracking-widest text-sm"
          >
            {{ page.history.title }}
          </h3>

          <h4
            v-if="index === 0"
            class="text-3xl font-bold"
          >
            {{ page.history.subtitle }}
          </h4>

          <p class="text-green-50/80 text-lg max-w-4xl leading-relaxed">
            {{ milestone.event }}
          </p>
        </div>
      </div>
    </div>

  </div>

  <div
    class="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mb-32"
  ></div>
</section>

    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <!-- <h3 class="text-[#004d33] font-black uppercase tracking-[0.3em] text-xs mb-4">Accountability</h3>
      <h2 class="text-4xl font-black text-gray-900 mb-12">Governance & Leadership</h2> -->
        <div class="mb-16">
          <div
            class="w-full px-4 py-4 sm:px-6 rounded-2xl border-2 border-green-50 bg-white shadow-md text-center"
          >
            <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">
              {{ page.governance.title}}
            </h2>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <router-link
            v-for="unit in page.governance.units"
            :key="unit"
            to="/governance"
            class="p-6 rounded-3xl border border-gray-100 bg-[#f8fdf9] hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
          >
            <div
              class="w-10 h-10 bg-[#004d33] rounded-xl mb-4 mx-auto flex items-center justify-center text-white"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <p class="font-bold text-gray-800 text-sm uppercase tracking-tight">
              {{ unit }}
            </p>
          </router-link>
        </div>
        <p
          class="mt-12 text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed italic"
        >
          "{{ page.governance.note }}"
        </p>
      </div>
    </section>

    
    <section class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-10">
          <div
            class="w-full px-6 py-6 rounded-2xl border-2 border-green-50 bg-white shadow-md text-center"
          >
            <h2
              class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight"
            >
              {{ page.ctaSection.title }}
            </h2>
          </div>
        </div>

        <div class="group/container relative" ref="parallaxContainer">
          <div
            class="relative w-full overflow-hidden min-h-[900px] lg:min-h-[800px] bg-[#f8fdf9] rounded-[4rem] p-8 md:p-16 flex items-center justify-center border border-white shadow-2xl"
          >
            <div class="absolute inset-0 z-0">
              <div
                class="blob blob-1"
                :style="{ transform: `translateY(${scrollY * 0.1}px)` }"
              ></div>
              <div
                class="blob blob-2"
                :style="{
                  transform: `translateY(${
                    scrollY * -0.05
                  }px) translateX(30px)`,
                }"
              ></div>
            </div>

            <div
              class="absolute inset-0 z-10 backdrop-blur-[100px] bg-white/30"
            ></div>

            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 max-w-6xl relative z-20 w-full place-items-center"
            >
              <div
                v-for="(item, index) in page.ctaSection.items"
                :key="index"
                class="leaf-wrapper w-full max-w-[400px]"
                :style="{
                  '--delay': `${index * 0.3}s`,
                  '--float-dist': index % 2 === 0 ? '20px' : '-20px',
                  transform: `translateY(${scrollY * 0.03}px)`,
                }"
              >
                <div class="leaf-card group">
                  <div
                    :class="[
                      'leaf-face leaf-front border border-white/50 shadow-2xl flex flex-col justify-center items-center text-center p-10',
                      item.colorClass,
                    ]"
                  >
                    <div
                      class="absolute top-8 right-10 text-5xl font-black opacity-10 italic select-none"
                    >
                      0{{ index + 1 }}
                    </div>

                    <h3
                      class="text-2xl lg:text-3xl font-black tracking-tighter uppercase leading-tight px-2"
                    >
                      {{ item.title }}
                    </h3>

                    <div
                      class="w-16 h-[5px] bg-current/20 my-8 group-hover:w-32 group-hover:bg-current/40 transition-all duration-700 rounded-full"
                    ></div>

                    <p
                      class="text-xs font-black tracking-[0.2em] uppercase opacity-50 mb-3"
                    >
                      Core Mandate
                    </p>
                    <p
                      class="text-sm font-bold leading-relaxed opacity-90 italic"
                    >
                      {{ item.shortDesc }}
                    </p>
                  </div>

                  <div
                    :class="[
                      'leaf-face leaf-back shadow-inner flex flex-col justify-center items-center p-10 text-center',
                      item.colorClass === 'leaf-green'
                        ? 'bg-[#1a3a24] text-white'
                        : 'bg-[#5e3a2d] text-white',
                    ]"
                  >
                    <div class="space-y-6">
                      <p
                        class="text-sm md:text-base font-semibold leading-relaxed px-2"
                      >
                        {{ item.fullDesc }}
                      </p>

                      <router-link
                        to="/get-involved" 
                        class="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 rounded-full text-xs font-black uppercase tracking-widest hover:bg-orange-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                      >
                        Get Involved
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="3"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="pb-24 px-4">
      <div
        class="max-w-7xl mx-auto bg-[#f2f9f3] rounded-[4rem] p-12 md:p-20 relative overflow-hidden"
      >
        <div
          class="absolute top-10 right-10 w-32 h-32 bg-[#004d33]/5 rounded-full blur-3xl"
        ></div>

        <div class="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-4xl font-black text-[#004d33] mb-6">
              {{ page.commitment.title}}
            </h2>
            <p class="text-gray-600 text-lg mb-8">
              {{ page.commitment.description}}
            </p>
            <button
              class="px-10 py-4 bg-[#004d33] text-white rounded-full font-bold shadow-lg hover:shadow-green-900/20 transition-all"
            >
              {{ page.commitment.buttonText}}
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-for="(goal, i) in page.commitment.goals"
              :key="i"
              class="bg-white p-6 rounded-[2rem] shadow-sm flex items-center gap-6 border border-white hover:border-[#004d33]/10 transition-all"
            >
              <span class="text-3xl font-black text-[#004d33]/20"
                >0{{ i + 1 }}</span
              >
              <p class="font-bold text-gray-800 text-lg tracking-tight">
                {{ goal }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>






<style scoped>
@import "tailwindcss";

.leaf-wrapper {
  perspective: 2000px;
  animation: float 10s ease-in-out infinite alternate;
  animation-delay: var(--delay);
  transition: transform 0.2s cubic-bezier(0, 0, 0.2, 1);
}

.leaf-card {
  @apply relative w-72 h-72 md:w-80 md:h-80 lg:w-[490px] lg:h-[480px] transition-all duration-[1.2s] ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer;
  transform-style: preserve-3d;
}

.leaf-wrapper:hover .leaf-card {
  transform: rotateY(180deg) scale(1.05) translateZ(50px);
}

.leaf-face {
  @apply absolute inset-0 flex flex-col items-center justify-center text-center;
  backface-visibility: hidden;
  border-radius: 80% 0 80% 0;
}

.leaf-back {
  transform: rotateY(180deg);
  border-radius: 0 80% 0 80%;
}

.leaf-green {
  @apply bg-white/90 text-[#2D5A3A] backdrop-blur-xl;
}
.leaf-tan {
  @apply bg-[#FCF3EE]/90 text-[#7A4B3A] backdrop-blur-xl;
}

.blob {
  @apply absolute rounded-full mix-blend-multiply opacity-50 transition-transform duration-100 ease-out;
  filter: blur(80px);
}

.blob-1 {
  @apply w-[800px] h-[800px] bg-[#98D8A0] -top-40 -left-40;
}
.blob-2 {
  @apply w-[900px] h-[900px] bg-[#FCE5D8] bottom-0 -right-40;
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  100% {
    transform: translateY(var(--float-dist)) rotate(4deg);
  }
}

@media (min-width: 1024px) {
  .leaf-wrapper:nth-child(3n-2) {
    @apply mt-24;
  }
  .leaf-wrapper:nth-child(3n-1) {
    @apply mt-0;
  }
  .leaf-wrapper:nth-child(3n) {
    @apply mt-12;
  }
}
</style>
