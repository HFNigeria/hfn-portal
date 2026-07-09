<script setup>
import contentUploadsApi from "@/api/contentUploadsApi";
import eventsApi from "@/api/events.js";
import newsApi from "@/api/newsModule.js";
import authApi from "@/api/userRegister.js";
import blogh from "@/assets/blogh.png";
import UserSidebar from "@/components/layout/UserSidebar.vue";
import { computed, onMounted, ref } from "vue";

const resources = ref([]);
const searchQuery = ref("");
const selectedType = ref("all");
const loadingResources = ref(false);
const userIsMember = true;
const newsletters = ref([]);
const events = ref([]);
const topics = ref([]);
const showRegisterModal = ref(false);
const selectedEvent = ref(null);
const registering = ref(false);
const registerError = ref(null);
const user = ref({ name: "" });
const downloadingMinutes = ref(false);
const minutesError = ref(null);
const latestMinutes = ref(null);
const showSidebar = ref(false);
const toggleSidebar = () => (showSidebar.value = !showSidebar.value);
const closeSidebar = () => (showSidebar.value = false);


// const getEmbedUrl = (youtubeUrl) => {
//   if (!youtubeUrl) return "";

//   try {
//     const url = new URL(youtubeUrl);
//     const videoId = url.searchParams.get("v");

//     if (videoId) {
//       return `https://www.youtube.com/embed/${videoId}`;
//     }

//     return youtubeUrl.replace("watch?v=", "embed/");
//   } catch {
//     return youtubeUrl;
//   }
// };

const getEmbedUrl = (youtubeUrl) => {
  if (!youtubeUrl) return "";

  try {
    const url = new URL(youtubeUrl);

    let videoId = "";


    if (url.hostname.includes("youtube.com")) {
      videoId = url.searchParams.get("v");
    }


    if (url.hostname.includes("youtu.be")) {
      videoId = url.pathname.replace("/", "");
    }

    return videoId
      ? `https://www.youtube.com/embed/${videoId}`
      : youtubeUrl;
  } catch (error) {
    return youtubeUrl;
  }
};
  
  
const videos = ref([
  {
    title:
      "NEW TAX LAWS AND IT'S IMPLICATIONS FOR PRIVATE HEALTHCARE PROVIDERS",
    url: "https://www.youtube.com/watch?v=Usug5WLXWRM",
  },
  {
    title: "HFN WOMEN'S FORUM WEBINAR - HER VOICE, HER INNOVATION",
    url: "https://www.youtube.com/watch?v=GAxo0PH39Sc",
  },
  {
    title:
      "CNBC AFRICA: FOCUS ON HEALTHCARE FEDERATION OF NIGERIA AND MEDICAL TOURISM",
    url: "https://www.youtube.com/watch?v=mld2SRRMO18",
  },
  {
    title: "HIGHLIGHTS FROM HFN CONFERENCE 2025",
    url: "https://www.youtube.com/watch?v=ihiq1lI5ghY",
  },
  {
    title:
      "FG PLEDGES SUPPORT FUNDING FOR LOCAL MANUFACTURES OF PHARMACUETICALS",
    url: "https://www.youtube.com/watch?v=tTrGFKvevFs",
  },
  {
    title: "HFN SEEKS PARTNERSHIP WITH FG ON ADVANCING HEALTHCARE",
    url: "https://www.youtube.com/watch?v=qmPRjXnEU58",
  },
  {
    title: "HFN HOST HISTORIC HIGH-LEVEL DIALOGUE ON HEALTHCARE REFORMS",
    url: "https://www.youtube.com/watch?v=S9dd1S7Xbk0",
  },
  {
    title: "HFN OFFICE OPENING AND 3D HUB LAUNCH",
    url: "https://www.youtube.com/watch?v=rEqwcBARMMo",
  },
]);


const fetchVideos = async () => {
  try {
    const [membersRes, allRes] = await Promise.all([
      contentUploadsApi.getVideos({ audience: "members" }),
      contentUploadsApi.getVideos({ audience: "all" }),
    ]);

    const apiMembersVideos = (membersRes.results || membersRes || []).map((v) => ({
      title: v.title || "HFN Video",
      url: v.youtube_url || v.url,
    }));

    const apiAllVideos = (allRes.results || allRes || []).map((v) => ({
      title: v.title || "HFN Video",
      url: v.youtube_url || v.url,
    }));

    const articles = await newsApi.listArticles({ limit: 20 });

    const articleVideos = articles
      .filter((a) => a.videos && a.videos.length)
      .flatMap((a) =>
        a.videos.map((v) => ({
          title: a.title,
          url: typeof v === "string" ? v : v.youtube_url,
        }))
      );

    const galleryData = await contentUploadsApi.gallery();

    const galleryVideos = galleryData
      .filter((item) => item.media_type === "youtube" && item.youtube_url)
      .map((item) => ({
        title: item.title || "HFN Video",
        url: item.youtube_url,
      }));

    videos.value = [
      ...apiMembersVideos,
      ...apiAllVideos,
      ...galleryVideos,
      ...articleVideos,
      ...videos.value,
    ];
  } catch (err) {
    console.error("Failed to fetch videos", err);
  }
};

const newsletterPdfs = ref([
  {
    date: "October 8, 2025",
    comments: 0,
    text: "Q4 Quarterly Newsletter, 2025 (October-December, 2025)",
    pdfUrl:
      "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1770067786/2025-hfn-quarterly-newsletter-q4_gd0aj6.pdf",
  },
  {
    date: "July 2, 2025",
    comments: 0,
    text: "Q3 Quarterly Newsletter, 2025 (July-September, 2025)",
    pdfUrl:
      "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1770067785/2025-hfn-quarterly-newsletter-q3_g4ks3t.pdf",
  },
  {
    date: "April 7, 2025",
    comments: 0,
    text: "Q2 Quarterly Newsletter, 2025 (April-June, 2025)",
    pdfUrl:
      "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1770067784/hfn-quarterly-newsletter-q-2---2025_jfakrt.pdf",
  },
  {
    date: "February 27, 2025",
    comments: 0,
    text: "Q1 Quarterly Newsletter, 2025 (January-March, 2025)",
    pdfUrl:
      "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1770067784/1st-quarter-2025-hfn-newsletter1_nznhgn.pdf",
  },
  {
    date: "October 3, 2024",
    comments: 0,
    text: "Q4 Quarterly Newsletter, 2024 (October-December, 2024)",
    pdfUrl:
      "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1770067784/hfn-quarterly-newsletter-q-4_2024_rqpvhf.pdf",
  },
]);

const dummyResources = [
  {
    id: "dummy-1",
    title: "HFN Annual Healthcare Report 2025",
    type: "report",
    description:
      "Comprehensive report on Nigeria's healthcare sector performance in 2025",
    file_url:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "dummy-2",
    title: "HFN Policy Brief – Health Financing",
    type: "publication",
    description: "Insights into healthcare financing strategies and reforms",
    file_url:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "dummy-3",
    title: "HFN Newsletter – October Edition",
    type: "news",
    description: "Highlights from HFN activities in October 2025",
    slug: "dummy-newsletter-october",
  },
  {
    id: "dummy-4",
    title: "Healthcare Innovation Document",
    type: "document",
    description: "Whitepaper on new innovations in healthcare",
    file_url:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
];

const fetchResources = async () => {
  loadingResources.value = true;

  try {
    const data = await contentUploadsApi.listPublications();

    const apiResources = (data || []).map((item) => ({
      ...item,
      file_url: item.file_url || item.file,
      audience: item.audience?.toLowerCase() || "all",
    }));

    const localResources = dummyResources.map((item) => ({
      ...item,
      audience: item.audience || "all",
    }));

    let merged = [...apiResources, ...localResources];

    merged = merged.filter((item) => {
      if (userIsMember) {
        return ["all", "members"].includes(item.audience);
      } else {
        return item.audience === "all";
      }
    });

    resources.value = merged;

  } catch (err) {
    console.error("Failed to load resources", err);

    resources.value = dummyResources.filter((item) =>
      userIsMember
        ? ["all", "members"].includes(item.audience || "all")
        : (item.audience || "all") === "all"
    );
  } finally {
    loadingResources.value = false;
  }
};
  
  
const dummyEvents = [
  {
    slug: "dummy-1",
    title: "2026 Annual Conference",
    image:
      "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769883047/events-CNRYrGt8_trfhaz.png",
    tag: "Conference",
    description:
      "The HFN Annual Conference has evolved into Nigeria’s leading private sector healthcare platform.",
    date: "March 4th, 2026",
    time: "10:00 AM",
    location: "Lagos, Nigeria",
    buttonText: "Register",
    externalUrl:
      "https://tix.africa/claim/2026-hfn-annual-conference/VGlja2V0LTgzOWNmYmQ3LTliNDUtNGE3Ny1iNTM1LTI5ZWFjZWQ5MTgxOQ==",
  },
  {
    slug: "Medical-nnovation-investment-forum",
    title: "Medical Innovation & Investment Forum",
    image:
      "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769801324/37a077342a5babe5ea57edba2f8b97d5_M_wvfvsf.jpg",
    tag: "Health Alert",
    description:
      "Exploring investment opportunities in local pharmaceutical manufacturing.",
    date: "October 12, 2025",
    time: "9:00 AM",
    location: "Abuja, Nigeria",
    buttonText: "View",
  },
  {
    slug: "hfn-end-of-year-stakeholders-summit",
    title: "HFN End-of-Year Stakeholders Summit",
    image:
      "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769739050/850a9bd13a177b57467b2c6d7c3dfec3_L_g8tmki.jpg",
    tag: "Programs & Initiatives",
    description: "Annual summit bringing together key healthcare stakeholders.",
    date: "Dec 5, 2026",
    time: "11:00 AM",
    location: "Hybrid Event",
    buttonText: "View",
  },
];

const downloadMinutes = async () => {
  downloadingMinutes.value = true;
  minutesError.value = null;

  try {
    const response = await newsApi.downloadMinutes();

    const link = document.createElement("a");
    link.href = response.file_url;
    link.download = response.filename || "HFN-Meeting-Minutes.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const blob = new Blob([response], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  } catch (err) {
    minutesError.value = "Failed to download minutes";
  } finally {
    downloadingMinutes.value = false;
  }
};

const openRegisterModal = (event) => {
  selectedEvent.value = event;
  showRegisterModal.value = true;
};

const closeRegisterModal = () => {
  showRegisterModal.value = false;
  selectedEvent.value = null;
  registerError.value = null;
};

const confirmRegistration = async () => {
  if (!selectedEvent.value) return;

  registering.value = true;
  registerError.value = null;

  try {
    await eventsApi.createEvent(selectedEvent.value.slug);
    closeRegisterModal();
  } catch (err) {
    registerError.value = "Failed to view past event";
  } finally {
    registering.value = false;
  }
};

const fetchUser = async () => {
  try {
    const data = await authApi.getUser();
    user.value = data;
  } catch (error) {
    console.error("Failed to fetch user info");
  }
};

const fixImageUrl = (url) => {
  if (!url) return blogh;
  return url.replace("http://", "https://");
};

const fetchNewsletters = async () => {
  try {
    const data = await newsApi.getFeaturedArticles();
    newsletters.value = data.map((item) => ({
      title: item.title,
      image: fixImageUrl(item.featured_image),
      description_short: item.excerpt,
      date: item.publish_date,
      slug: item.slug,
      external_link: item.external_link,
      is_external: item.is_external,
    }));
  } catch (error) {
    console.error("Failed to fetch newsletters");
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};


const fetchNewsletterPdfs = async () => {
  try {
    const data = await contentUploadsApi.listNewsletters();

    const apiNewsletters = data.map((n) => ({
      date: formatDate(n.created_at),
      text: n.title,
      pdfUrl: n.file,
      created_at: n.created_at
    }));

    const localNewsletters = newsletterPdfs.value.map(n => ({
      ...n,
      created_at: new Date(n.date)
    }));

    newsletterPdfs.value = [...apiNewsletters, ...localNewsletters].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

  } catch (err) {
    console.error("Failed to fetch newsletters", err);
  }
};


const fetchEvents = async () => {
  try {
    const data = await eventsApi.listEvents({
      ordering: "start_datetime",
      limit: 6,
    });

    const apiResults = data.results || data;
    const apiEvents = (apiResults || []).map((event) => ({
      slug: event.slug,
      title: event.title,
      image: event.banner_image,
      tag: event.event_type,
      description: event.description,
      date: new Date(event.start_datetime).toLocaleDateString(),
      time: new Date(event.start_datetime).toLocaleTimeString(),
      location: event.location,
      buttonText: event.is_free ? "Register Free" : "Buy Ticket",
      externalUrl: event.meeting_url || null,
    }));

    events.value = [...apiEvents, ...dummyEvents];
  } catch (error) {
    console.error("Failed to fetch events");
    events.value = dummyEvents;
  }
};

const fetchLatestMinutes = async () => {
  try {
    const minutes = await contentUploadsApi.getMinutes();

    if (minutes && minutes.length) {
      latestMinutes.value = minutes[0];
    }
  } catch (err) {
    console.error("Failed to fetch minutes", err);
  }
};

const fetchTopics = async () => {
  try {
    const data = await newsApi.listArticles({ limit: 4 });
    topics.value = data.map((item) => ({
      ...item,
      visualImage: fixImageUrl(item.featured_image),
      description: item.excerpt,
      date: new Date(item.publish_date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      tag: "Public Health Stories",
      tagColor: "#ff6600",
      comments: "0 Comments",
      external_link: item.external_link,
      is_external: item.is_external,
    }));
  } catch (error) {
    console.error("Failed to fetch topics");
  }
};
const filteredResources = computed(() => {
  return resources.value.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    const matchesType =
      selectedType.value === "all" || item.type === selectedType.value;

    return matchesSearch && matchesType;
  });
});

const itemsPerPage = 6;

const resourcesPage = ref(1);
const eventsPage = ref(1);
const topicsPage = ref(1);
const videosPage = ref(1);

const paginatedResources = computed(() => {
  const start = (resourcesPage.value - 1) * itemsPerPage;
  return filteredResources.value.slice(start, start + itemsPerPage);
});
const totalResourcePages = computed(() => Math.ceil(filteredResources.value.length / itemsPerPage) || 1);

const paginatedEvents = computed(() => {
  const start = (eventsPage.value - 1) * itemsPerPage;
  return events.value.slice(start, start + itemsPerPage);
});
const totalEventPages = computed(() => Math.ceil(events.value.length / itemsPerPage) || 1);

const paginatedTopics = computed(() => {
  const start = (topicsPage.value - 1) * itemsPerPage;
  return topics.value.slice(start, start + itemsPerPage);
});
const totalTopicPages = computed(() => Math.ceil(topics.value.length / itemsPerPage) || 1);

const paginatedVideos = computed(() => {
  const start = (videosPage.value - 1) * itemsPerPage;
  return videos.value.slice(start, start + itemsPerPage);
});
const totalVideoPages = computed(() => Math.ceil(videos.value.length / itemsPerPage) || 1);

onMounted(() => {
  fetchNewsletters();
  fetchEvents();
  fetchTopics();
  fetchUser();
  fetchResources();
  fetchVideos();
  fetchLatestMinutes();
  fetchNewsletterPdfs();
});
</script>

<template>
  <div class="flex min-h-screen bg-white relative">
    <button
      @click="toggleSidebar"
      class="lg:hidden fixed top-20 right-4 z-50 bg-[#004d33] text-white p-2 rounded-md shadow-md"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <div
      class="fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:translate-x-0 pt-16 lg:pt-0"
      :class="showSidebar ? 'translate-x-0' : '-translate-x-full'"
    >
      <UserSidebar @closeSidebar="closeSidebar" class="h-full" />
    </div>

    <div
      v-if="showSidebar"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 z-30 lg:hidden"
      @click="closeSidebar"
    ></div>

    <div class="flex-1 p-6 md:p-10 overflow-y-auto">
      <h2 class="text-xl md:text-2xl font-semibold text-[#f54a00]">
        Welcome {{ user.first_name || "Member" }},
      </h2>
      <p class="text-[#555] mt-1">Stay up to date with the latest on HFN</p>

      <div
        class="w-screen py-16 shadow-inner relative left-1/2 right-1/2 -mx-[50vw]"
        :style="{ backgroundColor: '#F8F3EE' }"
      >
        <section class="max-w-6xl mx-auto px-6 text-center">
          <h3 class="text-3xl font-sans text-[#333] mb-8">
            Missed the Last HFN Meeting?
          </h3>

          <div class="mb-8 flex justify-center">
            <div
              class="p-4 border border-gray-200 rounded-xl bg-white shadow-md"
            >
              <div
                class="w-40 md:w-48 p-6 bg-white border border-green-100 rounded-lg flex flex-col items-center justify-center relative"
              >
                <div class="absolute top-2 left-2"></div>
                <div
                  class="relative w-16 h-16 mb-4 flex items-center justify-center bg-red-50 rounded-lg border border-red-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-10 h-10 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1.5V8h4.5L13 3.5z"
                    />
                    <text
                      x="6"
                      y="19"
                      font-size="6"
                      fill="white"
                      font-weight="bold"
                    >
                      PDF
                    </text>
                  </svg>
                </div>

                <p class="text-sm font-semibold text-[#333] mt-2 leading-none">
                  Meeting Minutes
                </p>
                <p class="text-xs text-gray-500">
                  {{ latestMinutes?.title || "Latest meeting minutes" }}
                </p>
              </div>
            </div>
          </div>

          <button
            @click="downloadMinutes"
            :disabled="downloadingMinutes"
            class="inline-flex items-center gap-2 bg-[#004D33] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#006644] transition shadow-lg disabled:opacity-60"
          >
            <span v-if="downloadingMinutes">Downloading…</span>
            <span v-else>Download Minutes</span>
          </button>

          <p v-if="minutesError" class="text-red-600 text-sm mt-3">
            {{ minutesError }}
          </p>
          
        </section>
      </div>
      <section class="mt-10 max-w-6xl mx-auto px-4">
        <h3 class="text-3xl font-sans font-bold text-black text-center mb-10">
          HFN Newsletter
        </h3>

        <div class="bg-white rounded-xl overflow-hidden shadow-lg p-6 md:p-10">
          <div
            v-if="newsletters.length"
            class="grid md:grid-cols-2 gap-8 items-center"
          >
            <div class="order-2 md:order-1">
              <div class="w-full relative">
                <img
                  :src="newsletters[0].image"
                  :alt="newsletters[0].title"
                  class="w-full h-auto rounded-xl shadow-lg border-2 border-gray-100"
                />
              </div>
            </div>

            <div class="order-1 md:order-2">
              <!-- <h4 class="text-md font-extrabold text-[#333] mb-4 leading-snug">
                {{ newsletters[0].title }}
              </h4> -->
              <p class="text-md text-gray-700 mb-6">
                {{ newsletters[0].description_short }}
              </p>

              <a
                v-if="newsletters[0].is_external && newsletters[0].external_link"
                :href="newsletters[0].external_link"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block bg-[#004D33] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#006644] transition duration-300"
              >
                Read More
              </a>
              <router-link
                v-else
                :to="`/news/${newsletters[0].slug}`"
                class="inline-block bg-[#004D33] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#006644] transition duration-300"
              >
                Read More
              </router-link>
            </div>
          </div>
          <div v-else class="text-center py-12 text-gray-500">No data</div>
        </div>
      </section>
      <section class="mt-16 max-w-7xl mx-auto px-4">
        <h2 class="text-4xl font-bold text-gray-900 text-center mb-12">
          Newsletters
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16">
          <div
            v-for="(item, index) in newsletterPdfs"
            :key="index"
            class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col"
          >
            <div class="relative group h-60 overflow-hidden bg-gray-100">
              <iframe
                :src="`https://docs.google.com/viewer?url=${encodeURIComponent(item.pdfUrl)}&embedded=true`"
                class="w-full h-full pointer-events-none"
                frameborder="0"
                title="Newsletter Preview"
              ></iframe>
              <div
                class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"
              >
                <span class="text-white bg-green-700 px-3 py-1 rounded text-xs">
                  View Document
                </span>
              </div>
            </div>

            <div class="p-6 flex flex-col flex-grow">
              <p class="text-sm text-orange-500 mb-3">
                {{ item.date }}
              </p>

              <p class="text-gray-700 text-base mb-4 flex-grow">
                {{ item.text }}
              </p>

              <div class="mt-auto flex gap-2">
                <a
                  :href="item.pdfUrl"
                  download
                  target="_blank"
                  class="flex-1 text-center bg-green-700 text-white text-sm px-5 py-2 rounded-full hover:bg-green-800 transition"
                >
                  Download PDF
                </a>

                <a
                  :href="item.pdfUrl"
                  target="_blank"
                  class="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition"
                  title="Open in browser"
                >
                  <svg
                    class="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </a>
              </div>
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
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </section>

      <section class="mt-16 max-w-6xl mx-auto px-4">
        <h3 class="text-3xl font-bold text-[#333] text-center mb-8">
          Resources & Publications
        </h3>

        <div class="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search documents, news, publications..."
            class="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-[#004D33] focus:border-[#004D33]"
          />

          <select
            v-model="selectedType"
            class="border border-gray-300 rounded-lg px-4 py-3 text-sm"
          >
            <option value="all">All</option>
            <option value="document">Documents</option>
            <option value="publication">Publications</option>
            <option value="report">Reports</option>
          </select>
        </div>

        <div
          v-if="filteredResources.length"
          class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="item in paginatedResources"
            :key="item.id"
            class="bg-white rounded-xl border border-gray-200 shadow-md p-6 flex flex-col"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-10 h-10 flex items-center justify-center rounded-lg"
                :class="{
                  'bg-red-100 text-red-600': item.type === 'report',
                  'bg-blue-100 text-blue-600': item.type === 'publication',
                  'bg-green-100 text-green-600': item.type === 'document',
                  'bg-orange-100 text-orange-600': item.type === 'news',
                }"
              >
                📄
              </div>

              <span class="text-xs font-semibold uppercase text-gray-500">
                {{ item.type || 'report' }}
              </span>
            </div>

            <h4 class="font-semibold text-[#333] mb-2">
              {{ item.title }}
            </h4>

            <p class="text-sm text-gray-600 mb-4 line-clamp-3">
              {{ item.description || item.summary || "No description available." }}
            </p>

            <div class="mt-auto">
              <a
                v-if="item.file_url"
                :href="item.file_url"
                download
                target="_blank"
                class="inline-flex items-center text-green-700 font-medium hover:underline"
              >
                Download →
              </a>
                            
            </div>
          </div>
        </div>

        <div v-else class="text-center py-16 text-gray-500">
          No resources found
        </div>

        <div v-if="totalResourcePages > 1" class="flex justify-center items-center gap-4 mt-8">
          <button @click="resourcesPage--" :disabled="resourcesPage <= 1" class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <span class="text-sm text-gray-600 font-medium">Page {{ resourcesPage }} of {{ totalResourcePages }}</span>
          <button @click="resourcesPage++" :disabled="resourcesPage >= totalResourcePages" class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>

      <section class="mt-10 max-w-6xl mx-auto px-4">
        <h3 class="text-3xl font-sans font-bold text-[#333] text-center mb-6">
          Our Events
        </h3>

        <div class="flex justify-start mb-8">
          <select
            class="border border-gray-300 rounded-lg p-2 text-sm font-medium text-gray-700 focus:ring-[#004D33] focus:border-[#004D33]"
          >
            <option>October 2026</option>
            <option>November 2026</option>
            <option>December 2026</option>
          </select>
        </div>

        <div
          v-if="events.length"
          class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
          v-for="(event, index) in paginatedEvents"
          :key="index"
          class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          :class="{ 'p-0': true }"
          >
            <div class="relative">
              <img
                :src="event.image"
                :alt="event.title"
                class="w-full h-48 object-cover rounded-t-xl"
              />

              <span
                class="absolute bottom-0 left-0 px-3 py-1 text-xs font-semibold text-white rounded-tr-lg"
                :class="{
                  'bg-green-700': event.tag === 'Programs & Initiatives',
                  'bg-red-700': event.tag === 'Health Alert',
                }"
              >
                {{ event.tag }}
              </span>
            </div>

            <div class="p-6">
              <p class="text-sm text-gray-700 mb-4">
                {{ event.description }}
              </p>

              <div
                class="flex flex-wrap justify-between items-center text-sm text-gray-500 mb-4 space-y-1"
              >
                <div class="flex items-center text-orange-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 mr-1 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 18H5V8h14v13z"
                    />
                  </svg>
                  <span class="text-xs">{{ event.date }}</span>
                </div>

                <div
                  v-if="event.time"
                  class="flex items-center text-orange-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 mr-1 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.8 14.8l-4.4-4.4L12 11.2V6h2v6h5.2l-1.6 1.6 4.4 4.4L12.8 20.8 12 20l-1.6 1.6z"
                    />
                  </svg>
                  <span class="text-xs">{{ event.time }}</span>
                </div>

                <div v-if="event.views" class="flex items-center text-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 mr-1 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                    />
                  </svg>
                  <span class="text-xs">{{ event.views }} Views</span>
                </div>
              </div>

              <div
                v-if="event.location"
                class="flex items-center text-sm text-green-700 mb-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 mr-1 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  />
                </svg>
                <span class="font-medium text-xs">{{ event.location }}</span>
              </div>

              <a
                v-if="event.externalUrl"
                :href="event.externalUrl"
                target="_blank"
                class="block w-full text-center mt-4 bg-[#004D33] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#006644] transition"
              >
                {{ event.buttonText }}
              </a>

              <button
                v-else
                @click="openRegisterModal(event)"
                class="w-full mt-4 bg-[#004D33] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#006644] transition"
              >
                {{ event.buttonText }}
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-16 text-gray-500">No data</div>

        <div v-if="totalEventPages > 1" class="flex justify-center items-center gap-4 mt-8">
          <button @click="eventsPage--" :disabled="eventsPage <= 1" class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <span class="text-sm text-gray-600 font-medium">Page {{ eventsPage }} of {{ totalEventPages }}</span>
          <button @click="eventsPage++" :disabled="eventsPage >= totalEventPages" class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>
      <section class="mt-10 mb-16 max-w-6xl mx-auto px-4">
        <h3 class="text-2xl font-sans font-bold text-[#333] text-center mb-10">
          Topics that might interest you
        </h3>

        <div v-if="topics.length" class="grid sm:grid-cols-2 gap-6">
          <div
          v-for="(topic, index) in paginatedTopics"
          :key="index"
          class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden p-0"
          >
            <div class="grid grid-cols-1 sm:grid-cols-5 h-full">
              <div
                class="relative col-span-2 h-full min-h-[150px] flex flex-col justify-end p-4 bg-gray-50 rounded-l-2xl border-r-2 border-dashed border-gray-200"
              >
                <img
                  :src="fixImageUrl(topic.featured_image)"
                  :alt="'Visual for ' + topic.tag"
                  class="absolute inset-0 w-full h-full object-cover"
                  aria-hidden="true"
                />
                <div
                  class="absolute inset-0 flex items-center justify-center opacity-70"
                ></div>

                <span
                  class="text-xs font-semibold px-3 py-1 text-white rounded-lg shadow-md z-10"
                  :style="{ backgroundColor: topic.tagColor || '#ff6600' }"
                >
                  {{ topic.tag || "Public Health Stories" }}
                </span>
              </div>

              <div class="col-span-3 p-5 flex flex-col justify-between">
                <div>
                  <div
                    class="flex items-center space-x-4 text-xs font-medium mb-3"
                  >
                    <span class="flex items-center text-orange-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4 mr-1 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 18H5V8h14v13z"
                        />
                      </svg>
                      {{ topic.date || "October 10, 2025" }}
                    </span>
                    <span class="flex items-center text-orange-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4 mr-1 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                        />
                      </svg>
                      {{ topic.comments || "0 Comments" }}
                    </span>
                  </div>

                  <p class="text-sm text-gray-700 mb-2">
                    {{ topic.description }}
                  </p>
                </div>

                <a
                  v-if="topic.is_external && topic.external_link"
                  :href="topic.external_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm font-medium text-green-700 hover:text-green-800 transition self-start mt-2"
                >
                  Read more...
                </a>
                <router-link
                  v-else
                  :to="`/news/${topic.slug}`"
                  class="text-sm font-medium text-green-700 hover:text-green-800 transition self-start mt-2"
                >
                  Read more...
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-16 text-gray-500">No data</div>

        <div v-if="totalTopicPages > 1" class="flex justify-center items-center gap-4 mt-8">
          <button @click="topicsPage--" :disabled="topicsPage <= 1" class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <span class="text-sm text-gray-600 font-medium">Page {{ topicsPage }} of {{ totalTopicPages }}</span>
          <button @click="topicsPage++" :disabled="topicsPage >= totalTopicPages" class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>
      <section class="mt-16 max-w-6xl mx-auto px-4">
        <h3 class="text-3xl font-sans font-bold text-[#333] text-center mb-10">
          HFN Video Updates
        </h3>

        <div
          v-if="videos.length"
          class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <div
          v-for="(video, index) in paginatedVideos"
          :key="index"
          class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div class="aspect-video bg-black">
              <iframe
                class="w-full h-full"
                :src="getEmbedUrl(video.url)"
                frameborder="0"
                allow="
                  accelerometer;
                  autoplay;
                  clipboard-write;
                  encrypted-media;
                  gyroscope;
                  picture-in-picture;
                "
                allowfullscreen
              ></iframe>
            </div>

            <div class="p-4">
              <h4 class="font-semibold text-[#333] mb-2">
                {{ video.title }}
              </h4>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12 text-gray-500">
          No videos available
        </div>

        <div v-if="totalVideoPages > 1" class="flex justify-center items-center gap-4 mt-8">
          <button @click="videosPage--" :disabled="videosPage <= 1" class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <span class="text-sm text-gray-600 font-medium">Page {{ videosPage }} of {{ totalVideoPages }}</span>
          <button @click="videosPage++" :disabled="videosPage >= totalVideoPages" class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>
    </div>
    <div
      v-if="showRegisterModal"
      class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 class="text-xl font-bold text-[#333] mb-2">View Past Event</h3>

        <p class="text-gray-600 mb-6">
          {{ selectedEvent?.title }}
        </p>

        <div v-if="registerError" class="text-red-600 text-sm mb-4"></div>

        <div class="flex gap-3">
          <button
            @click="closeRegisterModal"
            class="flex-1 border border-gray-300 rounded-lg py-2"
          >
            Cancel
          </button>

          <button
            @click="confirmRegistration"
            :disabled="registering"
            class="flex-1 bg-[#004D33] text-white rounded-lg py-2 font-semibold hover:bg-[#006644]"
          >
            {{ viewing ? "Viewing…" : "View" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 10px;
}
</style>
