<script setup>
import analyticsApi from "@/api/dashboard.js";
import { useAuth } from "@/store/authStore";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const emit = defineEmits(["closeSidebar"]);
const router = useRouter();
const route = useRoute();

const { logout } = useAuth();
const DARK_GREEN = "#004d33";
const LIGHT_GREEN = "#f2f9f3";

const currentPath = ref(route.path);
const courseCount = ref("...");

watch(
  () => route.path,
  (newPath) => {
    currentPath.value = newPath;
  },
  { immediate: true }
);

onMounted(async () => {
  try {
    const data = await analyticsApi.fetchCourseAnalytics();
    courseCount.value = String(data.total_courses ?? 0);
  } catch (e) {
    courseCount.value = "0";
  }
});

const navLinks = [
  {
    title: "Dashboard",
    path: "/superadmin/dashboard",
    icon: "M3 3v18h18V3H3zm16 16H5V5h14v14zM9 8h6v2H9V8zm0 4h6v2H9v-2zm0 4h4v2H9v-2z",
  },
  {
    title: "Courses",
    path: "/superadmin/courses",
    icon: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20zm-1-8V7h2v5h4l-5 5-5-5h4z",
  },
  {
    title: "Applications",
    path: "/superadmin/applications",
    icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z",
  },
  {
    title: "Membership",
    path: "/superadmin/members",
  icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  },
  {
    title: "Payments",
    path: "/superadmin/payments",
  icon: "M2 7h20a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm0 4h20M4 15h4",
  },
  {
    title: "Messages",
    path: "/superadmin/messages",
    icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  },
  {
    title: "Feedback",
    path: "/superadmin/feedback",
    icon: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z",
  },
  {
    title: "My Account",
    path: "/superadmin/account",
    icon: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
  },
  {
    title: "Events & Newsletter",
    path: "/superadmin/events",
    icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  },
  {
    title: "Page Manager",
    path: "/superadmin/pages",
    icon: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20zm-1-8V7h2v5h4l-5 5-5-5h4z",
  },
  {
    title: 'Access Manager',
    path: '/superadmin/access',
    icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20zm0-13a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zm0 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  },
];

const handleLogout = () => {
  logout();
  window.location.href = "/";
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const isLinkActive = (path) => path === currentPath.value;

const handleLinkClick = (path) => {
  currentPath.value = path;
  emit("closeSidebar");
};
</script>

<template>
  <div
    :style="{ backgroundColor: DARK_GREEN }"
    class="w-full lg:w-64 min-h-screen flex flex-col justify-between border-r sticky top-0 left-0 pt-8 text-white shadow-xl"
  >
    <nav class="space-y-1 px-4 flex flex-col">
      <RouterLink
        v-for="link in navLinks"
        :key="link.title"
        :to="link.path"
        @click="handleLinkClick(link.path)"
        class="flex items-center justify-between p-3 text-lg font-medium rounded-xl transition-all duration-200 cursor-pointer"
        :class="
          isLinkActive(link.path)
            ? 'font-bold shadow-md'
            : 'text-gray-200 hover:bg-green-700/50 hover:text-white'
        "
        :style="
          isLinkActive(link.path)
            ? { backgroundColor: LIGHT_GREEN, color: DARK_GREEN }
            : {}
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-6 h-6 mr-3"
        >
          <path :d="link.icon" />
        </svg>
        <span class="flex-1">{{ link.title }}</span>
        <span v-if="link.title === 'Courses'" class="ml-auto text-xs bg-[#00cc66] text-white px-2 py-0.5 rounded-full">{{ courseCount }}</span>
      </RouterLink>
      <div class="p-4 border-t border-green-700">
        <button
          @click="handleLogout"
          class="flex items-center p-3 text-lg font-medium rounded-xl transition-all duration-200 text-gray-200 hover:bg-red-700/50 hover:text-white w-full text-left"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-6 h-6 mr-3"
          >
            <path
              d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h4M16 17l5-5-5-5M21 12H9"
            />
          </svg>
          Logout
        </button>
      </div>
    </nav>
  </div>
</template>

