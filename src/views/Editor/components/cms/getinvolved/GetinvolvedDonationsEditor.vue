<script setup>
import { ref, watch } from "vue";


const props = defineProps({
  modelValue: Object,
});


const emit = defineEmits(["update:modelValue"]);


const getDefaultData = () => ({
  title: "",
  subtitle: "",
  paragraphs: [],
  note: "",
  quote: "",
  buttonText: "",
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
  currentSectionData.value.paragraphs.push("");
};


const deleteItem = (index) => {
  currentSectionData.value.paragraphs.splice(index, 1);
};
</script>

<template>
        
            <div class="border border-gray-300 rounded-lg p-3 space-y-2 mb-4">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Title</label
              >
              <input
                v-model="currentSectionData.title"
                type="text"
                class="w-full border-none focus:ring-0 p-0 m-0"
              />
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2 mb-4">
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
              v-for="(paragraph, index) in currentSectionData.paragraphs"
              :key="index"
              class="border border-gray-300 rounded-lg p-3 space-y-2 mb-4"
            >
              <label
                class="block text-xs font-semibold uppercase text-gray-500"
              >
                Paragraph {{ index + 1 }}
              </label>
              <textarea
                v-model="currentSectionData.paragraphs[index]"
                rows="3"
                class="w-full text-sm border-none focus:ring-0 p-0 m-0 resize-none"
              ></textarea>

              <button
                class="text-red-500 text-sm mt-2"
                @click="deleteItem(index)"
              >
                Delete Paragraph
              </button>
            </div>

            <button
              class="bg-black text-white px-4 py-2 rounded mb-6"
              @click="addItem"
            >
              Add Paragraph
            </button>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2 mb-4">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Note</label
              >
              <textarea
                v-model="currentSectionData.note"
                rows="2"
                class="w-full text-sm border-none focus:ring-0 p-0 m-0 resize-none"
              ></textarea>
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2 mb-4">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Quote</label
              >
              <textarea
                v-model="currentSectionData.quote"
                rows="2"
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

</template>  
