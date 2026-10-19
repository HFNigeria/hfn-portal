<script setup>
import { ref, watch } from "vue";




const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});
  
const emit = defineEmits(["update:modelValue"]);

const currentSectionData = ref(props.modelValue || []);

watch(
  () => props.modelValue,
  (val) => {
    currentSectionData.value = val || [];
  }
);

watch(
  currentSectionData,
  (val) => {
    emit("update:modelValue", val);
  },
  { deep: true }
);
  
const addMonth = () => {
  currentSectionData.value.months["New Month"] = {
    featured: { image: "", tag: "", date: "", comments: 0, description: "" },
    newsList: [],
  };
};

const removeMonth = (month) => {
  delete currentSectionData.value.months[month];
};

const addNewsItem = (month) => {
  currentSectionData.value.months[month].newsList.push({
    image: "",
    tag: "",
    date: "",
    comments: 0,
    description: "",
  });
};

const removeNewsItem = (month, index) => {
  currentSectionData.value.months[month].newsList.splice(index, 1);
};


</script>  
<template>

            <div class="space-y-8">
              <div
                v-for="(monthData, monthName) in currentSectionData.months"
                :key="monthName"
                class="border border-gray-300 rounded-lg p-4 space-y-6"
              >
                
                <div class="flex justify-between items-center">
                  <h3 class="font-semibold">{{ monthName }}</h3>
                  <button
                    class="text-red-500 text-sm"
                    @click="removeMonth(monthName)"
                  >
                    Delete Month
                  </button>
                </div>

                
                
<div class="space-y-3 border rounded p-3 bg-gray-50">
  <label class="text-xs font-semibold uppercase text-gray-500">
    Featured Article
  </label>

  <input
    v-model="monthData.featured.title"
    placeholder="Title"
    class="w-full border-none focus:ring-0 font-semibold"
  />

  <input
    v-model="monthData.featured.image"
    placeholder="Image URL"
    class="w-full text-xs border rounded p-2 font-mono"
  />

  <input
    v-model="monthData.featured.tag"
    placeholder="Tag"
    class="w-full border-none focus:ring-0"
  />

  <input
    v-model="monthData.featured.date"
    placeholder="Date"
    class="w-full border-none focus:ring-0"
  />

  <textarea
    v-model="monthData.featured.description"
    rows="3"
    class="w-full border-none focus:ring-0 resize-none"
  />
</div>

                
                <div class="space-y-4">
                  <div class="flex justify-between">
                    <label
                      class="text-xs font-semibold uppercase text-gray-500"
                    >
                      News List
                    </label>
                    <button
                      class="text-sm bg-black text-white px-2 py-1 rounded"
                      @click="addNewsItem(monthName)"
                    >
                      + Add News
                    </button>
                  </div>

                  <div
                    v-for="(news, index) in monthData.newsList"
                    :key="index"
                    class="border rounded p-3 space-y-2"
                  >
                    <input
    v-model="news.title"
    placeholder="Title"
    class="w-full font-semibold border-none focus:ring-0"
  />

  <input
    v-model="news.image"
    placeholder="Image URL"
    class="w-full text-xs border rounded p-2 font-mono"
  />
                    <input
                      v-model="news.tag"
                      placeholder="Tag"
                      class="w-full border-none focus:ring-0"
                    />
                    <input
                      v-model="news.date"
                      placeholder="Date"
                      class="w-full border-none focus:ring-0"
                    />
                    <textarea
                      v-model="news.description"
                      rows="2"
                      class="w-full border-none focus:ring-0 resize-none"
                    />

                    <button
                      class="text-red-500 text-sm"
                      @click="removeNewsItem(monthName, index)"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <button
                class="bg-black text-white px-4 py-2 rounded"
                @click="addMonth"
              >
                + Add New Month
              </button>
            </div>
          

</template> 
