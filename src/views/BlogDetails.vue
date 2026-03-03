<template>
  <div class="bg-gray-50 min-h-screen">
    <div
      class="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10"
    >
      <div
        class="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
      >
        <span
          class="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-3"
        >
          {{ blog?.tag }}
        </span>

        <h1
          class="text-2xl lg:text-3xl font-bold text-gray-900 leading-snug mb-4"
        >
          {{ blog?.title }}
        </h1>

        <div class="flex items-center text-sm text-orange-500 mb-6 space-x-4">
          <span class="flex items-center gap-1">
            <i class="fa-regular fa-calendar text-orange-700"></i>
            Published on {{ blog?.date }}
          </span>
          <span class="flex items-center gap-1">
            <i class="fa-regular fa-eye text-orange-700"></i>
            {{ blog?.views }} Views
          </span>
        </div>

        <div class="mb-6">
          <img
            :src="resolveImage(blog)"
            alt="Blog featured"
            class="w-full h-80 object-contain rounded-2xl"
          />
          <p class="text-sm text-gray-400 italic mt-2">
            {{ blog?.caption }}
          </p>
        </div>

        
        <div class="prose max-w-none text-gray-700 leading-relaxed space-y-4">
          <p>
            {{ blog?.description }}
          </p>
        </div>

        <div class="flex items-center justify-center space-x-3 mt-8">
          <button
            class="bg-green-700 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-green-800 transition"
          >
            <i class="fa-brands fa-whatsapp-f mr-1"></i> Share
          </button>
          <button
            class="bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            <i class="fa-brands fa-facebook-f mr-1"></i> Share
          </button>
          <button
            class="bg-gray-700 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            <i class="fa-brands fa-x-twitter mr-1"></i> Tweet
          </button>
          <button
            class="bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <i class="fa-brands fa-linkedin-in mr-1"></i> Post
          </button>
        </div>
      </div>

      <div class="lg:col-span-4 space-y-6">
        <div
          class="bg-[#f0fdf499] rounded-2xl border border-gray-200 shadow-sm p-5"
        >
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Other News</h2>

          <div
            v-for="(item, index) in otherNews"
            :key="index"
            class="flex items-start gap-3 mb-5 border-b border-gray-100 pb-4 last:border-b-0"
          >
            <img
              :src="resolveImage(item)"
              alt="Other news"
              class="w-20 h-20 object-cover rounded-lg"
            />
            <div class="flex-1">
              <RouterLink
                :to="`/blog/${item.slug}`"
                class="text-sm font-medium text-gray-800 leading-snug hover:text-green-700"
              >
                {{ item.title }}
              </RouterLink>

              <div class="flex items-center text-xs text-orange-600 mt-2 gap-3">
                <span
                  ><i class="fa-regular fa-calendar text-orange-600"></i>
                  {{ item.date }}</span
                >
                <span
                  ><i class="fa-regular fa-comments text-orange-600"></i>
                  {{ item.comments }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-orange-50 border border-orange-200 rounded-xl h-60 flex items-center justify-center text-orange-600 font-semibold text-lg"
        >
          Place advert here
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { homePageSchema } from "@/schemas/pages/home.schema";
import { newsPageSchema } from "@/schemas/pages/news.schema";
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import wef from "@/assets/wef.jpg";

const route = useRoute();
// const blogId = route.params.id;
// const slug = route.params.slug;
const slug = computed(() => route.params.slug);

const allBlogs = [
  ...newsPageSchema.news.latestNewsSection.articles,
  ...newsPageSchema.news.policyAdvocacySection.updates,
  ...Object.values(homePageSchema.news.months).flatMap((m) => m.newsList),
  ...Object.values(homePageSchema.news.months).map((m) => m.featured),
];

// const blog = computed(() => allBlogs.find((item) => item.slug === slug));

// const otherNews = computed(() =>
//   allBlogs.filter((item) => item.slug !== slug).slice(0, 3)
// );

  const blog = computed(() =>
  allBlogs.find((item) => item.slug === slug.value)
);

const otherNews = computed(() =>
  allBlogs.filter((item) => item.slug !== slug.value).slice(0, 3)
);


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

const resolveImage = (item) => {
  if (!item) return "/images/placeholder-news.jpg";

  const img =
    item.image ||
    item.thumbnail ||
    item.coverImage ||
    item.featured_image ||
    item.featuredImage;

  if (!img) return "/images/placeholder-news.jpg";

  if (typeof img === 'string' && (img.startsWith("http") || img.startsWith("data:image"))) {
    return img;
  }

  if (typeof img === 'string' && img.includes('/assets/')) {
    return img;
  }

  return imageMap[img] || img || "/images/placeholder-news.jpg";
};

watch(
  () => route.params.slug,
  () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
);
</script>

<style scoped>
.prose ul {
  list-style-type: disc;
}
</style>
