<template>
  <div class="gallery-page font-sans bg-white">
    <section v-if="!page.hero?.is_hidden" :style="{ backgroundColor: page.hero.backgroundColor || '#E87A1814' }">
      <div class="container mx-auto px-4 md:px-8 pt-10 pb-16">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between">
          <div class="lg:w-1/2 mb-8 lg:mb-0">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              <span class="text-green-700">{{ page.hero.titleLine1 }}</span>
              <br />
              <span class="text-gray-900">{{ page.hero.titleLine2 }}</span>
            </h1>
            <p class="mt-4 text-gray-600 max-w-lg">{{ page.hero.description }}</p>
          </div>

          <div class="lg:w-1/2 flex justify-center w-full h-64 sm:h-80 lg:h-96 relative">
            <img :src="resolveImage(page.hero.image)" alt="Gallery highlight" class="object-cover w-full h-full rounded-2xl shadow-lg" />
          </div>
        </div>
      </div>
    </section>

    <section v-if="!page.filtering?.is_hidden" class="container mx-auto px-4 md:px-8 py-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 class="text-2xl font-semibold text-gray-800">{{ page.filtering.title }}</h3>

        <div class="flex flex-wrap gap-3">
          <select class="p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 bg-white">
            <option>All Years</option>
            <option v-for="year in page.filtering.years" :key="year">{{ year }}</option>
          </select>

          <select class="p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 bg-white">
            <option>All Categories</option>
            <option v-for="cat in page.filtering.categories" :key="cat">{{ cat }}</option>
          </select>
        </div>
      </div>
    </section>

    <section class="container mx-auto px-4 md:px-8 py-10">
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin"></div>
          <p class="text-gray-500 text-sm font-medium">Loading gallery...</p>
        </div>
      </div>

      <div v-else-if="galleryItems.lenght > 0" class="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        <div v-for="(item, i) in galleryItems" :key="i" class="break-inside-avoid">
          <RouterLink :to="`/gallery/${item.slug}`" class="block group">
            <div class="relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
              <img :src="resolveImage(item.cover || item)" :alt="item.title" class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p class="text-xs font-semibold uppercase tracking-wider">{{ item.category }}</p>
                <h3 class="text-lg font-bold">{{ item.title }}</h3>
                <p class="text-sm opacity-80">{{ item.date }}</p>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
      <div v-else class="flex justify-center items-center py-20">
  <div class="text-center">
    <p class="text-xl font-semibold text-gray-600">
      No gallery images available.
    </p>
    <p class="text-sm text-gray-500 mt-2">
      Gallery images will appear here once they are uploaded.
    </p>
  </div>
</div>

      <div v-if="hasMore" class="flex justify-center mt-12">
        <button @click="loadMorePhotos" :disabled="loadingMore" class="px-8 py-3 bg-green-700 text-white rounded-full hover:bg-green-800 transition disabled:opacity-50">
          {{ loadingMore ? 'Loading...' : 'Load More' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import pagesApi from "@/api/pageManagement";
import galleryApi from "@/api/contentUploadsApi";
import { galleryPageSchema } from "@/schemas/pages/gallery.schema";

const pageFromApi = ref(null);
const loading = ref(false);
const loadingMore = ref(false);
const error = ref(null);
const galleryItems = ref([]);
const currentPage = ref(1);
const hasMore = ref(true);

const page = computed(() => ({
  ...galleryPageSchema,
  ...(pageFromApi.value || {}),
  hero: { ...galleryPageSchema.hero, ...(pageFromApi.value?.hero || {}) },
  filtering: { ...galleryPageSchema.filtering, ...(pageFromApi.value?.filtering || {}) },
}));

const imageMap = {
  "latest_news.png": "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769738844/675362aef61a36df3271398e6ff1e414_S_c6duhw.jpg",
  "awards.png": "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769739050/850a9bd13a177b57467b2c6d7c3dfec3_L_g8tmki.jpg",
};

const resolveImage = (item) => {
  if (!item) return "";
  if (typeof item === "string") return imageMap[item] || item;
  const img = item.cover_image || item.image || item.cover;
  if (img) {
    if (typeof img === "string" && (img.startsWith("http") || img.startsWith("data:image"))) return img;
    return imageMap[img] || img;
  }
  if (item.images?.length) {
    const first = item.images[0];
    return typeof first === "string" ? first : (first.image || first.url || "");
  }
  if (item.file) return item.file;
  return "";
};

// const dummyGalleryItems = [
//   { slug: "digital-skills-bootcamp-2025", title: "Digital Skills Bootcamp 2025", category: "Workshop", date: "November 20, 2025", cover: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769739050/850a9bd13a177b57467b2c6d7c3dfec3_L_g8tmki.jpg" },
//   { slug: "women-in-tech-summit", title: "Women in Tech Summit", category: "Conference", date: "December 5, 2025", cover: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769738844/675362aef61a36df3271398e6ff1e414_S_c6duhw.jpg" },
//   { slug: "community-outreach-lagos", title: "Community Outreach Lagos", category: "Social", date: "October 12, 2025", cover: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769739050/646e54f3224499907f10b9e476e85f82_S_xa0w1q.jpg" },
//   { slug: "health-wellness-webinar", title: "Health & Wellness Webinar", category: "Webinar", date: "January 12, 2026", cover: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769739049/1327d600f17579e414edbf44c080e3b5_L_1_p2vdpq.jpg" },
//   { slug: "annual-leadership-awards", title: "Annual Leadership Awards", category: "Gala", date: "December 20, 2025", cover: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769739049/47ed312dbee39b4feb4a261300270374_M_1_jqdrbm.jpg" },
//   { slug: "tech-innovation-expo", title: "Tech Innovation Expo", category: "Conference", date: "March 15, 2026", cover: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769739049/176305b02b8b14f75f2e6c696c06f6d6_M_fyowa4.jpg" },
// ];

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); }
  catch { return ""; }
};

const fetchGalleryFromApi = async (loadMore = false) => {
  if (loadMore) loadingMore.value = true;
  else loading.value = true;
  error.value = null;

  try {
    const [allRes, nonMembersRes] = await Promise.all([
      galleryApi.gallery({ audience: "all", page: currentPage.value }),
      galleryApi.gallery({ audience: "non_members", page: currentPage.value }),
    ]);

    const apiData = [...(allRes.results || allRes), ...(nonMembersRes.results || nonMembersRes)];

    const mappedApiItems = apiData
      .filter((item) => item.media_type !== "youtube")
      .map((item) => ({
        slug: item.slug || `gallery-${item.id}`,
        title: item.title,
        category: item.category || "General",
        date: formatDate(item.created_at || item.date),
        cover: resolveImage(item),
      }));

    if (loadMore) {
      galleryItems.value = [...galleryItems.value, ...mappedApiItems];
    } else {
      galleryItems.value = mappedApiItems;
    }
     const totalResults =
  (allRes.count || 0) +
  (nonMembersRes.count || 0);

hasMore.value =
  galleryItems.value.length > 0 &&
  galleryItems.value.length < totalResults;
  } catch (err) {
    console.error("Failed to load gallery", err);
    error.value = "Failed to load gallery items";
    galleryItems.value = [...dummyGalleryItems];
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMorePhotos = () => {
  currentPage.value++;
  fetchGalleryFromApi(true);
};

onMounted(async () => {
  try {
    const res = await pagesApi.getPageByType("gallery");
    const content = res?.content || null;
    if (content?._hidden) {
      for (const key of content._hidden) {
        if (content[key]) content[key].is_hidden = true;
      }
      delete content._hidden;
    }
    pageFromApi.value = content;
  } catch (e) {
    console.warn("Using local gallery schema fallback");
  }

  fetchGalleryFromApi();
});
</script>

<style scoped>
.break-inside-avoid {
  break-inside: avoid;
}
</style>
