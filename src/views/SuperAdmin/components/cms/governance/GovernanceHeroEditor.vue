<script setup>
import { nextTick, ref, watch } from 'vue'

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(["update:modelValue"])
let isSyncingFromProp = false

const currentSectionData = ref({
  titleHighlight: '',
  titleMain: '',
  description: '',
  image: '',
  backgroundColor: '#F2F9F3',
  ...props.modelValue
})

watch(
  () => props.modelValue,
  async (val) => {
    isSyncingFromProp = true
    currentSectionData.value = {
      titleHighlight: '',
      titleMain: '',
      description: '',
      image: '',
      backgroundColor: '#F2F9F3',
      ...val
    }
    await nextTick()
    isSyncingFromProp = false
  }
)

watch(currentSectionData, (val) => {
  if (!isSyncingFromProp) {
    emit("update:modelValue", val)
  }
}, { deep: true })

</script>

<template>
  <div class="space-y-4">
    <div class="border border-gray-300 rounded-lg p-3 space-y-2">
      <label class="block text-xs font-semibold uppercase text-gray-500">
        Title Highlight
      </label>
      <input
        v-model="currentSectionData.titleHighlight"
        type="text"
        class="w-full border-none focus:ring-0"
      />
    </div>

    <div class="border border-gray-300 rounded-lg p-3 space-y-2">
      <label class="block text-xs font-semibold uppercase text-gray-500">
        Title Main
      </label>
      <input
        v-model="currentSectionData.titleMain"
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
        rows="4"
        class="w-full border-none focus:ring-0 resize-none"
      ></textarea>
    </div>

    <div class="border border-gray-300 rounded-lg p-3 space-y-2">
      <label class="block text-xs font-semibold uppercase text-gray-500">
        Image URL
      </label>
      <input
        v-model="currentSectionData.image"
        type="text"
        class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>

    <div class="border border-gray-300 rounded-lg p-3 space-y-2">
      <label class="block text-xs font-semibold uppercase text-gray-500">
        Background Color
      </label>
      <div class="flex items-center space-x-2">
        <input
          v-model="currentSectionData.backgroundColor"
          type="color"
          class="w-8 h-8 rounded border-none p-0 cursor-pointer"
        />
        <input
          v-model="currentSectionData.backgroundColor"
          type="text"
          class="flex-grow text-base border-none focus:ring-0 p-0 m-0 font-mono uppercase"
        />
      </div>
    </div>
  </div>
</template>
