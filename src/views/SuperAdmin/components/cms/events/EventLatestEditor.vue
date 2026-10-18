<script setup>
import { ref, watch } from "vue";


const props = defineProps({
  modelValue: Object,
});


const emit = defineEmits(["update:modelValue"]);


const getDefaultEvent = () => ({
  id: Date.now(),
  title: "",
  category: "",
  date: "",
  time: "",
  location: "",
  frequency: "",
  description: "",
  image: "",
  registerLink: "",
});


const currentSectionData = ref({
  title: "",
  items: [],
  ...props.modelValue,
});

watch(
  () => props.modelValue,
  (val) => {
    currentSectionData.value = {
      title: "",
      items: [],
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

const addLatestEvent = () => {
  currentSectionData.value.items.push(getDefaultEvent());
};

const removeLatestEvent = (index) => {
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
              :key="event.id"
              class="border border-gray-300 rounded-lg p-4 space-y-3"
            >
              <div class="flex justify-between items-center">
                <h4 class="font-semibold text-sm">Event {{ index + 1 }}</h4>
                <button
                  @click="removeLatestEvent(index)"
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
                v-model="event.time"
                placeholder="Time"
                class="w-full border-none focus:ring-0"
              />
              <input
                v-model="event.location"
                placeholder="Location"
                class="w-full border-none focus:ring-0"
              />
              <input
                v-model="event.frequency"
                placeholder="Frequency"
                class="w-full border-none focus:ring-0"
              />
              <textarea
                v-model="event.description"
                rows="3"
                placeholder="Description"
                class="w-full border-none focus:ring-0 resize-none"
              ></textarea>
              <input
                v-model="event.image"
                placeholder="Image URL"
                class="w-full border-none focus:ring-0"
              />
              <input
                v-model="event.registerLink"
                placeholder="Register Link"
                class="w-full border-none focus:ring-0"
              />
            </div>

            <button
              @click="addLatestEvent"
              class="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800"
            >
              + Add Event
            </button>

</template>  
