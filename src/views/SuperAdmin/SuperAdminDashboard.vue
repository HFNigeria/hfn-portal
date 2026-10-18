<script setup>
import analyticsApi from "@/api/dashboard.js";
import DashboardLoader from "@/components/layout/DashboardLoader.vue";
import SuperAdminSidebar from "@/views/SuperAdmin/SuperAdminSidebar.vue";
import { computed, onMounted, reactive, ref } from "vue";
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

const active = ref("Dashboard");
const router = useRouter();
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dashboardData = reactive({
  stats: [],
  summary: [],
  courses: [],
  mostViewed: [],
  revenue: {},
  enrollment: {},
  completion: {},
  growth: {},
  membershipStats: {},
  response: null,
});

const membershipCards = computed(() => {
  const stats = dashboardData.membershipStats || {};
  return [
    { title: "Active Subscriptions", value: stats.active_subscriptions || 0 },
    { title: "Expired Subscriptions", value: stats.expired_subscriptions || 0 },
    { title: "Total Subscriptions", value: stats.total_subscriptions || 0 },
  ];
});

const summaryData = computed(() => {
  const dash = dashboardData.response;
  if (!dash) return [];
  return [
    {
      title: "Total Visits",
      value: dash.total_page_views?.toLocaleString() || "0",
      trendValue: `${dash.total_unique_visitors || 0} Unique`,
      trendType: "up",
    },
    {
      title: "Bounce Rate",
      value: `${dash.bounce_rate?.toFixed(1) || 0}%`,
      trendValue: dash.bounce_rate < 40 ? "Good" : "Needs Improvement",
      trendType: dash.bounce_rate < 40 ? "up" : "down",
    },
    {
      title: "Avg Session Time",
      value: `${dash.average_session_duration_minutes?.toFixed(0) || 0} mins`,
      trendValue: "Per session",
      trendType: "up",
    },
    {
      title: "Time on Courses",
      value: `${dash.average_time_spent_minutes?.toFixed(0) || 0} mins`,
      trendValue: "Per student",
      trendType: "up",
    },
  ];
});
const loading = ref(true);
const error = ref(null);

const revenueData = reactive({
  labels: MONTHS,
  datasets: [
    {
      label: "Revenue",
      backgroundColor: "rgba(0, 204, 102, 0.3)",
      borderColor: "#00cc66",
      pointBackgroundColor: "#00cc66",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#00cc66",
      data: [],
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
              currency: "N",
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

const usersByRoleData = reactive({
  labels: [],
  datasets: [
    {
      label: "Users by Role",
      backgroundColor: [
        "#28a745",
        "#E87A18",
        "#007bff",
        "#ffc107",
        "#6c757d",
        "#17a2b8",
      ],
      data: [],
    },
  ],
});

const engagementData = reactive({
  labels: [],
  datasets: [
    {
      label: "Engagement",
      backgroundColor: "#28a745",
      borderRadius: 8,
      data: [],
    },
  ],
});

const completionData = reactive({
  labels: [],
  datasets: [
    {
      label: "Course Completion",
      backgroundColor: ["#28a745", "#ffb300", "#ff5252"],
      data: [],
    },
  ],
});

const growthData = reactive({
  labels: ["Active", "Expired"],
  datasets: [
    {
      label: "Memberships",
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

const showSidebar = ref(false);
const toggleSidebar = () => (showSidebar.value = !showSidebar.value);
const closeSidebar = () => (showSidebar.value = false);

onMounted(async () => {
  try {
    loading.value = true;
    const dash = await analyticsApi.fetchDashboard();

    if (dash.users_by_role && dash.users_by_role.length > 0) {
      usersByRoleData.labels = dash.users_by_role.map(
        (item) => item.role.charAt(0).toUpperCase() + item.role.slice(1)
      );
      usersByRoleData.datasets[0].data = dash.users_by_role.map(
        (item) => item.count
      );
    }

    dashboardData.response = dash;
    dashboardData.membershipStats = dash.membership_stats || {};

    dashboardData.stats = [
      {
        title: "Total Accounts",
        value: dash.total_accounts,
        change: "",
        changeColor: "text-gray-500",
      },
      {
        title: "Monthly Active Users",
        value: dash.monthly_active_users,
        change: "",
        changeColor: "text-gray-500",
      },
      {
        title: "Bounce Rate",
        value: dash.bounce_rate?.toFixed(2) + "%",
        change: "",
        changeColor: "text-gray-500",
      },
      {
        title: "Average Session (min)",
        value: dash.average_session_duration_minutes?.toFixed(2),
        change: "",
        changeColor: "text-gray-500",
      },
      {
        title: "New Sign Ups (30 days)",
        value: dash.new_signups_30_days,
        change: "Last 30 days",
        changeColor: "text-orange-600",
      },
      {
        title: "Active Users",
        value: dash.total_active_users,
        change: "Currently active",
        changeColor: "text-purple-600",
      },
    ];

    revenueData.labels = MONTHS;
    revenueData.datasets[0].data = MONTHS.map(
      (m) => dash.monthly_revenue[m] || 0
    );

    const revEntries = Object.entries(dash.monthly_revenue);
    const topMonthEntry = revEntries.reduce(
      (a, b) => (b[1] > a[1] ? b : a),
      [MONTHS[0], 0]
    );

    dashboardData.revenue = {
      topMonth: { name: topMonthEntry[0], year: new Date().getFullYear() },
      topYear: {
        year: new Date().getFullYear(),
        sales: `${dash.total_revenue.toLocaleString()}`,
      },
      bestSeller: {
        name: dash.most_viewed_courses[0]?.title || "None",
        instructor: "Primary Instructor",
      },
    };

    engagementData.labels = MONTHS;
    engagementData.datasets[0].data = MONTHS.map(
      (m) => dash.enrollments_by_month[m] || 0
    );

    completionData.labels = ["Completed", "In Progress", "Dropped"];
    completionData.datasets[0].data = [
      dash.course_completion_stats.completed_count,
      dash.course_completion_stats.in_progress_count,
      dash.course_completion_stats.dropped_count,
    ];

    growthData.labels = ["Active", "Expired"];
    growthData.datasets[0].data = [
      dash.membership_stats.active_subscriptions,
      dash.membership_stats.expired_subscriptions,
    ];

    const maxViews = Math.max(
      ...dash.most_viewed_courses.map((c) => c.view_count),
      1
    );
    dashboardData.mostViewed = dash.most_viewed_courses.map((course) => ({
      name: course.title,
      value: course.view_count,
      progress: (course.view_count / maxViews) * 100 + "%",
    }));

    dashboardData.courses = dash.time_spent_per_course.map((course) => ({
      name: course.course_title,
      enrollments: course.total_time_minutes + " mins",
    }));
  } catch (err) {
    console.error("Failed to load dashboard data", err);
    error.value = err;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="flex min-h-screen font-sans relative">
    <button @click="toggleSidebar"
      class="lg:hidden fixed top-20 right-4 z-50 bg-[#004d33] text-white p-2 rounded-md shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <div
      class="fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:translate-x-0 pt-16 lg:pt-0"
      :class="showSidebar ? 'translate-x-0' : '-translate-x-full'">
      <SuperAdminSidebar @closeSidebar="closeSidebar" class="h-full" />
    </div>

    <div v-if="showSidebar" class="fixed inset-0 bg-gray bg-opacity-10 z-30 lg:hidden" @click="closeSidebar"></div>
    <main class="flex-1 p-8 overflow-auto bg-white">
      <DashboardLoader v-if="loading" message="Loading super admin dashboard..." />

      <div>
        <h1 class="text-4xl font-extrabold text-[#E87A18]">
          Welcome Super Admin!
        </h1>
        <p class="text-gray-700 mt-2">

        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
        <div v-for="(stat, index) in dashboardData.stats" :key="stat.title"
          class="flex-1 p-6 text-center bg-white shadow-lg border-y border-[#00cc66] relative overflow-hidden group transition-all duration-300"
          :class="{
            'rounded-tl-4xl rounded-br-4xl':
              index === 0 || index === dashboardData.stats.length - 1,
          }">
          <div class="absolute inset-y-0 left-0 w-1 bg-[#00cc66]"></div>
          <div class="absolute inset-y-0 right-0 w-1 bg-[#00cc66]"></div>

          <p class="text-gray-600 text-sm mb-1">{{ stat.title }}</p>

          <div class="text-4xl font-bold text-gray-800 mb-1">
            <span v-if="stat.stars">
              <span class="text-[#ff9900]">
                <span v-for="i in 5" :key="i">
                  <span v-if="i <= Math.floor(parseFloat(stat.value))">★</span>
                  <span v-else-if="i === Math.ceil(parseFloat(stat.value)) && stat.value % 1 !== 0">☆</span>
                  <span v-else class="text-gray-300">★</span>
                </span>
              </span>
              <span class="text-sm ml-2">{{ stat.value }}</span>
            </span>
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
            Members Monthly Registration
          </h2>
          <div class="h-[300px] w-full">
            <Bar v-if="!loading" :data="engagementData" :options="barOptions" />
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-lg w-full">
          <h2 class="text-xl font-semibold mb-4 text-[#006633]">
            Users by Role
          </h2>

          <div class="h-[300px] w-full">
            <Pie v-if="!loading && usersByRoleData.datasets[0].data.length" :data="usersByRoleData"
              :options="pieOptions" />
          </div>
        </div>



        <div class="bg-white p-6 rounded-xl shadow-lg w-full">
          <h2 class="text-xl font-semibold mb-4 text-[#006633]">
            Subscriptions
          </h2>
          <div class="h-[300px] w-full">
            <Line v-if="!loading" :data="growthData" :options="lineOptions" />
          </div>
        </div>
      </div>
      <div class="p-6 bg-white rounded-xl mb-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
          <div
            v-for="card in summaryData"
            :key="card.title"
            class="summary-card-alt flex-1 p-6 text-center bg-white shadow-lg relative overflow-hidden group transition-all duration-300"
            :class="{ 'rounded-tl-4xl rounded-br-4xl': true }"
          >
            <div class="absolute inset-y-0 left-0 w-1 bg-[#00cc66]"></div>
            <div class="absolute inset-y-0 right-0 w-1 bg-[#00cc66]"></div>
            <p class="text-gray-600 text-sm mb-1">{{ card.title }}</p>
            <div class="text-4xl font-bold text-gray-800 mb-1">
              <span>{{ card.value }}</span>
            </div>
            <p :class="[card.trendType === 'up' ? 'text-[#00cc66]' : 'text-red-500', 'text-sm font-medium']">
              {{ card.trendValue }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div
            v-for="(card, index) in membershipCards"
            :key="index"
            class="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
          >
            <p class="text-sm text-gray-500 mb-1">{{ card.title }}</p>
            <p class="text-3xl font-bold text-gray-800">{{ card.value }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-8 p-6 bg-white rounded-lg">
        <div class="col-span-1">
          <div class="bg-white p-6 rounded-lg shadow-sm mb-0">
            <div class="flex justify-between items-start mb-4">
              <h2 class="text-2xl font-bold text-gray-800">Revenue</h2>
              <div class="p-2 border border-gray-300 rounded-md text-sm cursor-pointer flex items-center">
                Yearly <span class="ml-1 text-xs">⌄</span>
              </div>
            </div>
            <div class="h-80">
              <Line v-if="!loading" :data="revenueData" :options="revenueChartOptions" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-0 mt-[-10px]">
            <div class="highlight-card-wrapper border-r border-orange-100">
              <div class="highlight-card">
                <p class="text-sm text-gray-500 mb-1">Top month</p>
                <p class="text-3xl font-bold text-[#E87A18]">
                  {{ dashboardData.revenue.topMonth?.name || "N/A" }}
                </p>
                <p class="text-xl font-semibold text-[#E87A18] mt-1">
                  {{ dashboardData.revenue.topMonth?.year || "N/A" }}
                </p>
              </div>
            </div>

            <div class="highlight-card-wrapper border-r border-orange-100">
              <div class="highlight-card">
                <p class="text-sm text-gray-500 mb-1">Top year</p>
                <p class="text-3xl font-bold text-[#E87A18]">
                  {{ dashboardData.revenue.topYear?.year || "N/A" }}
                </p>
                <p class="text-xl font-semibold text-gray-600 mt-1">
                  {{ dashboardData.revenue.topYear?.sales || "N/A" }}
                </p>
              </div>
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
