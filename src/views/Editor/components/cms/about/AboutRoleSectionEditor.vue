<script setup>
import { ref, watch } from 'vue'


const props = defineProps({
  modelValue: Object
})


const emit = defineEmits(['update:modelValue'])


const currentSectionData = ref({
  points: [],
  tags: [],
  ...props.modelValue
})


watch(
  () => props.modelValue,
  (val) => {
    currentSectionData.value = { points: [], tags: [], ...val }
  }
)


watch(
  currentSectionData,
  (val) => {
    emit('update:modelValue', val)
  },
  { deep: true }
)


const addPoint = () => {
  currentSectionData.value.points.push('')
}

const deletePoint = (index) => {
  currentSectionData.value.points.splice(index, 1)
}


const addTag = () => {
  currentSectionData.value.tags.push('')
}

const deleteTag = (index) => {
  currentSectionData.value.tags.splice(index, 1)
}
</script>

<template>
  <div class="border border-gray-300 rounded-lg p-3 mb-4">
    <label class="block text-xs font-semibold uppercase text-gray-500">Title</label>
    <input
      v-model="currentSectionData.title"
      type="text"
      class="w-full border-none focus:ring-0 p-0 m-0"
    />
  </div>

  <div class="border border-gray-300 rounded-lg p-3 mb-2">
    <label class="block text-xs font-semibold uppercase text-gray-500">Description</label>
    <textarea
      v-model="currentSectionData.description"
      rows="3"
      class="w-full text-sm border-none focus:ring-0 p-0 m-0 resize-none"
    ></textarea>
  </div>

  <div class="border border-gray-300 rounded-lg p-3 mb-2">
    <label class="block text-xs font-semibold uppercase text-gray-500">Highlight Text</label>
    <input
      v-model="currentSectionData.highlightText"
      type="text"
      class="w-full border-none focus:ring-0 p-0 m-0"
    />
  </div>

  
  <div class="border border-gray-300 rounded-lg p-3 mb-2 space-y-2">
    <label class="block text-xs font-semibold uppercase text-gray-500">Points</label>
    <div
      v-for="(point, index) in currentSectionData.points"
      :key="index"
      class="flex justify-between items-center space-x-2"
    >
      <input
        v-model="currentSectionData.points[index]"
        type="text"
        class="flex-grow border-none focus:ring-0 p-0 m-0"
      />
      <button class="text-red-500 text-sm" @click="deletePoint(index)">Delete</button>
    </div>
    <button class="bg-black text-white px-3 py-1 rounded mt-2" @click="addPoint">Add Point</button>
  </div>

  
  <div class="border border-gray-300 rounded-lg p-3 mb-2 space-y-2">
    <label class="block text-xs font-semibold uppercase text-gray-500">Tags</label>
    <div
      v-for="(tag, index) in currentSectionData.tags"
      :key="index"
      class="flex justify-between items-center space-x-2"
    >
      <input
        v-model="currentSectionData.tags[index]"
        type="text"
        class="flex-grow border-none focus:ring-0 p-0 m-0"
      />
      <button class="text-red-500 text-sm" @click="deleteTag(index)">Delete</button>
    </div>
    <button class="bg-black text-white px-3 py-1 rounded mt-2" @click="addTag">Add Tag</button>
  </div>

  
  <div class="border border-gray-300 rounded-lg p-3 mb-2">
    <label class="block text-xs font-semibold uppercase text-gray-500">Tag Description</label>
    <textarea
      v-model="currentSectionData.tagDescription"
      rows="3"
      class="w-full text-sm border-none focus:ring-0 p-0 m-0 resize-none"
    ></textarea>
  </div>
</template>
