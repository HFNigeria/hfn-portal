<script setup>
import api from "@/api/axios";
import newsApi from "@/api/newsModule";
import HfnCalender from "@/components/layout/HfnCalender.vue";
import { homePageSchema } from "@/schemas/pages/home.schema";
import { resolveAsset } from "@/utils/assetMap";
import { computed, onMounted, onUnmounted, ref } from "vue";

import {
  HandRaisedIcon,
  LightBulbIcon,
  ScaleIcon,
  UserGroupIcon,
} from "@heroicons/vue/24/outline";

import wef from "@/assets/wef.jpg";

const latest =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769896360/243A8355_r47c3t.jpg";
const event =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769715457/16268da44f149e859e5069f5fcdbf9fb_S_j9rsms.jpg";
const hands =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769715465/1feebd03da9f660dfb6e3f79b696f544_L_rxf7mk.jpg";
const hands1 =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769716174/f5b95525832f3712e665bb57dba370d3_XS_yrppya.jpg";
const hands2 =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769716176/dc2a1ae8ac60464700aa7be25ea2c408_L_dt5us8.jpg";

const showDonateDialog = ref(false);
const showConferencePopup = ref(false);
const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let countdownInterval = null;

const apiNews = ref([]);

const startCountdown = () => {
  const targetDate = new Date("March 4, 2026 09:00:00").getTime();

  countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      clearInterval(countdownInterval);
      return;
    }

    timeLeft.value = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  }, 1000);
};
const closeConferencePopup = () => {
  showConferencePopup.value = false;
  sessionStorage.setItem("hfn_conference_popup_shown", "true");
};

const openDonateDialog = () => {
  showDonateDialog.value = true;
};

const closeDonateDialog = () => {
  showDonateDialog.value = false;
};
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
  return img;
};

// const resolveImage = (item) => {
//   if (!item) return "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772533037/news_mup0qv.png";

//   const img =
//     item.image ||
//     item.thumbnail ||
//     item.coverImage ||
//     item.featured_image ||
//     item.featuredImage ||
//     item.image_url ||
//     item.file ||
//     item.media;

//   if (!img) return "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772533037/news_mup0qv.png";

//   if (typeof img === "string" && img.startsWith("http")) {
//     return img;
//   }

//   if (imageMap[img]) {
//     return imageMap[img];
//   }

//   return "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772533037/news_mup0qv.png";
// };

const actionRef = ref(null);
const isVisible = ref(false);
const sectionRef = ref(null);
const actions = [
  {
    title: "Policy Advocacy",
    description:
      "We engage policymakers to shape evidence-based reforms that enable effective regulation, sustainable financing, and private sector participation in health system strengthening.",
    icon: ScaleIcon,
  },
  {
    title: "Stakeholder Convening",
    description:
      "We bring together private sector actors, government institutions, and development partners to align priorities, share knowledge, and drive collective action.",
    icon: UserGroupIcon,
  },
  {
    title: "Sector Intelligence & Thought Leadership",
    description:
      "We generate insights, reports, and high-level dialogues that inform policy decisions, investment, and strategic engagement across the health sector.",
    icon: LightBulbIcon,
  },
  {
    title: "Public–Private Collaboration",
    description:
      "We support partnerships that leverage private sector capacity to improve service delivery, emergency care, and access to quality healthcare.",
    icon: HandRaisedIcon,
  },
];

const heroSlides = [
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769773405/1_1_uebqmc.jpg",
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769801024/2_evqlkd.jpg",
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769773393/3_nvepaa.jpg",
];

const activeSlide = ref(0);
let interval = null;

const faqs = computed(() => pageContent.value.faqs);
const group =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769715465/1feebd03da9f660dfb6e3f79b696f544_L_rxf7mk.jpg";
const group1 =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769801806/IMG_8324_vikc7v.jpg";
const activeFaq = ref(null);
const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index;
};

const assignTagFromContent = (news) => {
  if (news.tag) return news.tag;

  const text = `${news.title} ${news.excerpt} ${news.content}`.toLowerCase();

  const keywordMap = [
    { keywords: ["alert", "outbreak", "disease", "emergency", "virus", "epidemic", "pandemic", "warning", "crisis", "flu"], tag: "Health Alert" },
    { keywords: ["policy", "advocacy", "reform", "government", "regulation", "law", "legislation", "committee", "ministry"], tag: "Policy & Advocacy" },
    { keywords: ["digital", "tech", "technology", "platform", "app", "innovation", "telemedicine", "data", "electronic", "ai"], tag: "Digital Health" },
    { keywords: ["program", "initiative", "campaign", "awareness", "screening", "vaccination", "immunization", "training", "workshop"], tag: "Programs & Initiatives" },
    { keywords: ["story", "community", "public", "patient", "care", "wellness", "prevention", "lifestyle", "nutrition"], tag: "Public Health Stories" },
    { keywords: ["partnership", "collaboration", "funding", "investment", "sponsor", "donation", "grant"], tag: "Partnerships" },
    { keywords: ["event", "conference", "summit", "forum", "roundtable", "meeting", "dialogue"], tag: "Events & Conferences" },
  ];

  for (const { keywords, tag } of keywordMap) {
    if (keywords.some((kw) => text.includes(kw))) {
      return tag;
    }
  }

  const fallbackTags = ["Programs & Initiatives", "Public Health Stories", "Policy & Advocacy"];
  return fallbackTags[Math.floor(Math.random() * fallbackTags.length)];
};

const months = computed(() => Object.keys(pageContent.value.news.months));

const allDummyNews = computed(() => {
  const allNews = [];
  for (const month of Object.keys(pageContent.value.news.months)) {
    const monthData = pageContent.value.news.months[month];
    if (monthData.featured) {
      allNews.push({ ...monthData.featured, source: "dummy" });
    }
    if (monthData.newsList) {
      monthData.newsList.forEach((news) => {
        allNews.push({ ...news, source: "dummy" });
      });
    }
  }
  return allNews;
});

const featured = computed(() => {
  if (apiNews.value.length > 0) {
    const latestApi = apiNews.value[0];
    const formattedDate = latestApi.publish_date
      ? new Date(latestApi.publish_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
    return { ...latestApi, source: "api", date: formattedDate, tag: assignTagFromContent(latestApi) };
  }
  const firstMonth = Object.keys(pageContent.value.news.months)[0];
  return pageContent.value.news.months[firstMonth]?.featured;
});

const executives = computed(() => pageContent.value.executives);

const pageContent = ref(structuredClone(homePageSchema));
const pageType = "home";
const selectedMonth = ref(Object.keys(homePageSchema.news.months)[0]);
const currentPage = ref(0);
const newsPerPage = 3;

const allNewsList = computed(() => {
  const apiNewsList = apiNews.value.slice(1).map((news) => {
    const formattedDate = news.publish_date
      ? new Date(news.publish_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
    return {
      ...news,
      source: "api",
      date: formattedDate,
      tag: assignTagFromContent(news),
    };
  });
  const dummyNewsList = allDummyNews.value.filter(
    (news) => news.slug !== featured.value?.slug
  );
  return [...apiNewsList, ...dummyNewsList];
});

const newsList = computed(() => {
  const start = currentPage.value * newsPerPage;
  return allNewsList.value.slice(start, start + newsPerPage);
});

const totalPages = computed(() =>
  Math.ceil(allNewsList.value.length / newsPerPage)
);

const goToPrevPage = () => {
  if (currentPage.value > 0) currentPage.value--;
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value - 1) currentPage.value++;
};

onMounted(async () => {
  startCountdown();
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        isVisible.value = true;
        observer.unobserve(entries[0].target);
      }
    },
    { threshold: 0.2 }
  );

  if (!sessionStorage.getItem("hfn_conference_popup_shown")) {
    setTimeout(() => {
      showConferencePopup.value = true;
    }, 1500);
  }

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
  interval = setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % heroSlides.length;
  }, 5000);

  try {
    const { data } = await api.get(`/pages/${pageType}/`);
    const rawContent = data.content || {};
    if (rawContent._hidden) {
      for (const key of rawContent._hidden) {
        if (rawContent[key]) {
          rawContent[key].is_hidden = true;
        }
      }
      delete rawContent._hidden;
    }
    pageContent.value = { ...structuredClone(homePageSchema), ...rawContent };
  } catch (err) {
    console.error("Failed to load homepage content:", err);
    pageContent.value = structuredClone(homePageSchema);
  }

  try {
    const newsData = await newsApi.listArticles();
    apiNews.value = newsData.results || newsData || [];
  } catch (err) {
    console.error("Failed to load API news:", err);
    apiNews.value = [];
  }

  const toggles = document.querySelectorAll(".faq-toggle");
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const targetId = toggle.getAttribute("data-target");
      const content = document.getElementById(targetId);
      const icon = toggle.querySelector(".faq-icon");
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";

      toggles.forEach((t) => {
        if (t !== toggle) {
          t.setAttribute("aria-expanded", "false");
          document.getElementById(
            t.getAttribute("data-target")
          ).style.maxHeight = "0";
          t.querySelector(".faq-icon").classList.remove("rotate-45");
        }
      });

      if (isExpanded) {
        toggle.setAttribute("aria-expanded", "false");
        content.style.maxHeight = "0";
        icon.classList.remove("rotate-45");
      } else {
        toggle.setAttribute("aria-expanded", "true");
        content.style.maxHeight = content.scrollHeight + "px";
        icon.classList.add("rotate-45");
      }
    });
  });
});

onUnmounted(() => {
  clearInterval(interval);
  if (countdownInterval) clearInterval(countdownInterval);
});
</script>

<template>
  <div>
    <section v-if="!pageContent.hero?.is_hidden" class="relative h-[90vh] min-h-[650px] overflow-hidden">
      <div class="absolute inset-0">
        <transition-group name="fade">
          <img
            v-for="(slide, index) in heroSlides"
            v-show="index === activeSlide"
            :key="slide"
            :src="slide"
            class="absolute inset-0 w-full h-full object-cover"
          />
        </transition-group>

        <div class="absolute inset-0 bg-black/50"></div>
      </div>

      <div class="relative z-10 h-full flex items-center">
        <div class="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div class="lg:w-1/2 text-white">
            <h1
              class="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
            >
              <span class="text-white-400">
                {{ pageContent.hero.titleHighlight }}
              </span>
              <br />
              <span class="text-white">
                {{ pageContent.hero.titleMain }}
              </span>
            </h1>

            <p class="text-lg mb-6 max-w-xl">
              <span class="text-white-300 font-semibold">
                {{ pageContent.hero.introLine }}
              </span>
              {{ pageContent.hero.introText }}
            </p>

            <p class="text-lg mb-10 max-w-xl">
              {{ pageContent.hero.subText }}
            </p>

            <RouterLink
              :to="pageContent.hero.ctaLink"
              class="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-xl font-semibold shadow-xl transition"
            >
              {{ pageContent.hero.ctaText }}
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section v-if="!pageContent.about?.is_hidden" ref="sectionRef" class="relative py-20 overflow-hidden bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div
            class="relative w-full lg:w-1/2 transition-all duration-1000 ease-out"
            :class="
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-20'
            "
          >
            <div
              class="relative z-10 w-full aspect-square md:aspect-[4/5] overflow-hidden shadow-2xl hover:rotate-2 transition-transform duration-700"
              style="border-radius: 100px 0 100px 0"
            >
              <img
                src="https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769803836/1_hkuaio.jpg"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-[#004d33]/60 to-transparent"
              ></div>
            </div>

            <div
              class="absolute -bottom-6 -right-6 z-20 bg-white p-6 shadow-xl rounded-2xl border-l-4 border-[#004d33] animate-bounce-slow"
            >
              <p class="text-3xl font-black text-[#004d33]">6+</p>
              <p
                class="text-xs font-bold text-gray-500 uppercase tracking-widest"
              >
                Health Guardians
              </p>
            </div>
          </div>

          <div
            class="w-full lg:w-1/2 space-y-8 transition-all duration-1000 delay-300 ease-out"
            :class="
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-20'
            "
          >
            <div class="inline-flex items-center space-x-2">
              <span class="w-10 h-[2px] bg-[#004d33]"></span>
              <span
                class="text-[#004d33] font-black uppercase tracking-[0.3em] text-xs"
                >Who We Are</span
              >
            </div>

            <h2
              class="text-4xl md:text-5xl font-black text-gray-900 leading-tight"
            >
              Strengthening Nigeria's <br />
              <span class="text-green-700">Healthcare System</span>
            </h2>

            <div class="space-y-6">
              <p class="text-lg text-gray-600 leading-relaxed font-medium">
                Healthcare Federation of Nigeria (HFN) is a
                <span class="text-green-700 font-bold"
                  >coalition of private healthcare stakeholders</span
                >
                committed to strengthening Nigeria’s health system through
                strategic advocacy, collaboration, and private sector
                leadership. HFN serves as a unified platform for engaging
                government, influencing health policy, and enabling private
                sector contributions that expand access, improve quality, and
                accelerate progress toward Universal Health Coverage.
              </p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="feature-card">
                  <div class="icon-box">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="m12 14 4-4-4-4" />
                      <path d="M3 3v18h18" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-green-700 text-sm">
                      Unified Platform
                    </h4>
                    <p
                      class="text-[10px] text-gray-500 uppercase font-bold tracking-tighter"
                    >
                      Engagement & Policy
                    </p>
                  </div>
                </div>

                <div class="feature-card">
                  <div class="icon-box">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-green-700 text-sm">
                      Universal Progress
                    </h4>
                    <p
                      class="text-[10px] text-gray-500 uppercase font-bold tracking-tighter"
                    >
                      Universal Coverage
                    </p>
                  </div>
                </div>
              </div>

              <RouterLink to="/about" class="cta-button group">
                Read Our Full Story
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="transition-transform group-hover:translate-x-2"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-if="!pageContent.mandate?.is_hidden"
      ref="actionRef"
      class="py-24 bg-[#F2F9F3] relative overflow-hidden"
    >
      <div
        class="absolute top-0 right-0 text-[15rem] font-black text-white leading-none -z-0 opacity-40 translate-y-20 select-none"
      >
        ACTION
      </div>

      <div class="max-w-7xl mx-auto px-4 relative z-10">
        <div class="text-center mb-16 space-y-4">
          <h2
            class="text-green-700 font-black uppercase tracking-[0.4em] text-xs"
          >
            Our Core Mandate
          </h2>
          <h3 class="text-4xl md:text-5xl font-black text-gray-900">
            What We Do
          </h3>
          <p
            class="max-w-2xl mx-auto text-gray-600 leading-relaxed font-medium"
          >
            Driving measurable change in Nigeria's healthcare landscape through
            four strategic pillars.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="(action, index) in actions"
            :key="index"
            class="group relative bg-white p-8 md:p-10 rounded-[2.5rem] border border-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden translate-y-10 opacity-0"
            :class="{ 'animate-reveal': isVisible }"
            :style="{ 'animation-delay': `${index * 150}ms` }"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-transparent via-[#f2f9f3]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            ></div>

            <div class="relative z-10 flex flex-col h-full">
              <div class="flex items-start justify-between mb-6">
                <div
                  class="w-16 h-16 rounded-2xl bg-green-700 flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform duration-500"
                >
                  <component :is="action.icon" class="w-8 h-8" />
                </div>
                <span
                  class="text-5xl font-black text-[#004d33]/5 select-none group-hover:text-[#004d33]/10 transition-colors"
                  >0{{ index + 1 }}</span
                >
              </div>

              <h4 class="text-2xl font-black text-gray-900 mb-4">
                {{ action.title }}
              </h4>
              <p class="text-gray-600 leading-relaxed font-medium">
                {{ action.description }}
              </p>

              <div class="mt-8 flex flex-wrap gap-2">
                <span
                  v-for="tag in action.tags"
                  :key="tag"
                  class="px-3 py-1 bg-[#F2F9F3] text-[#004d33] text-[10px] font-bold uppercase tracking-wider rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="sweep"></div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="!pageContent.news?.is_hidden" class="bg-white py-16 px-6 md:px-12 lg:px-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div
          class="flex flex-col sm:flex-row justify-center items-center h-auto sm:h-20 relative rounded-2xl border-2 border-green-50 bg-white shadow-sm px-4 py-3"
        >
          <select
            v-model="selectedMonth"
            class="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-700 appearance-none bg-white pr-8 w-full sm:w-auto sm:absolute sm:left-6"
          >
            <option v-for="month in months" :key="month" :value="month">
              {{ month }}
            </option>
          </select>

          <h2
            class="text-2xl sm:text-3xl md:text-4xl font-sans font-extrabold text-gray-900 tracking-tight text-center sm:text-left mt-3 sm:mt-0"
          >
            Our Latest Update
          </h2>
        </div>
      </div>
    </section>

    <section v-if="!pageContent.news?.is_hidden" class="bg-[#f6faf8] py-16 px-6 md:px-12 lg:px-24">
      <div class="grid lg:grid-cols-3 gap-8">
        <div
          class="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
        >
          <div class="relative">
            <img
              :src="resolveImage(featured)"
              alt="Featured news"
              class="w-full h-[400px] object-cover object-top"
            />
            <span
              class="absolute bottom-4 left-4 bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded-full"
            >
              {{ featured.tag }}
            </span>
          </div>

          <div class="p-6">
            <div
              class="flex items-center text-sm text-orange-600 mb-3 space-x-4"
            >
              <span class="flex items-center gap-1">
                <i class="fa-regular fa-calendar"></i> {{ featured.date }}
              </span>
              <span class="flex items-center gap-1">
                <i class="fa-regular fa-comments"></i>
                {{ featured.comments }} Comment
              </span>
            </div>

            <p class="text-gray-700 mb-6">
              {{ featured.description || featured.excerpt }}
            </p>

            <RouterLink
              v-if="featured?.slug"
              :to="`/blog/${featured.slug}`"
              class="inline-flex items-center gap-2 bg-green-700 text-white px-5 py-2 rounded-full font-medium hover:bg-green-800 transition"
            >
              Read More <i class="fa-solid fa-arrow-right"></i>
            </RouterLink>
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <div
            v-for="(news, index) in newsList"
            :key="index"
            class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 flex flex-col sm:flex-row transition hover:shadow-md"
          >
            <div class="relative w-full sm:w-48">
              <img
                :src="resolveImage(news)"
                alt="News image"
                class="w-full h-40 sm:h-full object-cover"
              />

              <span
                class="absolute bottom-3 left-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full"
                :class="{
                  'bg-red-700 text-white': news.tag === 'Health Alert',
                  'bg-orange-600 text-white':
                    news.tag === 'Public Health Stories',
                }"
              >
                {{ news.tag }}
              </span>
            </div>

            <div class="flex flex-col justify-between p-4 flex-1">
              <div>
                <div
                  class="flex items-center text-xs text-orange-600 mb-2 space-x-6"
                >
                  <span class="flex items-center gap-1">
                    <i class="fa-regular fa-calendar text-orange-600"></i>
                    {{ news.date }}
                  </span>
                  <span class="flex items-center gap-1">
                    <i class="fa-regular fa-comments text-orange-600"></i>
                    {{ news.comments }} Comment
                  </span>
                </div>

                <p class="text-gray-700 text-sm leading-relaxed line-clamp-3">
                  {{ news.description || news.excerpt}}
                </p>
              </div>

              <div class="mt-3">
                <span
                  class="inline-block bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full"
                  :class="{
                    'bg-red-700 text-white': news.tag === 'Health Alert',
                    'bg-orange-600 text-white':
                      news.tag === 'Public Health Stories',
                  }"
                >
                  {{ news.tag }}
                </span>
                <RouterLink
                  v-if="news.slug"
                  :to="`/blog/${news.slug}`"
                  class="text-green-700 text-xs font-bold hover:underline"
                >
                  Read More →
                </RouterLink>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-center gap-4 mt-4">
            <button
              @click="goToPrevPage"
              :disabled="currentPage === 0"
              class="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-green-700 hover:text-white hover:border-green-700 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-300"
            >
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <span class="text-sm text-gray-600 font-medium">
              {{ currentPage + 1 }} of {{ totalPages }}
            </span>
            <button
              @click="goToNextPage"
              :disabled="currentPage >= totalPages - 1"
              class="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-green-700 hover:text-white hover:border-green-700 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-300"
            >
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section v-if="!pageContent.news?.is_hidden" class="bg-[#f6faf8] pb-16 px-6 md:px-12 lg:px-24">
      <div class="flex justify-center">
        <RouterLink
          to="/news"
          class="inline-flex items-center gap-2 bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800 transition shadow-lg"
        >
          Read More News <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </div>
    </section>

    <section v-if="!pageContent.executives?.is_hidden" class="py-16 bg-white">
      <div class="container mx-auto px-6 text-center">
        <h2
          class="text-3xl md:text-4xl font-sans mb-10 font-extrabold text-gray-900 rounded-2xl border-2 border-green-50 bg-white shadow-md px-4 py-4"
        >
          Our Executives
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div
            v-for="(exec, index) in executives"
            :key="index"
            class="flex justify-center"
          >
            <div
              class="relative w-full max-w-xs aspect-[4/5] rounded-t-[2.5rem] rounded-b-xl overflow-hidden shadow-2xl"
              style="background-color: #f0f7f5"
            >
              <img
                :src="exec.image"
                :alt="exec.name"
                class="w-full h-full object-cover object-top"
              />

              <div
                class="absolute mb-5 bottom-0 left-1/2 transform -translate-x-1/2 w-[85%] px-4 py-3 rounded-xl border border-green-300 bg-white shadow-xl text-center"
              >
                <h3 class="text-lg font-bold text-green-700">
                  {{ exec.name }}
                </h3>
                <p class="text-sm text-gray-700">
                  {{ exec.position }}
                </p>
                <p class="text-sm text-gray-700">
                  {{ exec.role }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="!pageContent.partners?.is_hidden" class="py-6 border-b border-gray-200 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-6">
          <span
            class="text-lg font-semibold text-gray-500 uppercase tracking-wider"
          >
            {{ pageContent.partners.title }}
          </span>
        </div>

        <div class="flex flex-wrap justify-center items-center gap-5 md:gap-10">
          <div
            v-for="(logoKey, index) in pageContent.partners.logos"
            :key="index"
            class="flex items-center justify-center h-48 w-49"
          >
            <img
              :src="resolveAsset(logoKey)"
              :alt="logoKey + ' Logo'"
              class="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="!pageContent.faqs?.is_hidden">
      <HfnCalender id="calendar" />
    </div>

    <section class="relative py-20 px-4">
      <div
        class="max-w-6xl mx-auto relative overflow-hidden rounded-[4rem] bg-[#004d33] p-8 md:p-20 shadow-2xl group"
      >
        <div class="absolute inset-0 z-0 opacity-20">
          <div
            v-for="n in 8"
            :key="n"
            class="particle text-white"
            :style="{ '--d': n * 2 + 's', '--x': n * 10 + '%' }"
          ></div>
        </div>

        <div
          class="absolute -top-24 -right-24 w-96 h-96 bg-green-400 rounded-full blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"
        ></div>

        <div
          class="relative z-10 flex flex-col items-center text-center space-y-8"
        >
          <div
            class="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 animate-pulse"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
              />
            </svg>
          </div>

          <div class="max-w-3xl space-y-4">
            <h2
              class="text-3xl md:text-5xl font-black text-white leading-tight"
            >
              Make a Tangible Difference
            </h2>
            <p
              class="text-lg md:text-xl text-green-100/80 font-medium leading-relaxed"
            >
              Support advocacy and collaboration that strengthen Nigeria’s
              healthcare system.
            </p>
          </div>

          <button
            @click="openDonateDialog"
            class="relative group/btn overflow-hidden bg-white px-12 py-5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <div
              class="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
            ></div>
            <span
              class="relative z-10 text-[#004d33] group-hover/btn:text-white font-black text-lg flex items-center gap-3"
            >
              Donate Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="transition-transform group-hover/btn:translate-x-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </button>

          <div
            class="pt-4 flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
          >
            <p
              class="text-[10px] text-white font-bold tracking-[0.2em] uppercase"
            >
              Secure Donation via
            </p>
            <div class="flex gap-4">
              <div class="w-8 h-8 rounded bg-white/20"></div>
              <div class="w-8 h-8 rounded bg-white/20"></div>
              <div class="w-8 h-8 rounded bg-white/20"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div
    v-if="showDonateDialog"
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl p-8 max-w-md w-full relative shadow-2xl">
      <button
        @click="closeDonateDialog"
        class="absolute top-4 right-4 text-gray-400 hover:text-black text-xl"
      >
        ✕
      </button>

      <h3 class="text-2xl font-bold mb-6 text-[#004d33]">
        Donation Account Details
      </h3>

      <div class="space-y-4 text-gray-700 font-medium">
        <p><strong>Bank Name:</strong> Zenith Bank</p>
        <p><strong>Account Name:</strong> Healthcare Federation Of Nigeria</p>
        <p><strong>Account Number:</strong> 1013784059</p>
      </div>

      <button
        @click="closeDonateDialog"
        class="mt-8 w-full bg-[#004d33] text-white py-3 rounded-xl font-bold hover:bg-green-800 transition"
      >
        Close
      </button>
    </div>
  </div>
</template>

<style scoped>
@import "tailwindcss";

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.container {
  max-width: 1100px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
.animate-bounce-slow {
  animation: bounce-slow 4s ease-in-out infinite;
}

.feature-card {
  @apply flex items-center gap-4 p-5 rounded-2xl bg-[#f2f9f3]/70 border border-white hover:border-[#004d33]/20 hover:bg-white hover:shadow-xl hover:shadow-green-900/5 transition-all duration-500;
}

.icon-box {
  @apply w-12 h-12 rounded-xl bg-[#004d33] flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-900/20;
}

.cta-button {
  @apply inline-flex items-center gap-2
         bg-green-700 text-white
         px-5 py-2.5
         rounded-full
         font-semibold text-sm
         shadow-md shadow-green-900/20
         hover:shadow-green-900/40
         transition-all transform hover:-translate-y-0.5 active:scale-95;
}

@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}
.animate-bounce-slow {
  animation: bounce-slow 4s ease-in-out infinite;
}

.animate-reveal {
  animation: revealUp 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

@keyframes revealUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sweep {
  @apply absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] transition-all duration-1000 ease-in-out;
}

.group:hover .sweep {
  left: 100%;
}

.particle {
  position: absolute;
  bottom: -20px;
  left: var(--x);
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  animation: rise 5s infinite linear;
  animation-delay: var(--d);
}

@keyframes rise {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translateY(-300px) scale(0);
    opacity: 0;
  }
}
</style>
