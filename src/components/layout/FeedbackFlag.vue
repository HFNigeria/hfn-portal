<template>
  <div class="fixed right-0 top-1/2 -translate-y-1/2 z-50">
    <button 
      @click="isOpen = true"
      class="bg-orange-500 text-white font-semibold py-3 px-2 rounded-l-lg shadow-lg hover:bg-orange-600 transition duration-150 ease-in-out"
      style="writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg);"
    >
      Feedback 
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline ml-1 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
  </div>
  <div
      v-if="isOpen"
      class="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      @click.self="closeForm"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-80 p-6 relative animate-fadeIn"
      >
        <h3 class="text-lg font-semibold text-gray-800 mb-4">
          We value your feedback
        </h3>

        <form @submit.prevent="submitFeedback" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1"
              >Name</label
            >
            <input
              v-model="form.name"
              type="text"
              placeholder="Your name"
              class="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1"
              >Feedback</label
            >
            <textarea
              v-model="form.feedback"
              placeholder="Your feedback..."
              rows="3"
              class="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
              required
            ></textarea>
          </div>

          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="closeForm"
              class="px-3 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition disabled:opacity-50"
            >
              {{ loading ? "Submitting..." : "Submit" }}
            </button>
          </div>
        </form>
      </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "vue-toastification";
import messagingApi from "@/api/messaging";

const toast = useToast();
const isOpen = ref(false);
const loading = ref(false);
const form = ref({
  name: "",
  feedback: "",
});

const closeForm = () => {
  isOpen.value = false;
};

const submitFeedback = async () => {
  if (!form.value.name || !form.value.feedback) return;

  loading.value = true;

  try {
    await messagingApi.sendFeedback({
      name: form.value.name,
      feedback: form.value.feedback,
    });

    toast.success("Feedback submitted successfully!");

    // Reset form
    form.value = { name: "", feedback: "" };
    isOpen.value = false;
  } catch (error) {
    console.error("Failed to submit feedback", error);
    toast.error("Failed to submit feedback. Please try again.");
  } finally {
    loading.value = false;
  }
};
</script>
