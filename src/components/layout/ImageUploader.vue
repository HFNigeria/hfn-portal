<script setup>
import { ref, watch } from 'vue'
import { uploadPageImage } from '@/utils/imageUpload.js'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])
const isUploading = ref(false)
const errorMessage = ref('')
const noticeMessage = ref('')
const manualUrl = ref(props.modelValue || '')

watch(
  () => props.modelValue,
  (val) => {
    manualUrl.value = val || ''
  }
)

const handleChange = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  errorMessage.value = ''
  noticeMessage.value = ''
  isUploading.value = true
  try {
    const result = await uploadPageImage(file)
    emit('update:modelValue', result.url)
    if (!result.hosted) {
      noticeMessage.value =
        'Image could not be uploaded to the media service, so it was embedded in the page data. It will still save.'
    }
  } catch (e) {
    const detail = e?.response?.data ?? e?.message ?? e
    errorMessage.value =
      'Image upload failed. ' +
      (typeof detail === 'string' ? detail : JSON.stringify(detail)) +
      ' You can paste an image URL below instead.'
  } finally {
    isUploading.value = false
    event.target.value = ''
  }
}

const applyManualUrl = () => {
  emit('update:modelValue', manualUrl.value.trim())
}
</script>

<template>
  <div class="border border-gray-300 rounded-lg p-3 space-y-2">
    <label class="block text-xs font-semibold uppercase text-gray-500">
      Hero Image
    </label>
    <input
      type="file"
      accept="image/*"
      :disabled="isUploading"
      @change="handleChange"
    />
    <p v-if="isUploading" class="text-sm text-gray-500">Uploading...</p>
    <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
    <p v-if="noticeMessage" class="text-sm text-amber-600">
      {{ noticeMessage }}
    </p>
    <input
      v-model="manualUrl"
      type="url"
      placeholder="Or paste an image URL"
      class="w-full text-sm border border-gray-200 rounded px-2 py-1"
      @change="applyManualUrl"
    />
    <img
      v-if="modelValue"
      :src="modelValue"
      alt="Hero preview"
      class="mt-2 max-h-40 w-full object-cover rounded"
    />
  </div>
</template>
