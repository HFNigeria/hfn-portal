<script setup>
import { computed, ref, onMounted } from "vue";
import eventThumb3 from "@/assets/event2026.png";
import eventThumb2 from "@/assets/hands.png";
import eventThumb from "@/assets/latest_news.png";
import RsvpModal from "./RsvpModal.vue";
import eventsApi from "@/api/events.js"; 
import { useToast } from "vue-toastification";


 const toast = useToast(); 
const today = new Date();
const activeDate = ref(new Date(today.getFullYear(), today.getMonth(), 1));
const sortBy = ref("All");
const eventThumb4 = 'https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769716174/f5b95525832f3712e665bb57dba370d3_XS_yrppya.jpg';

  const fetchApiEvents = async () => {
  try {
    const apiEvents = await eventsApi.listEvents(); 
    
    const mappedApiEvents = apiEvents.map((e) => {
      const start = new Date(e.start_datetime);

      return {
        id: e.id,
        title: e.title,
        date: start.toISOString().slice(0, 10),
        time: start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        tag: e.event_type || "General",
        image: e.banner_image || eventThumb,
        excerpt: e.description || "",
        details: e.description || "",
        slug: e.slug,
        meeting_url: e.meeting_url,
      };
    });

    events.value = [...events.value, ...mappedApiEvents];
  } catch (error) {
    console.error("Failed to fetch API events");
  }
};

const registerForEvent = async (event) => {
  try {
    await eventsApi.registerEvent(event.slug || event.id);
    toast.success("RSVP successful!");
    showRsvpModal.value = false;
  } catch (error) {
    console.error("RSVP failed");
    console.log("Failed to RSVP. Please try again.");
  }
};
  

onMounted(() => {
  fetchApiEvents();
});

  const selectedEvent = ref(null);
const showRsvpModal = ref(false);

const openRsvp = (event) => {
  selectedEvent.value = event;
  showRsvpModal.value = true;
};

function closeModal() {
  selectedEvent.value = null;
}

const events = ref([
  {
    id: 1,
    title: "Annual Conference & Networking",
    date: "2026-01-02",
    time: "09:00 AM",
    tag: "Programs & Initiatives",
    image: eventThumb,
    excerpt:
      "A gathering of healthcare leaders to share insights on policy, financing and collaboration.",
    details:
      "HFN’s Annual Conference brings together public and private healthcare leaders, policymakers and international partners to deliberate on priority reforms, financing strategies and public-private partnerships.",
  },
  {
    id: 2,
    title: "Health Alert: Seasonal Flu Advisory",
    date: "2026-01-19",
    time: "All day",
    tag: "Health Alert",
    image: eventThumb2,
    excerpt:
      "Rising seasonal flu — get vaccinated, practice hygiene and consult a provider if symptomatic.",
    details:
      "Public health experts recommend vaccination and avoidance of self-medication. Clinics across Lagos will offer subsidized vaccination during the awareness week.",
  },
  {
    id: 3,
    title: "Webinar: AI in Healthcare",
    date: "2026-01-25",
    time: "03:00 PM",
    tag: "Webinar",
    image: eventThumb2,
    excerpt:
      "How AI is transforming diagnostics, telemedicine and patient triage in Nigeria.",
    details:
      "A panel of clinicians, technologists and regulators will explore practical AI adoption paths, data governance and pilot programs for automated diagnostics.",
  },
  {
    id: 4,
    title: "2026 HFN Annual Conference",
    date: "2026-03-04",
    time: "10:00 AM",
    tag: "Conference",
    image: eventThumb3,
    excerpt:
      "Join HFN 2026 to explore bold private‑sector solutions driving healthcare financing and Universal Health Coverage in Nigeria.",
    details:
      "The Healthcare Federation of Nigeria (HFN) invites you to the HFN Annual Conference 2026, Nigeria’s premier gathering of private-sector healthcare leaders, policymakers, financiers, innovators, and development partners.",
  },
  {
    id: 5,
    title: "2026 HFN Annual Conference",
    date: "2026-03-05",
    time: "10:00 AM",
    tag: "Conference",
    image: eventThumb4,
    excerpt:
      "Join HFN 2026 to explore bold private‑sector solutions driving healthcare financing and Universal Health Coverage in Nigeria.",
    details:
      "The Healthcare Federation of Nigeria (HFN) invites you to the HFN Annual Conference 2026, Nigeria’s premier gathering of private-sector healthcare leaders, policymakers, financiers, innovators, and development partners.",
  },
]);

const year = computed(() => activeDate.value.getFullYear());
const month = computed(() => activeDate.value.getMonth());

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addMonths(d, n) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function prevMonth() {
  activeDate.value = addMonths(activeDate.value, -1);
}
function nextMonth() {
  activeDate.value = addMonths(activeDate.value, 1);
}
function goToday() {
  activeDate.value = new Date(today.getFullYear(), today.getMonth(), 1);
}

const weeks = computed(() => {
  const first = startOfMonth(activeDate.value);
  const last = endOfMonth(activeDate.value);

  const startIndex = first.getDay();
  const firstCellDate = new Date(first);
  firstCellDate.setDate(first.getDate() - startIndex);

  const weeks = [];
  let cursor = new Date(firstCellDate);

  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
});

function eventsForDate(date) {
  const iso = dateToISO(date);
  return events.value.filter((e) => e.date === iso);
}
function dateToISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function onEventClick(ev) {
  selectedEvent.value = ev;
}

function isSameMonth(date) {
  return date.getMonth() === month.value && date.getFullYear() === year.value;
}
function isToday(date) {
  const t = new Date();
  return (
    date.getFullYear() === t.getFullYear() &&
    date.getMonth() === t.getMonth() &&
    date.getDate() === t.getDate()
  );
}
</script>

<template>
  <section class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-800 text-center md:text-left w-full md:w-auto">
          HFN Events Calendar
        </h2>

        <div class="flex items-center gap-3 ml-auto">
          <div class="flex items-center gap-2 bg-white border border-gray-100 rounded-md shadow-sm px-3 py-1">
            <button @click="prevMonth" class="px-2 py-1 rounded hover:bg-gray-50">
              ‹
            </button>
            <div class="text-sm font-medium">
              {{
                activeDate.toLocaleString(undefined, {
                  month: "long",
                  year: "numeric",
                })
              }}
            </div>
            <button @click="nextMonth" class="px-2 py-1 rounded hover:bg-gray-50">
              ›
            </button>
          </div>

          <button @click="goToday"
            class="text-sm px-3 py-1 bg-green-50 border border-green-200 rounded text-green-700 hover:bg-green-100">
            Today
          </button>

          <select v-model="sortBy" class="text-sm border rounded px-3 py-1">
            <option value="All">Sort By</option>
            <option value="Programs">Programs & Initiatives</option>
            <option value="Health">Health Alert</option>
            <option value="Webinar">Webinar</option>
          </select>

          <!-- <button
            class="inline-flex items-center gap-2 bg-green-700 text-white px-3 py-1 rounded"
          >
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
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Add Event
          </button> -->
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
        <div class="grid grid-cols-7 text-xs text-gray-600 mb-2">
          <div class="text-center py-2">Sun</div>
          <div class="text-center py-2">Mon</div>
          <div class="text-center py-2">Tue</div>
          <div class="text-center py-2">Wed</div>
          <div class="text-center py-2">Thu</div>
          <div class="text-center py-2">Fri</div>
          <div class="text-center py-2">Sat</div>
        </div>

        <div class="grid grid-cols-7 gap-2">
          <template v-for="(week, wi) in weeks" :key="wi">
            <template v-for="(day, di) in week" :key="di + '-' + wi">
              <div
                class="min-h-[88px] p-2 rounded-md border border-transparent hover:border-gray-200 transition-colors flex flex-col"
                :class="[
                  isSameMonth(day) ? 'bg-white' : 'bg-gray-50 text-gray-400',
                  isToday(day) ? 'ring-2 ring-green-100' : '',
                ]">
                <div class="flex items-start justify-between">
                  <div class="text-sm font-medium">
                    {{ day.getDate() }}
                  </div>
                  <div v-if="eventsForDate(day).length" class="ml-1">
                    <span class="inline-block w-2 h-2 rounded-full bg-green-600"></span>
                  </div>
                </div>

                <div class="mt-2 space-y-1 flex-1">
                  <template v-for="ev in eventsForDate(day).slice(0, 2)" :key="ev.id">
                    <button @click="onEventClick(ev)"
                      class="w-full flex items-center gap-2 text-left text-xs py-1 px-2 rounded-md hover:shadow-sm"
                      :class="[
                        ev.tag.includes('Health')
                          ? 'bg-red-50 border border-red-100'
                          : ev.tag.includes('Program')
                            ? 'bg-green-50 border border-green-100'
                            : 'bg-blue-50 border border-blue-100',
                      ]">
                      <img :src="ev.image" alt="" class="w-8 h-8 object-cover rounded-sm flex-shrink-0" />
                      <div class="truncate">
                        <div class="font-semibold text-[11px] text-gray-800 truncate">
                          {{ ev.title }}
                        </div>
                        <div class="text-[10px] text-gray-500 truncate">
                          {{ ev.time }}
                        </div>
                      </div>
                    </button>
                  </template>

                  <div v-if="eventsForDate(day).length > 2" class="text-[11px] text-gray-500 mt-1">
                    +{{ eventsForDate(day).length - 2 }} more
                  </div>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>

      
    </div>
    <teleport to="body">
      <div v-if="selectedEvent" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="closeModal"></div>

        <div class="relative bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 overflow-hidden animate-fade-in">
          <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
            ✕
          </button>

          <div class="flex flex-col md:flex-row gap-6 p-6">
            <img :src="selectedEvent.image" alt="event image"
              class="w-full md:w-64 h-48 object-cover rounded-lg flex-shrink-0" />

            <div class="flex-1">
              <div class="flex items-start justify-between gap-4 mb-2">
                <h3 class="text-xl font-semibold text-gray-900">
                  {{ selectedEvent.title }}
                </h3>
              </div>

              <div class="text-sm text-gray-500 mb-3">
                {{ selectedEvent.date }} • {{ selectedEvent.time }}
              </div>

              <span
                class="inline-block mb-3 text-xs font-medium px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                {{ selectedEvent.tag }}
              </span>

              <p class="text-sm text-gray-700 mb-3">
                {{ selectedEvent.excerpt }}
              </p>

              <p class="text-sm text-gray-600 mb-6">
                {{ selectedEvent.details }}
              </p>

              <div class="flex items-center gap-3">
                <a
                  v-if="selectedEvent.meeting_url"
                  :href="selectedEvent.meeting_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
                >
                  RSVP
                </a>
                <router-link
                  v-else-if="selectedEvent.slug"
                  :to="`/events/${selectedEvent.slug}/register-events`"
                  class="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
                >
                  RSVP
                </router-link>
                <router-link
                  v-else
                  to="/conference"
                  class="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
                >
                  RSVP
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>

  </section>
  <RsvpModal
  v-if="showRsvpModal"
  :event="selectedEvent"
  @close="showRsvpModal = false"
/>

</template>

<style scoped></style>
