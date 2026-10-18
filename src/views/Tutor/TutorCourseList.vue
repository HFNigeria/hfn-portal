<script setup>
import courseApi from '@/api/learningModule.js';
import DashboardLoader from '@/components/layout/DashboardLoader.vue';
import TutorSidebar from '@/views/Tutor/TutorSidebar.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import ConfirmModal from '@/components/layout/ConfirmModal.vue';
import {
    ChevronLeft,
    ChevronRight,
    Edit2,
    Eye,
    MoreVertical,
    Plus,
    Search,
    Trash2,
} from 'lucide-vue-next';

const courseTabs = ref(['Published', 'Drafts', 'Archived', 'Approvals']);
const currentTab = ref('Published');
const router = useRouter();
const courses = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const isConfirmModalOpen = ref(false);
const actionLoading = ref(null); 
let courseToDelete = null; 

const tabStatusMap = {
  Published: 'published',
  Drafts: 'draft',
  Archived: 'archived',
  Approvals: 'draft',
};

const fetchCourses = async () => {
  loading.value = true;

  try {
    const status = tabStatusMap[currentTab.value];

    const response = await courseApi.getAllCourses({
      status,
      search: searchQuery.value,
      page: currentPage.value,
    });

    courses.value = response.results || response.data || response || [];
  } finally {
    loading.value = false;
  }
};

const activeCourses = computed(() => {
  if (!searchQuery.value) return courses.value;

  return courses.value.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const isApprovalTab = computed(() => currentTab.value === 'Approvals');

const handleAction = async (action, course) => {
  switch (action) {
    case 'View':
      router.push(`/tutor/courses/${course.slug}/view`);
      break;

    case 'Edit':
      router.push(`/tutor/courses/${course.slug}/edit`);
      break;

    case 'Delete':
      courseToDelete = course;
  isConfirmModalOpen.value = true;
      break;

    case 'Approve':
  try {
    actionLoading.value = course.id;

    await courseApi.publishCourse(course.slug);

    console.log(`Course "${course.title}" published successfully`);

    fetchCourses();
  } catch (err) {
    console.error(err);
    console.log('Failed to publish course');
  } finally {
    actionLoading.value = null;
  }
  break;
  
  }
};


const confirmDelete = async () => {
  if (!courseToDelete) return;

  try {
    await courseApi.deleteCourse(courseToDelete.slug);
    fetchCourses(); 
    courseToDelete = null;
    isConfirmModalOpen.value = false;
  } catch (err) {
    console.error(err);
    isConfirmModalOpen.value = false;
    courseToDelete = null;
    console.log('Failed to delete course');
  }
};


const currentPage = ref(1);
const totalPages = 2;

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages) {
    currentPage.value = page;
  }
};

watch(searchQuery, fetchCourses);
watch(currentTab, () => {
  currentPage.value = 1;
  fetchCourses();
});

onMounted(fetchCourses);

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
      <TutorSidebar @closeSidebar="closeSidebar" class="h-full" />
    </div>

    <div
      v-if="showSidebar"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 z-30 lg:hidden"
      @click="closeSidebar"
    ></div>

    <main class="flex-1 p-8 overflow-auto bg-white">
      <DashboardLoader v-if="loading" message="Loading courses..." />
      <template v-else>
        <div class="text-sm text-gray-500 mb-6 pt-10 lg:pt-0">
          <span class="text-[#006633]">Home</span> > My Courses
        </div>

      <div class="text-center mb-8">
        <h1
          class="text-3xl font-bold text-gray-800 mb-6 border-b border-[#006633]/30 inline-block pb-3"
        >
          My Courses
        </h1>

        <div class="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
          <div class="flex flex-wrap justify-center border-b border-gray-200 gap-2">
            <button
              v-for="tab in courseTabs"
              :key="tab"
              @click="currentTab = tab"
              class="py-2 px-4 text-lg font-medium transition-colors whitespace-nowrap"
              :class="{
                'text-[#006633] border-b-2 border-[#00cc66]':
                  currentTab === tab,
                'text-gray-500 hover:text-[#00994d]': currentTab !== tab,
              }"
            >
              {{ tab }}
            </button>
          </div>

          <router-link
            to="/tutor/create-course"
            class="flex items-center px-4 py-2 bg-[#006633] text-white rounded-lg shadow-md hover:bg-[#00994d] transition-colors font-medium whitespace-nowrap"
          >
            <Plus class="w-5 h-5 mr-2" />
            Create New Course
          </router-link>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div class="flex justify-end mb-6">
          <div class="relative w-full max-w-sm">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00cc66] focus:border-[#00cc66] transition-colors"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr
              class="bg-[#f0fff0] text-gray-700 uppercase text-sm leading-normal border-b border-[#00cc66]/50"
            >
              <th class="py-3 px-3 text-left w-12 rounded-tl-lg">
                <input
                  type="checkbox"
                  class="h-4 w-4 text-[#00cc66] border-gray-300 rounded focus:ring-[#00cc66]"
                />
              </th>

              <th class="py-3 px-3 text-left flex items-center">
                Course Title
                <MoreVertical
                  class="w-4 h-4 ml-1 text-gray-500 cursor-pointer"
                />
              </th>

              <template v-if="isApprovalTab">
                <th class="py-3 px-3 text-left">Created By</th>
                <th class="py-3 px-3 text-left">Creation Date</th>
                <th class="py-3 px-3 text-center rounded-tr-lg">Action</th>
              </template>

              <template v-else>
                <th class="py-3 px-3 text-left">
                  Enrollments
                  <MoreVertical
                    class="w-4 h-4 ml-1 text-gray-500 cursor-pointer"
                  />
                </th>
                <th class="py-3 px-3 text-left">
                  Completion Rate
                  <MoreVertical
                    class="w-4 h-4 ml-1 text-gray-500 cursor-pointer"
                  />
                </th>
                <th class="py-3 px-3 text-left">
                  Last Update
                  <MoreVertical
                    class="w-4 h-4 ml-1 text-gray-500 cursor-pointer"
                  />
                </th>
              </template>

              <th class="py-3 px-3 text-center rounded-tr-lg">Action</th>
            </tr>
          </thead>

          <tbody
            class="text-gray-600 text-sm font-light divide-y divide-gray-100"
          >
            <tr
              v-for="course in activeCourses"
              :key="course.id"
              class="hover:bg-[#f9fff9] transition-colors"
            >
              <td class="py-3 px-3">
                <input type="checkbox" class="h-4 w-4 text-[#00cc66]" />
              </td>

              <td class="py-3 px-3 font-medium text-[#006633]">
                {{ course.title }}
              </td>

              <template v-if="isApprovalTab">
                <td class="py-3 px-3">
                  {{ course.created_by?.name }}
                </td>
                <td class="py-3 px-3">
                  {{ course.created_at }}
                </td>
                <td class="py-3 px-3">
                  <button
                    @click="handleAction('Approve', course)"
                    :disabled="actionLoading === course.id"
                    class="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center min-w-[80px]"
                  >
                    <svg v-if="actionLoading === course.id" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{{ actionLoading === course.id ? 'Loading...' : 'Approve' }}</span>
                  </button>
                </td>
              </template>

              <template v-else>
                <td class="py-3 px-3">
                  {{ course.enrollment_count ?? '-' }}
                </td>
                <td class="py-3 px-3">
                  <span
                    :class="{
                      'text-green-600 font-semibold':
                        course.completion?.includes('100'),
                      'text-orange-500':
                        parseFloat(course.completion) < 50 &&
                        course.completion !== '-',
                    }"
                  >
                    {{ course.completion_rate ?? '-' }}
                  </span>
                </td>
                <td class="py-3 px-3">
                  {{ course.updated_at }}
                </td>
              </template>

              <td class="py-3 px-3 text-center">
                <div class="flex item-center justify-center space-x-2">
                  <button
                    @click="handleAction('View', course)"
                    class="w-6 h-6 hover:text-blue-500"
                  >
                    <Eye class="w-full h-full" />
                  </button>
                  <button
                    @click="handleAction('Edit', course)"
                    class="w-6 h-6 hover:text-green-500"
                  >
                    <Edit2 class="w-full h-full" />
                  </button>
                  <button
                    @click="handleAction('Delete', course)"
                    class="w-6 h-6 hover:text-red-500"
                  >
                    <Trash2 class="w-full h-full" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>

        <div class="flex justify-end items-center mt-6 text-sm text-gray-600">
          <span class="mr-4">Page {{ currentPage }} of {{ totalPages }}</span>
          <div class="flex space-x-2">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              class="p-2 border rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              :class="{
                'opacity-50 cursor-not-allowed': currentPage === totalPages,
              }"
              class="p-2 border rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
  v-if="isConfirmModalOpen"
  title="Delete Course"
  message="Are you sure you want to delete this course?"
  @confirm="confirmDelete"
@cancel="() => { isConfirmModalOpen = false; courseToDelete = null; }"
        />
      </template>
    </main>
  </div>
</template>

<style scoped></style>
