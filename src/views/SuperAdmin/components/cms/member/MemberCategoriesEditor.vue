<script setup>
import { ref, watch } from "vue";


const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});


const emit = defineEmits(["update:modelValue"]);

const currentSectionData = ref([]);

watch(
  () => props.modelValue,
  (val) => {
    currentSectionData.value = val ? JSON.parse(JSON.stringify(val)) : [];
  },
  { immediate: true, deep: true }
);

watch(
  currentSectionData,
  (val) => {
    emit("update:modelValue", JSON.parse(JSON.stringify(val)));
  },
  { deep: true }
);
</script>

<template>
  <div
    v-for="(category, catIndex) in currentSectionData"
    :key="catIndex"
    class="border border-gray-300 rounded-lg p-4 space-y-4"
  >
    <div>
      <label class="block text-xs font-semibold uppercase text-gray-500">
        Category Name
      </label>
      <input
        v-model="category.name"
        type="text"
        class="w-full border-none focus:ring-0 p-0 m-0"
      />
    </div>

    <div>
      <label class="block text-xs font-semibold uppercase text-gray-500">
        Description
      </label>
      <input
        v-model="category.description"
        type="text"
        class="w-full border-none focus:ring-0 p-0 m-0"
      />
    </div>

    <div
      v-for="(plan, planIndex) in category.plans"
      :key="planIndex"
      class="border border-gray-200 rounded-md p-3 space-y-2"
    >
      <input
        v-model="plan.title"
        placeholder="Plan Title"
        class="w-full border-none p-0 m-0"
      />
      <input
        v-model="plan.price"
        placeholder="Price"
        class="w-full border-none p-0 m-0"
      />
      <input
        v-model="plan.audience"
        placeholder="Audience"
        class="w-full border-none p-0 m-0"
      />

      <div
        v-for="(benefit, benefitIndex) in plan.benefits"
        :key="benefitIndex"
        class="flex items-center gap-2"
      >
        <input
          v-model="plan.benefits[benefitIndex]"
          class="flex-1 border-none p-0 m-0"
        />
        <button
          class="text-red-500 text-sm"
          @click="plan.benefits.splice(benefitIndex, 1)"
        >
          X
        </button>
      </div>

      <button
        class="text-sm text-black"
        @click="plan.benefits.push('New benefit')"
      >
        + Add Benefit
      </button>

      <button
        class="text-red-500 text-sm"
        @click="category.plans.splice(planIndex, 1)"
      >
        Delete Plan
      </button>
    </div>

    <button
      class="text-sm bg-black text-white px-3 py-1 rounded"
      @click="
        category.plans.push({
          title: '',
          price: '',
          audience: '',
          benefits: [],
        })
      "
    >
      + Add Plan
    </button>

    <button
      class="text-red-500 text-sm"
      @click="currentSectionData.splice(catIndex, 1)"
    >
      Delete Category
    </button>
  </div>

  <button
    class="bg-black text-white px-4 py-2 rounded"
    @click="
      currentSectionData.push({
        id: '',
        name: '',
        description: '',
        plans: [],
      })
    "
  >
    + Add Category
  </button>
</template>