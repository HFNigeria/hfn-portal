<script setup>
import usersApi from '@/api/userRegister';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import LearnerSidebar from './LearnerSidebar.vue';


const router = useRouter();
const user = ref(null)
const loading = ref(true)
const certificate = ref(null)
const certificateUrl = ref(null)
const enrollmentId = ref(null)

onMounted(async () => {
  try {
    const res = await usersApi.getUser()
    user.value = res.data

    await loadCertificate()

  } catch (e) {
    console.error('Failed to load user', e)
  } finally {
    loading.value = false
  }
})  

const loadCertificate = async () => {
  try {
    const res = await usersApi.generateCertificate(enrollmentId.value)

    certificate.value = res
    certificateUrl.value = res.pdf_url

  } catch (err) {
    console.error("Certificate loading failed", err)
  }
}  
const viewCertificateInNewTab = () => {
  if (certificate.value) {
    window.open(
      `/api/learning/certificates/${certificate.value.id}/download/`,
      "_blank"
    )
  }
}
const subscription = computed(() => ({
  type: user.value?.membership_type || 'None',
  expiresAt: user.value?.membership_expires_at,
  isActive: user.value?.is_active,
  invoices: [],
  totalPages: 1,
  currentPage: 1,
}))


const makePayment = () => {
  router.push({ name: 'UserSubscription' });
};

const goToPage = (page) => {
  if (page >= 1 && page <= subscription.totalPages) {
    subscription.currentPage = page;
    console.log(`Navigating to page ${page}`);
  }
};

const isOrganization = ref(true);
const currentView = ref('My Profile');
const activeTab = ref('My Profile');

const navLinks = [
  
  {
    title: 'My Learning',
    path: '/learner/dashboard',
    icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20zm-1-8V7h2v5h4l-5 5-5-5h4z',
  },

  {
    title: "Courses",
    path: "/learner/courses",
    icon: "M12 3L1 9l11 6 9-5.1V17h2V9L12 3zm0 4.2L18.6 9 12 12.8 5.4 9 12 7.2z",
  },
  
  {
    title: 'My Account',
    path: '/learner/account',
    icon: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2',
  },
  {
    title: 'Support',
    path: '/learner/support',
    icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20zm0-13a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zm0 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  },
  {
     name: 'Logout',
     icon: 'M11 16l-4-4m0 0l4-4m-4 4h14M3 12h2a2 2 0 002-2V6a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H9a2 2 0 00-2 2v-4',
   },
];
  

watch(currentView, (newVal) => {
  if (newVal === 'My Account') activeTab.value = 'My Profile';
});

const isOrgEditing = ref(false);
const orgDetails = reactive({
  name: '',
  email: '',
  phone: '',
  password: '********',
});
const orgDetailsKeys = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email Address' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'password', label: 'Password' },
];

const isIndividualEditing = ref(false);
const individualDetails = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '********',
})


const individualDetailsKeys = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email Address' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'password', label: 'Password' },
];

const isOtherDetailsEditing = ref(false);
const otherDetails = reactive({
  addressLine1: 'Address Line 1',
  addressLine2: 'Address Line 2',
  state: 'State',
  country: 'Country',
  description: '',
});

const invitations = reactive([
  { id: 1, email: 'peterpan@gmail.com', sent: true },
  { id: 2, email: '', sent: false },
  { id: 3, email: '', sent: false },
]);

const sentInvitesCount = computed(
  () => invitations.filter((i) => i.sent).length
);

const toggleOrgEdit = () => {
  if (isOrgEditing.value) {
    console.log(
      'Saving Organization Details:',
      JSON.parse(JSON.stringify(orgDetails))
    );
  }
  isOrgEditing.value = !isOrgEditing.value;
};

const toggleIndividualEdit = () => {
  if (isIndividualEditing.value) {
    console.log(
      'Saving Individual Details:',
      JSON.parse(JSON.stringify(individualDetails))
    );
  }
  isIndividualEditing.value = !isIndividualEditing.value;
};

const toggleOtherDetailsEdit = () => {
  if (isOtherDetailsEditing.value) {
    console.log(
      'Saving Other Details:',
      JSON.parse(JSON.stringify(otherDetails))
    );
  }
  isOtherDetailsEditing.value = !isOtherDetailsEditing.value;
};

const sendInvitation = (id) => {
  const invite = invitations.find((i) => i.id === id);
  if (invite && invite.email !== '') {
    console.log(`Sending invite to: ${invite.email}`);
    invite.sent = true;
  }
};

const removeInvitation = (id) => {
  const invite = invitations.find((i) => i.id === id);
  if (invite) {
    invite.email = '';
    invite.sent = false;
  }
};

const toggleInterest = (id) => {
  const item = interests.find((i) => i.id === id);

  if (item && !item.isMainCategory) {
    const willBeSelected = !item.selected;

    if (willBeSelected && selectedInterestsCount.value >= 4) {
      console.log('Cannot select more than 4 secondary interests.');
      return;
    }

    item.selected = willBeSelected;
  }
};

watch(user, (u) => {
  if (!u) return
  individualDetails.value = {
    firstName: u.first_name ?? '',
    lastName: u.last_name ?? '',
    email: u.email ?? '',
    phone: u.phone_number ?? '',
    password: '********',
  }
}, { immediate: true })

</script>

<template>
  <div
    class="flex flex-col lg:flex-row min-h-screen font-sans bg-white border-0"
  >
    <LearnerSidebar
      class="hidden md:flex"
      :navLinks="navLinks"
      @update:view="currentView = $event"
      :currentView="currentView"
    />

    <main class="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
      <span class="text-sm text-gray-500"
        >Home > My Account > {{ activeTab }}</span
      >

      <header class="mb-8 text-center">
        <h1 class="text-3xl font-bold mt-2 text-gray-800">{{ currentView }}</h1>
      </header>

      <div v-if="currentView === 'My Profile'">
        <div
          class="flex justify-center border-b border-gray-200 mb-8 space-x-6"
        >
          <button
            @click="activeTab = 'My Profile'"
            :class="[
              'py-2 px-1 border-b-2 transition duration-150 font-medium',
              activeTab === 'My Profile'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            ]"
          >
            My Profile
          </button>
          <button
            @click="activeTab = 'My Certificate'"
            :class="[
              'py-2 px-1 border-b-2 transition duration-150 font-medium',
              activeTab === 'My Certificate'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            ]"
          >
            My Certificate
          </button>

          <button
            @click="activeTab = 'Subscription'"
            :class="[
              'py-2 px-1 border-b-2 transition duration-150 font-medium',
              activeTab === 'Subscription'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            ]"
          >
            Subscription
          </button>
          
        </div>

        <div v-if="activeTab === 'My Profile'" class="space-y-10">
          <div v-if="isOrganization" class="p-6 bg-white shadow-lg space-y-8">
            <h2 class="text-xl font-semibold text-gray-800">Profile</h2>

            <div class="grid md:grid-cols-2 gap-8">
              <div
                class="flex flex-col items-center p-6 border border-gray-200 rounded-xl"
              >
                <div
                  class="w-24 h-24 bg-white border border-gray-300 rounded-lg flex items-center justify-center mb-3 shadow-inner"
                >
                  <svg
                    class="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>

                <span class="text-xs text-gray-500 mb-4">
                  Allowed file types: JPG, PNG, JPEG
                </span>

                <div class="flex space-x-3">
                  <button
                    class="px-4 py-2 text-sm text-green-800 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm transition duration-150"
                  >
                    Save
                  </button>
                  <label
                    for="logoUpload"
                    class="px-4 py-2 text-sm text-white bg-[#0c6b39] hover:bg-[#09572d] rounded-lg shadow-md cursor-pointer transition duration-150"
                  >
                    Upload
                  </label>
                  <input
                    type="file"
                    id="logoUpload"
                    class="hidden"
                    accept=".jpg,.png,.jpeg"
                  />
                </div>
              </div>

              <div class="p-6 rounded-xl shadow-md bg-[#F2F9F3] relative">
                <div class="space-y-4 text-sm text-gray-700">
                  <div
                    v-for="detail in orgDetailsKeys"
                    :key="detail.key"
                    class="flex justify-between items-center"
                  >
                    <span class="font-semibold text-gray-600"
                      >{{ detail.label }}:</span
                    >
                    <input
                      :type="detail.key === 'password' ? 'password' : 'text'"
                      v-model="orgDetails[detail.key]"
                      :disabled="detail.key !== 'password' || !isOrgEditing"
                      :class="[
                        'text-right w-2/3 transition duration-150',
                        detail.key === 'password' && isOrgEditing
                          ? 'bg-white border border-gray-400 rounded-md p-1.5'
                          : 'bg-transparent border-none',
                      ]"
                    />
                  </div>
                </div>

                <div class="flex justify-end mt-6">
                  <button
                    @click="toggleOrgEdit"
                    :class="
                      isOrgEditing
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-[#0c6b39] hover:bg-[#09572d]'
                    "
                    class="px-6 py-2 text-sm text-white rounded-lg shadow-md transition duration-150"
                  >
                    {{ isOrgEditing ? 'Save Changes' : 'Change Password' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="text-center mt-8 pt-6 border-t border-gray-200">
              <h3 class="text-xl font-bold mb-2 text-gray-800">
                Your Account is:
                <span
  :class="user?.is_active ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'"
  class="p-3 rounded-md font-semibold"
>
  {{ user?.is_active ? 'ACTIVE' : 'INACTIVE' }}
</span>

              </h3>
              <p class="text-gray-600">
                Your Exclusive Discount Code is:
                <span
                  class="font-mono font-bold text-lg text-gray-800 tracking-wider"
                  >INDISI2345</span
                >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="inline-block align-text-bottom text-gray-400 ml-1 cursor-pointer"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </p>
            </div>
          </div>

          <div v-else class="p-6 bg-white rounded-xl shadow-lg space-y-8">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold">My Personal Profile</h2>
              <button
                @click="toggleIndividualEdit"
                :class="
                  isIndividualEditing
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[#0c6b39] hover:bg-[#09572d]'
                "
                class="px-6 py-2 text-sm text-white rounded-lg shadow-md transition duration-150"
              >
                {{ isIndividualEditing ? 'Save Changes' : 'Change Password' }}
              </button>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
              <div
                class="flex flex-col items-center p-6 border border-gray-200 rounded-xl bg-gray-50"
              >
                <div
                  class="w-24 h-24 bg-white border border-gray-300 rounded-full flex items-center justify-center mb-3 shadow-inner"
                >
                  <svg
                    class="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>

                <span class="text-xs text-gray-500 mb-4">
                  Allowed file types: JPG, PNG, JPEG
                </span>

                <div class="flex space-x-3">
                  <button
                    class="px-4 py-2 text-sm text-green-800 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm transition duration-150"
                  >
                    Save
                  </button>
                  <label
                    for="profilePicUpload"
                    class="px-4 py-2 text-sm text-white bg-[#0c6b39] hover:bg-[#09572d] rounded-lg shadow-md cursor-pointer transition duration-150"
                  >
                    Upload
                  </label>
                  <input
                    type="file"
                    id="profilePicUpload"
                    class="hidden"
                    accept=".jpg,.png,.jpeg"
                  />
                </div>
              </div>

              <div class="p-6 rounded-xl shadow-md bg-[#F2F9F3] relative">
                <div class="space-y-4 text-sm text-gray-700">
                  <div
                    v-for="detail in individualDetailsKeys"
                    :key="detail.key"
                    class="flex justify-between items-center"
                  >
                    <span class="font-semibold text-gray-600"
                      >{{ detail.label }}:</span
                    >
                    <input
                      :type="detail.key === 'password' ? 'password' : 'text'"
                      v-model="individualDetails[detail.key]"
                      :disabled="
                        detail.key !== 'password' || !isIndividualEditing
                      "
                      :class="[
                        'text-right w-2/3 transition duration-150',
                        detail.key === 'password' && isIndividualEditing
                          ? 'bg-white border border-gray-400 rounded-md p-1.5'
                          : 'bg-transparent border-none',
                      ]"
                    />
                  </div>
                </div>
                <div class="flex justify-end mt-6">
                  <button
                    @click="toggleIndividualEdit"
                    :class="
                      isIndividualEditing
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-[#0c6b39] hover:bg-[#09572d]'
                    "
                    class="px-6 py-2 text-sm text-white rounded-lg shadow-md transition duration-150"
                  >
                    {{ isIndividualEditing ? 'Save Changes' : 'Edit' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="text-center mt-8 pt-6 border-t border-gray-200">
              <h3 class="text-xl font-bold mb-2 text-gray-800">
                Account Status: <span class="text-green-600">VERIFIED</span>
              </h3>
            </div>
          </div>

          <div class="p-6 bg-white rounded-xl shadow-lg">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold">Other Details</h2>
              <button
                @click="toggleOtherDetailsEdit"
                :class="
                  isOtherDetailsEditing
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[#0c6b39] hover:bg-[#09572d]'
                "
                class="px-6 py-2 text-sm text-white rounded-lg shadow-md transition duration-150"
              >
                {{ isOtherDetailsEditing ? 'Save Changes' : 'Edit' }}
              </button>
            </div>
            <div class="space-y-4">
              <input
                type="text"
                placeholder="Address Line 1"
                v-model="otherDetails.addressLine1"
                :disabled="!isOtherDetailsEditing"
                :class="
                  isOtherDetailsEditing
                    ? 'bg-white border-gray-400'
                    : 'bg-gray-50 border-gray-300'
                "
                class="w-full p-3 border rounded-lg focus:ring-primary-green focus:border-primary-green transition duration-150"
              />
              <input
                type="text"
                placeholder="Address Line 2"
                v-model="otherDetails.addressLine2"
                :disabled="!isOtherDetailsEditing"
                :class="
                  isOtherDetailsEditing
                    ? 'bg-white border-gray-400'
                    : 'bg-gray-50 border-gray-300'
                "
                class="w-full p-3 border rounded-lg focus:ring-primary-green focus:border-primary-green transition duration-150"
              />

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  v-model="otherDetails.state"
                  :disabled="!isOtherDetailsEditing"
                  :class="
                    isOtherDetailsEditing
                      ? 'bg-white border-gray-400'
                      : 'bg-gray-50 border-gray-300'
                  "
                  class="w-full p-3 border rounded-lg appearance-none focus:ring-primary-green focus:border-primary-green transition duration-150"
                >
                  <option value="">Select Option (State)</option>
                  <option value="Mock State">Mock State</option>
                </select>
                <select
                  v-model="otherDetails.country"
                  :disabled="!isOtherDetailsEditing"
                  :class="
                    isOtherDetailsEditing
                      ? 'bg-white border-gray-400'
                      : 'bg-gray-50 border-gray-300'
                  "
                  class="w-full p-3 border rounded-lg appearance-none focus:ring-primary-green focus:border-primary-green transition duration-150"
                >
                  <option value="">Select Option (Country)</option>
                  <option value="Mock Country">Mock Country</option>
                </select>
              </div>

              <textarea
                rows="3"
                placeholder="Brief Description"
                v-model="otherDetails.description"
                :disabled="!isOtherDetailsEditing"
                :class="
                  isOtherDetailsEditing
                    ? 'bg-white border-gray-400'
                    : 'bg-gray-50 border-gray-300'
                "
                class="w-full p-3 border rounded-lg focus:ring-primary-green focus:border-primary-green resize-none transition duration-150"
              ></textarea>
            </div>
          </div>

          <div class="p-6 bg-white rounded-xl shadow-lg">
            <h2 class="text-xl font-semibold mb-4">My Interests</h2>
            <p class="text-sm text-gray-600 mb-6">
              Select up to four categories you're into. We'll help you find
              great things to learn. (Selected: {{ selectedInterestsCount }}/4)
            </p>

            <div class="flex flex-wrap gap-3">
              <button
                v-for="interest in interests"
                :key="interest.id"
                @click="toggleInterest(interest.id)"
                :disabled="
                  !interest.selected &&
                  selectedInterestsCount >= 4 &&
                  !interest.isMainCategory
                "
                :class="{
                  'bg-green-100 text-green-700': interest.isMainCategory,
                  'bg-orange-100 text-orange-700 hover:bg-orange-200':
                    interest.selected && !interest.isMainCategory,
                  'bg-gray-100 text-gray-700 hover:bg-gray-200':
                    !interest.selected && !interest.isMainCategory,
                }"
                class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full cursor-pointer transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {{ interest.name }}
                <svg
                  v-if="interest.isMainCategory"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-4 h-4 ml-2"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <svg
                  v-else-if="interest.selected"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-4 h-4 ml-2"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-4 h-4 ml-2"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'Subscription'" class="space-y-10">
          <div
            class="p-10 bg-[#F2F9F3] rounded-xl shadow-lg text-center border-2 border-green-300"
          >
            <h3 class="text-3xl font-sans text-[#333] mb-2">
              Subscription Type:
              <span class="text-[#004D33] font-bold">{{ subscription.type }}</span>
            </h3>

            <p class="text-sm text-gray-700 mb-10">
              Purchased on <span class="font-medium">{{ new Date(subscription.expiresAt).toLocaleDateString() }}</span>
            </p>
            <h2 class="text-2xl font-semibold mb-3 text-gray-800">
              Your subscription expires on:
            </h2>
            <p class="text-4xl font-bold text-orange-600 mb-6">
              {{ subscription.expiryDate }}
            </p>
            <button
              @click="makePayment"
              class="px-8 py-3 text-lg text-white bg-[#0c6b39] hover:bg-[#09572d] rounded-lg shadow-md transition duration-150 font-semibold"
            >
              Renew/Upgrade Membership
            </button>
          </div>

          <div>
            <h2 class="text-2xl font-semibold mb-6 text-gray-800">
              My Invoices
            </h2>

            <div
              class="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-t-lg"
            >
              <p class="text-sm text-gray-700">
                Showing 1 to {{ subscription.invoices.length }} of
                {{ subscription.totalEntries }} entries
              </p>
              <div class="relative">
                <input
                  type="text"
                  placeholder="Search"
                  class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
                <svg
                  class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>

            <div
              class="overflow-x-auto bg-white border border-gray-200 shadow-lg rounded-b-lg"
            >
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Invoice #
                      <span class="ml-1 text-gray-400">⋮</span>
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Invoice Date
                      <span class="ml-1 text-gray-400">⋮</span>
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Due Date
                      <span class="ml-1 text-gray-400">⋮</span>
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                      <span class="ml-1 text-gray-400">⋮</span>
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status/Action
                      <span class="ml-1 text-gray-400">⋮</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="invoice in subscription.invoices"
                    :key="invoice.id"
                  >
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {{ invoice.invoiceNo }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ invoice.invoiceDate }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ invoice.dueDate }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                      {{ invoice.total }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                      >
                        {{ invoice.status }}
                      </span>
                      <a
                        v-for="invoice in subscription.invoices"
                        :key="invoice.id"
                        :href="invoice.downloadUrl"
                        download
                        class="ml-4 text-green-600 hover:text-green-900 flex items-center inline-block"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="w-4 h-4 mr-1"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                        Download
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              class="flex justify-end items-center mt-4 text-sm text-gray-600"
            >
              <p class="mr-4">
                Page {{ subscription.currentPage }} of
                {{ subscription.totalPages }}
              </p>
              <button
                @click="goToPage(subscription.currentPage - 1)"
                :disabled="subscription.currentPage === 1"
                class="flex items-center text-gray-400 hover:text-gray-600 disabled:opacity-50 mr-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Prev
              </button>
              <button
                @click="goToPage(subscription.currentPage + 1)"
                :disabled="subscription.currentPage === subscription.totalPages"
                class="flex items-center text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div v-else-if="activeTab === 'My Certificate'" class="space-y-10">
          <div
            class="p-10 bg-white rounded-xl shadow-lg border border-gray-200"
          >
            <h2 class="text-2xl font-semibold mb-4 text-gray-800">
              My Certificate
            </h2>

            <p class="text-gray-600 mb-6">
              Preview and download your certificate below.
            </p>

            <!-- Certificate Preview Box -->
            <div
              class="w-full border border-gray-300 rounded-lg overflow-hidden shadow-md bg-gray-50 flex justify-center items-center h-80"
            >
              <iframe
                v-if="certificateUrl"
                :src="certificateUrl"
                class="w-full h-full"
              ></iframe>

              <div v-else class="text-center text-gray-500">
                Certificate preview unavailable
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex justify-center space-x-4">
              <a
  v-if="certificate"
  :href="`https://temp-hf.onrender.com/api/learning/certificates/${certificate.id}/download/`"
  target="_blank"
  class="px-6 py-2 bg-[#0c6b39] hover:bg-[#09572d] text-white rounded-lg shadow"
>
  Download Certificate
</a>

              <button
                @click="viewCertificateInNewTab"
                class="px-6 py-2 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100"
              >
                Open in New Tab
              </button>
            </div>
          </div>
        </div>

        <div
          v-else
          class="p-10 text-center bg-white rounded-xl shadow-lg text-gray-500"
        >
          <h2 class="text-2xl font-semibold mb-3">
            Content for {{ activeTab }}
          </h2>
          <p>
            This section will contain details related to your
            {{ activeTab }} preferences or status.
          </p>
        </div>
      </div>

      <div
        v-else
        class="p-10 text-center bg-white rounded-xl shadow-lg text-gray-500"
      >
        <h2 class="text-2xl font-semibold mb-3">
          Welcome to the {{ currentView }} Page
        </h2>
        <p>
          This is where the content for the primary {{ currentView }} view would
          be rendered. The sidebar controls the major page view.
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped>
:root {
  --primary-green: #0c6b39;
  --sidebar-green: #104037;
  --sidebar-green-dark: #09572d;
  --light-green-bg: #f2f9f3;
  --active-light-green: #d1fae5;
}

.font-inter {
  font-family: 'Inter', sans-serif;
}

.main-button {
  background-color: var(--primary-green);
  transition: all 0.2s;
}
.main-button:hover {
  background-color: var(--sidebar-green-dark);
}
.org-info-card {
  background-color: var(--light-green-bg);
}

.tab-active {
  border-bottom: 2px solid var(--primary-green);
  color: var(--primary-green);
  font-weight: 600;
}
</style>
