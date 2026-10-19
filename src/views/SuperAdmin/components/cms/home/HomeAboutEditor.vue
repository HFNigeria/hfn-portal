<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(["update:modelValue"]);


const currentSectionData = ref({ ...props.modelValue });















watch(
  () => props.modelValue,
  (val) => {
    currentSectionData.value = { ...val };
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

const addFeature = () => {
  currentSectionData.value.features.push({
    title: "",
    sub: ""
  });
};

const removeFeature = (index) => {
  currentSectionData.value.features.splice(index, 1);
};  


</script>  
<template>
  <div class="space-y-6">

    
    <div class="border p-3 rounded-lg">
      <label class="text-xs font-semibold uppercase text-gray-500">Badge</label>
      <input v-model="currentSectionData.badge" class="w-full border-none focus:ring-0" />
    </div>

    
    <div class="border p-3 rounded-lg">
      <label class="text-xs font-semibold uppercase text-gray-500">Title</label>
      <input v-model="currentSectionData.title" class="w-full border-none focus:ring-0" />
    </div>

    
    <div class="border p-3 rounded-lg">
      <label class="text-xs font-semibold uppercase text-gray-500">Description</label>
      <textarea v-model="currentSectionData.description" rows="4" class="w-full border-none resize-none" />
    </div>

    
    <div class="border p-3 rounded-lg">
      <label class="text-xs font-semibold uppercase text-gray-500">Image URL</label>
      <input v-model="currentSectionData.image" class="w-full border-none focus:ring-0" />
    </div>

    <div class="border p-4 rounded-lg space-y-3">
      <label class="text-xs font-semibold uppercase text-gray-500">Stats</label>

      <div class="grid grid-cols-2 gap-3">
        <input
          v-model="currentSectionData.stats.number"
          placeholder="6+"
          class="border p-2 rounded"
        />
        <input
          v-model="currentSectionData.stats.label"
          placeholder="Health Guardians"
          class="border p-2 rounded"
        />
      </div>
    </div>

    <div class="border p-4 rounded-lg space-y-3">
      <div class="flex justify-between items-center">
        <label class="text-xs font-semibold uppercase text-gray-500">
          Features (Tags)
        </label>

        <button
          @click="addFeature"
          class="text-sm bg-black text-white px-2 py-1 rounded"
        >
          + Add
        </button>
      </div>

      <div
        v-for="(feature, index) in currentSectionData.features"
        :key="index"
        class="grid grid-cols-2 gap-2 border p-2 rounded"
      >
        <input
          v-model="feature.title"
          placeholder="Title"
          class="border-none focus:ring-0"
        />
        <input
          v-model="feature.sub"
          placeholder="Sub text"
          class="border-none focus:ring-0"
        />

        <button
          @click="removeFeature(index)"
          class="col-span-2 text-red-500 text-sm text-left"
        >
          Remove
        </button>
      </div>
    </div>

    <div class="border p-3 rounded-lg">
      <label class="text-xs font-semibold uppercase text-gray-500">
        CTA Button Text
      </label>
      <input
        v-model="currentSectionData.ctaText"
        placeholder="Read our full story"
        class="w-full border-none focus:ring-0"
      />
    </div>

  </div>
</template>
