<script setup>
import { ref, watch } from 'vue'


const props = defineProps({
  modelValue: Object
})


const emit = defineEmits(['update:modelValue'])


const currentSectionData = ref({
  items: [],
  ...props.modelValue
})


watch(
  () => props.modelValue,
  (val) => {
    currentSectionData.value = { items: [], ...val }
  }
)


watch(
  currentSectionData,
  (val) => {
    emit('update:modelValue', val)
  },
  { deep: true }
)


const addItem = () => {
  currentSectionData.value.items.push({
    title: '',
    shortDesc: '',
    fullDesc: '',
    colorClass: ''
  })
}

const deleteItem = (index) => {
  currentSectionData.value.items.splice(index, 1)
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

  
  <div class="border border-gray-300 rounded-lg p-3 mb-4">
    <label class="block text-xs font-semibold uppercase text-gray-500">Image</label>
    <input
      v-model="currentSectionData.image"
      type="text"
      placeholder="Enter image URL or use uploader"
      class="w-full border-none focus:ring-0 p-0 m-0"
    />
  </div>

  
  <div class="border border-gray-300 rounded-lg p-3 space-y-2">
    <label class="block text-xs font-semibold uppercase text-gray-500">Items</label>

    <div
      v-for="(item, index) in currentSectionData.items"
      :key="index"
      class="border border-gray-200 p-3 rounded mb-2 space-y-2"
    >
      <label class="block text-xs font-semibold uppercase text-gray-500">Title</label>
      <input
        v-model="item.title"
        type="text"
        class="w-full border-none focus:ring-0 p-0 m-0"
      />

      <label class="block text-xs font-semibold uppercase text-gray-500">Short Description</label>
      <input
        v-model="item.shortDesc"
        type="text"
        class="w-full border-none focus:ring-0 p-0 m-0"
      />

      <label class="block text-xs font-semibold uppercase text-gray-500">Full Description</label>
      <textarea
        v-model="item.fullDesc"
        rows="3"
        class="w-full text-sm border-none focus:ring-0 p-0 m-0 resize-none"
      ></textarea>

      <label class="block text-xs font-semibold uppercase text-gray-500">Color Class</label>
      <input
        v-model="item.colorClass"
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
      class="bg-black text-white px-3 py-1 rounded mt-2"
      @click="addItem"
    >
      Add Item
    </button>
  </div>
</template>
