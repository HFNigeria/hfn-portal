<script setup>
import { ref, watch } from "vue";
import { resolveAsset } from "@/utils/assetMap";

const props = defineProps({
  modelValue: Array
});

const emit = defineEmits(["update:modelValue"]);

const currentSectionData = ref(props.modelValue || []);

watch(
  () => props.modelValue,
  (val) => {
    currentSectionData.value = val || [];
  }
);

watch(
  currentSectionData,
  (val) => {
    emit("update:modelValue", val);
  },
  { deep: true }
);
  
const addPartnerLogo = () => {
  currentSectionData.value.logos.push("");
};

const removePartnerLogo = (index) => {
  currentSectionData.value.logos.splice(index, 1);
};

const logoPreview = (key) => {
  if (!key) return '';
  const resolved = resolveAsset(key);
  return resolved || key;
};


</script>  
<template>

            <div class="space-y-6">
              
              <div class="border border-gray-300 rounded-lg p-3 space-y-2">
                <label
                  class="block text-xs font-semibold uppercase text-gray-500"
                >
                  Section Title
                </label>
                <input
                  v-model="currentSectionData.title"
                  type="text"
                  class="w-full text-lg border-none focus:ring-0 p-0 m-0"
                />
              </div>

              
              <div class="border border-gray-300 rounded-lg p-4 space-y-4">
                <div class="flex justify-between items-center">
                  <label class="text-xs font-semibold uppercase text-gray-500">
                    Partner Logos
                  </label>

                  <button
                    class="text-sm bg-black text-white px-3 py-1 rounded"
                    @click="addPartnerLogo"
                  >
                    + Add Logo
                  </button>
                </div>

                <div
                  v-for="(logo, index) in currentSectionData.logos"
                  :key="index"
                  class="flex items-center space-x-3 border rounded p-2"
                >
                  <div class="w-12 h-12 shrink-0 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    <img
                      v-if="logoPreview(logo)"
                      :src="logoPreview(logo)"
                      alt="preview"
                      class="max-w-full max-h-full object-contain"
                      @error="$event.target.style.display = 'none'"
                    />
                  </div>
                  <input
                    v-model="currentSectionData.logos[index]"
                    type="text"
                    class="flex-grow border-none focus:ring-0"
                    placeholder="logo-key or cloudinary-id"
                  />

                  <button
                    class="text-red-500 text-sm shrink-0"
                    @click="removePartnerLogo(index)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          
</template> 
