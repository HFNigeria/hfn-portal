<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: Object,
});

const emit = defineEmits(["update:modelValue"]);

const getDefaultData = () => ({
  titleLine1: "",
  titleLine2: "",
  description: "",
  image: "latest_news.png",
  backgroundColor: "#E87A1814",
});

const currentSectionData = ref(getDefaultData());


watch(
  () => props.modelValue,
  (val) => {
    currentSectionData.value = {
      ...getDefaultData(),
      ...(val || {}),
    };
  },
  { immediate: true }
);

const updateParent = () => {
  emit("update:modelValue", { ...currentSectionData.value });
};
</script>

<template>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label
                class="block text-xs font-semibold uppercase text-gray-500"
              >
                Hero Title Line 1
              </label>
              <input
                v-model="currentSectionData.titleLine1"
                type="text"
                class="w-full border-none focus:ring-0"
              />
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label
                class="block text-xs font-semibold uppercase text-gray-500"
              >
                Hero Title Line 2
              </label>
              <input
                v-model="currentSectionData.titleLine2"
                type="text"
                class="w-full border-none focus:ring-0"
              />
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label
                class="block text-xs font-semibold uppercase text-gray-500"
              >
                Description
              </label>
              <textarea
                v-model="currentSectionData.description"
                rows="4"
                class="w-full border-none focus:ring-0 resize-none"
              ></textarea>
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label
                class="block text-xs font-semibold uppercase text-gray-500"
              >
                Image URL
              </label>
              <input
                v-model="currentSectionData.image"
                type="text"
                class="w-full border-none focus:ring-0"
              />
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label
                class="block text-xs font-semibold uppercase text-gray-500"
              >
                Background Color
              </label>
              <input
                v-model="currentSectionData.backgroundColor"
                type="color"
                class="w-16 h-10 p-0 border-none focus:ring-0"
              />
            </div>

</template>  
