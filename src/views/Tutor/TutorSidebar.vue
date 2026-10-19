<script setup>
import analyticsApi from '@/api/dashboard.js';
import { useAuth } from '@/store/authStore';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const emit = defineEmits(['closeSidebar']);
const router = useRouter()
const route = useRoute();
const { logout } = useAuth()

const DARK_GREEN = '#004d33';
const LIGHT_GREEN = '#f2f9f3';

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
    title: 'Dashboard',
    path: '/tutor/dashboard',
    icon: 'M3 3v18h18V3H3zm16 16H5V5h14v14zM9 8h6v2H9V8zm0 4h6v2H9v-2zm0 4h4v2H9v-2z',
  },
  {
    title: 'My Courses',
    path: '/tutor/mycourses',
    icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20zm-1-8V7h2v5h4l-5 5-5-5h4z',
  },
  {
    title: 'Review',
    path: '/tutor/reviews',
    icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  },
  
  
  
  
  
  
  
  
  
  
];

const handleLogout = () => {
  logout() 
  router.push('/') 
    window.scrollTo({ top: 0, behavior: 'smooth' });

}

const isLinkActive = (path) => path === currentPath.value;

const handleLinkClick = (path) => {
  currentPath.value = path;
  emit('closeSidebar');
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
        <span v-if="link.title === 'My Courses'" class="ml-auto text-xs bg-[#00cc66] text-white px-2 py-0.5 rounded-full">{{ courseCount }}</span>
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
          <path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h4M16 17l5-5-5-5M21 12H9" />
        </svg>
        Logout
      </button>
    </div>
    </nav>

    
  </div>
</template>

