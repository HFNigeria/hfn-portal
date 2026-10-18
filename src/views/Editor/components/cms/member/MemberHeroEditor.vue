<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      headlineTop: "",
      headlineBottom: "",
      description: "",
      image: "",
    }),
  },
});

const emit = defineEmits(["update:modelValue"]);


const currentSectionData = reactive({
  headlineTop: "",
  headlineBottom: "",
  description: "",
  image: "",
  sectionTitle: "",
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      Object.assign(currentSectionData, newVal);
    }
  },
  { immediate: true, deep: true }
);

watch(
  currentSectionData,
  (newVal) => {
    emit("update:modelValue", { ...newVal });
  },
  { deep: true }
);
</script>

<template>
  <div>
    <label class="block text-xs font-semibold uppercase text-gray-500">
      Headline Top
    </label>
    <input
      v-model="currentSectionData.headlineTop"
      type="text"
      class="w-full border-none focus:ring-0 p-0 m-0"
    />
  </div>

  <div>
    <label class="block text-xs font-semibold uppercase text-gray-500">
      Headline Bottom
    </label>
    <input
      v-model="currentSectionData.headlineBottom"
      type="text"
      class="w-full border-none focus:ring-0 p-0 m-0"
    />
  </div>

  <div>
    <label class="block text-xs font-semibold uppercase text-gray-500">
      Description
    </label>
    <textarea
      v-model="currentSectionData.description"
      rows="4"
      class="w-full border-none focus:ring-0 p-0 m-0 resize-none"
    />
  </div>

  <div>
    <label class="block text-xs font-semibold uppercase text-gray-500">
      Hero Image
    </label>
    <input
      v-model="currentSectionData.image"
      type="text"
      class="w-full border-none focus:ring-0 p-0 m-0"
    />
  </div>
  <div>
  <label class="block text-xs font-semibold uppercase text-gray-500">
    Section Title
  </label>
  <input
    v-model="currentSectionData.sectionTitle"
    type="text"
    class="w-full border-none focus:ring-0 p-0 m-0"
  />
</div>
</template>