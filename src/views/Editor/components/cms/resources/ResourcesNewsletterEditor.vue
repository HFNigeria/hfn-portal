<script setup>
import { ref, watch } from "vue";


const props = defineProps({
  modelValue: Object,
});


const emit = defineEmits(["update:modelValue"]);

const getDefaultData = () => ({
  title: "",
  items: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    nextPageUrl: "",
  },
});

const currentSectionData = ref({
  ...getDefaultData(),
  ...props.modelValue,
});

watch(
  () => props.modelValue,
  (val) => {
    currentSectionData.value = {
      ...getDefaultData(),
      ...val,
    };
  },
  { deep: true }
);

watch(
  currentSectionData,
  (val) => {
    emit("update:modelValue", val);
  },
  { deep: true }
);

const addItem = () => {
  if (!currentSectionData.value.items) {
    currentSectionData.value.items = [];
  }

  currentSectionData.value.items.push({
    id: Date.now(),
    title: "",
    excerpt: "",
    image: "",
    date: "",
    commentCount: 0,
    downloadUrl: "",
  });
};

const deleteItem = (index) => {
  currentSectionData.value.items.splice(index, 1);
};
</script>
<template>
         
            <div class="border border-gray-300 rounded-lg p-3 space-y-2 mb-4">
              <label
                class="block text-xs font-semibold uppercase text-gray-500"
              >
                Section Title
              </label>
              <input
                v-model="currentSectionData.title"
                type="text"
                class="w-full border-none focus:ring-0 p-0 m-0"
              />
            </div>

            
            <div
              v-for="(item, index) in currentSectionData.items"
              :key="index"
              class="border border-gray-300 rounded-lg p-3 space-y-2 mb-4"
            >
              <label
                class="block text-xs font-semibold uppercase text-gray-500"
              >
                Date
              </label>
              <input
                v-model="item.date"
                type="text"
                class="w-full border-none focus:ring-0 p-0 m-0"
              />

              <label
                class="block text-xs font-semibold uppercase text-gray-500"
              >
                Title
              </label>
              <input
                v-model="item.text"
                type="text"
                class="w-full border-none focus:ring-0 p-0 m-0"
              />

              <label
                class="block text-xs font-semibold uppercase text-gray-500"
              >
                PDF URL
              </label>
              <input
                v-model="item.pdfUrl"
                type="text"
                class="w-full border-none focus:ring-0 p-0 m-0"
              />

              <button
                class="text-red-500 text-sm mt-2"
                @click="deleteItem(index)"
              >
                Delete Newsletter
              </button>
            </div>

            <button
              class="bg-black text-white px-4 py-2 rounded"
              @click="addItem"
            >
              Add Newsletter
            </button>

            
            <div class="border border-gray-300 rounded-lg p-3 space-y-2 mt-6">
              <label
                class="block text-xs font-semibold uppercase text-gray-500"
              >
                Current Page
              </label>
              <input
                v-model="currentSectionData.pagination.currentPage"
                type="number"
                class="w-full border-none focus:ring-0 p-0 m-0"
              />

              <label
                class="block text-xs font-semibold uppercase text-gray-500"
              >
                Total Pages
              </label>
              <input
                v-model="currentSectionData.pagination.totalPages"
                type="number"
                class="w-full border-none focus:ring-0 p-0 m-0"
              />

              <label
                class="block text-xs font-semibold uppercase text-gray-500"
              >
                Next Page URL
              </label>
              <input
                v-model="currentSectionData.pagination.nextPageUrl"
                type="text"
                class="w-full border-none focus:ring-0 p-0 m-0"
              />
            </div>

</template>  
