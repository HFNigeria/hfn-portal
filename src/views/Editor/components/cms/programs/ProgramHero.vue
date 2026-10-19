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
  image: "",
  backgroundColor: "#ffffff",
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
</script>

<template>
  <div class="space-y-4 max-w-full">

    
    <div class="border border-gray-300 rounded-lg p-3 space-y-2">
      <label class="block text-xs font-semibold uppercase text-gray-500">
        Hero Title Line 1
      </label>
      <input
        v-model="currentSectionData.titleLine1"
        type="text"
        class="w-full border-none focus:ring-0"
        placeholder="Enter first line of title..."
      />
    </div>

    
    <div class="border border-gray-300 rounded-lg p-3 space-y-2">
      <label class="block text-xs font-semibold uppercase text-gray-500">
        Hero Title Line 2
      </label>
      <input
        v-model="currentSectionData.titleLine2"
        type="text"
        class="w-full border-none focus:ring-0"
        placeholder="Enter second line of title..."
      />
    </div>

    
    <div class="border border-gray-300 rounded-lg p-3 space-y-2">
      <label class="block text-xs font-semibold uppercase text-gray-500">
        Hero Description
      </label>
      <textarea
        v-model="currentSectionData.description"
        rows="4"
        class="w-full border-none focus:ring-0 resize-none"
        placeholder="Enter hero description..."
      ></textarea>
    </div>

    
    <div class="border border-gray-300 rounded-lg p-3 space-y-2">
      <label class="block text-xs font-semibold uppercase text-gray-500">
        Hero Image URL
      </label>
      <input
        v-model="currentSectionData.image"
        type="text"
        class="w-full border-none focus:ring-0"
        placeholder="Enter image filename or URL..."
      />
    </div>

    
    <div class="border border-gray-300 rounded-lg p-3 space-y-2 flex items-center space-x-2">
      <label class="block text-xs font-semibold uppercase text-gray-500">
        Hero Background Color
      </label>
      <input
        v-model="currentSectionData.backgroundColor"
        type="color"
        class="w-16 h-10 p-0 border-none focus:ring-0"
      />
      <span class="text-xs text-gray-600">{{ currentSectionData.backgroundColor }}</span>
    </div>

  </div>
</template>
