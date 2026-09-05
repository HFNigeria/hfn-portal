<script setup>
// import hfn_logo from "@/assets/hfn-health.png";
import { useAuth } from "@/store/authStore";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();

const DARK_GREEN = "#004d33";
const ACTIVE_BG_COLOR = "#F2F9F3";
const hfn_logo =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769734458/Untitled_design_zuolwv.png";
const currentPath = ref(route.path);
const { user, isAuthenticated, logout, role } = useAuth();
const isMobileMenuOpen = ref(false);
const openDropdown = ref(null);

const handleLinkClick = (path) => {
  currentPath.value = path;
  isMobileMenuOpen.value = false;
  openDropdown.value = null;
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("refresh");
  localStorage.removeItem("role");
  localStorage.removeItem("user");

  logout();

  router.push("/");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const dashboardLink = computed(() => {
  if (!isAuthenticated.value) return "/signin";
  const userRole = role.value || "member";
  const roleMap = {
    superadmin: "/superadmin/dashboard",
    admin: "/admin/dashboard",
    editor: "/editor/dashboard",
    tutor: "/tutor/dashboard",
    learner: "/learner/dashboard",
    member: "/user/dashboard",
  };
  return roleMap[userRole.toLowerCase()] || "/dashboard";
});

const goToRegistration = () => {
  router.push("/register");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// const isLinkActive = (path) => {
//   return path === currentPath.value;
// };
const isLinkActive = (link) => {
  if (link.path !== "#" && link.path === currentPath.value) {
    return true;
  }

  if (link.hasDropdown && link.dropdownItems) {
    return link.dropdownItems.some((item) => item.path === currentPath.value);
  }

  return false;
};

const navLinks = [
  { title: "Home", path: "/", hasDropdown: false },
  {
    title: "About Us",
    path: "/about",
    hasDropdown: true,

    dropdownItems: [
      { title: "Governance", path: "/governance" },
      {
        title: "Health Guardian",
        path: "https://hfn-health-guardians.netlify.app/",
        external: true,
      },
    ],
  },
  {
    title: "News & Updates",
    path: "#",
    hasDropdown: true,
    dropdownItems: [
      // { title: "Programs & Initiatives", path: "/programs" },
      { title: "Latest News", path: "/news" },
      { title: "Newsletters", path: "/resources" },
      { title: "Events", path: "/events" },
      { title: "Gallery", path: "/gallery" },
      // { title: "2026 Annual Conference", path: "#" },
    ],
  },
  {
    title: "Membership",
    path: "#",
    hasDropdown: true,
    dropdownItems: [
      { title: "Member Area", path: "/membership" },
      { title: "Get Involved", path: "/get-involved" },
    ],
  },
  { title: "Contact Us", path: "/contact", hasDropdown: false },
];

watch(
  () => route.path,
  (newPath) => {
    currentPath.value = newPath;
  },
  { immediate: true }
);

const toggleDropdown = (title) => {
  openDropdown.value = openDropdown.value === title ? null : title;
};
</script>

<template>
  <header class="w-full bg-white font-sans shadow-md">
    <div
  :style="{ backgroundColor: '#004d33' }"
  class="text-white text-sm flex items-center justify-between px-4 sm:px-8 py-2 rounded-b-xl overflow-hidden"
>
  <div class="flex-1 overflow-hidden relative">
    <div class="marquee-content whitespace-nowrap flex items-center">
      <span class="mx-4 text-orange-400 font-bold"></span>
      <span class="font-medium"></span>
      
      
      <span class="mx-12 text-orange-400 font-bold"></span>
      <span class="font-medium"></span>
      
    </div>
  </div>

  <div class="relative group cursor-pointer ml-4">
    <div class="flex items-center px-3 py-1 rounded-full bg-green-900 bg-opacity-30 hover:bg-opacity-50 transition">
      English
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
        class="w-4 h-4 ml-1 transition-transform text-white"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
    <div class="absolute right-0 mt-2 w-32 bg-white text-gray-800 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
      <a href="#" class="block px-4 py-2 hover:bg-gray-100">Hausa</a>
      <a href="#" class="block px-4 py-2 hover:bg-gray-100">Igbo</a>
      <a href="#" class="block px-4 py-2 hover:bg-gray-100">Yoruba</a>
    </div>
  </div>
</div>

    <nav
      class="flex items-center justify-between p-4 lg:px-8 max-w-7xl mx-auto"
    >
      <div class="flex items-center flex-shrink-0">
        <RouterLink to="/" @click="handleLinkClick('/')" class="cursor-pointer">
          <img
            :src="hfn_logo"
            alt="HFN Logo"
            class="w-15 h-auto mr-3 flex-shrink-0"
          />
        </RouterLink>
      </div>

      <div class="hidden lg:flex items-center space-x-2 xl:space-x-4">
        <div v-for="link in navLinks" :key="link.title" class="relative group">
          <RouterLink
            :to="link.path"
            @click="handleLinkClick(link.path)"
            class="flex items-center px-4 py-3 font-semibold transition-all duration-200 rounded-lg whitespace-nowrap"
            :class="[
              isLinkActive(link.path)
                ? `bg-[${ACTIVE_BG_COLOR}] text-[${DARK_GREEN}] shadow-md`
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
            ]"
          >
            {{ link.title }}
            <svg
              v-if="link.hasDropdown"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              :class="[
                'w-4 h-4 ml-1 transition-transform',
                isLinkActive(link.path)
                  ? `text-[${DARK_GREEN}]`
                  : 'text-gray-500',
              ]"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </RouterLink>

          <div
            v-if="link.hasDropdown"
            class="absolute left-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20"
          >
            <template v-for="item in link.dropdownItems" :key="item.title">
              <a
                v-if="item.external"
                :href="item.path"
                target="_blank"
                rel="noopener noreferrer"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F2F9F3] hover:text-[#004d33]"
                @click="handleLinkClick(item.path)"
              >
                {{ item.title }}
              </a>
              <RouterLink
                v-else
                :to="item.path"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F2F9F3] hover:text-[#004d33]"
                @click="handleLinkClick(item.path)"
              >
                {{ item.title }}
              </RouterLink>
            </template>
          </div>
        </div>
      </div>

      <div class="hidden lg:flex items-center space-x-4">
        <div class="relative w-44">
          <input
            type="text"
            placeholder="Search"
            class="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition shadow-inner text-sm"
          />
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
            class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        <button
          v-if="!isAuthenticated"
          @click="goToRegistration"
          :style="{ backgroundColor: DARK_GREEN }"
          class="px-6 py-2 font-bold text-white rounded-xl shadow-lg hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02]"
        >
          Login/Signup
        </button>
        <div v-else class="relative group cursor-pointer">
          <div
            :style="{
              backgroundColor: ACTIVE_BG_COLOR,
              borderColor: DARK_GREEN,
            }"
            class="w-10 h-10 rounded-full flex items-center justify-center border-2 hover:border-green-600 transition"
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
              :style="{ color: DARK_GREEN }"
              class="w-6 h-6"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <div
            class="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden ring-1 ring-gray-200"
          >
            <div class="p-3 border-b bg-gray-50">
              <p class="font-semibold text-sm truncate">
                {{ user?.name || "User" }}
              </p>
              <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
            </div>
            <RouterLink
              :to="dashboardLink"
              class="block px-4 py-2 hover:bg-green-50 transition duration-150"
            >
              Dashboard
            </RouterLink>
            <button
              @click="handleLogout"
              class="w-full text-left block px-4 py-2 hover:bg-red-50 transition duration-150 text-red-600 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      <div class="flex lg:hidden items-center ml-auto">
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="p-2 text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <svg
            v-if="isMobileMenuOpen"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-6 h-6"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-6 h-6"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      </div>
    </nav>

    <div
      :class="[
        'fixed top-0 right-0 w-full h-full bg-white shadow-xl z-20 lg:hidden transform transition-transform duration-300 overflow-y-auto',
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
      ]"
    >
      <div
        :style="{ backgroundColor: DARK_GREEN }"
        class="flex justify-between items-center p-4 text-white"
      >
        <span class="text-xl font-bold">Navigation</span>
        <button
          @click="isMobileMenuOpen = false"
          class="p-2 rounded-full hover:bg-white hover:text-gray-900 transition"
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
            class="w-6 h-6"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
      
      <div class="flex flex-col p-4 space-y-2">
        <!-- <div v-for="link in navLinks" :key="link.title">
          <div
            v-if="!link.hasDropdown"
            class="flex items-center justify-between p-3 border-b border-gray-100 transition-colors cursor-pointer"
            :class="[
              isLinkActive(link.path)
                ? `bg-[${ACTIVE_BG_COLOR}] text-[${DARK_GREEN}]`
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
            ]"
          >
            <RouterLink
              :to="link.path"
              class="block w-full"
              @click="handleLinkClick(link.path)"
            >
              {{ link.title }}
            </RouterLink>
          </div>

          <div v-else>
            <div
              class="flex items-center justify-between p-3 border-b border-gray-100 transition-colors cursor-pointer"
              :class="[
                openDropdown === link.title
                  ? `bg-[${ACTIVE_BG_COLOR}] text-[${DARK_GREEN}]`
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
              ]"
              @click="toggleDropdown(link.title)"
            >
              <span>{{ link.title }}</span>
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
                :class="[
                  'w-4 h-4 ml-1 transition-transform duration-200 ease-in-out',
                  openDropdown === link.title
                    ? 'rotate-180 text-[#004d33]'
                    : 'text-gray-500',
                ]"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>

            <div
              v-if="openDropdown === link.title"
              class="pl-6 pr-4 pb-2 bg-gray-50 border-b border-gray-100 space-y-2"
            >
              <RouterLink
                v-for="item in link.dropdownItems"
                :key="item.title"
                :to="item.path"
                class="block py-2 text-sm text-gray-700 hover:text-[#004d33]"
                @click="handleLinkClick(item.path)"
              >
                {{ item.title }}
              </RouterLink>
            </div>
          </div>
        </div> -->
        <div v-for="link in navLinks" :key="link.title">
        
        <div v-if="!link.hasDropdown"
          class="flex items-center justify-between p-3 border-b border-gray-100 transition-colors cursor-pointer"
          :class="[isLinkActive(link) ? 'bg-[#F2F9F3] text-[#004d33]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50']">
          <RouterLink :to="link.path" class="block w-full" @click="handleLinkClick(link.path)">{{ link.title }}</RouterLink>
        </div>

        <div v-else class="border-b border-gray-100">
          <div class="flex items-center justify-between transition-colors"
            :class="[(isLinkActive(link) || openDropdown === link.title) ? 'bg-[#F2F9F3] text-[#004d33]' : 'text-gray-600']">
            
            <template v-if="link.path !== '#'">
              <RouterLink 
                :to="link.path" 
                class="flex-grow p-3 font-semibold" 
                @click="handleLinkClick(link.path)"
              >
                {{ link.title }}
              </RouterLink>
            </template>
            <template v-else>
              <button 
                class="flex-grow text-left p-3 font-semibold" 
                @click="toggleDropdown(link.title)"
              >
                {{ link.title }}
              </button>
            </template>

            <button 
              class="p-3 border-l border-gray-100/50" 
              @click="toggleDropdown(link.title)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="['w-5 h-5 transition-transform duration-200', openDropdown === link.title ? 'rotate-180 text-[#004d33]' : 'text-gray-400']">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>

          <div v-if="openDropdown === link.title" class="pl-6 pr-4 pb-2 bg-gray-50 space-y-2">
            <template v-for="item in link.dropdownItems" :key="item.title">
              <a
                v-if="item.external"
                :href="item.path"
                target="_blank"
                rel="noopener noreferrer"
                class="block py-3 text-sm text-gray-700 border-b border-gray-100 last:border-0 hover:text-[#004d33]"
                @click="handleLinkClick(item.path)"
              >
                {{ item.title }}
              </a>
              <RouterLink
                v-else
                :to="item.path"
                class="block py-3 text-sm text-gray-700 border-b border-gray-100 last:border-0 hover:text-[#004d33]"
                @click="handleLinkClick(item.path)"
              >
                {{ item.title }}
              </RouterLink>
            </template>
          </div>
        </div>
      </div>

        <div class="mt-4 pt-4 border-t border-gray-200 space-y-4">
          <div class="relative">
            <input
              type="text"
              placeholder="Search..."
              class="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
            />
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
              class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <RouterLink
            to="/register"
            @click="isMobileMenuOpen = false"
            :style="{ backgroundColor: DARK_GREEN }"
            class="block w-full text-center px-6 py-3 font-bold text-white rounded-lg shadow-lg hover:opacity-90 transition-all duration-200"
          >
            Login/Signup
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.marquee-content {
  display: inline-flex;
  animation: marquee 30s linear infinite;
  min-width: 100%;
}

.marquee-content:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.relative.overflow-hidden::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 50px;
  height: 100%;
  background: linear-gradient(to right, transparent, #004d33);
  pointer-events: none;
}
  
</style>
