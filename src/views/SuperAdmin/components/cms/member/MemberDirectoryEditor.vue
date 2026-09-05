<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ title: "Member Directory" }),
  },
});

const emit = defineEmits(["update:modelValue"]);
const currentSectionData = ref({ ...props.modelValue });

watch(
  () => props.modelValue,
  (value) => {
    currentSectionData.value = { ...(value || {}) };
  },
  { immediate: true, deep: true }
);

watch(
  currentSectionData,
  (value) => emit("update:modelValue", { ...value }),
  { deep: true }
);
</script>

<template>
  <div class="border border-gray-300 rounded-lg p-3 space-y-2">
    <label class="block text-xs font-semibold uppercase text-gray-500">
      Section Title
    </label>
    <input
      v-model="currentSectionData.title"
      type="text"
      class="w-full text-lg border-none focus:ring-0 p-0 m-0"
    />
  </div>
</template>
