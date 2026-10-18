<script setup>
import { ref, watch } from 'vue'


const props = defineProps({
  modelValue: Object
})


const emit = defineEmits(['update:modelValue'])

const currentSectionData = ref({
  units: [],
  ...props.modelValue
})

watch(
  () => props.modelValue,
  (val) => {
    currentSectionData.value = { units: [], ...val }
  }
)

watch(
  currentSectionData,
  (val) => {
    emit('update:modelValue', val)
  },
  { deep: true }
)

const addUnit = () => {
  if (!currentSectionData.value.units) {
    currentSectionData.value.units = []
  }
  currentSectionData.value.units.push('')
}

const deleteUnit = (index) => {
  currentSectionData.value.units.splice(index, 1)
}
</script>

<template>

            <div class="border border-gray-300 rounded-lg p-3 mb-4">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Title</label
              >
              <input
                v-model="currentSectionData.title"
                type="text"
                class="w-full border-none focus:ring-0 p-0 m-0"
              />
            </div>

            <div class="border border-gray-300 rounded-lg p-3 mb-2 space-y-2">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Description</label
              >
              <textarea
                v-model="currentSectionData.note"
                rows="3"
                class="w-full text-sm border-none focus:ring-0 p-0 m-0 resize-none"
              ></textarea>
            </div>

            <div class="border border-gray-300 rounded-lg p-3 space-y-2">
              <label class="block text-xs font-semibold uppercase text-gray-500"
                >Units</label
              >
              <div
                v-for="(unit, index) in currentSectionData.units"
                :key="index"
                class="flex justify-between items-center space-x-2"
              >
                <input
                  v-model="currentSectionData.units[index]"
                  type="text"
                  class="flex-grow border-none focus:ring-0 p-0 m-0"
                />
                <button class="text-red-500 text-sm" @click="deleteUnit(index)">
                  Delete
                </button>
              </div>
              <button
                class="bg-black text-white px-3 py-1 rounded mt-2"
                @click="addUnit"
              >
                Add Unit
              </button>
            </div>

  </template>
