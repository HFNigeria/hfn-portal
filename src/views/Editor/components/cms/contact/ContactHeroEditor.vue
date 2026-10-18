<script setup>
import { ref, watch } from "vue";
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue"]);

const getDefaultSectionData = () => ({
  badgeText: "",
  headline: {
    line1: "",
    line2: "",
  },
  subheadline: "",
  responseNote: "",
  image: {
    src: "",
    alt: "",
  },
  backgroundColor: "bg-[#F2F9F3]",
});

const mergeData = (data = {}) => {
  const defaults = getDefaultSectionData();

  let normalizedHeadline = defaults.headline;

  if (typeof data.headline === "string") {
    normalizedHeadline = {
      line1: data.headline,
      line2: "",
    };
  } else {
    normalizedHeadline = {
      ...defaults.headline,
      ...(data.headline || {}),
    };
  }

  let normalizedImage = defaults.image;

  if (typeof data.image === "string") {
    normalizedImage = {
      src: data.image,
      alt: "",
    };
  } else {
    normalizedImage = {
      ...defaults.image,
      ...(data.image || {}),
    };
  }

  return {
    ...defaults,
    ...data,
    headline: normalizedHeadline,
    image: normalizedImage,
  };
};



const currentSectionData = computed({
  get() {
    return mergeData(props.modelValue);
  },
  set(val) {
    emit("update:modelValue", val);
  }
});
</script>

<template>
  <div class="flex space-x-6">
    
    <div class="w-3/5 space-y-6">
      
      <div class="border border-gray-300 rounded-lg p-3 space-y-2">
        <label class="block text-xs font-semibold uppercase text-gray-500">
          Badge Text
        </label>
        <input
          v-model="currentSectionData.badgeText"
          type="text"
          class="w-full text-lg border-none focus:ring-0 p-0 m-0"
        />
      </div>

      <div class="border border-gray-300 rounded-lg p-3 space-y-2">
        <label class="block text-xs font-semibold uppercase text-gray-500">
          Headline Line 1
        </label>
        <input
          v-model="currentSectionData.headline.line1"
          type="text"
          class="w-full text-lg border-none focus:ring-0 p-0 m-0"
        />
      </div>

      
      <div class="border border-gray-300 rounded-lg p-3 space-y-2">
        <label class="block text-xs font-semibold uppercase text-gray-500">
          Headline Line 2
        </label>
        <input
          v-model="currentSectionData.headline.line2"
          type="text"
          class="w-full text-lg border-none focus:ring-0 p-0 m-0"
        />
      </div>

      
      <div class="border border-gray-300 rounded-lg p-3 space-y-2">
        <label class="block text-xs font-semibold uppercase text-gray-500">
          Subheadline
        </label>
        <textarea
          v-model="currentSectionData.subheadline"
          rows="3"
          class="w-full text-sm border-none focus:ring-0 p-0 m-0 resize-none"
        />
      </div>

      
      <div class="border border-gray-300 rounded-lg p-3 space-y-2">
        <label class="block text-xs font-semibold uppercase text-gray-500">
          Response Note
        </label>
        <input
          v-model="currentSectionData.responseNote"
          type="text"
          class="w-full text-sm border-none focus:ring-0 p-0 m-0"
        />
      </div>
    </div>

    
    <div class="w-2/5 space-y-6">
      <image-uploader v-model="currentSectionData.image.src" />

      <div class="border border-gray-300 rounded-lg p-3 space-y-2">
        <label class="block text-xs font-semibold uppercase text-gray-500">
          Image Alt Text
        </label>
        <input
          v-model="currentSectionData.image.alt"
          type="text"
          class="w-full text-sm border-none focus:ring-0 p-0 m-0"
        />
      </div>

      
      <div class="border border-gray-300 rounded-lg p-3 space-y-2">
        <label class="block text-xs font-semibold uppercase text-gray-500">
          Background Color Class
        </label>
        <input
          v-model="currentSectionData.backgroundColor"
          type="text"
          class="w-full text-sm border-none focus:ring-0 p-0 m-0"
        />
      </div>
    </div>
  </div>
</template> 
