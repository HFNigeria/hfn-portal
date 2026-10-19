<script setup>
import dashboardApi from "@/api/dashboard";
import DashboardLoader from "@/components/layout/DashboardLoader.vue";
import AdminSidebar from "@/views/Admin/AdminSidebar.vue";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

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

const toast = useToast();
const router = useRouter();
const active = ref("Dashboard");
const isLoading = ref(true);
const dashboardData = ref(null);

const revenueData = ref({
  labels: [],
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

const engagementData = ref({
  labels: [],
  datasets: [
    {
      label: "Enrollments",
      backgroundColor: "#28a745",
      borderRadius: 8,
      data: [],
    },
  ],
});

const completionData = ref({
  labels: ["Completed", "In Progress", "Dropped"],
  datasets: [
    {
      label: "Course Completion",
      backgroundColor: ["#28a745", "#ffb300", "#ff5252"],
      data: [0, 0, 0],
    },
  ],
});

const growthData = ref({
  labels: [],
  datasets: [
    {
      label: "New Users",
      borderColor: "#fdc700",
      backgroundColor: "#fdc7008a",
      fill: true,
      tension: 0.4,
      data: [],
    },
  ],
});

const revenueChartOptions = ref({
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
              currency: "NGN",
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
  plugins: {
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
      },
    },
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

const statCards = computed(() => {
  if (!dashboardData.value) return [];

  return [
    {
      title: "Total Accounts",
      value: dashboardData.value.total_accounts,
      change: "",
      changeColor: "text-gray-500",
    },
    {
      title: "Monthly Active Users",
      value: dashboardData.value.monthly_active_users,
      change: "",
      changeColor: "text-gray-500",
    },
    {
      title: "Bounce Rate",
      value: `${dashboardData.value.bounce_rate?.toFixed(2) || 0}%`,
      change: "",
      changeColor: "text-gray-500",
    },
    {
      title: "Average Session (min)",
      value: dashboardData.value.average_session_duration_minutes?.toFixed(2),
      change: "",
      changeColor: "text-gray-500",
    },
    {
      title: "New Sign Ups (30 days)",
      value: dashboardData.value.new_signups_30_days,
      change: "Last 30 days",
      changeColor: "text-orange-600",
    },
    {
      title: "Active Users",
      value: dashboardData.value.total_active_users,
      change: "Currently active",
      changeColor: "text-purple-600",
    },
  ];
});

const usersByRoleData = computed(() => {
  if (!dashboardData.value?.users_by_role)
    return {
      labels: [],
      datasets: [],
    };

  return {
    labels: dashboardData.value.users_by_role.map((r) => r.role),
    datasets: [
      {
        data: dashboardData.value.users_by_role.map((r) => r.count),
        backgroundColor: [
          "#00cc66",
          "#E87A18",
          "#006633",
          "#ffb300",
          "#ff5252",
          "#8884d8",
        ],
      },
    ],
  };
});

const summaryData = computed(() => {
  if (!dashboardData.value) return [];

  return [
    {
      title: "Total Visits",
      value: dashboardData.value.total_page_views?.toLocaleString() || "0",
      trendValue: `${dashboardData.value.total_unique_visitors || 0} Unique`,
      trendType: "up",
    },
    {
      title: "Bounce Rate",
      value: `${dashboardData.value.bounce_rate?.toFixed(1) || 0}%`,
      trendValue:
        dashboardData.value.bounce_rate < 40 ? "Good" : "Needs Improvement",
      trendType: dashboardData.value.bounce_rate < 40 ? "up" : "down",
    },
    {
      title: "Avg Session Time",
      value: `${
        dashboardData.value.average_session_duration_minutes?.toFixed(0) || 0
      } mins`,
      trendValue: "Per session",
      trendType: "up",
    },
    {
      title: "Time on Courses",
      value: `${
        dashboardData.value.average_time_spent_minutes?.toFixed(0) || 0
      } mins`,
      trendValue: "Per student",
      trendType: "up",
    },
  ];
});

const mostViewedCourses = computed(() => {
  if (!dashboardData.value?.most_viewed_courses) return [];

  const maxEnrollments = Math.max(
    ...dashboardData.value.most_viewed_courses.map(
      (c) => c.enrollment_count || 0
    )
  );

  return dashboardData.value.most_viewed_courses.map((course) => ({
    name: course.title,
    value: course.enrollment_count || 0,
    progress:
      maxEnrollments > 0
        ? `${Math.round((course.enrollment_count / maxEnrollments) * 100)}%`
        : "0%",
    course_id: course.id,
  }));
});

const courseData = computed(() => {
  if (!dashboardData.value?.most_viewed_courses) return [];

  return dashboardData.value.most_viewed_courses.slice(0, 4).map((course) => ({
    name: course.title,
    enrollments: course.enrollment_count || 0,
    course_id: course.id,
  }));
});

const topRevenueData = computed(() => {
  if (!dashboardData.value?.monthly_revenue) return null;

  const monthlyData = dashboardData.value.monthly_revenue;
  const entries = Object.entries(monthlyData);

  if (entries.length === 0) return null;

  let topMonth = { month: "", revenue: 0 };
  let topYear = { year: 0, total: 0 };

  entries.forEach(([month, revenue]) => {
    if (revenue > topMonth.revenue) {
      topMonth = { month, revenue };
    }
    topYear.total += revenue;
  });

  return {
    topMonth: topMonth.month,
    topMonthRevenue: topMonth.revenue,
    topYear: "2024",
    totalYearRevenue: topYear.total,
  };
});

const fetchDashboardData = async () => {
  try {
    isLoading.value = true;
    const data = await dashboardApi.fetchDashboard();

    if (data) {
      dashboardData.value = data;
      updateChartData();
    } else {
      toast.error("Failed to load dashboard data");
    }
  } catch (error) {
    console.error("Dashboard fetch error");
    toast.error("Failed to load dashboard data. Please try again.");
  } finally {
    isLoading.value = false;
  }
};

const updateChartData = () => {
  if (!dashboardData.value) return;

  
  if (dashboardData.value.monthly_revenue) {
    revenueData.value = {
      ...revenueData.value,
      labels: Object.keys(dashboardData.value.monthly_revenue),
      datasets: [
        {
          ...revenueData.value.datasets[0],
          data: Object.values(dashboardData.value.monthly_revenue),
        },
      ],
    };
  }

  
  if (dashboardData.value.enrollments_by_month) {
    engagementData.value = {
      ...engagementData.value,
      labels: Object.keys(dashboardData.value.enrollments_by_month),
      datasets: [
        {
          ...engagementData.value.datasets[0],
          data: Object.values(dashboardData.value.enrollments_by_month),
        },
      ],
    };
  }

  
  if (dashboardData.value.new_users_by_month) {
    growthData.value = {
      ...growthData.value,
      labels: Object.keys(dashboardData.value.new_users_by_month),
      datasets: [
        {
          ...growthData.value.datasets[0],
          data: Object.values(dashboardData.value.new_users_by_month),
        },
      ],
    };
  }

  
  if (dashboardData.value.course_completion_stats) {
    const stats = dashboardData.value.course_completion_stats;
    completionData.value = {
      ...completionData.value,
      datasets: [
        {
          ...completionData.value.datasets[0],
          data: [
            Number(stats.completed_count) || 0,
            Number(stats.in_progress_count) || 0,
            Number(stats.dropped_count) || 0,
          ],
        },
      ],
    };
  }
};

const membershipCards = computed(() => {
  const stats = dashboardData.value?.membership_stats || {};

  return [
    {
      title: "Active Subscriptions",
      value: stats.active_subscriptions || 0,
    },
    {
      title: "Expired Subscriptions",
      value: stats.expired_subscriptions || 0,
    },
    {
      title: "Total Subscriptions",
      value: stats.total_subscriptions || 0,
    },
  ];
});

onMounted(() => {
  fetchDashboardData();
});

const showSidebar = ref(false);
const toggleSidebar = () => (showSidebar.value = !showSidebar.value);
const closeSidebar = () => (showSidebar.value = false);
</script>

<template>
  <div class="flex min-h-screen font-sans relative">
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
      <AdminSidebar @closeSidebar="closeSidebar" class="h-full" />
    </div>

    <div
      v-if="showSidebar"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 z-30 lg:hidden"
      @click="closeSidebar"
    ></div>

    <main class="flex-1 p-8 overflow-auto bg-white">
      <DashboardLoader v-if="isLoading" message="Loading admin dashboard..." />

      <div v-else>
        <div class="mb-8">
          <h1 class="text-4xl font-extrabold text-[#E87A18]">Welcome Admin!</h1>
          <p class="text-gray-700 mt-2">
            
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
          <div
            v-for="(stat, index) in statCards"
            :key="stat.title"
            class="flex-1 p-6 text-center bg-white shadow-lg border-y border-[#00cc66] relative overflow-hidden group transition-all duration-300"
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
              <span v-if="stat.stars">
                <span class="text-[#ff9900]">
                  <span v-for="i in 5" :key="i">
                    <span v-if="i <= Math.floor(parseFloat(stat.value))"
                      >★</span
                    >
                    <span
                      v-else-if="
                        i === Math.ceil(parseFloat(stat.value)) &&
                        stat.value % 1 !== 0
                      "
                      >☆</span
                    >
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

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div class="bg-white p-6 rounded-xl shadow-lg lg:col-span-3">
            <h2 class="text-xl font-semibold mb-4 text-[#006633]">
              Membership Monthly Registrations
            </h2>
            <div
              v-if="engagementData.labels.length > 0"
              class="h-[300px] w-full"
            >
              <Bar :data="engagementData" :options="barOptions" />
            </div>
            <div
              v-else
              class="h-[300px] w-full flex items-center justify-center text-gray-500"
            >
              No registration data available
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
              Users by Role
            </h2>

            <div v-if="usersByRoleData.labels.length" class="h-72">
              <Pie :data="usersByRoleData" />
            </div>

            <p v-else class="text-sm text-gray-400 text-center">
              No role data available
            </p>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-lg w-full">
            <h2 class="text-xl font-semibold mb-4 text-[#006633]">
              New User Signups
            </h2>
            <div v-if="growthData.labels.length > 0" class="h-[300px] w-full">
              <Line :data="growthData" :options="lineOptions" />
            </div>
            <div
              v-else
              class="h-[300px] w-full flex items-center justify-center text-gray-500"
            >
              No growth data available
            </div>
          </div>
        </div>

        <div class="p-6 bg-white rounded-xl mb-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
            <div
              v-for="card in summaryData"
              :key="card.title"
              class="summary-card-alt flex-1 p-6 text-center bg-white shadow-lg relative overflow-hidden group transition-all duration-300"
              :class="{
                'rounded-tl-4xl rounded-br-4xl': true,
              }"
            >
              <div class="absolute inset-y-0 left-0 w-1 bg-[#00cc66]"></div>
              <div class="absolute inset-y-0 right-0 w-1 bg-[#00cc66]"></div>

              <p class="text-gray-600 text-sm mb-1">{{ card.title }}</p>

              <div class="text-4xl font-bold text-gray-800 mb-1">
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

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div
              v-for="(card, index) in membershipCards"
              :key="index"
              class="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
            >
              <p class="text-sm text-gray-500 mb-1">
                {{ card.title }}
              </p>

              <p class="text-3xl font-bold text-gray-800">
                {{ card.value }}
              </p>
            </div>
          </div>

          
        </div>

        <div class="grid grid-cols-1 gap-8 p-6 bg-white rounded-lg">
          <div class="col-span-1">
            <div class="bg-white p-6 rounded-lg shadow-sm mb-0">
              <div class="flex justify-between items-start mb-4">
                <h2 class="text-2xl font-bold text-gray-800">Revenue</h2>
                <div
                  class="p-2 border border-gray-300 rounded-md text-sm cursor-pointer flex items-center"
                >
                  Yearly <span class="ml-1 text-xs">⌄</span>
                </div>
              </div>
              <div v-if="revenueData.labels.length > 0" class="h-80">
                <Line :data="revenueData" :options="revenueChartOptions" />
              </div>
              <div
                v-else
                class="h-80 flex items-center justify-center text-gray-500"
              >
                No revenue data available
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-0 mt-[-10px]">
              <div
                class="highlight-card-wrapper border-r border-orange-100"
                v-if="topRevenueData"
              >
                <div class="highlight-card">
                  <p class="text-sm text-gray-500 mb-1">Top month</p>
                  <p class="text-3xl font-bold text-[#E87A18]">
                    {{ topRevenueData.topMonth }}
                  </p>
                  <p class="text-xl font-semibold text-[#E87A18] mt-1">
                    {{
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "NGN",
                        maximumFractionDigits: 0,
                      }).format(topRevenueData.topMonthRevenue)
                    }}
                  </p>
                </div>
              </div>

              <div
                class="highlight-card-wrapper border-r border-orange-100"
                v-if="topRevenueData"
              >
                <div class="highlight-card">
                  <p class="text-sm text-gray-500 mb-1">Top year</p>
                  <p class="text-3xl font-bold text-[#E87A18]">
                    {{ topRevenueData.topYear }}
                  </p>
                  <p class="text-xl font-semibold text-gray-600 mt-1">
                    {{
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "NGN",
                        maximumFractionDigits: 0,
                      }).format(topRevenueData.totalYearRevenue)
                    }}
                  </p>
                </div>
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
