<script setup>
import { ref, watch } from "vue";


const props = defineProps({
  modelValue: Object,
});


const emit = defineEmits(["update:modelValue"]);


const getDefaultData = () => ({
  title: "",
  searchPlaceholder: "",
  years: [],
  categories: [],
});

const currentSectionData = ref({
  ...getDefaultData(),
  ...props.modelValue,
});

const newYear = ref("");
const newCategory = ref("");

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


const addYear = () => {
  if (!newYear.value) return;

  if (!currentSectionData.value.years) {
    currentSectionData.value.years = [];
  }

  currentSectionData.value.years.push(newYear.value);
  newYear.value = "";
};

const removeYear = (index) => {
  currentSectionData.value.years.splice(index, 1);
};


const addCategory = () => {
  if (!newCategory.value) return;

  if (!currentSectionData.value.categories) {
    currentSectionData.value.categories = [];
  }

  currentSectionData.value.categories.push(newCategory.value);
  newCategory.value = "";
};

const removeCategory = (index) => {
  currentSectionData.value.categories.splice(index, 1);
};
</script>

<template>
         
            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label
                class="block text-xs font-semibold uppercase text-gray-500"
              >
                Section Title
              </label>
              <input
                v-model="currentSectionData.title"
                class="w-full border-none focus:ring-0"
              />
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label
                class="block text-xs font-semibold uppercase text-gray-500"
              >
                Search Placeholder
              </label>
              <input
                v-model="currentSectionData.searchPlaceholder"
                class="w-full border-none focus:ring-0"
              />
            </div>

            
            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label
                class="block text-xs font-semibold uppercase text-gray-500"
              >
                Years
              </label>
              <div class="flex gap-2 flex-wrap">
                <span
                  v-for="(year, index) in currentSectionData.years"
                  :key="index"
                  class="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {{ year }}
                  <button
                    @click="removeYear(index)"
                    class="text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
                <input
                  v-model="newYear"
                  @keyup.enter="addYear"
                  placeholder="Add year"
                  class="border p-1 rounded focus:ring-0 w-24"
                />
              </div>
            </div>

            
            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label
                class="block text-xs font-semibold uppercase text-gray-500"
              >
                Categories
              </label>
              <div class="flex gap-2 flex-wrap">
                <span
                  v-for="(category, index) in currentSectionData.categories"
                  :key="index"
                  class="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {{ category }}
                  <button
                    @click="removeCategory(index)"
                    class="text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
                <input
                  v-model="newCategory"
                  @keyup.enter="addCategory"
                  placeholder="Add category"
                  class="border p-1 rounded focus:ring-0 w-32"
                />
              </div>
            </div>

</template>  
