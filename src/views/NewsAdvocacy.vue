<template>
  <div class="news-page font-sans bg-white">
    <section class="bg-[#E87A1814] pt-10 pb-16">
      <div class="container mx-auto px-4 md:px-8">
        <div
          class="flex flex-col lg:flex-row items-start lg:items-center justify-between"
        >
          <div class="lg:w-1/2 mb-8 lg:mb-0">
            <h1
              class="text-4xl md:text-5xl font-bold text-gray-800 leading-tight"
            >
              <span class="text-green-700">Stay Informed:</span>
              <br />
              <span class="text-gray-900"
                >Latest Healthcare News & Updates</span
              >
            </h1>
            <p class="mt-4 text-gray-600 max-w-lg">
              Get the latest insights, announcements, and policy developments
              from the Healthcare Federation of Nigeria and across the health
              sector.
            </p>
          </div>

          <div
            class="lg:w-1/2 flex justify-center w-full h-64 sm:h-80 lg:h-96 relative"
          >
            <img
              :src="latest"
              alt="Latest news and updates"
              class="object-cover w-full h-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>

    <main class="container mx-auto px-4 md:px-8 py-16">
      <h2 class="text-4xl font-bold text-gray-900 text-center mb-12">
        Latest News
      </h2>

      <div class="max-w-7xl mx-auto mb-8">
        <select
          class="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
        >
          <option>January 2026</option>
          <option>February 2026</option>
          <option>March 2026</option>
        </select>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto mb-16"
      >
        <div
          v-for="article in sortedArticles"
          :key="article.id"
          class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
        >
          <img
            :src="
              article.image.startsWith('http')
                ? article.image
                : imageMap[article.image]
            "
            class="w-full h-60 object-contain"
          />

          <div class="p-6">
            <p class="text-sm text-orange-500 mb-4 flex items-center space-x-4">
              <span class="flex items-center">
                {{ article.date }}
              </span>
              <span class="flex items-center">
                {{ article.commentCount }} Comments
              </span>
            </p>

            <p class="text-gray-700 text-base mb-4">
              {{ article.excerpt }}
            </p>

            <RouterLink
              :to="`/blog/${article.slug}`"
              class="inline-block bg-green-700 text-white text-sm px-5 py-2 rounded-full hover:bg-green-800 transition-colors"
            >
              Read More
            </RouterLink>
          </div>
        </div>
      </div>

      <div
        class="flex justify-center items-center space-x-4 text-gray-600 mb-20"
      >
        <span class="text-sm">Page 1 of 2</span>
        <a
          href="#"
          class="flex items-center space-x-1 text-green-700 hover:underline"
        >
          <span>Next</span>
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </a>
      </div>

      <section class="max-w-7xl mx-auto mb-20">
        <h2 class="text-4xl font-bold text-gray-900 text-center mb-12">
          Video Updates
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(video, index) in videos"
            :key="index"
            class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
          >
            <div class="aspect-video bg-black">
              <iframe
                class="w-full h-full"
                :src="getEmbedUrl(video.url)"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>

            <div class="p-4">
              <p class="text-sm text-orange-500 mb-1">
                {{ video.date }}
              </p>
              <h4 class="font-semibold text-gray-800">
                {{ video.title }}
              </h4>
            </div>
          </div>
        </div>
      </section>

      <h2 class="text-4xl font-bold text-gray-900 text-center mb-12">
        Policy & Advocacy
      </h2>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16 py-10 px-10 bg-[#F2F9F3] rounded-3xl"
      >
        <div
          v-for="item in policyUpdates"
          :key="item.slug"
          class="flex flex-col text-center"
        >
          <div
            class="w-full h-48 mb-4 rounded-xl overflow-hidden border-2 border-green-400/50 shadow-md"
          >
            <img
              :src="
                item.image.startsWith('http')
                  ? item.image
                  : imageMap[item.image]
              "
              :alt="item.title"
            />
          </div>

          <h4 class="text-lg font-semibold text-gray-900 mb-2">
            {{ item.title }}
          </h4>

          <p class="text-gray-600 text-sm mb-3">
            {{ item.excerpt }}
          </p>

          <RouterLink
            :to="`/blog/${item.slug}`"
            class="text-orange-600 text-sm font-medium hover:text-orange-700 transition mx-auto"
          >
            Learn more →
          </RouterLink>
        </div>
      </div>

      <div class="flex justify-center items-center space-x-4 text-gray-600">
        <span class="text-sm">Page 1 of 2</span>
        <a
          href="#"
          class="flex items-center space-x-1 text-green-700 hover:underline"
        >
          <span>Next</span>
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </a>
      </div>
    </main>
  </div>
</template>

<script setup>
import wef from "@/assets/wef.jpg";
import { newsPageSchema } from "@/schemas/pages/news.schema";
import { computed } from "vue";


const sortedArticles = computed(() => {
  return [...newsPageSchema.news.latestNewsSection.articles].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
});
const policyUpdates = newsPageSchema.news.policyAdvocacySection.updates;

const latest =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769896360/243A8355_r47c3t.jpg";
const event =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769715457/16268da44f149e859e5069f5fcdbf9fb_S_j9rsms.jpg";
const group =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769716176/e21b2626f11dbd7c071c1bdc38aee1f6_L_y1r0t8.jpg";
const group1 =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769716176/f01ce502715837920e87942116372980_M_jb2p23.jpg";
const hands =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769715465/1feebd03da9f660dfb6e3f79b696f544_L_rxf7mk.jpg";
const hands1 =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769716174/f5b95525832f3712e665bb57dba370d3_XS_yrppya.jpg";
const hands2 =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769716176/dc2a1ae8ac60464700aa7be25ea2c408_L_dt5us8.jpg";

const imageMap = {
  "event.png": event,
  "group.png": group,
  "group1.png": group1,
  "wef.jpg": wef,
  "hands.png": hands,
    "hands1.png": hands1,
  "hands2.png": hands2,

};

const videos = [
  {
    title: "Special Address by NCDC DG Dr. Jide Idris | HFN Annual Conference 2026",
    date: "March 11, 2026",
    url: "https://www.youtube.com/watch?v=-EE2utpBKng&t=6s",
  },
  {
    title: "HFN Healthcare Policy Roundtable",
    date: "October 20, 2025",
    url: "https://www.youtube.com/watch?v=Usug5WLXWRM",
  },
  {
    title: "HFN Women’s Forum – Innovation & Leadership",
    date: "September 18, 2025",
    url: "https://www.youtube.com/watch?v=GAxo0PH39Sc",
  },
  {
    title: "HFN Conference 2025 Highlights",
    date: "August 5, 2025",
    url: "https://www.youtube.com/watch?v=ihiq1lI5ghY",
  },
];

const getEmbedUrl = (youtubeUrl) => {
  const url = new URL(youtubeUrl);
  const videoId = url.searchParams.get("v");
  return `https://www.youtube.com/embed/${videoId}`;
};
</script>

<style scoped>
</style>
