<script setup>
import learningModule from "@/api/learningModule.js";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from 'vue-toastification';
import LearnerSidebar from "./LearnerSidebar.vue";

import user from "@/assets/user.png";
import user1 from "@/assets/user1.png";
import user2 from "@/assets/user2.png";

const router = useRouter();
const toast = useToast();
const showSidebar = ref(false);
const toggleSidebar = () => (showSidebar.value = !showSidebar.value);
const closeSidebar = () => (showSidebar.value = false);

const DARK_GREEN = "#004d33";
const LIGHT_GREEN = "#f2f9f3";
const ACCENT_GRAY = "#f9fafb";
const ACCENT_ORANGE = "#ff6600";
const LIGHT_PINKISH_GRAY = "#E87A1814";


const userName = ref("User");
const isLoading = ref(true);
const activeSidebarItem = ref("Dashboard");
const activeCourseTrack = ref("Care");
const searchQuery = ref("");


const categories = ref([]);
const courses = ref([]);
const filteredCourses = ref([]);
const latestCourses = ref([]);
const userEnrollments = ref([]);


const currentPage = ref(1);
const itemsPerPage = 6;
const totalPages = ref(1);

const courseTracks = ref([]);


const fetchUserProfile = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    userName.value = userData.full_name || userData.username || "User";
  } catch (error) {
    console.error('Error fetching user profile');
  }
};


const fetchCategories = async () => {
  try {
    const response = await learningModule.getCategories();
    if (response.data) {
      categories.value = Array.isArray(response.data) 
        ? response.data 
        : response.data.results || [];
      
      courseTracks.value = categories.value
        .filter(cat => cat.is_active !== false)
        .map(cat => cat.name)
        .slice(0, 6);
    }
  } catch (error) {
    console.error('Error fetching categories');
    toast.error('Failed to load course categories');
  }
};


const fetchCourses = async () => {
  try {
    const response = await learningModule.listCourses({
      status: 'published',
      ordering: '-enrollment_count'
    });
    
    if (response.data) {
      const allCourses = Array.isArray(response.data) 
        ? response.data 
        : response.data.results || [];
      
      courses.value = allCourses;
      filteredCourses.value = allCourses;
      
      latestCourses.value = allCourses.slice(0, 3);
      
      updatePagination();
    }
  } catch (error) {
    console.error('Error fetching courses');
    toast.error('Failed to load courses');
  }
};


const fetchUserEnrollments = async () => {
  try {
    const enrollmentResponse = await learningModule.getEnrollment();
    if (enrollmentResponse.data) {
      userEnrollments.value = Array.isArray(enrollmentResponse.data)
        ? enrollmentResponse.data
        : enrollmentResponse.data.results || [];
    }
  } catch (error) {
    console.error('Error fetching enrollments');
  }
};

const updatePagination = () => {
  totalPages.value = Math.ceil(filteredCourses.value.length / itemsPerPage);
};

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const filterCoursesByTrack = () => {
  if (!activeCourseTrack.value || activeCourseTrack.value === "All") {
    filteredCourses.value = courses.value;
  } else {
    const category = categories.value.find(cat => cat.name === activeCourseTrack.value);
    if (category) {
      filteredCourses.value = courses.value.filter(course => 
        course.category?.name === activeCourseTrack.value ||
        course.category?.id === category.id
      );
    } else {
      filteredCourses.value = courses.value;
    }
  }
  
  currentPage.value = 1;
  updatePagination();
};

const currentPageCourses = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredCourses.value.slice(startIndex, endIndex);
});

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    filteredCourses.value = courses.value;
  } else {
    const query = searchQuery.value.toLowerCase();
    filteredCourses.value = courses.value.filter(course => 
      course.title?.toLowerCase().includes(query) ||
      course.description?.toLowerCase().includes(query) ||
      course.short_description?.toLowerCase().includes(query) ||
      course.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  currentPage.value = 1;
  updatePagination();
};

const formatPrice = (course) => {
  if (course.is_free) return "Free";
  return `₦${course.price?.toLocaleString() || '0'}`;
};

const formatRating = (course) => {
  return course.rating_average?.toFixed(1) || '0.0';
};

const formatReviewCount = (course) => {
  return course.rating_count?.toLocaleString() || '0';
};

const goToCourseDetails = (courseId) => {
  router.push({ name: "CourseDetails", params: { id: courseId } });
};

const isUserEnrolled = (courseId) => {
  return userEnrollments.value.some(enrollment => enrollment.course?.id === courseId);
};


const handleCourseAction = async (item) => {
  const courseData = item.course ? item.course : item;
  const slug = courseData.slug;
  const courseId = courseData.id;

  if (!slug) {
    toast.error('Course identifier missing');
    return;
  }

  if (isUserEnrolled(courseId)) {
    router.push(`/learning/courses/${slug}`);
    return;
  }

  try {
    await learningModule.courseEnrollment(slug);
    
    toast.success(`Successfully enrolled in ${courseData.title || 'course'}`);
    
    await fetchUserEnrollments(); 
  } catch (error) {
    const serverMessage = error.response?.data?.error || error.response?.data?.message;
    console.error('Enrollment Failed:', serverMessage || error.message);
    toast.error(serverMessage || 'Server error during enrollment');
  }
};


const getActionButtonText = (course) => {
  return isUserEnrolled(course.id) ? 'Continue Course' : 'Take Course';
};

const getStarIcons = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push('full');
  }
  
  if (hasHalfStar) {
    stars.push('half');
  }
  
  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push('empty');
  }
  
  return stars;
};

const getIconPaths = (name) => {
  const icons = {
    dashboard:
      '<path d="M3 3v18h18"/><rect x="9" y="9" width="6" height="6" rx="1" /><path d="M12 3v18m0-12h12m0 6h-12M6 6h12m-6 0v18"/>',
    learning:
      '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    messages:
      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    account:
      '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    support:
      '<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 14v-4m0-4h.01"/>',
    logout:
      '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
    search:
      '<circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    "chevron-down": '<polyline points="6 9 12 15 18 9"/>',
    "star-fill":
      '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    "star-half":
      '<path d="M12 2v17.77l-5.18 2.81-1.64-7.03L2 9.74l7.19-.61L12 2z"/>',
    "star-empty":
      '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    next: '<polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>',
    prev: '<polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>',
  };
  return icons[name] || "";
};

const initializeData = async () => {
  try {
    isLoading.value = true;
    
    await Promise.all([
      fetchUserProfile(),
      fetchCategories(),
      fetchCourses(),
      fetchUserEnrollments()
    ]);
    
    if (courseTracks.value.length > 0) {
      activeCourseTrack.value = courseTracks.value[0];
      filterCoursesByTrack();
    }
    
  } catch (error) {
    console.error('Initialization error');
    toast.error('Failed to load dashboard data');
  } finally {
    isLoading.value = false;
  }
};

watch(() => activeCourseTrack.value, () => {
  filterCoursesByTrack();
});

onMounted(() => {
  initializeData();
});
</script>

<template>
  <div class="min-h-screen flex font-sans relative bg-white">
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
      class="fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:translate-x-0"
      :class="showSidebar ? 'translate-x-0' : '-translate-x-full'"
    >
      <LearnerSidebar @closeSidebar="closeSidebar" class="h-full" />
    </div>

    <div
      v-if="showSidebar"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 z-30 lg:hidden"
      @click="closeSidebar"
    ></div>

    <main
      class="flex-grow overflow-y-auto pb-12"
      :style="{ backgroundColor: 'white' }"
    >
        <div class="max-w-6xl mx-auto p-4 sm:p-8">
          <div v-if="isLoading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00cc66]"></div>
          </div>

          <div v-else>
            <div class="mb-10 pt-4">
              <h1 class="text-3xl font-bold" style="color: #e87a18">
                Welcome {{ userName }},
              </h1>
              <p class="text-xl font-medium text-gray-700 mt-1">
                Accelerate your career in as little as 3 months
              </p>
            </div>

            <div
              class="w-screen mb-12 py-16 shadow-inner relative left-1/2 right-1/2 -mx-[50vw]"
              :style="{ backgroundColor: LIGHT_PINKISH_GRAY }"
            >
              <div class="max-w-6xl mx-auto px-6">
                <h2
                  class="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-10"
                >
                  How HFN Learning hub works...
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div
                    class="bg-[#F2F9F3] rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition duration-300"
                  >
                    <img
                      :src="user"
                      alt="Profile Icon"
                      class="h-34 mx-auto mb-4"
                    />
                    <h3
                      class="text-lg font-bold mb-2"
                      :style="{ color: DARK_GREEN }"
                    >
                      Complete your Profile
                    </h3>
                    <p class="text-sm text-gray-600">
                      Tell us about your wellness interests and goals so we can
                      personalize your experience.
                    </p>
                  </div>

                  <div
                    class="bg-[#F2F9F3] rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition duration-300"
                  >
                    <img
                      :src="user1"
                      alt="Search Icon"
                      class="h-34 mx-auto mb-4"
                    />
                    <h3
                      class="text-lg font-bold mb-2"
                      :style="{ color: DARK_GREEN }"
                    >
                      Search for Courses
                    </h3>
                    <p class="text-sm text-gray-600">
                      Find health tips, natural living guides, and upcoming events
                      that align with your interests.
                    </p>
                  </div>

                  <div
                    class="bg-[#F2F9F3] rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition duration-300"
                  >
                    <img
                      :src="user2"
                      alt="Connect Icon"
                      class="h-34 mx-auto mb-4"
                    />
                    <h3
                      class="text-lg font-bold mb-2"
                      :style="{ color: DARK_GREEN }"
                    >
                      Make a Connection
                    </h3>
                    <p class="text-sm text-gray-600">
                      Join a growing community of health enthusiasts and
                      professionals sharing their experiences.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mb-8">
              <div class="relative max-w-2xl mx-auto">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input
                  v-model="searchQuery"
                  @input="handleSearch"
                  type="search"
                  placeholder="Search for courses, topics, or instructors..."
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#00cc66] focus:border-transparent"
                />
              </div>
            </div>

            <h2 class="text-2xl font-bold text-gray-800 text-center mb-6">
              Our Course Tracks
            </h2>

            <div
              class="flex flex-wrap justify-center gap-2 mb-8 bg-white p-2 rounded-xl shadow-md"
            >
              <button
                v-for="track in courseTracks"
                :key="track"
                @click="activeCourseTrack = track"
                :class="[
                  'px-5 py-2 rounded-lg font-medium transition duration-200 text-sm md:text-base',
                  track === activeCourseTrack
                    ? 'text-white shadow-inner'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100',
                ]"
                :style="
                  track === activeCourseTrack
                    ? { backgroundColor: DARK_GREEN }
                    : {}
                "
              >
                {{ track }}
              </button>
            </div>

            <div v-if="currentPageCourses.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div
                v-for="course in currentPageCourses"
                :key="course.id"
                class="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
              >
                <div class="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    v-if="course.thumbnail"
                    :src="course.thumbnail"
                    :alt="course.title"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#004d33] to-[#00cc66]">
                    <span class="text-white text-lg font-bold">{{ course.title?.charAt(0) || 'C' }}</span>
                  </div>
                  <div class="absolute top-2 right-2">
                    <span 
                      :class="[
                        'px-2 py-1 rounded text-xs font-semibold',
                        course.is_free ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      ]"
                    >
                      {{ formatPrice(course) }}
                    </span>
                  </div>
                  <div class="absolute bottom-2 left-2">
                    <span class="px-2 py-1 bg-black/70 text-white text-xs rounded">
                      {{ course.level || 'Beginner' }}
                    </span>
                  </div>
                </div>

                <div class="p-4">
                  <p class="text-xs text-gray-500 font-semibold uppercase mb-1">
                    {{ course.category?.name || 'Uncategorized' }}
                  </p>
                  <h3 
                    @click="goToCourseDetails(course.id)"
                    class="text-lg font-bold text-gray-800 mt-1 line-clamp-2 hover:text-[#004d33] cursor-pointer transition-colors"
                  >
                    {{ course.title }}
                  </h3>
                  <p class="text-sm text-gray-600 mb-2">By {{ course.instructor?.full_name || course.instructor?.username || 'HFN Team' }}</p>

                  <div class="flex items-center my-3">
                    <div class="flex items-center mr-2">
                      <svg
                        v-for="(star, index) in getStarIcons(course.rating_average || 0)"
                        :key="index"
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4 mr-1"
                        :class="{
                          'text-yellow-500': star === 'full',
                          'text-yellow-300': star === 'half',
                          'text-gray-300': star === 'empty'
                        }"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="none"
                        stroke-width="0"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        v-html="getIconPaths(star === 'full' ? 'star-fill' : star === 'half' ? 'star-half' : 'star-empty')"
                      ></svg>
                    </div>
                    <span class="text-sm text-gray-600">
                      {{ formatRating(course) }} ({{ formatReviewCount(course) }} reviews)
                    </span>
                  </div>

                  <p class="text-sm text-gray-500 line-clamp-3 mb-4">
                    {{ course.short_description || course.description || 'No description available' }}
                  </p>

                  <div class="flex justify-between text-xs text-gray-500 mb-4">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{{ course.duration_hours || 0 }}h</span>
                    </div>
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{{ course.enrollment_count?.toLocaleString() || 0 }} enrolled</span>
                    </div>
                  </div>

                  <button
                    @click="handleCourseAction(course)"
                    class="w-full py-2 rounded-lg font-semibold text-white transition duration-200 hover:opacity-90"
                    :style="{ backgroundColor: DARK_GREEN }"
                    :class="{
                      'bg-[#e87a18]': isUserEnrolled(course.id)
                    }"
                  >
                    {{ getActionButtonText(course) }}
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-12">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                No courses found
              </h3>
              <p class="text-gray-500">
                {{ searchQuery ? 'No courses match your search.' : 'No courses available in this category.' }}
              </p>
            </div>

            <div v-if="currentPageCourses.length > 0" class="flex justify-center items-center mt-10 space-x-4 text-gray-600">
              <button
                @click="goToPrevPage"
                :disabled="currentPage === 1"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                class="text-sm font-medium hover:text-gray-900 transition flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  v-html="getIconPaths('prev')"
                ></svg>
                Prev
              </button>
              <span class="text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
              <button
                @click="goToNextPage"
                :disabled="currentPage === totalPages"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                class="text-sm font-medium hover:text-gray-900 transition flex items-center"
              >
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 ml-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  v-html="getIconPaths('next')"
                ></svg>
              </button>
            </div>

            <div v-if="latestCourses.length > 0">
              <h2 class="text-2xl font-bold text-gray-800 mt-12 mb-6">
                Latest Courses
              </h2>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  v-for="course in latestCourses"
                  :key="'latest-' + course.id"
                  class="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
                >
                  <div class="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      v-if="course.thumbnail"
                      :src="course.thumbnail"
                      :alt="course.title"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#004d33] to-[#00cc66]">
                      <span class="text-white text-lg font-bold">{{ course.title?.charAt(0) || 'C' }}</span>
                    </div>
                    <div class="absolute top-2 right-2">
                      <span 
                        :class="[
                          'px-2 py-1 rounded text-xs font-semibold',
                          course.is_free ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        ]"
                      >
                        {{ formatPrice(course) }}
                      </span>
                    </div>
                    <div class="absolute bottom-2 left-2">
                      <span class="px-2 py-1 bg-black/70 text-white text-xs rounded">
                        NEW
                      </span>
                    </div>
                  </div>

                  <div class="p-4">
                    <h3 
                      @click="goToCourseDetails(course.id)"
                      class="text-lg font-bold text-gray-800 mt-1 line-clamp-2 hover:text-[#004d33] cursor-pointer transition-colors"
                    >
                      {{ course.title }}
                    </h3>
                    <p class="text-sm text-gray-600 mb-2">By {{ course.instructor?.full_name || course.instructor?.username || 'HFN Team' }}</p>

                    <p class="text-sm text-gray-500 line-clamp-3 mb-4">
                      {{ course.short_description || course.description || 'No description available' }}
                    </p>

                    <button
                      @click="handleCourseAction(course)"
                      class="w-full py-2 rounded-lg font-semibold text-white transition duration-200 hover:opacity-90"
                      :style="{ backgroundColor: DARK_GREEN }"
                    >
                      {{ getActionButtonText(course) }}
                    </button>
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
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>