<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});
  
const emit = defineEmits(["update:modelValue"]);


const currentSectionData = ref(props.modelValue || {});

watch(
  () => props.modelValue,
  (val) => {
    currentSectionData.value = val || {};
  }
);

watch(
  currentSectionData,
  (val) => {
    emit("update:modelValue", val);
  },
  { deep: true }
);
  
const addMandateAction = () => {
  currentSectionData.value.actions.push({
    title: "",
    description: "",
    icon: "LightBulbIcon",
    tags: [""]
  });
};

const removeMandateAction = (index) => {
  currentSectionData.value.actions.splice(index, 1);
};

const addTag = (action) => {
  action.tags.push("");
};

const removeTag = (action, index) => {
  action.tags.splice(index, 1);
};  
</script>
<template>
  <div class="space-y-6">

    
    <div class="border border-gray-300 rounded-lg p-3 space-y-2">
      <label class="block text-xs font-semibold uppercase text-gray-500">
        Badge
      </label>
      <input
        v-model="currentSectionData.badge"
        type="text"
        class="w-full border-none focus:ring-0"
      />
    </div>

    
    <div class="border border-gray-300 rounded-lg p-3 space-y-2">
      <label class="block text-xs font-semibold uppercase text-gray-500">
        Title
      </label>
      <input
        v-model="currentSectionData.title"
        type="text"
        class="w-full border-none focus:ring-0"
      />
    </div>

    
    <div class="border border-gray-300 rounded-lg p-3 space-y-2">
      <label class="block text-xs font-semibold uppercase text-gray-500">
        Description
      </label>
      <textarea
        v-model="currentSectionData.description"
        rows="3"
        class="w-full border-none focus:ring-0 resize-none"
      />
    </div>

    
    <div class="flex justify-between items-center">
      <label class="text-xs font-semibold uppercase text-gray-500">
        Mandate Actions
      </label>
      <button
        @click="addMandateAction"
        class="text-sm bg-black text-white px-3 py-1 rounded"
      >
        + Add Action
      </button>
    </div>

    
    <div
      v-for="(action, index) in currentSectionData.actions"
      :key="index"
      class="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50"
    >
      
      <input
        v-model="action.title"
        placeholder="Action Title"
        class="w-full font-bold bg-transparent border-none focus:ring-0"
      />

      
      <textarea
        v-model="action.description"
        placeholder="Description"
        rows="2"
        class="w-full text-sm bg-transparent border-none focus:ring-0"
      />

      
      <input
        v-model="action.icon"
        placeholder="Icon (e.g. LightBulbIcon)"
        class="w-full text-xs border rounded px-2 py-1"
      />

      
      <div class="space-y-2">
        <div class="flex gap-2 flex-wrap">
          <div
            v-for="(tag, tIdx) in action.tags"
            :key="tIdx"
            class="flex items-center gap-1"
          >
            <input
              v-model="action.tags[tIdx]"
              class="text-xs border rounded px-2 py-1 w-24"
            />
            <button
              @click="removeTag(action, tIdx)"
              class="text-red-500 text-xs"
            >
              ×
            </button>
          </div>
        </div>

        <button
          @click="addTag(action)"
          class="text-xs text-blue-600"
        >
          + Add Tag
        </button>
      </div>

      
      <button
        @click="removeMandateAction(index)"
        class="text-red-500 text-xs"
      >
        Remove Action
      </button>
    </div>

  </div>
</template>
