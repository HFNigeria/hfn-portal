<script setup>
import { ref, watch } from "vue";


const props = defineProps({
  modelValue: Object,
});


const emit = defineEmits(["update:modelValue"]);


const getDefaultData = () => ({
  items: [],
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
  currentSectionData.value.items.push({
    id: Date.now(),
    title: "",
    description: "",
    buttonText: "",
  });
};


const deleteItem = (index) => {
  currentSectionData.value.items.splice(index, 1);
};
</script>

<template>
       
            <div
              v-for="(item, index) in currentSectionData.items"
              :key="index"
              class="border border-gray-300 rounded-lg p-3 space-y-2 mb-4"
            >
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Title</label
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
                rows="3"
                class="w-full text-sm border-none focus:ring-0 p-0 m-0 resize-none"
              ></textarea>

              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Button Text</label
              >
              <input
                v-model="item.buttonText"
                type="text"
                class="w-full border-none focus:ring-0 p-0 m-0"
              />

              <button
                class="text-red-500 text-sm mt-2"
                @click="deleteItem(index)"
              >
                Delete Item
              </button>
            </div>

            <button
              class="bg-black text-white px-4 py-2 rounded"
              @click="addItem"
            >
              Add Opportunity
            </button>

</template>  
