<script setup>
import { ref, watch } from "vue";
import draggable from "vuedraggable";
import { uploadPageImage } from "@/utils/imageUpload.js";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue"]);
const mainContent = ref(normalizeMain(props.modelValue));

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeTextBlock(content = "") {
  return { id: makeId("block"), type: "text", heading: "", content };
}

function normalizeMain(value = {}) {
  if (
    Array.isArray(value.rows) &&
    (value.rows.length || !value.paragraphs?.some((paragraph) => paragraph))
  ) {
    return value;
  }

  const blocks = (value.paragraphs || []).map((paragraph, index) => ({
    ...makeTextBlock(paragraph),
    backgroundColor: value.paragraphBackgroundColors?.[index] || "",
    icon: value.paragraphIcons?.[index] || "",
    iconColor: value.iconColor || "#004d33",
    textColor: value.textColor || "#374151",
    fontSize: value.textFontSize || 18,
  }));

  ["mission", "vision"].forEach((field) => {
    if (value[field]) {
      blocks.push({ ...makeTextBlock(value[field]), heading: field });
    }
  });

  ["rolePoints", "commitmentGoals"].forEach((field) => {
    if (value[field]?.length) {
      blocks.push({
        ...makeTextBlock(value[field].join("\n")),
        heading: field === "rolePoints" ? "Role points" : "Commitment goals",
      });
    }
  });

  if (value.image) {
    blocks.push({
      id: makeId("block"),
      type: "image",
      src: value.image,
      alt: "",
    });
  }

  return {
    ...value,
    rows: [
      {
        id: makeId("row"),
        columns: [{ id: makeId("column"), blocks }],
      },
    ],
  };
}

watch(
  () => props.modelValue,
  (value) => {
    mainContent.value = normalizeMain(value || {});
  }
);

watch(
  mainContent,
  (value) => emit("update:modelValue", value),
  { deep: true }
);

const addRow = (columnCount) => {
  mainContent.value.rows.push({
    id: makeId("row"),
    columns: Array.from({ length: columnCount }, () => ({
      id: makeId("column"),
      blocks: [],
    })),
  });
};

const icons = [
  { value: "", label: "No icon" },
  { value: "star", label: "Star" },
  { value: "check", label: "Check" },
  { value: "heart", label: "Heart" },
  { value: "info", label: "Information" },
  { value: "arrow", label: "Arrow" },
];

const clearBackground = (item) => {
  item.backgroundColor = "";
};

const setFontSize = (target, field, event) => {
  const value = Number(event.target.value);
  if (Number.isFinite(value)) {
    target[field] = Math.min(72, Math.max(12, value));
  }
};

const addBlock = (column, type) => {
  column.blocks.push(
    type === "image"
      ? { id: makeId("block"), type, src: "", alt: "" }
      : {
          ...makeTextBlock(),
          textColor: "#374151",
          fontSize: 18,
          headingColor: "#111827",
          headingFontSize: 24,
          headingUnderline: false,
          headingUnderlineColor: "#111827",
          icon: "",
          iconColor: "#004d33",
          backgroundColor: "",
        }
  );
};

const removeBlock = (column, blockId) => {
  column.blocks = column.blocks.filter((block) => block.id !== blockId);
};

const readImage = async (event, block) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const { url } = await uploadPageImage(file);
    block.src = url;
  } catch (e) {
    console.error("Image upload failed", e);
    alert(
      "Image upload failed. Try a different image, or paste an image URL instead."
    );
  } finally {
    event.target.value = "";
  }
};
</script>

<template>
  <div class="space-y-6">
    <label class="block">
      <span class="mb-2 block text-xs font-semibold uppercase text-gray-500">Main section title</span>
      <input
        v-model="mainContent.sectionTitle"
        type="text"
        class="w-full rounded border border-gray-300 px-3 py-2"
        placeholder="Section title"
      />
    </label>
    <div class="grid gap-3 rounded border border-gray-200 p-3 sm:grid-cols-2">
      <label class="flex items-center justify-between gap-2 text-xs text-gray-600">
        Section heading color
        <input v-model="mainContent.headingColor" type="color" class="h-8 w-10 cursor-pointer" />
      </label>
      <label class="flex items-center justify-between gap-2 text-xs text-gray-600">
        Section heading size (12–72 px)
        <input
          :value="mainContent.headingFontSize ?? 36"
          type="number"
          min="12"
          max="72"
          class="w-20 rounded border border-gray-300 px-2 py-1"
          @change="setFontSize(mainContent, 'headingFontSize', $event)"
        />
      </label>
      <label class="flex items-center gap-2 text-xs text-gray-600">
        <input v-model="mainContent.headingUnderline" type="checkbox" />
        Underline section heading
      </label>
      <label class="flex items-center justify-between gap-2 text-xs text-gray-600">
        Underline color
        <input
          v-model="mainContent.headingUnderlineColor"
          type="color"
          class="h-8 w-10 cursor-pointer"
          :disabled="!mainContent.headingUnderline"
        />
      </label>
    </div>

    <section
      v-for="(row, rowIndex) in mainContent.rows"
      :key="row.id"
      class="rounded border border-gray-300 bg-gray-50 p-4"
    >
      <header class="mb-4 flex items-center justify-between">
        <h3 class="font-semibold text-gray-800">Row {{ rowIndex + 1 }} · {{ row.columns.length }} column{{ row.columns.length === 1 ? "" : "s" }}</h3>
        <div class="flex items-center gap-3">
          <label class="flex items-center gap-2 text-xs text-gray-600">
            Row background
            <input
              :value="row.backgroundColor || '#ffffff'"
              type="color"
              class="h-8 w-10 cursor-pointer"
              @input="row.backgroundColor = $event.target.value"
            />
          </label>
          <button
            v-if="row.backgroundColor"
            type="button"
            class="text-xs text-gray-500 underline"
            @click="clearBackground(row)"
          >
            Clear
          </button>
          <button
            type="button"
            class="text-sm text-red-700 hover:underline"
            @click="mainContent.rows.splice(rowIndex, 1)"
          >
            Remove row
          </button>
        </div>
      </header>

      <div class="content-columns" :style="{ '--column-count': row.columns.length }">
        <section
          v-for="(column, columnIndex) in row.columns"
          :key="column.id"
          class="min-w-0 rounded border border-dashed border-gray-400 p-3"
          :style="{ backgroundColor: column.backgroundColor || '#ffffff' }"
        >
          <div class="mb-3 flex items-center justify-between gap-2">
            <h4 class="text-xs font-semibold uppercase text-gray-500">Column {{ columnIndex + 1 }}</h4>
            <div class="flex items-center gap-2">
              <label class="flex items-center gap-1 text-xs text-gray-600">
                Background
                <input
                  :value="column.backgroundColor || '#ffffff'"
                  type="color"
                  class="h-7 w-9 cursor-pointer"
                  @input="column.backgroundColor = $event.target.value"
                />
              </label>
              <button
                v-if="column.backgroundColor"
                type="button"
                class="text-xs text-gray-500 underline"
                @click="clearBackground(column)"
              >
                Clear
              </button>
            </div>
          </div>
          <draggable
            v-model="column.blocks"
            item-key="id"
            group="page-content-blocks"
            handle=".drag-handle"
            class="min-h-16 space-y-3"
            ghost-class="opacity-40"
          >
            <template #item="{ element: block }">
              <article class="rounded border border-gray-200 bg-white p-3 shadow-sm">
                <div class="mb-3 flex items-center justify-between">
                  <button type="button" class="drag-handle cursor-grab text-sm font-medium text-gray-600" title="Drag to another column">
                    Drag {{ block.type }}
                  </button>
                  <button
                    type="button"
                    class="text-sm text-red-700 hover:underline"
                    @click="removeBlock(column, block.id)"
                  >
                    Delete
                  </button>
                </div>

                <template v-if="block.type === 'text'">
                  <input
                    v-model="block.heading"
                    type="text"
                    class="mb-2 w-full rounded border border-gray-300 px-2 py-1"
                    placeholder="Heading (optional)"
                  />
                  <textarea
                    v-model="block.content"
                    rows="5"
                    class="w-full rounded border border-gray-300 px-2 py-2"
                    placeholder="Write your text"
                  ></textarea>
                  <div class="grid gap-3 sm:grid-cols-2">
                    <label class="flex items-center justify-between gap-2 text-xs text-gray-600">
                      Text color
                      <input v-model="block.textColor" type="color" class="h-8 w-10 cursor-pointer" />
                    </label>
                    <label class="flex items-center justify-between gap-2 text-xs text-gray-600">
                      Text size (12–72 px)
                      <input
                        :value="block.fontSize ?? 18"
                        type="number"
                        min="12"
                        max="72"
                        class="w-20 rounded border border-gray-300 px-2 py-1"
                        @change="setFontSize(block, 'fontSize', $event)"
                      />
                    </label>
                    <label class="flex items-center justify-between gap-2 text-xs text-gray-600">
                      Heading color
                      <input v-model="block.headingColor" type="color" class="h-8 w-10 cursor-pointer" />
                    </label>
                    <label class="flex items-center justify-between gap-2 text-xs text-gray-600">
                      Heading size (12–72 px)
                      <input
                        :value="block.headingFontSize ?? 24"
                        type="number"
                        min="12"
                        max="72"
                        class="w-20 rounded border border-gray-300 px-2 py-1"
                        @change="setFontSize(block, 'headingFontSize', $event)"
                      />
                    </label>
                    <label class="flex items-center gap-2 text-xs text-gray-600">
                      <input v-model="block.headingUnderline" type="checkbox" />
                      Underline heading
                    </label>
                    <label class="flex items-center justify-between gap-2 text-xs text-gray-600">
                      Underline color
                      <input
                        v-model="block.headingUnderlineColor"
                        type="color"
                        class="h-8 w-10 cursor-pointer"
                        :disabled="!block.headingUnderline"
                      />
                    </label>
                    <label class="flex items-center justify-between gap-2 text-xs text-gray-600">
                      Icon
                      <select v-model="block.icon" class="rounded border border-gray-300 px-2 py-1">
                        <option v-for="icon in icons" :key="icon.value" :value="icon.value">
                          {{ icon.label }}
                        </option>
                      </select>
                    </label>
                    <label class="flex items-center justify-between gap-2 text-xs text-gray-600">
                      Icon color
                      <input v-model="block.iconColor" type="color" class="h-8 w-10 cursor-pointer" />
                    </label>
                    <label class="flex items-center justify-between gap-2 text-xs text-gray-600">
                      Block background
                      <input
                        :value="block.backgroundColor || '#ffffff'"
                        type="color"
                        class="h-8 w-10 cursor-pointer"
                        @input="block.backgroundColor = $event.target.value"
                      />
                    </label>
                    <button
                      v-if="block.backgroundColor"
                      type="button"
                      class="justify-self-start text-xs text-gray-500 underline"
                      @click="clearBackground(block)"
                    >
                      Clear block background
                    </button>
                  </div>
                </template>

                <template v-else>
                  <input
                    v-model="block.src"
                    type="url"
                    class="mb-2 w-full rounded border border-gray-300 px-2 py-1"
                    placeholder="Image URL"
                  />
                  <input type="file" accept="image/*" class="block w-full text-sm" @change="readImage($event, block)" />
                  <input
                    v-model="block.alt"
                    type="text"
                    class="mt-2 w-full rounded border border-gray-300 px-2 py-1"
                    placeholder="Image description"
                  />
                  <img v-if="block.src" :src="block.src" :alt="block.alt" class="mt-3 max-h-52 w-full object-contain" />
                </template>
              </article>
            </template>
          </draggable>

          <div class="mt-3 flex flex-wrap gap-2">
            <button type="button" class="rounded bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700" @click="addBlock(column, 'text')">
              Add text
            </button>
            <button type="button" class="rounded border border-gray-400 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50" @click="addBlock(column, 'image')">
              Add image
            </button>
          </div>
        </section>
      </div>
    </section>

    <div class="flex flex-wrap items-center gap-3 border-t border-gray-200 pt-5">
      <span class="text-sm font-medium text-gray-700">Add a row:</span>
      <button type="button" class="rounded border border-gray-400 px-3 py-2 text-sm hover:bg-gray-50" @click="addRow(1)">Full width</button>
      <button type="button" class="rounded border border-gray-400 px-3 py-2 text-sm hover:bg-gray-50" @click="addRow(2)">2 columns</button>
      <button type="button" class="rounded border border-gray-400 px-3 py-2 text-sm hover:bg-gray-50" @click="addRow(3)">3 columns</button>
    </div>
  </div>
</template>

<style scoped>
.content-columns {
  display: grid;
  grid-template-columns: repeat(var(--column-count, 1), minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 767px) {
  .content-columns {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>