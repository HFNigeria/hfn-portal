<script setup>
import { ref, watch } from "vue";


const props = defineProps({
  modelValue: Object,
});


const emit = defineEmits(["update:modelValue"]);


const getDefaultData = () => ({
  title: "",
  subtitle: "",
  options: [],
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


const addItem = () => {
  currentSectionData.value.options.push({
    key: `option-${Date.now()}`,
    title: "",
    description: "",
  });
};


const deleteItem = (index) => {
  currentSectionData.value.options.splice(index, 1);
};
</script>

<template>
          
            <div class="border border-gray-300 rounded-lg p-3 space-y-2 mb-4">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Modal Title</label
              >
              <input
                v-model="currentSectionData.title"
                type="text"
                class="w-full border-none focus:ring-0 p-0 m-0"
              />
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2 mb-6">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Subtitle</label
              >
              <input
                v-model="currentSectionData.subtitle"
                type="text"
                class="w-full border-none focus:ring-0 p-0 m-0"
              />
            </div>

            <div
              v-for="(item, index) in currentSectionData.options"
              :key="index"
              class="border border-gray-300 rounded-lg p-3 space-y-2 mb-4"
            >
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Option Title</label
              >
              <input
                v-model="item.title"
                type="text"
                class="w-full border-none focus:ring-0 p-0 m-0"
              />

              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Description</label
              >
              <textarea
                v-model="item.description"
                rows="2"
                class="w-full text-sm border-none focus:ring-0 p-0 m-0 resize-none"
              ></textarea>

              <button
                class="text-red-500 text-sm mt-2"
                @click="deleteItem(index)"
              >
                Delete Option
              </button>
            </div>

            <button
              class="bg-black text-white px-4 py-2 rounded"
              @click="addItem"
            >
              Add Option
            </button>
</template>  
