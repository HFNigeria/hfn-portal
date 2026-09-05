<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])
const isUploading = ref(false)
const errorMessage = ref('')

const handleChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  errorMessage.value = ''
  isUploading.value = true
  const reader = new FileReader()
  reader.onload = () => {
    emit('update:modelValue', reader.result)
    isUploading.value = false
  }
  reader.onerror = () => {
    errorMessage.value = 'Image upload failed.'
    isUploading.value = false
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="border border-gray-300 rounded-lg p-3 space-y-2">
    <label class="block text-xs font-semibold uppercase text-gray-500">
      Hero Image
    </label>
    <input type="file" accept="image/*" @change="handleChange" />
    <p v-if="isUploading" class="text-sm text-gray-500">Uploading...</p>
    <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
    <img
      v-if="modelValue"
      :src="modelValue"
      alt="Hero preview"
      class="mt-2 max-h-40 w-full object-cover rounded"
    />
  </div>
</template>