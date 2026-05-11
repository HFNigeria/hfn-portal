<template>
  <div class="news-page font-sans bg-white">
    <section v-if="!page.hero?.is_hidden" class="bg-[#E87A1814] pt-10 pb-16">
      <div class="container mx-auto px-4 md:px-8">
        <div
          class="flex flex-col lg:flex-row items-start lg:items-center justify-between"
        >
          <div class="lg:w-1/2 mb-8 lg:mb-0">
            <h1
              class="text-4xl md:text-5xl font-bold text-gray-800 leading-tight"
            >
              <span class="text-green-700">{{ page.hero.titleLine1 }}</span>
              <br />
              <span class="text-gray-900">{{ page.hero.titleLine2 }}</span>
            </h1>
            <p class="mt-4 text-gray-600 max-w-lg">
              {{ page.hero.description }}
            </p>
          </div>

          <div
            class="lg:w-1/2 flex justify-center w-full h-64 sm:h-80 lg:h-96 relative"
          >
            <img
              :src="
                page.hero.image.startsWith('http')
                  ? page.hero.image
                  : imageMap[page.hero.image]
              "
              alt="Latest news and updates"
              class="object-cover w-full h-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>

    <main v-if="!page.latestNewsSection?.is_hidden" class="container mx-auto px-4 md:px-8 py-16">
      <h2 class="text-4xl font-bold text-gray-900 text-center mb-12">
        {{ page.latestNewsSection.title }}
      </h2>

      <div
        class="max-w-7xl mx-auto mb-10 flex flex-wrap items-center gap-4 justify-center"
      >
        <!-- Month -->
        <div class="relative">
          <select
            v-model="selectedDate.month"
            @change="
              fetchArticles();
              fetchVideos();
            "
            class="appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-full px-5 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="">All Months</option>
            <option v-for="m in 12" :key="m" :value="m">
              {{
                new Date(0, m - 1).toLocaleString("default", { month: "long" })
              }}
            </option>
          </select>

          <span class="absolute right-3 top-2.5 text-gray-400"> ▼ </span>
        </div>

        <!-- Year -->
        <div class="relative">
          <select
            v-model="selectedDate.year"
            @change="
              fetchArticles();
              fetchVideos();
            "
            class="appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-full px-5 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="">All Years</option>
            <option v-for="y in 5" :key="y" :value="2026 - y + 1">
              {{ 2026 - y + 1 }}
            </option>
          </select>

          <span class="absolute right-3 top-2.5 text-gray-400"> ▼ </span>
        </div>

        <!-- Reset -->
        <button
          @click="
            selectedDate.month = '';
            selectedDate.year = '';
            videosPage.value = 1;
            fetchArticles();
            fetchVideos();
          "
          class="text-sm bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-800 transition"
        >
          Reset Filters
        </button>
      </div>
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto mb-16"
      >
        <div
          v-for="article in paginatedArticles"
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

            <a
              v-if="article.external_link"
              :href="article.external_link"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block bg-green-700 text-white text-sm px-5 py-2 rounded-full hover:bg-green-800 transition-colors"
            >
              Read More
            </a>
            <RouterLink
              v-else
              :to="getArticleLink(article)"
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
        <button
          @click="goToPrevPage"
          :disabled="currentPage === 1"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
          class="flex items-center space-x-1 text-green-700 hover:underline disabled:hover:no-underline"
        >
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
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          <span>Prev</span>
        </button>
        <span class="text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          @click="goToNextPage"
          :disabled="currentPage === totalPages"
          :class="{
            'opacity-50 cursor-not-allowed': currentPage === totalPages,
          }"
          class="flex items-center space-x-1 text-green-700 hover:underline disabled:hover:no-underline"
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
        </button>
      </div>

      <section class="max-w-7xl mx-auto mb-20">
        <h2 class="text-4xl font-bold text-gray-900 text-center mb-12">
          Video Updates
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(video, index) in paginatedVideos"
            :key="index"
            class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
          >
            <div class="aspect-video bg-black">
              <iframe
                v-if="video.url"
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

        <div
          v-if="totalVideoPages > 1"
          class="flex justify-center items-center space-x-4 text-gray-600 mt-8"
        >
          <button
            @click="goToPrevVideoPage"
            :disabled="videosPage === 1"
            :class="{ 'opacity-50 cursor-not-allowed': videosPage === 1 }"
            class="flex items-center space-x-1 text-green-700 hover:underline disabled:hover:no-underline"
          >
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
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            <span>Prev</span>
          </button>
          <span class="text-sm">Page {{ videosPage }} of {{ totalVideoPages }}</span>
          <button
            @click="goToNextVideoPage"
            :disabled="videosPage === totalVideoPages"
            :class="{ 'opacity-50 cursor-not-allowed': videosPage === totalVideoPages }"
            class="flex items-center space-x-1 text-green-700 hover:underline disabled:hover:no-underline"
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
          </button>
        </div>
      </section>

      <template v-if="!page.policyAdvocacySection?.is_hidden">
        <h2 class="text-4xl font-bold text-gray-900 text-center mb-12">
          {{ page.policyAdvocacySection.title }}
        </h2>

        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16 py-10 px-10 bg-[#F2F9F3] rounded-3xl"
        >
          <div
            v-for="item in paginatedPolicy"
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
              {{ item.description }}
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
          <button
            @click="goToPrevPagePolicy"
            :disabled="currentPagePolicy === 1"
            :class="{ 'opacity-50 cursor-not-allowed': currentPagePolicy === 1 }"
            class="flex items-center space-x-1 text-green-700 hover:underline disabled:hover:no-underline"
          >
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
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            <span>Prev</span>
          </button>
          <span class="text-sm"
            >Page {{ currentPagePolicy }} of {{ totalPolicyPages }}</span
          >
          <button
            @click="goToNextPagePolicy"
            :disabled="currentPagePolicy >= totalPolicyPages"
            :class="{
              'opacity-50 cursor-not-allowed':
                currentPagePolicy >= totalPolicyPages,
            }"
            class="flex items-center space-x-1 text-green-700 hover:underline disabled:hover:no-underline"
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
          </button>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import wef from "@/assets/wef.jpg";
import blog from "@/assets/blogh.png";
import { newsPageSchema } from "@/schemas/pages/news.schema";
import { ref, reactive, computed, onMounted, watch } from "vue";
import contentUploadApi from "@/api/contentUploadsApi";
import newsModule from "@/api/newsModule";
import pagesApi from "@/api/pageManagement";

const currentPage = ref(1);
const itemsPerPage = 4;
const currentPagePolicy = ref(1);
const itemsPerPagePolicy = 3;
const videosPage = ref(1);
const videosPerPage = 6;
const selectedDate = reactive({ month: "", year: "" });

const totalPages = computed(() => {
  return Math.ceil(filteredArticles.value.length / itemsPerPage) || 1;
});

const pageFromApi = ref(null);
const page = computed(() => ({
  ...newsPageSchema,
  ...(pageFromApi.value || {}),
  hero: { ...newsPageSchema.hero, ...(pageFromApi.value?.hero || {}) },
  latestNewsSection: { ...newsPageSchema.latestNewsSection, ...(pageFromApi.value?.latestNewsSection || {}) },
  policyAdvocacySection: { ...newsPageSchema.policyAdvocacySection, ...(pageFromApi.value?.policyAdvocacySection || {}) },
}));
const sortedArticles = computed(() => {
  return [...newsPageSchema.latestNewsSection.articles].sort((a, b) => {
    const dateA = new Date(a.created_at || a.date).getTime();
    const dateB = new Date(b.created_at || b.date).getTime();
    return dateB - dateA;
  });
});
// const policyUpdates = newsPageSchema.news.policyAdvocacySection.updates;
const policyUpdates = computed(() => page.value.policyAdvocacySection.updates);
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

const formatDate = (dateVal) => {
  if (!dateVal) return "N/A";
  const d = new Date(dateVal);
  return isNaN(d.getTime()) ? "N/A" : d.toDateString();
};

const getArticleLink = (article) => {
  return {
    path: `/blog/${article.slug}`,
    state: {
      article: {
        title: article.title,
        description:
          article.description || article.content || article.excerpt || "",
        image: article.featured_image || article.image || "event.png",
        date: formatDate(article.created_at || article.date),
        tag: article.tag || "News",
        caption: article.caption || "",
        comments: article.commentCount || 0,
      },
    },
  };
};

const imageMap = {
  "event.png": event,
  "group.png": group,
  "group1.png": group1,
  "wef.jpg": wef,
  "hands.png": hands,
  "hands1.png": hands1,
  "hands2.png": hands2,
  "latest_news.png": latest,
  "blogh.png": blog,
};

watch([() => selectedDate.month, () => selectedDate.year], () => {
  currentPage.value = 1;
  currentPagePolicy.value = 1;
  videosPage.value = 1;
});

const allowedAudiences = ["all", "non_members"];

const dummyArticles = [...newsPageSchema.latestNewsSection.articles];

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPrevPagePolicy = () => {
  if (currentPagePolicy.value > 1) {
    currentPagePolicy.value--;
  }
};

const goToNextPagePolicy = () => {
  if (currentPagePolicy.value < totalPolicyPages.value) {
    currentPagePolicy.value++;
  }
};

const goToPrevVideoPage = () => {
  if (videosPage.value > 1) videosPage.value--;
};

const goToNextVideoPage = () => {
  if (videosPage.value < totalVideoPages.value) videosPage.value++;
};

const paginatedArticles = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredArticles.value.slice(startIndex, endIndex);
});

const paginatedPolicy = computed(() => {
  const policyList = policyUpdates.value || [];
  const startIndex = (currentPagePolicy.value - 1) * itemsPerPagePolicy;
  const endIndex = startIndex + itemsPerPagePolicy;
  return policyList.slice(startIndex, endIndex);
});

const updatePagination = () => {
  totalPages.value = Math.ceil(filteredArticles.value.length / itemsPerPage);
};

const totalPolicyPages = computed(() => {
  const policyCount = policyUpdates.value?.length || 0;
  return Math.ceil(policyCount / itemsPerPagePolicy) || 1;
});

const paginatedVideos = computed(() => {
  const startIndex = (videosPage.value - 1) * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  return filteredVideos.value.slice(startIndex, endIndex);
});

const totalVideoPages = computed(() => Math.ceil(filteredVideos.value.length / videosPerPage) || 1);

const dummyVideos = [
  {
    title:
      "Special Address by NCDC DG Dr. Jide Idris | HFN Annual Conference 2026",
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

const articles = ref([]);
const videos = ref([]);

const selectedAudience = ref("all"); // all | non-members

const fetchArticles = async () => {
  try {
    const res = await newsModule.listArticles({
      audience: selectedAudience.value,
    });

    const apiArticles = Array.isArray(res) ? res : res.results || [];

    const normalizedApiArticles = apiArticles.map((item) => ({
      id: item.id,
      slug: item.slug,
      excerpt: item.excerpt || item.content?.slice(0, 120),
      image: item.featured_image || "blogh.png",
      title: item.title,
      description: item.content,
      created_at: item.publish_date,
      date: item.publish_date
        ? new Date(item.publish_date).toDateString()
        : "Recently Published",
      commentCount: item.comment_count || 0,
      audience: item.audience,
      external_link: item.external_link,
      is_external: item.is_external,
    }));

    articles.value = [...dummyArticles, ...normalizedApiArticles];
  } catch (error) {
    console.error("Error fetching articles");
    articles.value = [...dummyArticles];
  }
};

const fetchVideos = async () => {
  try {
    const res = await contentUploadApi.getVideos({
      type: "video",
      audience: selectedAudience.value,
    });

    const apiVideos = Array.isArray(res) ? res : res.results || [];

    const normalizedApiVideos = apiVideos
      .filter((item) => item.youtube_url)
      .map((item) => ({
        title: item.title,
        url: item.youtube_url,
        date: new Date(item.created_at).toDateString(),
        audience: item.audience,
      }));

    videos.value = [...normalizedApiVideos, ...dummyVideos];
  } catch (error) {
    console.error("Error fetching videos");
    videos.value = [...dummyVideos];
  }
};

const filteredArticles = computed(() => {
  return articles.value
    .filter((article) => {
      const dateStr = article.created_at || article.date;
      const d = dateStr ? new Date(dateStr) : null;
      const isValidDate = d && !isNaN(d.getTime());

      const matchMonth = selectedDate.month
        ? isValidDate && d.getMonth() + 1 === Number(selectedDate.month)
        : true;

      const matchYear = selectedDate.year
        ? isValidDate && d.getFullYear() === Number(selectedDate.year)
        : true;

      const matchAudience = allowedAudiences.includes(
        article.audience || "all"
      );

      return matchMonth && matchYear && matchAudience;
    })
    .sort((a, b) => {
      const getTime = (article) => {
        const dateStr = article.created_at || article.date;
        if (!dateStr) return Infinity;
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? Infinity : d.getTime();
      };
      return getTime(b) - getTime(a);
    });
});

const filteredVideos = computed(() => {
  return videos.value.filter((video) => {
    const d = new Date(video.date);

    const matchMonth = selectedDate.month
      ? d.getMonth() + 1 === Number(selectedDate.month)
      : true;

    const matchYear = selectedDate.year
      ? d.getFullYear() === Number(selectedDate.year)
      : true;

    const matchAudience = allowedAudiences.includes(video.audience || "all");

    return matchMonth && matchYear && matchAudience;
  });
});


const getEmbedUrl = (youtubeUrl) => {
  if (!youtubeUrl) return "";

  try {
    const url = new URL(youtubeUrl);
    let videoId = "";

    if (url.hostname.includes("youtu.be")) {
      videoId = url.pathname.slice(1);
    } else {
      videoId = url.searchParams.get("v") || "";
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  } catch {
    return "";
  }
};

onMounted(async () => {
  try {
    const res = await pagesApi.getPageByType("latestnews");
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
    console.warn("Using local news schema fallback");
  }
  fetchArticles();
  fetchVideos();
});
</script>

<style scoped>
</style>
