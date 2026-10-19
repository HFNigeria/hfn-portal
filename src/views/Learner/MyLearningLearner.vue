<script setup>
import learningModule from "@/api/learningModule.js";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import LearnerSidebar from "./LearnerSidebar.vue";

const router = useRouter();
const toast = useToast();
const showSidebar = ref(false);
const toggleSidebar = () => (showSidebar.value = !showSidebar.value);
const closeSidebar = () => (showSidebar.value = false);

const DARK_GREEN = "#004d33";
const LIGHT_GREEN = "#f2f9f3";
const reviewedCourses = ref(new Set());
const isLoading = ref(true);
const userEnrollments = ref([]);
const activeCourses = ref([]);
const completedCourses = ref([]);
const certificate = ref(null);
const selectedEnrollmentForCert = ref(null);
const activePage = ref(1);
const activePerPage = 5;
const completedPage = ref(1);
const completedPerPage = 3;
const showReviewDialog = ref(false);
const selectedEnrollment = ref(null);

const reviewForm = ref({
  rating: 0,
  review_text: "",
});

  const goToCertificate = (enrollment) => {
  const slug = enrollment.course?.slug;

  if (!slug) {
    toast.error("Course not found");
    return;
  }

  router.push(`/learning/courses/${slug}?tab=certificate`);
};

const fetchUserEnrollments = async () => {
  try {
    isLoading.value = true;

    const response = await learningModule.getEnrollment({
      expand: "course",
      ordering: "-last_accessed",
    });

    if (response.data) {
      userEnrollments.value = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      
      userEnrollments.value = userEnrollments.value.map((e) => ({
        ...e,
        course: {
          id: e.course,
          title: e.course_title,
          slug: e.course_slug,
        },
      }));

      activeCourses.value = userEnrollments.value.filter(
        (e) => e.status === "active" && Number(e.progress_percentage) < 100
      );

      completedCourses.value = userEnrollments.value.filter(
        (e) => e.status === "completed" || Number(e.progress_percentage) === 100
      );
    }
  } catch (error) {
    console.error("Error fetching enrollments");
    toast.error("Failed to load your learning progress");
  } finally {
    isLoading.value = false;
  }
};

const totalActivePages = computed(() =>
  Math.ceil(activeCourses.value.length / activePerPage)
);

const paginatedActiveCourses = computed(() => {
  const start = (activePage.value - 1) * activePerPage;
  const end = start + activePerPage;
  return activeCourses.value.slice(start, end);
});

const totalCompletedPages = computed(() =>
  Math.ceil(completedCourses.value.length / completedPerPage)
);

const paginatedCompletedCourses = computed(() => {
  const start = (completedPage.value - 1) * completedPerPage;
  const end = start + completedPerPage;
  return completedCourses.value.slice(start, end);
});

const goToActivePage = (page) => {
  if (page >= 1 && page <= totalActivePages.value) {
    activePage.value = page;
  }
};

const goToCompletedPage = (page) => {
  if (page >= 1 && page <= totalCompletedPages.value) {
    completedPage.value = page;
  }
};

const continueLearning = (enrollment) => {
  const slug = enrollment.course?.slug;

  if (!slug) {
    toast.error("Course slug missing");
    return;
  }

  router.push(`/learner/courses/${slug}`);
};


  const fetchUserReviews = async () => {
  try {
    const res = await learningModule.reviewCourse(); 

    const reviews = Array.isArray(res.data)
      ? res.data
      : res.data?.results || [];

    reviewedCourses.value = new Set(
      reviews.map((r) => r.course)
    );

  } catch (err) {
    console.error("Failed to fetch reviews", err);
  }
};

const reviewCourse = (enrollment) => {
  selectedEnrollment.value = enrollment;
  reviewForm.value = {
    rating: 0,
    review_text: "",
  };
  showReviewDialog.value = true;
};

const submitReview = async () => {
  try {
    if (!reviewForm.value.rating) {
      toast.error("Please select a rating");
      return;
    }

    await learningModule.createReview({
      course: selectedEnrollment.value.course.id,
      rating: reviewForm.value.rating,
      review_text: reviewForm.value.review_text,
    });

    
    reviewedCourses.value.add(selectedEnrollment.value.course.id);
    selectedEnrollment.value.has_reviewed = true;

    toast.success("Review submitted successfully");

    showReviewDialog.value = false;
  } catch (error) {
    console.error(error);
    toast.error("Failed to submit review");
  }
};

const fetchCertificate = async (enrollment) => {
  if (!enrollment?.id) return;
  selectedEnrollmentForCert.value = enrollment;
  try {
    const res = await learningModule.generateCertificate({
      enrollment_id: enrollment.id,
    });
    certificate.value = res.data || res;
  } catch (err) {
    console.error("Certificate fetch/generate failed", err);
    toast.error("Failed to fetch certificate");
  }
};
  
const formatProgress = (progress) => {
  return Math.round(progress || 0);
};

onMounted(() => {
  fetchUserEnrollments();
  fetchUserReviews();
});
</script>

<template>
  <div class="flex min-h-screen font-sans relative bg-gray-50">
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

    <main class="flex-1 p-4 md:p-8 lg:p-12 overflow-auto">
      <div class="flex justify-center w-full items-center mb-8">
        <div class="w-full">
          <div class="mb-16 w-full">
            <div
              class="w-full px-4 py-4 sm:px-6 rounded-2xl border-2 border-green-100 bg-white shadow-md text-center"
            >
              <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">
                My Learning
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00cc66]"
        ></div>
      </div>

      <div v-else-if="userEnrollments.length === 0" class="text-center py-12">
        <svg
          class="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          No courses enrolled yet
        </h3>
        <p class="text-gray-500 mb-4">
          Start your learning journey by enrolling in courses.
        </p>
        <button
          @click="router.push('/learner/courses')"
          class="inline-flex items-center px-4 py-2 bg-[#006633] text-white rounded-lg hover:bg-[#00994d] transition-colors"
        >
          Browse Courses
        </button>
      </div>

      <div v-else-if="activeCourses.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Active Courses</h2>

        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl"
        >
          <div
            v-for="enrollment in paginatedActiveCourses"
            :key="enrollment.id"
            class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 hover:shadow-xl"
          >
            <div class="relative w-full h-36 bg-gray-100">
              <img
                v-if="enrollment.course.thumbnail"
                :src="enrollment.course.thumbnail"
                :alt="enrollment.course.title"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#004d33] to-[#00cc66]"
              >
                <span class="text-white text-lg font-bold">{{
                  enrollment.course.title?.charAt(0) || "C"
                }}</span>
              </div>
              <div
                class="absolute bottom-0 left-4 transform translate-y-1/2 p-1 bg-white rounded-full shadow-lg"
              >
                <div
                  class="w-10 h-10 rounded-full bg-gradient-to-br from-[#004d33] to-[#00cc66] flex items-center justify-center"
                >
                  <span class="text-white text-sm font-bold">
                    {{
                      enrollment.course.instructor?.full_name?.charAt(0) || "I"
                    }}
                  </span>
                </div>
              </div>
            </div>

            <div class="p-4 pt-8 flex flex-col flex-grow">
              <p class="text-xs text-gray-500 font-medium">
                {{ enrollment.course.instructor?.full_name || "Instructor" }}
              </p>
              <p class="text-xs text-gray-500 mb-2">
                {{ enrollment.course.instructor?.title || "" }}
              </p>
              <h3 class="text-lg font-bold text-gray-800 mb-4">
                {{ enrollment.course?.title }}
              </h3>

              <div class="mb-4">
                <div class="h-1 bg-gray-200 rounded-full mb-1">
                  <div
                    class="h-1 rounded-full"
                    :style="{
                      width:
                        formatProgress(enrollment.progress_percentage) + '%',
                      backgroundColor: DARK_GREEN,
                    }"
                  ></div>
                </div>
                <p class="text-xs text-gray-500">
                  {{ enrollment.completed_lessons || 0 }} of
                  {{ enrollment.course.total_lessons || 0 }} lessons |
                  {{ formatProgress(enrollment.progress_percentage) }}% complete
                </p>
              </div>

              <button
                @click="continueLearning(enrollment)"
                class="mt-auto py-2 rounded-lg font-semibold text-white transition duration-200 hover:opacity-90"
                :style="{ backgroundColor: DARK_GREEN }"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="totalActivePages > 1"
          class="flex justify-center items-center mt-8 space-x-4"
        >
          <button
            @click="goToActivePage(activePage - 1)"
            :disabled="activePage === 1"
            class="text-gray-500 disabled:opacity-50 hover:text-gray-700 p-2 rounded-full transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 transform rotate-180"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          <span class="text-sm text-gray-600">
            Page {{ activePage }} of {{ totalActivePages }}
          </span>
          <button
            @click="goToActivePage(activePage + 1)"
            :disabled="activePage === totalActivePages"
            class="text-gray-500 disabled:opacity-50 hover:text-gray-700 p-2 rounded-full transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <div v-if="completedCourses.length > 0">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Completed Courses</h2>

        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl"
        >
          <div
            v-for="enrollment in paginatedCompletedCourses"
            :key="enrollment.id"
            class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 hover:shadow-xl"
          >
            <div class="relative w-full h-36 bg-gray-100">
              <img
                v-if="enrollment.course?.thumbnail"
                :src="enrollment.course.thumbnail"
                :alt="enrollment.course.title"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#004d33] to-[#00cc66]"
              >
                <span class="text-white text-lg font-bold">{{
                  enrollment.course.title?.charAt(0) || "C"
                }}</span>
              </div>
              <div
                class="absolute bottom-0 left-4 transform translate-y-1/2 p-1 bg-white rounded-full shadow-lg"
              >
                <div
                  class="w-10 h-10 rounded-full bg-gradient-to-br from-[#004d33] to-[#00cc66] flex items-center justify-center"
                >
                  <span class="text-white text-sm font-bold">
                    {{
                      enrollment.course.instructor?.full_name?.charAt(0) || "I"
                    }}
                  </span>
                </div>
              </div>
              <div
                class="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold"
              >
                Completed
              </div>
            </div>

            <div class="p-4 pt-8 flex flex-col flex-grow">
              <p class="text-xs text-gray-500 font-medium">
                {{ enrollment.course.instructor?.full_name || "Instructor" }}
              </p>
              <p class="text-xs text-gray-500 mb-2">
                {{ enrollment.course.instructor?.title || "" }}
              </p>
              <h3 class="text-lg font-bold text-gray-800 mb-4">
                {{ enrollment.course?.title }}
              </h3>

              <p class="text-sm text-gray-600 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :style="{ color: DARK_GREEN }"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Completed on
                {{
                  enrollment.completed_at
                    ? new Date(enrollment.completed_at).toLocaleDateString()
                    : "—"
                }}
              </p>

              
<button
  v-if="!enrollment.has_reviewed"
  @click="reviewCourse(enrollment)"
  class="mt-auto py-2 rounded-lg font-semibold transition duration-200"
  :style="{
    backgroundColor: LIGHT_GREEN,
    color: DARK_GREEN,
    border: '1px solid #004d33',
  }"
>
  Review Course
</button>


<button
  v-else
  @click="goToCertificate(enrollment)"
  class="mt-auto py-2 rounded-lg font-semibold text-white"
  :style="{ backgroundColor: DARK_GREEN }"
>
  Get Certificate
</button>
            </div>
          </div>
        </div>

        <div
          v-if="totalCompletedPages > 1"
          class="flex justify-center items-center mt-8 space-x-4"
        >
          <button
            @click="goToCompletedPage(completedPage - 1)"
            :disabled="completedPage === 1"
            class="text-gray-500 disabled:opacity-50 hover:text-gray-700 p-2 rounded-full transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 transform rotate-180"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          <span class="text-sm text-gray-600">
            Page {{ completedPage }} of {{ totalCompletedPages }}
          </span>
          <button
            @click="goToCompletedPage(completedPage + 1)"
            :disabled="completedPage === totalCompletedPages"
            class="text-gray-500 disabled:opacity-50 hover:text-gray-700 p-2 rounded-full transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </main>
  </div>
  <div
    v-if="showReviewDialog"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
      <h3 class="text-lg font-bold mb-4">Review Course</h3>

      
      <div class="flex space-x-2 mb-4">
        <svg
          v-for="star in 5"
          :key="star"
          @click="reviewForm.rating = star"
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8 cursor-pointer"
          :class="
            star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
          "
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 .587l3.668 7.431L24 9.587l-6 5.848L19.335 24 12 20.202 4.665 24 6 15.435 0 9.587l8.332-1.569z"
          />
        </svg>
      </div>

      
      <textarea
        v-model="reviewForm.review_text"
        placeholder="Write your review..."
        class="w-full border rounded-lg p-3 mb-4"
        rows="4"
      ></textarea>

      
      <div class="flex justify-end space-x-3">
        <button
          @click="showReviewDialog = false"
          class="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          @click="submitReview"
          class="px-4 py-2 bg-[#004d33] text-white rounded-lg"
        >
          Submit Review
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
