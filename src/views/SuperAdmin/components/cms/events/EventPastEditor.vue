<script setup>
import { ref, watch } from "vue";


const props = defineProps({
  modelValue: Object,
});


const emit = defineEmits(["update:modelValue"]);


const getDefaultPastEvent = () => ({
  id: Date.now(),
  title: "",
  category: "",
  date: "",
  theme: "",
  image: "",
});


const currentSectionData = ref({
  title: "",
  items: [],
  ...props.modelValue,
});

watch(
  () => props.modelValue,
  (val) => {
    currentSectionData.value = { title: "", items: [], ...val };
  },
  { deep: true }
);

watch(
  currentSectionData,
  (val) => emit("update:modelValue", val),
  { deep: true }
);

const addPastEvent = () => {
  currentSectionData.value.items.push(getDefaultPastEvent());
};

const removePastEvent = (index) => {
  currentSectionData.value.items.splice(index, 1);
};
</script>
<template>
          
            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label
                class="block text-xs font-semibold uppercase text-gray-500"
              >
                Section Title
              </label>
              <input
                v-model="currentSectionData.title"
                class="w-full border-none focus:ring-0"
              />
            </div>

            <div
              v-for="(event, index) in currentSectionData.items"
              :key="index"
              class="border border-gray-300 rounded-lg p-4 space-y-3"
            >
              <div class="flex justify-between items-center">
                <h4 class="font-semibold text-sm">
                  Past Event {{ index + 1 }}
                </h4>
                <button
                  @click="removePastEvent(index)"
                  class="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>

              <input
                v-model="event.title"
                placeholder="Title"
                class="w-full border-none focus:ring-0"
              />
              <input
                v-model="event.category"
                placeholder="Category"
                class="w-full border-none focus:ring-0"
              />
              <input
                v-model="event.date"
                placeholder="Date"
                class="w-full border-none focus:ring-0"
              />
              <input
                v-model="event.theme"
                placeholder="Theme"
                class="w-full border-none focus:ring-0"
              />
              <input
                v-model="event.image"
                placeholder="Image URL"
                class="w-full border-none focus:ring-0"
              />
            </div>

            <button
              @click="addPastEvent"
              class="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800"
            >
              + Add Past Event
            </button>
</template>  
