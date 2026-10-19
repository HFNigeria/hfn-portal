<script setup>
import { ref, watch } from "vue";


const props = defineProps({
  modelValue: Object,
});


const emit = defineEmits(["update:modelValue"]);

const getDefaultData = () => ({
  id: "",
  tag: "",
  title: "",
  date: "",
  location: "",
  description: "",
  image: "",
  registerLink: "",
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
         
            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Tag</label
              >
              <input
                v-model="currentSectionData.tag"
                class="w-full border-none focus:ring-0"
              />
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Title</label
              >
              <input
                v-model="currentSectionData.title"
                class="w-full border-none focus:ring-0"
              />
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Date</label
              >
              <input
                v-model="currentSectionData.date"
                class="w-full border-none focus:ring-0"
              />
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Location</label
              >
              <input
                v-model="currentSectionData.location"
                class="w-full border-none focus:ring-0"
              />
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Description</label
              >
              <textarea
                v-model="currentSectionData.description"
                rows="4"
                class="w-full border-none focus:ring-0 resize-none"
              ></textarea>
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Image URL</label
              >
              <input
                v-model="currentSectionData.image"
                class="w-full border-none focus:ring-0"
              />
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Register Link</label
              >
              <input
                v-model="currentSectionData.registerLink"
                class="w-full border-none focus:ring-0"
              />
            </div>

</template>  
