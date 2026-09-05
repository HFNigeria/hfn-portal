
<script setup>
import { ref, watch } from 'vue'
import ImageUploader from '@/components/layout/ImageUploader.vue'

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(['update:modelValue'])

const currentSectionData = ref(props.modelValue || {})

watch(
  () => props.modelValue,
  (val) => {
    currentSectionData.value = val || {}
  }
)

watch(
  currentSectionData,
  (val) => {
    emit('update:modelValue', val)
  },
  { deep: true }
)  
</script>

<template>

            <div class="flex space-x-6">
              <!-- LEFT SIDE -->
              <div class="w-3/5 space-y-6">
                <div class="border border-gray-300 rounded-lg p-3 space-y-2">
                  <label
                    class="block text-xs font-semibold uppercase text-gray-500"
                    >Title Highlight</label
                  >
                  <input
                    v-model="currentSectionData.titleHighlight"
                    type="text"
                    class="w-full text-lg border-none focus:ring-0 p-0 m-0"
                  />
                </div>

                <div class="border border-gray-300 rounded-lg p-3 space-y-2">
                  <label
                    class="block text-xs font-semibold uppercase text-gray-500"
                    >Title Main</label
                  >
                  <input
                    v-model="currentSectionData.titleMain"
                    type="text"
                    class="w-full text-lg border-none focus:ring-0 p-0 m-0"
                  />
                </div>

                <div class="border border-gray-300 rounded-lg p-3 space-y-2">
                  <label
                    class="block text-xs font-semibold uppercase text-gray-500"
                    >Description Top</label
                  >
                  <textarea
                    v-model="currentSectionData.descriptionTop"
                    rows="2"
                    class="w-full text-sm border-none focus:ring-0 p-0 m-0 resize-none"
                  ></textarea>
                </div>

                <div class="border border-gray-300 rounded-lg p-3 space-y-2">
                  <label
                    class="block text-xs font-semibold uppercase text-gray-500"
                    >Description Text</label
                  >
                  <textarea
                    v-model="currentSectionData.descriptionText"
                    rows="2"
                    class="w-full text-sm border-none focus:ring-0 p-0 m-0 resize-none"
                  ></textarea>
                </div>

                <div class="border border-gray-300 rounded-lg p-3 space-y-2">
                  <label
                    class="block text-xs font-semibold uppercase text-gray-500"
                    >Description Bottom</label
                  >
                  <textarea
                    v-model="currentSectionData.descriptionBottom"
                    rows="2"
                    class="w-full text-sm border-none focus:ring-0 p-0 m-0 resize-none"
                  ></textarea>
                </div>

                <div class="border border-gray-300 rounded-lg p-3 space-y-2">
                  <label
                    class="block text-xs font-semibold uppercase text-gray-500"
                    >CTA Label</label
                  >
                  <input
                    v-model="currentSectionData.ctaLabel"
                    type="text"
                    class="w-full text-base border-none focus:ring-0 p-0 m-0"
                  />
                </div>

                <div class="border border-gray-300 rounded-lg p-3 space-y-2">
                  <label
                    class="block text-xs font-semibold uppercase text-gray-500"
                    >CTA Link</label
                  >
                  <input
                    v-model="currentSectionData.ctaLink"
                    type="text"
                    class="w-full text-base border-none focus:ring-0 p-0 m-0"
                  />
                </div>
              </div>

              <!-- RIGHT SIDE -->
              <div class="w-2/5 space-y-6">
                <image-uploader v-model="currentSectionData.image" />
                <div class="border border-gray-300 rounded-lg p-3 space-y-2">
                  <label
                    class="block text-xs font-semibold uppercase text-gray-500"
                    >Background Color</label
                  >
                  <input
                    type="color"
                    v-model="currentSectionData.backgroundColor"
                    class="w-12 h-8 rounded border-none p-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          

</template>
