<script setup>
import { nextTick, ref, watch } from "vue";

const props = defineProps({
  modelValue: Object,
});

const emit = defineEmits(["update:modelValue"]);
let isSyncingFromProp = false;

const getDefaultData = () => ({
  title: "",
  chair: {
    name: "",
    role: "",
    slug: "",
    tag: "",
    image: "",
    bio: "",
  },
  trustees: [],
});

const currentSectionData = ref({
  ...getDefaultData(),
  ...props.modelValue,
});

watch(
  () => props.modelValue,
  async (val) => {
    isSyncingFromProp = true;
    const defaultData = getDefaultData();

    currentSectionData.value = {
      ...defaultData,
      ...val,

      chair: {
        ...defaultData.chair,
        ...(val?.chair || {}),
      },

      trustees: (val?.trustees?.length
        ? val.trustees
        : defaultData.trustees
      ).map((t) => ({
        name: "",
        title: "",
        slug: "",
        image: "",
        bio: "",
        ...t,
      })),
    };
    await nextTick();
    isSyncingFromProp = false;
  },
  { immediate: true }
);

watch(currentSectionData, (val) => {
  if (!isSyncingFromProp) {
    emit("update:modelValue", val);
  }
}, { deep: true });

const addTrustee = () => {
  if (!currentSectionData.value.trustees) {
    currentSectionData.value.trustees = [];
  }

  currentSectionData.value.trustees.push({
    name: "",
    title: "",
    slug: "",
    image: "",
    bio: "",
  });
};

const removeTrustee = (index) => {
  currentSectionData.value.trustees.splice(index, 1);
};
</script>

<template>
  <div class="space-y-4">
    <div class="border border-gray-300 rounded-lg p-3 space-y-2">
      <label class="block text-xs font-semibold uppercase text-gray-500">
        Section Title
      </label>
      <input
        v-model="currentSectionData.title"
        type="text"
        class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>

    <div class="border border-gray-300 rounded-lg p-4 space-y-3">
      <h4 class="font-semibold text-sm">Chair</h4>

      <label class="text-xs font-semibold uppercase text-gray-500">Name</label>
      <input
        v-model="currentSectionData.chair.name"
        class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />

      <label class="text-xs font-semibold uppercase text-gray-500">Role</label>
      <input
        v-model="currentSectionData.chair.role"
        class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />

      <label class="text-xs font-semibold uppercase text-gray-500">Slug</label>
      <input
        v-model="currentSectionData.chair.slug"
        class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />

      <label class="text-xs font-semibold uppercase text-gray-500">Tag</label>
      <input
        v-model="currentSectionData.chair.tag"
        class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />

      <label class="text-xs font-semibold uppercase text-gray-500"
        >Image URL</label
      >
      <input
        v-model="currentSectionData.chair.image"
        class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>

    <div
      v-for="(trustee, index) in currentSectionData.trustees"
      :key="index"
      class="border border-gray-300 rounded-lg p-4 space-y-3"
    >
      <div class="flex justify-between items-center">
        <h4 class="font-semibold text-sm">Trustee {{ index + 1 }}</h4>
        <button @click="removeTrustee(index)" class="text-red-500 text-sm">
          Delete
        </button>
      </div>

      <label class="text-xs font-semibold uppercase text-gray-500">Name</label>
      <input v-model="trustee.name" class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" />

      <label class="text-xs font-semibold uppercase text-gray-500">Title</label>
      <input v-model="trustee.title" class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" />

      <label class="text-xs font-semibold uppercase text-gray-500">Slug</label>
      <input v-model="trustee.slug" class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" />

      <label class="text-xs font-semibold uppercase text-gray-500"
        >Image URL</label
      >
      <input v-model="trustee.image" class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      <label class="text-xs font-semibold uppercase text-gray-500">Bio</label>
      <textarea
        v-model="trustee.bio"
        class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
        rows="4"
      />
    </div>

    <button
      @click="addTrustee"
      class="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800"
    >
      + Add Trustee
    </button>
  </div>
</template>  
