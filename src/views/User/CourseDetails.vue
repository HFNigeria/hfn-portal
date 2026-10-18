<script setup>
import learningModule from "@/api/learningModule";
import courses from "@/assets/courses.jpg";
import student from "@/assets/student.jpg";

import UserSidebar from "@/components/layout/UserSidebar.vue";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
  
const DARK_GREEN = "#004d33";
const LIGHT_GREEN = "#f2f9f3";
const toast = useToast();
const activeTab = ref("courseInfo");
const activeModule = ref(null);
const showSidebar = ref(false);

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

const closeSidebar = () => {
  showSidebar.value = false;
};

const route = useRoute();
const enrollment = ref(null);
const courseParam = route.params.slug;

const loading = ref(true);
const certificate = ref(null);
const hasReviewed = ref(false);
const course = ref(null);
const modules = ref([]);
const instructor = ref(null);
const similarCourses = ref([]);
const completedLessons = ref(new Set());
const enrolling = ref(false);

const enrollCourse = async () => {
  if (!course.value?.slug) return;

  if (enrollment.value) {
    activeTab.value = "courseInfo";
    return;
  }

  try {
    enrolling.value = true;

    await learningModule.courseEnrollment(course.value.slug);

    await fetchEnrollment();

    toast.success("Successfully enrolled!");

  } catch (error) {
    console.error("Enrollment failed");
    toast.error("Failed to enroll. Please try again.");
  } finally {
    enrolling.value = false;
  }
};
  
const toggleModule = (moduleId) => {
  activeModule.value = activeModule.value === moduleId ? null : moduleId;
};

const isLessonCompleted = (lessonId) => {
  return completedLessons.value?.has(lessonId) || false;
};
  
const completeLesson = async (lessonId) => {
  try {
    await learningModule.completeLessonMark(lessonId);
    completedLessons.value.add(lessonId);

    await fetchEnrollment();

  } catch (error) {
    console.error("Lesson completion failed");
  }
};
 
const fetchEnrollment = async () => {
  if (!course.value?.id) return;

  try {
    const res = await learningModule.getEnrollment();
    const data = Array.isArray(res.data) ? res.data : res.data.results || [];

    const match = data.find((e) => {
      return (
        e.course === course.value.id ||       
        e.course?.id === course.value.id      
      );
    });

    if (match) {
      enrollment.value = match;

      if (match.certificate) {
        certificate.value = match.certificate;
      }

      if (match.completed_lessons) {
        completedLessons.value = new Set(
          match.completed_lessons.map(l => l.id || l)
        );
      }
    }
  } catch (err) {
    console.error("Error fetching enrollment:", err);
  }
};  
const fetchCourse = async () => {
  try {
    loading.value = true;

    const res = await learningModule.getCoursesDetails(courseParam);

    const payload = res.data;

    course.value = payload.course || payload;
    modules.value = payload.modules || [];
    instructor.value = payload.instructor || null;
    similarCourses.value = payload.similar_courses || [];
  } catch (err) {
    console.error("Failed to load course", err);
  } finally {
    loading.value = false;
  }
};

 const isCompleted = computed(() => {
  return (
    enrollment.value &&
    (enrollment.value.status === "completed" ||
      Number(enrollment.value.progress_percentage) === 100)
  );
}); 

const fetchCertificate = async () => {
  try {
    if (!enrollment.value?.id) return;
    const res = await learningModule.generateCertificate({
      enrollment_id: enrollment.value.id,
    });
    certificate.value = res.data; 
  } catch (err) {
    console.error("Certificate fetch failed", err);
  }
};
  


  onMounted(async () => {
  await fetchCourse();
  await fetchEnrollment();

   if (route.query.tab === 'certificate') {
    activeTab.value = 'certificate';
  } 
});
</script>

<template>
  <div class="relative flex min-h-screen bg-gray-50">
    <button
      @click="toggleSidebar"
      class="lg:hidden fixed top-20 right-4 z-50 bg-[#004d33] text-white p-2 rounded-md shadow-md"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <div
      v-if="showSidebar"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 z-30 lg:hidden"
      @click="closeSidebar"
    ></div>

    <div
      :class="[
        'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 w-72 max-w-full lg:static lg:translate-x-0 lg:w-64 lg:min-h-screen',
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <UserSidebar @closeSidebar="closeSidebar" />
    </div>

    <main class="flex-1 p-4 md:p-8 lg:p-12">
        <div class="mb-8">
          <p class="text-sm text-gray-500 mb-1">
            Home > Course: {{ course?.title }}
          </p>
          <h1 class="text-4xl font-semibold text-gray-800">
            {{ course?.title }}
          </h1>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div class="lg:col-span-2 space-y-8">
            <div
              class="relative bg-black rounded-xl overflow-hidden shadow-lg aspect-video"
            >
              <img
                :src="courses"
                alt="Course Video"
                class="w-full h-full object-cover opacity-50"
              />
              <div
                class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
              >
                <p class="text-white text-xl md:text-2xl font-bold mb-4">
                  Subscribe to continue join the class
                </p>
                <p class="text-gray-200 text-sm mb-6">
                  Become a member of HFN and get exclusive discounts on all
                  courses.
                </p>
                <button
  @click="enrollCourse"
  :disabled="enrolling"
  class="py-3 px-8 rounded-full font-bold text-white transition duration-200 hover:scale-105 shadow-lg disabled:opacity-50"
  :style="{ backgroundColor: DARK_GREEN }"
>
  {{ enrollment ? "Continue Course" : "Join Now" }}
</button>
              </div>
              <div
                class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-sm"
              >
                <div class="flex items-center space-x-2">
                  <button
                    class="p-1 rounded-full bg-gray-700/50 hover:bg-gray-700"
                  >
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
                    >
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </button>
                  <span>Course Info</span>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    class="p-1 rounded-full bg-gray-700/50 hover:bg-gray-700"
                  >
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
                    >
                      <rect
                        width="20"
                        height="14"
                        x="2"
                        y="7"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M16 21V7"></path>
                      <path d="M8 7v14"></path>
                      <path d="M12 7v14"></path>
                    </svg>
                  </button>
                  <button
                    class="p-1 rounded-full bg-gray-700/50 hover:bg-gray-700"
                  >
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
                    >
                      <path d="M12 5v14"></path>
                      <path d="M5 12h14"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="border-b border-gray-200 mb-6">
              <div class="flex text-lg font-medium">
                <button
                  @click="activeTab = 'courseInfo'"
                  :class="[
                    activeTab === 'courseInfo'
                      ? 'font-bold'
                      : 'text-gray-500 hover:text-gray-900',
                    'py-2 px-4 transition border-b-2',
                  ]"
                  :style="{
                    borderColor:
                      activeTab === 'courseInfo' ? DARK_GREEN : 'transparent',
                    color: activeTab === 'courseInfo' ? DARK_GREEN : '',
                  }"
                >
                  Course Info
                </button>
                <button
                  @click="activeTab = 'resources'"
                  :class="[
                    activeTab === 'resources'
                      ? 'font-bold'
                      : 'text-gray-500 hover:text-gray-900',
                    'py-2 px-4 transition border-b-2',
                  ]"
                  :style="{
                    borderColor:
                      activeTab === 'resources' ? DARK_GREEN : 'transparent',
                    color: activeTab === 'resources' ? DARK_GREEN : '',
                  }"
                >
                  Resources
                </button>
                <button
                  @click="activeTab = 'certificate'"
                  :class="[
                    activeTab === 'certificate'
                      ? 'font-bold'
                      : 'text-gray-500 hover:text-gray-900',
                    'py-2 px-4 transition border-b-2',
                  ]"
                  :style="{
                    borderColor:
                      activeTab === 'certificate' ? DARK_GREEN : 'transparent',
                    color: activeTab === 'certificate' ? DARK_GREEN : '',
                  }"
                >
                  Certificate
                </button>
              </div>
            </div>

            <div v-if="activeTab === 'courseInfo'" class="space-y-8">
              <div>
                <h3 class="text-xl font-bold text-gray-800 mb-4">
                  Course Description
                </h3>
                <p class="text-gray-700 leading-relaxed">
                  {{ course?.description }}
                </p>
              </div>

              <div>
                <h3 class="text-xl font-bold text-gray-800 mb-4">
                  Course Content
                </h3>
                <div v-if="modules.length === 0" class="text-gray-500 p-4">
                  No modules available for this course yet.
                </div>

                <div class="bg-white rounded-xl shadow-md overflow-hidden">
                  <div
                    v-for="module in modules"
                    :key="module.id"
                    class="border-b border-gray-200 last:border-b-0"
                  >
                    <button
                      @click="toggleModule(module.id)"
                      class="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                      <span>{{ module.title }}</span>
                      <svg
                        :class="{ 'rotate-180': activeModule === module.id }"
                        class="w-5 h-5 text-gray-500 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>
                    <div
                      v-if="activeModule === module.id"
                      class="px-6 py-4 bg-gray-50 space-y-2"
                    >
                      <div
  v-for="(lesson, idx) in module.lessons"
  :key="lesson.id"
  class="bg-white border rounded-lg p-4 space-y-3"
>
  <div class="flex justify-between items-center text-sm text-gray-700">
    <span class="font-semibold">
      Lesson {{ idx + 1 }}: {{ lesson.title }}
    </span>

    <button
      @click="completeLesson(lesson.id)"
      :disabled="isLessonCompleted(lesson.id)"
      class="text-xs px-3 py-1 rounded text-white"
      :class="
        isLessonCompleted(lesson.id)
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-green-600'
      "
    >
      {{ isLessonCompleted(lesson.id) ? "Completed" : "Mark Complete" }}
    </button>
  </div>

  
  <div
    v-if="lesson.content_type === 'text'"
    class="text-sm text-gray-600 leading-relaxed"
  >
    {{ lesson.content }}
  </div>

  
  <div v-if="lesson.content_type === 'video' && lesson.video_url">
    <iframe
      :src="lesson.video_url"
      class="w-full aspect-video rounded"
      allowfullscreen
    ></iframe>
  </div>

  
  <div v-if="lesson.file_attachment">
    <a
      :href="lesson.file_attachment"
      target="_blank"
      class="text-sm text-green-700 underline"
    >
      Download Resource
    </a>
  </div>
</div>
                      <div
                        v-for="(resource, idx) in module.resources"
                        :key="`res-${idx}`"
                        class="flex justify-between items-center text-sm"
                        :style="{ color: DARK_GREEN }"
                      >
                        <a href="#" class="hover:underline">{{
                          resource.title
                        }}</a>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path
                            d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                          ></path>
                          <path
                            d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'resources'" class="space-y-4">
              <p class="text-gray-700">
                Content for Resources tab will go here.
              </p>
            </div>

            <div v-else-if="activeTab === 'certificate'" class="space-y-6">
              <div v-if="!enrollment" class="text-gray-500">
                You are not enrolled in this course.
              </div>

              <div v-else-if="!isCompleted" class="text-center py-10">
                <p class="text-lg font-semibold text-gray-700">
                  Complete the course to unlock your certificate
                </p>

                <p class="text-sm text-gray-500 mt-2">
                  Progress: {{ Math.round(enrollment.progress_percentage) }}%
                </p>
              </div>

              <div v-else class="space-y-6">
                <div class="flex items-center justify-between bg-green-50 p-4 rounded-xl border border-green-100">
                  <div>
                    <h3 class="font-bold" :style="{ color: DARK_GREEN }">Certification Earned</h3>
                    <p class="text-sm text-gray-600">Issued on {{ new Date(enrollment.completed_at).toLocaleDateString() }}</p>
                  </div>
                  <a
                    v-if="certificate?.download_url"
                    :href="certificate.download_url"
                    target="_blank"
                    class="px-5 py-2 rounded-lg text-sm font-bold text-white transition hover:opacity-90 shadow-md"
                    :style="{ backgroundColor: DARK_GREEN }"
                  >
                    Download PDF
                  </a>
                </div>
            
                <div class="bg-white border rounded-2xl p-4 flex flex-col items-center shadow-inner min-h-[300px] justify-center">
                  <div v-if="certificate?.image_file" class="w-full">
                    <img 
                      :src="certificate.image_file" 
                      alt="Certificate Preview" 
                      class="w-full h-auto rounded-lg shadow-lg border"
                      @error="(e) => e.target.src = 'fallback-image-url-here'" 
                    />
                    <div class="mt-4 text-center">
                      <p class="text-xs text-gray-400">Certificate No: {{ certificate.certificate_number }}</p>
                      <a :href="certificate.verify_url" target="_blank" class="text-xs text-blue-500 underline">
                        Verify Authenticity
                      </a>
                    </div>
                  </div>
                  
                  <div v-else class="text-center">
                    <button 
                      @click="fetchCertificate"
                      class="px-6 py-2 rounded-lg border-2 font-bold"
                      :style="{ borderColor: DARK_GREEN, color: DARK_GREEN }"
                    >
                      View Certificate Details
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="lg:col-span-1 space-y-8">
            <div
              class="bg-white rounded-xl shadow-lg p-6 border-b-4"
              :style="{ borderBottomColor: DARK_GREEN }"
            >
              <p class="text-3xl font-bold text-gray-800 mb-2">
                ₦{{ course?.discount_price || course?.price }}
              </p>
              <p class="text-xs text-gray-500 mb-4">
                Get 20% off exclusive to HFN members.
              </p>
              <div class="flex space-x-2 mb-4">
                <button
  @click="enrollCourse"
  :disabled="enrolling"
  class="flex-grow py-3 rounded-lg font-semibold text-white transition duration-200 hover:scale-105 shadow-md disabled:opacity-50"
  :style="{ backgroundColor: DARK_GREEN }"
>
  {{ enrollment ? "Continue Learning" : enrolling ? "Processing..." : "Buy Now" }}
</button>
                <button
                  class="flex-grow py-3 rounded-lg font-semibold border transition duration-200 hover:scale-105 shadow-md"
                  :style="{
                    borderColor: DARK_GREEN,
                    color: DARK_GREEN,
                    backgroundColor: LIGHT_GREEN,
                  }"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="inline-block w-5 h-5 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                    ></path>
                  </svg>
                  Wishlist
                </button>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-xl font-bold text-gray-800 mb-4">
                About the Instructor.
              </h3>
              <div class="flex items-center mb-4">
                <img
                  :src="student"
                  alt="Instructor Avatar"
                  class="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <p class="font-bold text-gray-800">
                    {{ instructor?.name }}
                  </p>
                  <p class="text-sm text-gray-600">{{ instructor?.title }}</p>
                </div>
              </div>
              <p class="text-gray-700 text-sm leading-relaxed">
                {{ course?.description }}
              </p>
            </div>

            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-xl font-bold text-gray-800 mb-4">
                What you will learn
              </h3>
              <ul class="space-y-2 text-gray-700 text-sm">
                <li
                  v-for="(outcome, idx) in course?.learning_outcomes"
                  :key="idx"
                  class="flex items-start"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 mr-2 flex-shrink-0"
                    :style="{ color: DARK_GREEN }"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {{ outcome }}
                </li>
                <li v-if="!course?.learning_outcomes?.length" class="text-gray-400">
      No learning outcomes provided for this course.
    </li>
              </ul>
            </div>

            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-xl font-bold text-gray-800 mb-4">
                Material Includes
              </h3>
              <ul class="space-y-2 text-gray-700 text-sm">
                <li
      v-for="(item, idx) in course?.materials_included || []"
      :key="idx"
      class="flex items-start"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 mr-2 flex-shrink-0"
        :style="{ color: DARK_GREEN }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>

      {{ item }}
    </li>

    
    <li v-if="!course?.materials_included?.length" class="text-gray-400">
      No materials provided for this course.
    </li>
              </ul>
            </div>

            
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-xl font-bold text-gray-800 mb-4">Requirements</h3>
              <ul class="space-y-2 text-gray-700 text-sm">
                <li class="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 mr-2 flex-shrink-0"
                    :style="{ color: DARK_GREEN }"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Beginner (No prior knowledge required).
                </li>
              </ul>
            </div>
          </div>
        </div>

        
        <div class="mt-12">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">
            Similar courses you might like...
          </h2>
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl"
          >
            <div
              v-for="course in similarCourses"
              :key="course.id"
              class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 hover:shadow-xl"
            >
              <div class="relative w-full h-36 bg-gray-100">
                <img
                  :src="course.thumbnail"
                  alt="Course Thumbnail"
                  class="w-full h-full object-cover"
                />
                <div
                  class="absolute bottom-0 left-4 transform translate-y-1/2 p-1 bg-white rounded-full shadow-lg"
                >
                  <img
                    :src="student"
                    alt="Instructor"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                </div>
              </div>
              <div class="p-4 pt-8 flex flex-col flex-grow">
                <p class="text-xs text-gray-500 font-medium">
                  {{ course.instructor }}
                </p>
                <p class="text-xs text-gray-500 mb-2">
                  {{ course.profession }}
                </p>
                <h3 class="text-lg font-bold text-gray-800 mb-2">
                  {{ course.title }}
                </h3>
                <div class="flex items-center text-sm text-gray-600">
                  <div class="flex items-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 text-yellow-400 mr-1"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                      ></polygon>
                    </svg>
                    <span>{{ course.rating }}</span>
                  </div>
                  <span class="text-xs text-gray-500"
                    >({{ course.reviews }} reviews)</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    
  </div>
</template>

<style scoped></style>
