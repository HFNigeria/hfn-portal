<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: Object,
});

const emit = defineEmits(["update:modelValue"]);


const getDefaultData = () => ({
  contact: {
    address: "",
    email: "",
    phone: "",
    phoneLink: "",
  },
  navColumns: [],
  socials: [],
  legal: [],
  copyrightSuffix: "",
});

const currentSectionData = ref(getDefaultData());


watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      currentSectionData.value = JSON.parse(JSON.stringify(val));
    }
  },
  { immediate: true, deep: true }
);

watch(
  currentSectionData,
  (val) => {
    emit("update:modelValue", val);
  },
  { deep: true }
);


const addColumn = () => {
  currentSectionData.value.navColumns.push({
    title: "New Column",
    links: [],
  });
};

const deleteColumn = (index) => {
  currentSectionData.value.navColumns.splice(index, 1);
};

const addLink = (colIndex) => {
  currentSectionData.value.navColumns[colIndex].links.push({
    label: "New Link",
    url: "/",
  });
};

const deleteLink = (colIndex, linkIndex) => {
  currentSectionData.value.navColumns[colIndex].links.splice(linkIndex, 1);
};


const addSocial = () => {
  currentSectionData.value.socials.push({
    platform: "",
    url: "",
    icon: "",
  });
};

const deleteSocial = (index) => {
  currentSectionData.value.socials.splice(index, 1);
};


const addLegal = () => {
  currentSectionData.value.legal.push({
    label: "",
    url: "",
  });
};

const deleteLegal = (index) => {
  currentSectionData.value.legal.splice(index, 1);
};
</script>




<template>
  <div class="space-y-8">

    <div class="border p-4 rounded-lg space-y-4">
      <h3 class="font-bold text-lg">Contact Info</h3>

      <textarea
        v-model="currentSectionData.contact.address"
        placeholder="Address (use line breaks)"
        class="w-full border rounded p-2 text-sm"
      />

      <input
        v-model="currentSectionData.contact.email"
        placeholder="Email"
        class="w-full border rounded p-2 text-sm"
      />

      <input
        v-model="currentSectionData.contact.phone"
        placeholder="Phone"
        class="w-full border rounded p-2 text-sm"
      />

      <input
        v-model="currentSectionData.contact.phoneLink"
        placeholder="Phone Link (tel:...)"
        class="w-full border rounded p-2 text-sm"
      />
    </div>

    <div class="border p-4 rounded-lg space-y-4">
      <div class="flex justify-between">
        <h3 class="font-bold text-lg">Navigation Columns</h3>
        <button @click="addColumn" class="text-sm bg-gray-100 px-3 py-1 rounded">
          Add Column
        </button>
      </div>

      <div
        v-for="(col, colIndex) in currentSectionData.navColumns"
        :key="colIndex"
        class="border rounded p-4 space-y-3"
      >
        <div class="flex justify-between">
          <input
            v-model="col.title"
            class="border p-2 text-sm w-full"
          />
          <button @click="deleteColumn(colIndex)" class="text-red-500 text-xs ml-2">
            Delete
          </button>
        </div>

        <div
          v-for="(link, linkIndex) in col.links"
          :key="linkIndex"
          class="grid grid-cols-2 gap-2"
        >
          <input
            v-model="link.label"
            placeholder="Label"
            class="border p-2 text-sm"
          />
          <input
            v-model="link.url"
            placeholder="URL"
            class="border p-2 text-sm"
          />

          <button
            @click="deleteLink(colIndex, linkIndex)"
            class="text-red-500 text-xs col-span-2"
          >
            Delete Link
          </button>
        </div>

        <button
          @click="addLink(colIndex)"
          class="text-sm bg-gray-100 px-3 py-1 rounded"
        >
          Add Link
        </button>
      </div>
    </div>

    <div class="border p-4 rounded-lg space-y-4">
      <div class="flex justify-between">
        <h3 class="font-bold text-lg">Social Media</h3>
        <button @click="addSocial" class="text-sm bg-gray-100 px-3 py-1 rounded">
          Add Social
        </button>
      </div>

      <div
        v-for="(social, index) in currentSectionData.socials"
        :key="index"
        class="grid grid-cols-3 gap-2 border p-3 rounded"
      >
        <input v-model="social.platform" placeholder="Platform" class="border p-2 text-sm" />
        <input v-model="social.url" placeholder="URL" class="border p-2 text-sm" />
        <input v-model="social.icon" placeholder="Icon class" class="border p-2 text-sm" />

        <button @click="deleteSocial(index)" class="text-red-500 text-xs col-span-3">
          Delete
        </button>
      </div>
    </div>

    
    <div class="border p-4 rounded-lg space-y-4">
      <div class="flex justify-between">
        <h3 class="font-bold text-lg">Legal Links</h3>
        <button @click="addLegal" class="text-sm bg-gray-100 px-3 py-1 rounded">
          Add Legal
        </button>
      </div>

      <div
        v-for="(item, index) in currentSectionData.legal"
        :key="index"
        class="grid grid-cols-2 gap-2 border p-3 rounded"
      >
        <input v-model="item.label" placeholder="Label" class="border p-2 text-sm" />
        <input v-model="item.url" placeholder="URL" class="border p-2 text-sm" />

        <button @click="deleteLegal(index)" class="text-red-500 text-xs col-span-2">
          Delete
        </button>
      </div>
    </div>

    <div class="border p-4 rounded-lg space-y-2">
      <label class="text-xs font-semibold uppercase text-gray-500">
        Copyright Text
      </label>
      <input
        v-model="currentSectionData.copyrightSuffix"
        class="w-full border rounded p-2 text-sm"
      />
    </div>

  </div>
</template>
