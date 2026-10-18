<script setup>
import { ref, watch } from "vue";


const props = defineProps({
  modelValue: Object,
});


const emit = defineEmits(["update:modelValue"]);


const getDefaultData = () => ({
  title: "",
  subtitle: "",
  description: "",
  projects: [
    {
      id: Date.now(),
      title: "",
      summary: "",
      image: "",
      problem: "",
      solution: "",
      outcomes: "",
      layoutReverse: false,
      useAlternativeBg: false,
    },
  ],
});


const currentSectionData = ref({
  ...getDefaultData(),
  ...props.modelValue,
});


watch(
  () => props.modelValue,
  (val) => {
    currentSectionData.value = {
      ...getDefaultData(),
      ...val,
    };
  },
  { deep: true }
);


watch(
  currentSectionData,
  (val) => emit("update:modelValue", val),
  { deep: true }
);


const addProject = () => {
  currentSectionData.value.projects.push({
    id: Date.now(),
    title: "",
    summary: "",
    image: "",
    problem: "",
    solution: "",
    outcomes: "",
    layoutReverse: false,
    useAlternativeBg: false,
  });
};

const removeProject = (index) => {
  currentSectionData.value.projects.splice(index, 1);
};
</script>

<template>
  <div class="space-y-4 max-w-full">

    
    <div class="border border-gray-300 rounded-lg p-3 space-y-2">
      <label class="block text-xs font-semibold uppercase text-gray-500">Section Title</label>
      <input v-model="currentSectionData.title" type="text" class="w-full border-none focus:ring-0" />
    </div>

    
    <div class="border border-gray-300 rounded-lg p-3 space-y-2">
      <label class="block text-xs font-semibold uppercase text-gray-500">Subtitle</label>
      <input v-model="currentSectionData.subtitle" type="text" class="w-full border-none focus:ring-0" />
    </div>

    
    <div class="border border-gray-300 rounded-lg p-3 space-y-2">
      <label class="block text-xs font-semibold uppercase text-gray-500">Description</label>
      <textarea v-model="currentSectionData.description" rows="3" class="w-full border-none focus:ring-0 resize-none"></textarea>
    </div>

    
    <div v-for="(project, index) in currentSectionData.projects" :key="project.id" class="border border-gray-300 rounded-lg p-3 space-y-2">
      <div class="flex justify-between items-center mb-2">
        <span class="font-bold text-sm">Project {{ index + 1 }}</span>
        <button @click="removeProject(index)" class="text-red-500 text-xs">Remove</button>
      </div>

      <div class="space-y-2">
        <label class="block text-xs font-semibold uppercase text-gray-500">Title</label>
        <input v-model="project.title" type="text" class="w-full border-none focus:ring-0" />

        <label class="block text-xs font-semibold uppercase text-gray-500">Summary</label>
        <textarea v-model="project.summary" rows="2" class="w-full border-none focus:ring-0 resize-none"></textarea>

        <label class="block text-xs font-semibold uppercase text-gray-500">Image</label>
        <input v-model="project.image" type="text" class="w-full border-none focus:ring-0" />

        <label class="block text-xs font-semibold uppercase text-gray-500">Problem</label>
        <textarea v-model="project.problem" rows="2" class="w-full border-none focus:ring-0 resize-none"></textarea>

        <label class="block text-xs font-semibold uppercase text-gray-500">Solution</label>
        <textarea v-model="project.solution" rows="2" class="w-full border-none focus:ring-0 resize-none"></textarea>

        <label class="block text-xs font-semibold uppercase text-gray-500">Outcomes</label>
        <textarea v-model="project.outcomes" rows="2" class="w-full border-none focus:ring-0 resize-none"></textarea>

        <div class="flex space-x-4 mt-2">
          <label class="flex items-center space-x-1 text-xs">
            <input type="checkbox" v-model="project.layoutReverse" />
            <span>Layout Reverse</span>
          </label>
          <label class="flex items-center space-x-1 text-xs">
            <input type="checkbox" v-model="project.useAlternativeBg" />
            <span>Use Alternative Background</span>
          </label>
        </div>
      </div>
    </div>

    
    <button @click="addProject" class="px-3 py-1 bg-green-500 text-white rounded text-xs">Add Project</button>
  </div>
</template>
