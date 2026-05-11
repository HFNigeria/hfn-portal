<template>
  <div class="events-page font-sans bg-white">
    <section v-if="!page.hero?.is_hidden" class="bg-[#E87A1814]" :style="{ backgroundColor: page.hero.backgroundColor || '#E87A1814' }">
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
            <img :src="resolveImage(page.hero.image)" alt="Collage of past events" class="object-cover w-full h-full rounded-lg" />
          </div>
        </div>
      </div>
    </section>

    <template v-if="!page.searchAndFilter?.is_hidden">
    <section class="container mx-auto px-4 md:px-8 py-4">
      <h2 class="text-4xl font-bold text-gray-900 text-center">Events</h2>
    </section>

    <hr class="border-gray-200" />

    <section class="container mx-auto px-4 md:px-8 py-8">
      <h3 class="text-2xl font-semibold text-gray-800 mb-6">Find event</h3>
      <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-stretch sm:items-center">
        <div class="relative flex-grow">
          <input type="text" placeholder="Search" class="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" />
        </div>
        <select class="p-3 border border-gray-300 rounded-md appearance-none focus:ring-green-500 focus:border-green-500 sm:w-auto">
          <option>2026</option>
          <option>2025</option>
          <option>2024</option>
        </select>
        <select class="p-3 border border-gray-300 rounded-md appearance-none focus:ring-green-500 focus:border-green-500 sm:w-auto">
          <option>Category</option>
          <option>Webinar</option>
          <option>Conference</option>
        </select>
        <button class="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-150">Search</button>
      </div>
    </section>
    </template>

    <template v-if="!page.featuredEvent?.is_hidden">
    <hr class="border-gray-200" />

    <section class="container mx-auto px-4 md:px-8 py-10">
      <h3 class="text-2xl font-semibold text-gray-800 mb-8">Latest Events</h3>
      <div v-if="loadingUpcoming" class="text-center py-8 text-gray-500">Loading upcoming events...</div>
      <div v-else-if="upcomingEvents.length === 0" class="text-center py-8 text-gray-500">No upcoming events available.</div>
      <div v-else>
        <div v-for="(event, index) in upcomingEvents" :key="event.id || index" class="mb-12 border rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
          <div class="flex flex-col lg:flex-row">
            <div class="lg:w-3/5">
              <img :src="event.image" alt="Event image" class="object-cover w-full h-full rounded-lg" />
            </div>
            <div class="lg:w-2/5 p-6 md:p-8 flex flex-col justify-center">
              <div class="self-start inline-block text-[10px] font-semibold uppercase text-orange-600 bg-white rounded-full px-3 py-1 shadow-sm border border-orange-100">
                {{ event.category || 'Open Events' }}
              </div>
              <div class="flex items-center space-x-4 text-sm text-orange-500 mb-4 mt-5">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ event.date }}
                </span>
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ event.location }}
                </span>
              </div>
              <p class="text-gray-600 mb-6">{{ event.description }}</p>
              <a
                v-if="event.registerLink"
                :href="event.registerLink"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex self-start px-6 py-2 bg-green-900 text-white justify-center rounded-full hover:bg-green-700 transition duration-150 text-sm"
              >
                Register Now
              </a>
              
              <router-link
                v-else
                to="/buttons"
                class="inline-flex self-start px-6 py-2 bg-green-900 text-white justify-center rounded-full hover:bg-green-700 transition duration-150 text-sm"
              >
                Register Now
              </router-link>
              
            </div>
          </div>
        </div>
      </div>
    </section>
    </template>

    <template v-if="!page.pastEvents?.is_hidden">
    <section class="container mx-auto px-4 md:px-8 py-14">
      <h3 class="text-2xl font-semibold text-gray-800 mb-8">Past Events</h3>
      <div v-if="pastEvents.length === 0" class="text-center py-8 text-gray-500">No past events available.</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(event, index) in pastEvents" :key="event.id || index" class="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
          <img :src="event.image" class="w-full h-48 object-cover" alt="Past event" />
          <div class="p-5">
            <span class="text-xs font-semibold text-green-700 uppercase">{{ event.category }}</span>
            <h4 class="text-lg font-bold text-gray-900 mt-2">{{ event.title }}</h4>
            <p class="text-sm text-orange-600 mt-1">{{ event.date }}</p>
            <p class="text-sm text-gray-600 mt-3">
              <span class="font-semibold">Theme:</span> {{ event.theme }}
            </p>
          </div>
        </div>
      </div>
    </section>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import eventsApi from "@/api/events.js";
import pagesApi from "@/api/pageManagement";
import { eventsPageSchema } from "@/schemas/pages/events.schema";
import newEvent from "@/assets/events.png";

const loadingUpcoming = ref(false);
const loading = ref(true);
const pageFromApi = ref(null);

const staticPastEvents = [
  {
    id: "static-past-1",
    title: "HFN Healthcare Leadership Conference 2025",
    category: "Conference",
    date: "June 2, 2025",
    theme: "Accelerating UHC and Health Sovereignty Through Public-Private Integration",
    image: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769881267/1746181486545_mtao0s.jpg",
  },
  {
    id: "static-past-2",
    title: "High-Level Roundtable on Local Manufacturing of Medicines in Nigeria",
    category: "Roundtable",
    date: "October 22, 2025",
    theme: "Strengthening Local Pharmaceutical Manufacturing for Sustainable Health Security in Africa",
    image: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769881265/1764355254559_g2wv3t.jpg",
  },
  {
    id: "static-past-3",
    title: "HFN–NHIA Private Sector Roundtable Breakfast Meeting",
    category: "Roundtable",
    date: "December 1, 2025",
    theme: "Leveraging Private Sector to Accelerate Health Insurance Coverage in Nigeria",
    image: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769881263/1758712162657_yclv7p.jpg",
  },
  {
    id: "static-past-4",
    title: "2026 HFN Annual Conference",
    category: "Member Only",
    date: "Wednesday, March 4th 2026",
    time: "10:00 AM",
    location: "Lagos Oriental Hotel Lagos, LA",
    frequency: "Free for Members",
    image: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769883047/events-CNRYrGt8_trfhaz.png",
    description: "Join HFN 2026 to explore bold private‑sector solutions driving healthcare financing and Universal Health Coverage in Nigeria.",
    theme: "Join HFN 2026 to explore bold private‑sector solutions driving healthcare financing and Universal Health Coverage in Nigeria.",
    registerLink: "https://tix.africa/claim/2026-hfn-annual-conference/VGlja2V0LWE3MDc0Yjg4LTU3ZTUtNGE3My05MWU5LWNhMmYwYjZlYTJhYw==",
  },
  
];

const upcomingEvents = ref([]);
const pastEvents = ref([...staticPastEvents]);

const event = "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769883047/events-CNRYrGt8_trfhaz.png";
const breakfast2025 = "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769881263/1758712162657_yclv7p.jpg";
const roundtable2025 = "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769881265/1764355254559_g2wv3t.jpg";
const hfn2025 = "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769881267/1746181486545_mtao0s.jpg";

const imageMap = {
  "events-CNRYrGt8_trfhaz.png": event,
  "1758712162657_yclv7p.jpg": breakfast2025,
  "1764355254559_g2wv3t.jpg": roundtable2025,
  "1746181486545_mtao0s.jpg": hfn2025,
};

const resolveImage = (image) => imageMap[image] || image;

const fetchUpcomingEvents = async () => {
  loadingUpcoming.value = true;
  try {
    const apiEvents = await eventsApi.listEvents({ status: 'upcoming' });
    const mappedApiEvents = apiEvents.map((e) => {
      const startDate = new Date(e.start_datetime || e.start_date || e.date || e.created_at);
      const endDate = e.end_datetime || e.end_date ? new Date(e.end_datetime || e.end_date) : null;
      let formattedDate = startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      formattedDate += endDate ? ` - ${endDate.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}` : `, ${startDate.getFullYear()}`;
      return {
        id: e.id,
        title: e.title,
        category: e.event_type || 'Open Events',
        date: formattedDate,
        location: e.location || 'TBD',
        description: e.description || '',
        image: e.banner_image || newEvent,
        registerLink: e.meeting_url || e.registration_link || '#',
      };
    });
    upcomingEvents.value = mappedApiEvents;
  } catch (error) {
    console.error('Failed to fetch upcoming events:', error);
    upcomingEvents.value = [];
  } finally {
    loadingUpcoming.value = false;
  }
};

const fetchPastEvents = async () => {
  try {
    const apiEvents = await eventsApi.listEvents({ status: 'completed' });
    const mappedApiEvents = apiEvents.map((e) => {
      const startDate = new Date(e.start_datetime || e.start_date || e.date || e.created_at);
      return {
        id: e.id,
        title: e.title,
        category: e.event_type || 'Conference',
        date: startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        theme: e.theme || e.description || '',
        image: e.banner_image || breakfast2025,
      };
    });
    pastEvents.value = [...mappedApiEvents, ...staticPastEvents];
  } catch (error) {
    console.error('Failed to fetch past events:', error);
    pastEvents.value = [...staticPastEvents];
  }
};

const fetchPageFromApi = async () => {
  try {
    const res = await pagesApi.getPageByType("events");
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
    console.warn("Using local Events schema fallback");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUpcomingEvents();
  fetchPastEvents();
  fetchPageFromApi();
});

const page = computed(() => ({
  ...eventsPageSchema,
  ...(pageFromApi.value || {}),
  hero: { ...eventsPageSchema.hero, ...(pageFromApi.value?.hero || {}) },
  searchAndFilter: { ...eventsPageSchema.searchAndFilter, ...(pageFromApi.value?.searchAndFilter || {}) },
  featuredEvent: { ...eventsPageSchema.featuredEvent, ...(pageFromApi.value?.featuredEvent || {}) },
  latestEvents: { ...eventsPageSchema.latestEvents, ...(pageFromApi.value?.latestEvents || {}) },
  pastEvents: { ...eventsPageSchema.pastEvents, ...(pageFromApi.value?.pastEvents || {}) },
}));
</script>
