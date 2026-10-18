<script setup>
import { ref, watch } from "vue";
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});



const getDefaultSectionData = () => ({
  title: "",

  description: "",

  fields: [
    {
      id: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter name",
      required: true,
    },
    {
      id: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter email",
      required: true,
    },
    {
      id: "subject",
      label: "Subject",
      type: "text",
      placeholder: "Enter subject",
      required: true,
    },
    {
      id: "message",
      label: "Message",
      type: "textarea",
      placeholder: "Write your message...",
      rows: 5,
      required: true,
    },
  ],

  submitButtonText: "",

  successMessage:
    "",
});

const mergeData = (data = {}) => {
  const defaults = getDefaultSectionData();

  return {
    ...defaults,
    ...data,
    fields: data.fields?.length ? data.fields : defaults.fields,
  };
};



const currentSectionData = computed({
  get() {
    return mergeData(props.modelValue);
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const addField = () => {
  currentSectionData.value.fields.push({
    id: `field_${Date.now()}`, 
    label: "",
    type: "text",
    placeholder: "",
    required: false,
  });
};


const deleteField = (index) => {
  currentSectionData.value.fields.splice(index, 1);
};

const emit = defineEmits(["update:modelValue"]);








</script>

<template>
         
            <div class="space-y-6">
              
              <div class="border border-gray-300 rounded-lg p-3 space-y-2">
                <label
                  class="block text-xs font-semibold uppercase text-gray-500"
                >
                  Form Title
                </label>
                <input
                  v-model="currentSectionData.title"
                  type="text"
                  class="w-full text-lg border-none focus:ring-0 p-0 m-0"
                />
              </div>

              
              <div class="border border-gray-300 rounded-lg p-3 space-y-2">
                <label
                  class="block text-xs font-semibold uppercase text-gray-500"
                >
                  Description
                </label>
                <textarea
                  v-model="currentSectionData.description"
                  rows="3"
                  class="w-full text-sm border-none focus:ring-0 p-0 m-0 resize-none"
                />
              </div>

              
              <div
                v-for="(field, index) in currentSectionData.fields"
                :key="index"
                class="border border-gray-300 rounded-lg p-4 space-y-4"
              >
                <div class="flex justify-between items-center">
                  <h4 class="text-sm font-semibold text-gray-700">
                    Field {{ index + 1 }}
                  </h4>
                  <button
                    @click="deleteField(index)"
                    class="text-red-500 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <input
                    v-model="field.label"
                    placeholder="Label"
                    class="border border-gray-200 rounded p-2 text-sm"
                  />
                  <input
                    v-model="field.placeholder"
                    placeholder="Placeholder"
                    class="border border-gray-200 rounded p-2 text-sm"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <select
                    v-model="field.type"
                    class="border border-gray-200 rounded p-2 text-sm"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="textarea">Textarea</option>
                  </select>

                  <label class="flex items-center text-sm space-x-2">
                    <input type="checkbox" v-model="field.required" />
                    <span>Required</span>
                  </label>
                </div>
              </div>

              <button
                @click="addField"
                class="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold"
              >
                Add Field
              </button>

              
              <div class="border border-gray-300 rounded-lg p-3 space-y-2">
                <label
                  class="block text-xs font-semibold uppercase text-gray-500"
                >
                  Submit Button Text
                </label>
                <input
                  v-model="currentSectionData.submitButtonText"
                  type="text"
                  class="w-full text-sm border-none focus:ring-0 p-0 m-0"
                />
              </div>

              
              <div class="border border-gray-300 rounded-lg p-3 space-y-2">
                <label
                  class="block text-xs font-semibold uppercase text-gray-500"
                >
                  Success Message
                </label>
                <textarea
                  v-model="currentSectionData.successMessage"
                  rows="2"
                  class="w-full text-sm border-none focus:ring-0 p-0 m-0 resize-none"
                />
              </div>
            </div>

</template>
