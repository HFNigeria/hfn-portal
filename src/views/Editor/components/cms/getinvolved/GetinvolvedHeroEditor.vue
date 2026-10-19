<script setup>
import { computed } from "vue";


const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});


const emit = defineEmits(["update:modelValue"]);

const getDefaultData = () => ({
  titleLine1: "",
  titleLine2: "",
  description: "",
  image: "",
  backgroundColor: "#ffffff",
});

const currentSectionData = computed({
  get() {
    return {
      ...getDefaultData(),
      ...props.modelValue,
    };
  },
  set(val) {
    emit("update:modelValue", val);
  },
});
</script>

<template>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Title Line 1</label
              >
              <input
                v-model="currentSectionData.titleLine1"
                type="text"
                class="w-full border-none focus:ring-0 p-0 m-0"
              />
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Title Line 2</label
              >
              <input
                v-model="currentSectionData.titleLine2"
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
                >Background Color</label
              >
              <input
                v-model="currentSectionData.backgroundColor"
                type="text"
                class="w-full border-none focus:ring-0 p-0 m-0"
              />
            </div>

            <image-uploader
              v-model="currentSectionData.image"
              label="Hero Image"
            />

</template>  
