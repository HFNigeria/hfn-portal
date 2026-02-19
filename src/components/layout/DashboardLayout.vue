<!-- <script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import AdminHeader from "./AdminHeader.vue";

import EditorSidebar from "@/views/Editor/EditorSidebar.vue";
import SuperAdminSidebar from "@/views/SuperAdmin/SuperAdminSidebar.vue";
import TutorSidebar from "@/views/Tutor/TutorSidebar.vue";
import AdminSidebar from "./AdminSidebar.vue";
import { useSidebar } from "@/composables/useSidebar";

const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

const userRole = localStorage.getItem("role") || "user";

const sidebarComponent = computed(() => {
  switch (userRole) {
    case "editor":
      return EditorSidebar;
    case "tutor":
      return TutorSidebar;  
    case "superadmin":
      return SuperAdminSidebar;
    default:
      return AdminSidebar;
  }
});

const windowWidth = ref(window.innerWidth);
const handleResize = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value >= 1024) {
    isSidebarOpen.value = true; 
  } else {
    isSidebarOpen.value = false; 
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <AdminHeader />

    <div class="flex flex-1 relative">
      <transition name="slide-right">
        <component
          :is="sidebarComponent"
          v-if="isSidebarOpen || windowWidth >= 1024"
          class="fixed lg:static top-0 right-0 z-40 h-full lg:h-auto lg:block transition-transform duration-300 ease-in-out"
          :class="[
            windowWidth < 1024
              ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full')
              : 'translate-x-0'
          ]"
        />
      </transition>
      
      <div
        v-if="isSidebarOpen && windowWidth < 1024"
        class="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
        @click="closeSidebar"
      ></div>

      <main class="flex-1 p-4 lg:ml-64 transition-all duration-300">
        <router-view />
      </main>
    </div>
  </div>
</template>


<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(-100%);
}
</style> -->

<template>
  
</template>
