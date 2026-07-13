<script setup>
import { nextTick, ref, watch } from 'vue'

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(["update:modelValue"])
let isSyncingFromProp = false

const currentSectionData = ref({
  title: '',
  executives: [],
  ...props.modelValue
})

watch(
  () => props.modelValue,
  async (val) => {
    isSyncingFromProp = true
    currentSectionData.value = {
      title: '',
      executives: [],
      ...val
    }
    await nextTick()
    isSyncingFromProp = false
  },
  { immediate: true }
)

watch(currentSectionData, (val) => {
  if (!isSyncingFromProp) {
    emit("update:modelValue", val)
  }
}, { deep: true })

const addExecutives = () => {
  if (!currentSectionData.value.executives) {
    currentSectionData.value.executives = []
  }

  currentSectionData.value.executives.push({
    name: '',
    role: '',
    slug: '',
    image: '',
    profile: '',
    bio: '',
    socials: []
  })
}

const removeExecutives = (index) => {
  currentSectionData.value.executives.splice(index, 1)
}

const addSocial = (memberIndex) => {
  if (!currentSectionData.value.executives[memberIndex].socials) {
    currentSectionData.value.executives[memberIndex].socials = []
  }

  currentSectionData.value.executives[memberIndex].socials.push({
    platform: '',
    url: ''
  })
}

const removeSocial = (memberIndex, socialIndex) => {
  currentSectionData.value.executives[memberIndex].socials.splice(
    socialIndex,
    1
  )
}
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

    <div
      v-for="(member, index) in currentSectionData.executives"
      :key="index"
      class="border border-gray-300 rounded-lg p-4 space-y-3"
    >
      <div class="flex justify-between items-center">
        <h4 class="font-semibold text-sm">Member {{ index + 1 }}</h4>
        <button
          @click="removeExecutives(index)"
          class="text-red-500 text-sm"
        >
          Delete
        </button>
      </div>

      <label class="text-xs font-semibold uppercase text-gray-500"
        >Name</label
      >
      <input
        v-model="member.name"
        class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />

      <label class="text-xs font-semibold uppercase text-gray-500"
        >Role</label
      >
      <input
        v-model="member.role"
        class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />

      <label class="text-xs font-semibold uppercase text-gray-500"
        >Slug</label
      >
      <input
        v-model="member.slug"
        class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />

      <label class="text-xs font-semibold uppercase text-gray-500"
        >Image URL</label
      >
      <input
        v-model="member.image"
        class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />

      <label class="text-xs font-semibold uppercase text-gray-500"
        >Profile</label
      >
      <textarea
        v-model="member.profile"
        rows="3"
        class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
      ></textarea>
      <label class="text-xs font-semibold uppercase text-gray-500"
        >Bio</label
      >
      <textarea
        v-model="member.bio"
        rows="3"
        class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
      ></textarea>


      <div
        v-for="(social, sIndex) in member.socials"
        :key="sIndex"
        class="flex gap-2 items-center"
      >
        <input
          v-model="social.platform"
          placeholder="Platform"
          class="border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent w-32"
        />
        <input
          v-model="social.url"
          placeholder="URL"
          class="border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent flex-1"
        />
        <button
          @click="removeSocial(index, sIndex)"
          class="text-red-500"
        >
          ×
        </button>
      </div>

      <button
        @click="addSocial(index)"
        class="bg-gray-200 px-3 py-1 rounded text-sm"
      >
        + Add Social
      </button>
    </div>

    <button
      @click="addExecutives"
      class="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800"
    >
      + Add Member
    </button>
  </div>
</template>  
