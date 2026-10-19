<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue']);
const section = ref(props.modelValue || {});

watch(
  () => props.modelValue,
  (value) => {
    section.value = value || {};
  }
);

watch(
  section,
  (value) => emit('update:modelValue', value),
  { deep: true }
);

const icons = [
  { value: '', label: 'No icon' },
  { value: 'star', label: 'Star' },
  { value: 'check', label: 'Check' },
  { value: 'heart', label: 'Heart' },
  { value: 'info', label: 'Information' },
  { value: 'arrow', label: 'Arrow' },
];

const ensureStyleArrays = () => {
  const count = section.value.paragraphs?.length || 0;
  if (!Array.isArray(section.value.paragraphBackgroundColors)) {
    section.value.paragraphBackgroundColors = [];
  }
  if (!Array.isArray(section.value.paragraphIcons)) {
    section.value.paragraphIcons = [];
  }
  while (section.value.paragraphBackgroundColors.length < count) {
    section.value.paragraphBackgroundColors.push('');
  }
  while (section.value.paragraphIcons.length < count) {
    section.value.paragraphIcons.push('');
  }
};

watch(
  () => section.value.paragraphs?.length,
  ensureStyleArrays,
  { immediate: true }
);

const addParagraph = () => {
  if (!Array.isArray(section.value.paragraphs)) {
    section.value.paragraphs = [];
  }
  section.value.paragraphs.push('');
  ensureStyleArrays();
};

const deleteParagraph = (index) => {
  section.value.paragraphs.splice(index, 1);
  section.value.paragraphBackgroundColors?.splice(index, 1);
  section.value.paragraphIcons?.splice(index, 1);
};

const setFontSize = (field, event) => {
  const value = Number(event.target.value);
  if (Number.isFinite(value)) {
    section.value[field] = Math.min(72, Math.max(12, value));
  }
};

const clearParagraphBackground = (index) => {
  section.value.paragraphBackgroundColors[index] = '';
};
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-lg border border-gray-200 p-4 space-y-4">
      <h3 class="font-semibold text-gray-800">Main section</h3>
      <label class="block space-y-1">
        <span class="text-sm text-gray-600">Heading</span>
        <input
          v-model="section.sectionTitle"
          type="text"
          class="w-full rounded border border-gray-300 p-2"
        />
      </label>

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="flex items-center justify-between gap-3 text-sm text-gray-600">
          Section background
          <input v-model="section.backgroundColor" type="color" class="h-9 w-12 cursor-pointer" />
        </label>
        <label class="flex items-center justify-between gap-3 text-sm text-gray-600">
          Heading color
          <input v-model="section.headingColor" type="color" class="h-9 w-12 cursor-pointer" />
        </label>
        <label class="flex items-center justify-between gap-3 text-sm text-gray-600">
          Text color
          <input v-model="section.textColor" type="color" class="h-9 w-12 cursor-pointer" />
        </label>
        <label class="flex items-center justify-between gap-3 text-sm text-gray-600">
          Icon color
          <input v-model="section.iconColor" type="color" class="h-9 w-12 cursor-pointer" />
        </label>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="flex items-center gap-2 text-sm text-gray-600">
          <input v-model="section.headingUnderline" type="checkbox" />
          Underline heading
        </label>
        <label class="flex items-center justify-between gap-3 text-sm text-gray-600">
          Underline color
          <input
            v-model="section.headingUnderlineColor"
            type="color"
            class="h-9 w-12 cursor-pointer"
            :disabled="!section.headingUnderline"
          />
        </label>
        <label class="flex items-center justify-between gap-3 text-sm text-gray-600">
          Heading size (12–72 px)
          <input
            :value="section.headingFontSize ?? 36"
            type="number"
            min="12"
            max="72"
            class="w-20 rounded border border-gray-300 p-2"
            @change="setFontSize('headingFontSize', $event)"
          />
        </label>
        <label class="flex items-center justify-between gap-3 text-sm text-gray-600">
          Text size (12–72 px)
          <input
            :value="section.textFontSize ?? 18"
            type="number"
            min="12"
            max="72"
            class="w-20 rounded border border-gray-300 p-2"
            @change="setFontSize('textFontSize', $event)"
          />
        </label>
        <label class="flex items-center justify-between gap-3 text-sm text-gray-600">
          Content columns
          <select v-model.number="section.columns" class="rounded border border-gray-300 p-2">
            <option :value="1">1 column</option>
            <option :value="2">2 columns</option>
            <option :value="3">3 columns</option>
          </select>
        </label>
      </div>
    </div>

    <div
      v-for="(paragraph, index) in section.paragraphs"
      :key="index"
      class="rounded-lg border border-gray-200 p-4 space-y-3"
    >
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-gray-800">Content block {{ index + 1 }}</h3>
        <button type="button" class="text-sm text-red-600" @click="deleteParagraph(index)">
          Remove
        </button>
      </div>
      <textarea
        v-model="section.paragraphs[index]"
        rows="4"
        class="w-full rounded border border-gray-300 p-2"
        :aria-label="`Content block ${index + 1}`"
      ></textarea>
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="flex items-center justify-between gap-3 text-sm text-gray-600">
          Row / column background
          <input
            v-model="section.paragraphBackgroundColors[index]"
            type="color"
            class="h-9 w-12 cursor-pointer"
          />
        </label>
        <label class="flex items-center justify-between gap-3 text-sm text-gray-600">
          Icon
          <select v-model="section.paragraphIcons[index]" class="rounded border border-gray-300 p-2">
            <option v-for="icon in icons" :key="icon.value" :value="icon.value">
              {{ icon.label }}
            </option>
          </select>
        </label>
      </div>
      <button
        v-if="section.paragraphBackgroundColors[index]"
        type="button"
        class="text-xs text-gray-500 underline"
        @click="clearParagraphBackground(index)"
      >
        Clear block background
      </button>
    </div>

    <button
      type="button"
      class="rounded bg-[#004d33] px-4 py-2 text-white hover:bg-green-800"
      @click="addParagraph"
    >
      Add content block
    </button>
  </div>
</template>
