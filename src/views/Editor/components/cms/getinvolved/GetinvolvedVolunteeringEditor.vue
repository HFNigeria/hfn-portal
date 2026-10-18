<script setup>
import { ref, watch } from "vue";


const props = defineProps({
  modelValue: Object,
});


const emit = defineEmits(["update:modelValue"]);


const getDefaultData = () => ({
  title: "",
  subtitle: "",
  description: "",
  buttonText: "",
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
  { deep: true, immediate: true }
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
         
            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Title</label
              >
              <input
                v-model="currentSectionData.title"
                type="text"
                class="w-full border-none focus:ring-0 p-0 m-0"
              />
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Subtitle</label
              >
              <input
                v-model="currentSectionData.subtitle"
                type="text"
                class="w-full border-none focus:ring-0 p-0 m-0"
              />
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Description</label
              >
              <textarea
                v-model="currentSectionData.description"
                rows="3"
                class="w-full text-sm border-none focus:ring-0 p-0 m-0 resize-none"
              ></textarea>
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Button Text</label
              >
              <input
                v-model="currentSectionData.buttonText"
                type="text"
                class="w-full border-none focus:ring-0 p-0 m-0"
              />
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Background Color</label
              >
              <input
                v-model="currentSectionData.backgroundColor"
                type="text"
                class="w-full border-none focus:ring-0 p-0 m-0"
              />
            </div>

</template>  
