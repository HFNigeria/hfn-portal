<script setup>
import dashboardApi from "@/api/dashboard";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import { Bar, Line, Pie } from "vue-chartjs";
import EditorSidebar from "./EditorSidebar.vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const showSidebar = ref(false);
const toggleSidebar = () => (showSidebar.value = !showSidebar.value);
const closeSidebar = () => (showSidebar.value = false);

const active = ref("Dashboard");
const router = useRouter();

const loading = ref(true);
const analyticsError = ref(null);

const revenueData = reactive({
  labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
  datasets: [
    {
      label: "Revenue",
      backgroundColor: "rgba(0, 204, 102, 0.3)",
      borderColor: "#00cc66",
      pointBackgroundColor: "#00cc66",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#00cc66",
      data: [5000, 10000, 30000, 60000, 10000, 20000, 70000, 95000],
      fill: true,
      tension: 0.4,
    },
  ],
});

const revenueChartOptions = reactive({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(context.parsed.y);
          }
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 10,
        },
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          if (value >= 1000) {
            return value / 1000 + "k";
          }
          return value;
        },
        font: {
          size: 10,
        },
      },
      grid: {
        borderDash: [5, 5],
        color: "rgba(0,0,0,0.1)",
      },
    },
  },
});

const mostViewedCourses = reactive([
  { name: "Pregnancy", value: "120K", progress: "100%" },
  { name: "Pregnancy", value: "120K", progress: "100%" },
  { name: "Pregnancy", value: "80K", progress: "66%" },
  { name: "Pregnancy", value: "80K", progress: "66%" },
  { name: "Pregnancy", value: "70K", progress: "58%" },
  { name: "Pregnancy", value: "70K", progress: "58%" },
  { name: "Pregnancy", value: "50K", progress: "42%" },
  { name: "Pregnancy", value: "50K", progress: "42%" },
  { name: "Pregnancy", value: "50K", progress: "42%" },
]);

const summaryData = reactive([
  {
    title: "Highest bounced page",
    value: "About Us",
    trendValue: "Up 12%",
    trendType: "up",
  },
  {
    title: "Highest clicked page",
    value: "Latest Update",
    trendValue: "Down 29%",
    trendType: "down",
  },
  {
    title: "Highest clicked CTA",
    value: "Join Now",
    trendValue: "Up 12%",
    trendType: "up",
  },
  {
    title: "Average Time spent on pages",
    value: "20 hrs",
    trendValue: "Up 12%",
    trendType: "up",
  },
]);

const courseData = reactive([
  { name: "Pregnancy", enrollments: 340 },
  { name: "Data Science Course", enrollments: 275 },
  { name: "Digital Illustration", enrollments: 50 },
  { name: "Advanced Excel", enrollments: 410 },
]);

const statCards = ref([
  {
    title: "Total Visits",
    value: "0",
    change: "Loading...",
    changeColor: "text-gray-500",
  },
  {
    title: "Unique Visits",
    value: "0",
    change: "Loading...",
    changeColor: "text-gray-500",
  },
  {
    title: "Time Spent on website",
    value: "0 min",
    change: "Loading...",
    changeColor: "text-gray-500",
  },
  {
    title: "Bounce Rate",
    value: "0%",
    change: "Loading...",
    changeColor: "text-gray-500",
  },
]);

const engagementData = reactive({
  labels: [],
  datasets: [
    {
      label: "Page Views",
      backgroundColor: "#28a745",
      borderRadius: 8,
      data: [],
    },
  ],
});

const completionData = {
  labels: ["Completed", "In Progress", "Pending"],
  datasets: [
    {
      label: "Course Completion",
      backgroundColor: ["#28a745", "#ffb300", "#ff5252"],
      data: [45, 35, 20],
    },
  ],
};

const growthData = reactive({
  labels: [],
  datasets: [
    {
      label: "Page Views",
      borderColor: "#fdc700",
      backgroundColor: "#fdc7008a",
      fill: true,
      tension: 0.4,
      data: [],
    },
  ],
});

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true },
  },
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" },
  },
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true },
  },
};

async function loadAnalytics() {
  try {
    loading.value = true;
    analyticsError.value = null;
    const data = await dashboardApi.fetchWebsiteAnalytics({});

    statCards.value = [
      {
        title: "Total Visits",
        value: data.total_page_views.toLocaleString(),
        change: `${data.page_views_by_day.length} days tracked`,
        changeColor: "text-[#00cc66]",
      },
      {
        title: "Unique Visits",
        value: data.total_unique_visitors.toLocaleString(),
        change: `${data.currently_active_users} currently active`,
        changeColor: "text-[#00cc66]",
      },
      {
        title: "Time Spent on website",
        value: `${data.average_session_duration_minutes.toFixed(1)} min`,
        change: `${data.avg_active_days_per_user.toFixed(1)} avg active days`,
        changeColor: "text-[#00cc66]",
      },
      {
        title: "Bounce Rate",
        value: `${data.bounce_rate}%`,
        change: `${data.inactive_account_rate}% inactive rate`,
        changeColor: data.bounce_rate > 50 ? "text-red-500" : "text-[#00cc66]",
      },
    ];

    if (data.page_views_by_day && data.page_views_by_day.length > 0) {
      const dayLabels = data.page_views_by_day.map((_, i) => `Day ${i + 1}`);
      const viewValues = data.page_views_by_day.map((d) => d.views || d.value || d);

      engagementData.labels = dayLabels;
      engagementData.datasets[0].data = viewValues;

      growthData.labels = dayLabels;
      growthData.datasets[0].data = viewValues;
    }

    loading.value = false;
  } catch (err) {
    console.error("Failed to load website analytics:", err);
    analyticsError.value = "Failed to load analytics data";
    loading.value = false;
  }
}

onMounted(loadAnalytics);
</script>

<template>
  <div class="flex min-h-screen font-sans relative">
    <button
      @click="toggleSidebar"
      class="lg:hidden fixed top-20 right-4 z-50 bg-[#004d33] text-white p-2 rounded-md shadow-md"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <div
      class="fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:translate-x-0 pt-16 lg:pt-0"
      :class="showSidebar ? 'translate-x-0' : '-translate-x-full'"
    >
      <EditorSidebar @closeSidebar="closeSidebar" class="h-full" />
    </div>

    <div
      v-if="showSidebar"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 z-30 lg:hidden"
      @click="closeSidebar"
    ></div>

    <main class="flex-1 p-8 overflow-auto bg-white">
      <div class="mb-8">
        <h1 class="text-4xl font-extrabold text-[#E87A18]">Welcome Editor!</h1>
        <p class="text-gray-700 mt-2">
          Here is how your pages are performing today.
        </p>
      </div>

      <div v-if="analyticsError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        {{ analyticsError }}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
        <div
          v-for="(stat, index) in statCards"
          :key="stat.title"
          class="p-6 text-center bg-white shadow-lg border-y border-[#00cc66] relative overflow-hidden group transition-all duration-300"
          :class="{
            'rounded-tl-4xl rounded-br-4xl': index === 0,
            'rounded-tl-4xl rounded-br-4xl': index === statCards.length - 1,
            'rounded-tl-4xl rounded-br-4xl': true,
          }"
        >
          <div class="absolute inset-y-0 left-0 w-1 bg-[#00cc66]"></div>
          <div class="absolute inset-y-0 right-0 w-1 bg-[#00cc66]"></div>

          <p class="text-gray-600 text-sm mb-1">{{ stat.title }}</p>

          <div class="text-4xl font-bold text-gray-800 mb-1">
            <span v-if="loading" class="animate-pulse">...</span>
            <span v-else>{{ stat.value }}</span>
          </div>

          <p :class="[stat.changeColor, 'text-sm font-medium']">
            {{ stat.change }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white p-6 rounded-xl shadow-lg lg:col-span-3">
          <h2 class="text-xl font-semibold mb-4 text-[#006633]">
            Website Visit
          </h2>
          <div class="h-[300px] w-full">
            <Bar :data="engagementData" :options="barOptions" />
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-lg w-full">
          <h2 class="text-xl font-semibold mb-4 text-[#006633]">
            Page Visits
          </h2>
          <div class="h-[300px] w-full">
            <Pie :data="completionData" :options="pieOptions" />
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-lg w-full">
          <h2 class="text-xl font-semibold mb-4 text-[#006633]">
            Number of visitors per page
          </h2>
          <div class="h-[300px] w-full">
            <Line :data="growthData" :options="lineOptions" />
          </div>
        </div>
      </div>
      <div class="p-6 bg-white rounded-xl">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          <div
            v-for="card in summaryData"
            :key="card.title"
            class="summary-card-alt p-6 text-center bg-white shadow-lg relative overflow-hidden group transition-all duration-300"
            :class="{
              'rounded-tl-4xl rounded-br-4xl': true,
            }"
          >
            <div class="absolute inset-y-0 left-0 w-1 bg-[#00cc66]"></div>
            <div class="absolute inset-y-0 right-0 w-1 bg-[#00cc66]"></div>

            <p class="text-gray-600 text-sm mb-1">{{ card.title }}</p>

            <div class="text-2xl font-bold text-gray-800 mb-1">
              <span>{{ card.value }}</span>
            </div>

            <p
              :class="[
                card.trendType === 'up' ? 'text-[#00cc66]' : 'text-red-500',
                'text-sm font-medium',
              ]"
            >
              {{ card.trendValue }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 bg-white rounded-lg"
      >
        <div class="lg:col-span-2">
          <div class="bg-white p-6 rounded-lg shadow-sm mb-0">
            <div class="flex justify-between items-start mb-4">
              <h2 class="text-2xl font-bold text-gray-800">Total Content Uploaded</h2>
              <div
                class="p-2 border border-gray-300 rounded-md text-sm cursor-pointer flex items-center"
              >
                Yearly <span class="ml-1 text-xs">⌄</span>
              </div>
            </div>
            <div class="h-80">
              <Line :data="revenueData" :options="revenueChartOptions" />
            </div>
          </div>

          
        </div>
        
      </div>
    </main>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.h-\[300px\] {
  height: 300px;
}

.highlight-card {
  @apply bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center;
  text-align: center;
}

.summary-card {
  @apply relative bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden;
}

.trend-pill {
  @apply py-2 px-4 rounded-full font-semibold text-sm border-2 transition-colors duration-200;
}

.rounded-t-\[50px_25px\] {
  border-top-left-radius: 50px 25px;
  border-top-right-radius: 50px 25px;
}

.course-card {
  @apply bg-white p-4 border border-gray-200 rounded-lg shadow-sm;
}

.summary-card-corrected {
  @apply relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden;
  padding: 10px;
}

.summary-card-corrected::before {
  content: "";
  position: absolute;
  top: -10px;
  left: -10px;
  width: 100px;
  height: 100px;
  border: 4px solid #4caf50;
  border-right: none;
  border-bottom: none;
  border-top-left-radius: 80% 60%;
  pointer-events: none;
  z-index: 10;
}

.summary-card-corrected::after {
  content: "";
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 100px;
  height: 100px;
  border: 4px solid #4caf50;
  border-top: none;
  border-left: none;
  border-bottom-right-radius: 80% 60%;
  pointer-events: none;
  z-index: 10;
}

.trend-pill-corrected {
  @apply py-2 px-6 rounded-full font-bold text-base transition-shadow duration-300;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);
}

.text-orange-500 {
  color: #f97316;
}
</style>
