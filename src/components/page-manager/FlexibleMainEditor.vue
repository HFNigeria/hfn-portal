<script setup>
import { ref, watch } from "vue";
import draggable from "vuedraggable";

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
  if (Array.isArray(value.rows) && value.rows.length) return value;

  const blocks = (value.paragraphs || []).map((paragraph) =>
    makeTextBlock(paragraph)
  );

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

const addBlock = (column, type) => {
  column.blocks.push(
    type === "image"
      ? { id: makeId("block"), type, src: "", alt: "" }
      : makeTextBlock()
  );
};

const removeBlock = (column, blockId) => {
  column.blocks = column.blocks.filter((block) => block.id !== blockId);
};

const readImage = (event, block) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    block.src = reader.result;
  };
  reader.readAsDataURL(file);
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

    <section
      v-for="(row, rowIndex) in mainContent.rows"
      :key="row.id"
      class="rounded border border-gray-300 bg-gray-50 p-4"
    >
      <header class="mb-4 flex items-center justify-between">
        <h3 class="font-semibold text-gray-800">Row {{ rowIndex + 1 }} · {{ row.columns.length }} column{{ row.columns.length === 1 ? "" : "s" }}</h3>
        <button
          type="button"
          class="text-sm text-red-700 hover:underline"
          @click="mainContent.rows.splice(rowIndex, 1)"
        >
          Remove row
        </button>
      </header>

      <div class="content-columns" :style="{ '--column-count': row.columns.length }">
        <section
          v-for="(column, columnIndex) in row.columns"
          :key="column.id"
          class="min-w-0 rounded border border-dashed border-gray-400 bg-white p-3"
        >
          <h4 class="mb-3 text-xs font-semibold uppercase text-gray-500">Column {{ columnIndex + 1 }}</h4>
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