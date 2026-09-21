<script setup>
import messagingApi from '@/api/messaging.js';
import DashboardLoader from '@/components/layout/DashboardLoader.vue';
import AdminSidebar from '@/views/Admin/AdminSidebar.vue';
import { Eye, X } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const feedbacks = ref([]);
const loading = ref(true);
const detailLoading = ref(false);
const selectedFeedback = ref(null);

const feedbackList = computed(() => {
  const data = feedbacks.value;
  return data?.results || data?.data || (Array.isArray(data) ? data : []);
});

const getFeedbackMessage = (feedback) =>
  feedback?.message || feedback?.feedback || feedback?.content || '-';

const getFeedbackDate = (feedback) => {
  const date = feedback?.created_at || feedback?.created || feedback?.date;
  return date ? new Date(date).toLocaleString() : '-';
};

const fetchFeedbacks = async () => {
  loading.value = true;
  try {
    feedbacks.value = await messagingApi.listFeedback();
  } catch (error) {
    console.error('Failed to load feedback:', error);
    toast.error('Failed to load feedback');
  } finally {
    loading.value = false;
  }
};

const viewFeedback = async (feedback) => {
  if (!feedback?.id) return;

  detailLoading.value = true;
  try {
    selectedFeedback.value = await messagingApi.getFeedback(feedback.id);
  } catch (error) {
    console.error('Failed to load feedback details:', error);
    toast.error('Failed to load feedback details');
  } finally {
    detailLoading.value = false;
  }
};

const closeDetails = () => {
  selectedFeedback.value = null;
};

onMounted(fetchFeedbacks);
</script>

<template>
  <div class="flex min-h-screen font-sans relative bg-white">
    <AdminSidebar class="hidden lg:flex" />

    <main class="flex-1 p-6 lg:p-8 overflow-auto">
      <div class="text-sm text-gray-500 mb-6">
        <span class="text-[#006633]">Home</span> &gt; Feedback
      </div>

      <div class="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Feedback</h1>
          <p class="text-gray-500 mt-1">Review feedback submitted through the website.</p>
        </div>
        <button
          type="button"
          class="px-4 py-2 rounded-lg bg-[#004d33] text-white hover:bg-[#006633]"
          @click="fetchFeedbacks"
        >
          Refresh
        </button>
      </div>

      <DashboardLoader v-if="loading" message="Loading feedback..." />
      <div v-else-if="feedbackList.length === 0" class="rounded-xl border border-gray-200 p-10 text-center text-gray-500">
        No feedback
      </div>
      <div v-else class="overflow-x-auto rounded-xl border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-[#f2f9f3] text-left text-sm uppercase text-gray-700">
            <tr>
              <th class="px-5 py-3">Name</th>
              <th class="px-5 py-3">Feedback</th>
              <th class="px-5 py-3">Submitted</th>
              <th class="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm text-gray-600">
            <tr v-for="feedback in feedbackList" :key="feedback.id" class="hover:bg-[#f9fff9]">
              <td class="px-5 py-4 font-medium text-gray-800">{{ feedback.name || '-' }}</td>
              <td class="px-5 py-4 max-w-xl truncate">{{ getFeedbackMessage(feedback) }}</td>
              <td class="px-5 py-4 whitespace-nowrap">{{ getFeedbackDate(feedback) }}</td>
              <td class="px-5 py-4 text-right">
                <button
                  type="button"
                  class="inline-flex items-center gap-2 text-[#006633] hover:text-[#004d33] font-medium"
                  @click="viewFeedback(feedback)"
                >
                  <Eye class="w-4 h-4" /> View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <div v-if="selectedFeedback || detailLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="closeDetails">
      <div class="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div class="flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 class="text-xl font-semibold text-gray-800">Feedback details</h2>
          <button type="button" class="text-gray-500 hover:text-gray-800" aria-label="Close details" @click="closeDetails">
            <X class="w-5 h-5" />
          </button>
        </div>

        <DashboardLoader v-if="detailLoading" message="Loading feedback details..." />
        <div v-else class="space-y-4 pt-5 text-gray-700">
          <div>
            <p class="text-xs font-semibold uppercase text-gray-500">Name</p>
            <p class="mt-1">{{ selectedFeedback?.name || '-' }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase text-gray-500">Email</p>
            <p class="mt-1">{{ selectedFeedback?.email || '-' }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase text-gray-500">Submitted</p>
            <p class="mt-1">{{ getFeedbackDate(selectedFeedback) }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase text-gray-500">Feedback</p>
            <p class="mt-1 whitespace-pre-wrap">{{ getFeedbackMessage(selectedFeedback) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
