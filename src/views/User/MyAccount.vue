<script setup>
import learningModule from "@/api/learningModule";
import authApi from "@/api/userRegister";
import UserSidebar from '@/components/layout/UserSidebar.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";


const toast = useToast();  
const router = useRouter();
const isOrganization = ref(false);
const orgDetails = reactive({});
const otherDetails = reactive({});
const interests = ref([]);
const lagosLocalGovts = [
  "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin",
  "Apapa", "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki",
  "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island",
  "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo",
  "Shomolu", "Surulere", "Yaba",
];

const countries = [
  "Nigeria", "Ghana", "South Africa", "Kenya", "Ethiopia", "Tanzania",
  "Uganda", "Rwanda", "Senegal", "Cameroon", "Zambia", "Zimbabwe",
  "Mozambique", "Angola", "Botswana", "Malawi", "Namibia", "Benin",
  "Burkina Faso", "Burundi", "Cape Verde", "Chad", "Comoros", "Congo",
  "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini",
  "Gabon", "Gambia", "Guinea", "Guinea-Bissau", "Ivory Coast",
  "Lesotho", "Liberia", "Libya", "Madagascar", "Mali", "Mauritania",
  "Mauritius", "Morocco", "Niger", "Sao Tome and Principe",
  "Seychelles", "Sierra Leone", "Somalia", "South Sudan", "Sudan",
  "Togo", "Tunisia",
  "United States", "Canada", "United Kingdom", "Germany", "France",
  "Italy", "Spain", "Netherlands", "Belgium", "Switzerland", "Sweden",
  "Norway", "Denmark", "Finland", "Ireland", "Portugal", "Austria",
  "Australia", "New Zealand", "India", "China", "Japan", "Brazil",
  "Mexico", "Argentina", "Colombia", "Chile", "Peru", "Venezuela",
  "Saudi Arabia", "United Arab Emirates", "Qatar", "Kuwait", "Turkey",
  "Israel", "South Korea", "Singapore", "Malaysia", "Indonesia",
  "Philippines", "Vietnam", "Thailand", "Pakistan", "Bangladesh",
];
const certificates = ref([]);
const certificateUrl = ref('');
const userRole = ref('');

const profileImage = ref(null);
const selectedFile = ref(null);
const isUploading = ref(false);

const isOrgEditing = ref(false);

const orgDetailsKeys = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email Address' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'password', label: 'Password' },
];

const individualDetails = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  old_password: '',
  new_password: '',
  confirm_password: '',
});

const isIndividualEditing = ref(false);

const individualDetailsKeys = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email Address' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'password', label: 'Password' },
];

const currentView = ref('My Profile');
const activeTab = ref('My Profile');
const showSidebar = ref(false);

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

const closeSidebar = () => {
  showSidebar.value = false;
};

const downloadCertificate = async (certId) => {
  try {
    const response = await learningModule.downloadCertificate(certId);

    if (response.download_url) {
      const link = document.createElement('a');
      link.href = response.download_url;
      link.target = '_blank';
      link.download = `certificate_${certId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificate_${certId}.pdf`;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading certificate');
  }
}
  

const fetchCertificates = async () => {
  try {
    const res = await learningModule.getEnrollment();

    const data = Array.isArray(res.data)
      ? res.data
      : res.data?.results || [];

    const completedEnrollments = data.filter(
      (e) =>
        e.status === "completed" ||
        Number(e.progress_percentage) === 100
    );

    const certs = [];

    for (const e of completedEnrollments) {
      let certificateData = e.certificate;

      if (!certificateData) {
        try {
          const genRes = await learningModule.generateCertificate({
            enrollment_id: e.id,
          });

          certificateData = genRes.data || genRes;
        } catch (err) {
          console.warn("Certificate generation failed for:", e.id);
          continue;
        }
      }

      if (certificateData) {
        certs.push({
          id: certificateData.id,
          course_title: e.course_title,
          certificate_number: certificateData.certificate_number,
          issued_date: e.completed_at,
          pdf_file: certificateData.pdf_file,
          download_url: certificateData.download_url,
          image_file: certificateData.image_file,
          verify_url: certificateData.verify_url,
        });
      }
    }

    certificates.value = certs;
  } catch (error) {
    console.error("Error fetching certificates", error);
  }
};
  
  
const viewCertificateInNewTab = (cert) => {
  if (cert.pdf_file) {
    window.open(cert.pdf_file, "_blank");
  }
};

const subscription = reactive({
  hasSubscription: false,
  type: '',
  purchasedOn: '',
  expiryDate: '',
  invoices: [],
  currentPage: 1,
  totalPages: 1,
  totalEntries: 0
});


const makePayment = () => {
  router.push({ name: 'UserSubscription' });
};

const goToPage = (page) => {
  if (page >= 1 && page <= subscription.totalPages) {
    subscription.currentPage = page;
    console.log(`Navigating to page ${page}`);
  }
};



const navLinks = [
  {
    name: 'Dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    name: 'My Learning',
    icon: 'M12 6.253v13M3.475 12h17.052M18.82 8.16l-1.397 1.5M5.18 8.16l1.397 1.5',
  },
  {
    name: 'Messages',
    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z',
  },
  {
    name: 'My Account',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    name: 'Support',
    icon: 'M18.364 5.636l-1.414 1.414M16 12a4 4 0 10-8 0 4 4 0 008 0zM12 1v2M12 19v2M5.636 18.364l1.414-1.414M19 12h2M3 12h2M5.636 5.636l1.414 1.414M18.364 18.364l-1.414-1.414',
  },
  {
    name: 'Logout',
    icon: 'M11 16l-4-4m0 0l4-4m-4 4h14M3 12h2a2 2 0 002-2V6a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H9a2 2 0 00-2 2v-4',
  },
];

watch(currentView, (newVal) => {
  if (newVal === 'My Account') activeTab.value = 'My Profile';
});


const invitations = reactive([
  { id: 1, email: '', sent: true },
  { id: 2, email: '', sent: false },
  { id: 3, email: '', sent: false },
]);



// const selectedInterestsCount = computed(
//   () => interests.filter((i) => i.selected && !i.isMainCategory).length
// );
const selectedInterestsCount = computed(
  () =>
    interests.value.filter(
      (i) => i.selected && !i.isMainCategory
    ).length
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


const toggleIndividualEdit = async () => {
  if (isIndividualEditing.value) {
    // Validate first
    if (
      !individualDetails.old_password ||
      !individualDetails.new_password ||
      !individualDetails.confirm_password
    ) {
      toast.error("All password fields are required");
      return;
    }

    if (
      individualDetails.new_password !==
      individualDetails.confirm_password
    ) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      await authApi.changePassword({
        old_password: individualDetails.old_password,
        new_password: individualDetails.new_password,
        confirm_password: individualDetails.confirm_password,
      });

      toast.success("Password changed successfully");

      // Clear fields
      individualDetails.old_password = '';
      individualDetails.new_password = '';
      individualDetails.confirm_password = '';

      isIndividualEditing.value = false;
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
        "Failed to change password"
      );
    }

    return;
  }

  isIndividualEditing.value = true;
};
  
const onProfileImageSelect = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!["image/jpeg", "image/png"].includes(file.type)) {
    toast.error("Only JPG and PNG files are allowed");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    toast.error("File size must be less than 2MB");
    return;
  }

  selectedFile.value = file;
  profileImage.value = URL.createObjectURL(file);
};

const uploadProfileImage = async () => {
  if (!selectedFile.value) return;

  try {
    isUploading.value = true;
    const formData = new FormData();
    formData.append("profile_picture", selectedFile.value);
    const response = await authApi.partialProfileUpdate(formData);
    profileImage.value = response.profile_picture;
    selectedFile.value = null;
    toast.success("Profile picture updated successfully");
  } catch (err) {
    toast.error("Failed to upload profile picture");
  } finally {
    isUploading.value = false;
  }
};

const saveOtherDetails = async () => {
  try {
    const payload = {
      
      state: otherDetails.state,
      country: otherDetails.country,
      organization: otherDetails.organization,
      job_title: otherDetails.job_title,
      professional_license: otherDetails.professional_license,
      years_of_experience: otherDetails.years_of_experience,
      specialization: otherDetails.specialization,
      bio: otherDetails.bio,
      address: otherDetails.address,
      city: otherDetails.city,
      linkedin_url: otherDetails.linkedin_url,
      twitter_handle: otherDetails.twitter_handle,
    };

    if (selectedFile.value) {
      const formData = new FormData();
      for (const key in payload) {
        formData.append(key, payload[key]);
      }
      formData.append("profile_picture", selectedFile.value);
      await authApi.partialProfileUpdate(formData);
      selectedFile.value = null;
    } else {
      await authApi.partialProfileUpdate(payload);
    }

    toast.success("Profile updated successfully");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update profile");
  }
};

const isProfileIncomplete = computed(() => {
  const fields = ['organization', 'job_title', 'specialization', 'bio', 'address', 'city', 'state', 'country'];
  return fields.some(f => !otherDetails[f]);
});

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
  const item = interests.value.find((i) => i.id === id);

  if (item && !item.isMainCategory) {
    const willBeSelected = !item.selected;

    if (willBeSelected && selectedInterestsCount.value >= 4) {
      console.log('Cannot select more than 4 secondary interests.');
      return;
    }

    item.selected = willBeSelected;
  }
};

const fetchUserData = async () => {
  try {
    const res = await authApi.getUser();
    const data = res;

    // Personal info
    individualDetails.firstName = data.first_name || '';
    individualDetails.lastName = data.last_name || '';
    individualDetails.email = data.email || '';
    individualDetails.phone = data.phone_number || '';

    if (data.profile) {
      
      otherDetails.state = data.profile.state || '';
      otherDetails.country = data.profile.country || '';
      otherDetails.description = data.profile.description || '';
      otherDetails.organization = data.profile.organization || '';
      otherDetails.job_title = data.profile.job_title || '';
      otherDetails.professional_license = data.profile.professional_license || '';
      otherDetails.years_of_experience = data.profile.years_of_experience ?? null;
      otherDetails.specialization = data.profile.specialization || '';
      otherDetails.bio = data.profile.bio || '';
      otherDetails.address = data.profile.address || '';
      otherDetails.city = data.profile.city || '';
      otherDetails.linkedin_url = data.profile.linkedin_url || '';
      otherDetails.twitter_handle = data.profile.twitter_handle || '';
      profileImage.value = data.profile.profile_picture || data.profile.profile || null;
      certificateUrl.value = data.profile.certificateUrl || '';
      // interests.splice(0, interests.length, ...(data.profile.interests || []));
      const defaultInterests = [
    {
      id: 1,
      name: "policy",
      selected: false,
      isMainCategory: false,
    },
    {
      id: 2,
      name: "healthcare",
      selected: false,
      isMainCategory: false,
    },
    {
      id: 3,
      name: "advocacy",
      selected: false,
      isMainCategory: false,
    },
    {
      id: 4,
      name: "leadership",
      selected: false,
      isMainCategory: false,
    },
  ];

  const profileInterests =
    Array.isArray(data.profile.interests) &&
    data.profile.interests.length > 0
      ? data.profile.interests
      : defaultInterests;

     interests.value = profileInterests;      
    }

    subscription.hasSubscription = data.is_active;
    subscription.type = data.membership_type || '';
    userRole.value = data.member_category || data.role || '';
    subscription.expiryDate = data.membership_expires_at
      ? new Date(data.membership_expires_at).toLocaleDateString()
      : '';
    subscription.invoices = [];
  } catch (err) {
    console.error('Error fetching user data:', err);
  }
};

onMounted(() => {
  fetchUserData();
    fetchCertificates();

});


</script>

<template>
  <div class="relative flex flex-col lg:flex-row min-h-screen font-sans bg-white border-0">
    <button
      @click="toggleSidebar"
      class="lg:hidden fixed top-20 right-4 z-50 bg-[#004d33] text-white p-2 rounded-md shadow-md"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <div
      v-if="showSidebar"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 z-30 lg:hidden"
      @click="closeSidebar"
    ></div>

    <div
      :class="[
        'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 w-72 max-w-full lg:static lg:translate-x-0 lg:w-64 lg:min-h-screen',
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <UserSidebar
        :currentView="currentView"
        class="h-full"
        @update:view="currentView = $event"
        @closeSidebar="closeSidebar"
      />
    </div>

    <main class="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
      <span class="text-sm text-gray-500">Home > My Account > {{ activeTab }}</span>

      <header class="mb-8 text-center">
        <h1 class="text-3xl font-bold mt-2 text-gray-800">{{ currentView }}</h1>
      </header>

      <div v-if="currentView === 'My Profile'">
        <div class="flex justify-center border-b border-gray-200 mb-8 space-x-6">
          <button @click="activeTab = 'My Profile'" :class="[
            'py-2 px-1 border-b-2 transition duration-150 font-medium',
            activeTab === 'My Profile'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700',
          ]">
            My Profile
          </button>
          <button @click="activeTab = 'My Certificate'" :class="[
            'py-2 px-1 border-b-2 transition duration-150 font-medium',
            activeTab === 'My Certificate'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700',
          ]">
            My Certificate
          </button>

          <button @click="activeTab = 'Subscription'" :class="[
            'py-2 px-1 border-b-2 transition duration-150 font-medium',
            activeTab === 'Subscription'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700',
          ]">
            Subscription
          </button>
          <!-- <button
            @click="activeTab = 'Settings'"
            :class="[
              'py-2 px-1 border-b-2 transition duration-150 font-medium',
              activeTab === 'Settings'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            ]"
          >
            Settings
          </button> -->
        </div>

        <div v-if="activeTab === 'My Profile'" class="space-y-10">
          <div v-if="isOrganization" class="p-6 bg-white shadow-lg space-y-8">
            <h2 class="text-xl font-semibold text-gray-800">Profile</h2>

            <div class="grid md:grid-cols-2 gap-8">
              <div class="flex flex-col items-center p-6 border border-gray-200 rounded-xl">
                <div
                  class="w-24 h-24 bg-white border border-gray-300 rounded-lg flex items-center justify-center mb-3 shadow-inner">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                    </path>
                  </svg>
                </div>

                <span class="text-xs text-gray-500 mb-4">
                  Allowed file types: JPG, PNG, JPEG
                </span>

                <div class="flex space-x-3">
                  <button
                    class="px-4 py-2 text-sm text-green-800 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm transition duration-150">
                    Save
                  </button>
                  <label for="logoUpload"
                    class="px-4 py-2 text-sm text-white bg-[#0c6b39] hover:bg-[#09572d] rounded-lg shadow-md cursor-pointer transition duration-150">
                    Upload
                  </label>
                  <input type="file" id="logoUpload" class="hidden" accept=".jpg,.png,.jpeg" />
                </div>
              </div>

              <div class="p-6 rounded-xl shadow-md bg-[#F2F9F3] relative">
                <div class="space-y-4 text-sm text-gray-700">
                  <div v-for="detail in orgDetailsKeys" :key="detail.key" class="flex justify-between items-center">
                    <span class="font-semibold text-gray-600">{{ detail.label }}:</span>
                    <input :type="detail.key === 'password' ? 'password' : 'text'" v-model="orgDetails[detail.key]"
                      :disabled="detail.key !== 'password' || !isOrgEditing" :class="[
                        'text-right w-2/3 transition duration-150',
                        detail.key === 'password' && isOrgEditing
                          ? 'bg-white border border-gray-400 rounded-md p-1.5'
                          : 'bg-transparent border-none',
                      ]" />
                  </div>
                </div>

                <div class="flex justify-end mt-6">
                  <button @click="toggleOrgEdit" :class="isOrgEditing
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-[#0c6b39] hover:bg-[#09572d]'
                    " class="px-6 py-2 text-sm text-white rounded-lg shadow-md transition duration-150">
                    {{ isOrgEditing ? 'Save Changes' : 'Change Password' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="text-center mt-8 pt-6 border-t border-gray-200">
              <h3 class="text-xl font-bold mb-2 text-gray-800">
                Your Account is:
                <span class="text-green-600 bg-green-50 p-3 rounded-md">ACTIVE</span>
              </h3>
              <p class="text-gray-600">
                Your Exclusive Discount Code is:
                <span class="font-mono font-bold text-lg text-gray-800 tracking-wider">INDISI2345</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="inline-block align-text-bottom text-gray-400 ml-1 cursor-pointer">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </p>
            </div>
          </div>

          <div v-else class="p-6 bg-white rounded-xl shadow-lg space-y-8">
            <div v-if="isProfileIncomplete" class="bg-amber-50 border border-amber-300 text-amber-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <span>Kindly complete your profile details to proceed. Fill in all required fields in the <strong>Other Details</strong> section below.</span>
            </div>
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold">My Personal Profile</h2>
              <button @click="toggleIndividualEdit" :class="isIndividualEditing
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-[#0c6b39] hover:bg-[#09572d]'
                " class="px-6 py-2 text-sm text-white rounded-lg shadow-md transition duration-150">
                {{ isIndividualEditing ? 'Save Changes' : 'Change Password' }}
              </button>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
              <div class="flex flex-col items-center p-6 border border-gray-200 rounded-xl bg-gray-50">
                <div
                  class="w-24 h-24 bg-white border border-gray-300 rounded-full flex items-center justify-center mb-3 shadow-inner overflow-hidden">
                  <img v-if="profileImage" :src="profileImage" class="w-full h-full object-cover" alt="Profile" />
                  <svg v-else class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>

                <span class="text-xs text-gray-500 mb-4">
                  Allowed file types: JPG, PNG, JPEG
                </span>

                <div class="flex space-x-3">
                  <button @click="uploadProfileImage" :disabled="!selectedFile || isUploading"
                    class="px-4 py-2 text-sm text-green-800 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm transition duration-150 disabled:opacity-50">
                    {{ isUploading ? "Saving..." : "Save" }}
                  </button>
                  <label for="profilePicUpload"
                    class="px-4 py-2 text-sm text-white bg-[#0c6b39] hover:bg-[#09572d] rounded-lg shadow-md cursor-pointer transition duration-150">
                    Upload
                  </label>
                  <input type="file" id="profilePicUpload" class="hidden" accept=".jpg,.png,.jpeg" @change="onProfileImageSelect" />
                </div>
              </div>

              <div class="p-6 rounded-xl shadow-md bg-[#F2F9F3] relative">
                <div class="space-y-4 text-sm text-gray-700">
                  <div v-for="detail in individualDetailsKeys" :key="detail.key"
                    class="flex justify-between items-center">
                    <span class="font-semibold text-gray-600">{{ detail.label }}:</span>
                    <input :type="detail.key === 'password' ? 'password' : 'text'"
                      v-model="individualDetails[detail.key]" :disabled="detail.key !== 'password' || !isIndividualEditing
                        " :class="[
                        'text-right w-2/3 transition duration-150',
                        detail.key === 'password' && isIndividualEditing
                          ? 'bg-white border border-gray-400 rounded-md p-1.5'
                          : 'bg-transparent border-none',
                      ]" />
                  </div>
                  <div v-if="isIndividualEditing" class="mt-6 space-y-3">
  <input
    type="password"
    placeholder="Old Password"
    v-model="individualDetails.old_password"
    class="w-full p-2 border rounded"
  />

  <input
    type="password"
    placeholder="New Password"
    v-model="individualDetails.new_password"
    class="w-full p-2 border rounded"
  />

  <input
    type="password"
    placeholder="Confirm Password"
    v-model="individualDetails.confirm_password"
    class="w-full p-2 border rounded"
  />
</div>
                </div>
                <div class="flex justify-end mt-6">
                  <button @click="toggleIndividualEdit" :class="isIndividualEditing
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-[#0c6b39] hover:bg-[#09572d]'
                    " class="px-6 py-2 text-sm text-white rounded-lg shadow-md transition duration-150">
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
              <button @click="saveOtherDetails"
                class="px-6 py-2 text-sm text-white bg-[#0c6b39] hover:bg-[#09572d] rounded-lg shadow-md transition duration-150">
                Save Changes
              </button>
            </div>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder="Organization" v-model="otherDetails.organization"
                  class="w-full p-3 border rounded-lg focus:ring-primary-green focus:border-primary-green transition duration-150" />
                <input type="text" placeholder="Job Title" v-model="otherDetails.job_title"
                  class="w-full p-3 border rounded-lg focus:ring-primary-green focus:border-primary-green transition duration-150" />
                <input type="text" placeholder="Professional License" v-model="otherDetails.professional_license"
                  class="w-full p-3 border rounded-lg focus:ring-primary-green focus:border-primary-green transition duration-150" />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="number" placeholder="Years of Experience" v-model="otherDetails.years_of_experience"
                  class="w-full p-3 border rounded-lg focus:ring-primary-green focus:border-primary-green transition duration-150" />
                <input type="text" placeholder="Specialization" v-model="otherDetails.specialization"
                  class="w-full p-3 border rounded-lg focus:ring-primary-green focus:border-primary-green transition duration-150" />
              </div>

              <textarea rows="3" placeholder="Bio" v-model="otherDetails.bio"
                class="w-full p-3 border rounded-lg focus:ring-primary-green focus:border-primary-green resize-none transition duration-150"></textarea>

              <input type="text" placeholder="Address" v-model="otherDetails.address"
                class="w-full p-3 border rounded-lg focus:ring-primary-green focus:border-primary-green transition duration-150" />
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="City" v-model="otherDetails.city"
                  class="w-full p-3 border rounded-lg focus:ring-primary-green focus:border-primary-green transition duration-150" />
                <select v-model="otherDetails.state"
                  class="w-full p-3 border rounded-lg appearance-none focus:ring-primary-green focus:border-primary-green transition duration-150">
                  <option value="">Select Option (Local govt)</option>
                  <option v-for="lg in lagosLocalGovts" :key="lg" :value="lg">{{ lg }}</option>
                </select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select v-model="otherDetails.country"
                  class="w-full p-3 border rounded-lg appearance-none focus:ring-primary-green focus:border-primary-green transition duration-150">
                  <option value="">Select Option (Country)</option>
                  <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
                </select>
                <input type="url" placeholder="LinkedIn URL" v-model="otherDetails.linkedin_url"
                  class="w-full p-3 border rounded-lg focus:ring-primary-green focus:border-primary-green transition duration-150" />
              </div>

              <input type="text" placeholder="Twitter Handle" v-model="otherDetails.twitter_handle"
                class="w-full p-3 border rounded-lg focus:ring-primary-green focus:border-primary-green transition duration-150" />

              <textarea rows="3" placeholder="Brief Description" v-model="otherDetails.description"
                class="w-full p-3 border rounded-lg focus:ring-primary-green focus:border-primary-green resize-none transition duration-150"></textarea>
            </div>
          </div>

          <div class="p-6 bg-white rounded-xl shadow-lg">
            <h2 class="text-xl font-semibold mb-4">My Interests</h2>
            <p class="text-sm text-gray-600 mb-6">
              Select up to four categories you're into. We'll help you find
              great things to learn. (Selected: {{ selectedInterestsCount }}/4)
            </p>

            <div class="flex flex-wrap gap-3">
              <button v-for="interest in interests.value" :key="interest.id" @click="toggleInterest(interest.id)" :disabled="!interest.selected &&
                selectedInterestsCount >= 4 &&
                !interest.isMainCategory
                " :class="{
                  'bg-green-100 text-green-700': interest.isMainCategory,
                  'bg-orange-100 text-orange-700 hover:bg-orange-200':
                    interest.selected && !interest.isMainCategory,
                  'bg-gray-100 text-gray-700 hover:bg-gray-200':
                    !interest.selected && !interest.isMainCategory,
                }"
                class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full cursor-pointer transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed">
                {{ interest.name }}
                <svg v-if="interest.isMainCategory" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                  stroke-linejoin="round" class="w-4 h-4 ml-2">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <svg v-else-if="interest.selected" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                  stroke-linejoin="round" class="w-4 h-4 ml-2">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                  class="w-4 h-4 ml-2">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'Subscription'" class="space-y-10">
          <div class="p-10 bg-[#F2F9F3] rounded-xl shadow-lg text-center border-2 border-green-300">
            <h3 class="text-3xl font-sans text-[#333] mb-2">
              Subscription Type:
              <span class="text-[#004D33] font-bold">{{ userRole || '' }}</span>
            </h3>

            <p class="text-sm text-gray-700 mb-10">
              Purchased on <span class="font-medium">{{ subscription.purchasedOn }}</span>
            </p>
            <h2 class="text-2xl font-semibold mb-3 text-gray-800">
              Your subscription expires on:
            </h2>
            <p class="text-4xl font-bold text-orange-600 mb-6">
              {{ subscription.expiryDate }}
            </p>
            <button @click="makePayment"
              class="px-8 py-3 text-lg text-white bg-[#0c6b39] hover:bg-[#09572d] rounded-lg shadow-md transition duration-150 font-semibold">
              Renew/Upgrade Membership
            </button>
          </div>

          <div>
            <h2 class="text-2xl font-semibold mb-6 text-gray-800">
              My Invoices
            </h2>

            <div class="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-t-lg">
              <p class="text-sm text-gray-700">
                Showing 1 to {{ subscription.invoices.length }} of
                {{ subscription.totalEntries }} entries
              </p>
              <div class="relative">
                <input type="text" placeholder="Search"
                  class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            <div class="overflow-x-auto bg-white border border-gray-200 shadow-lg rounded-b-lg">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice #
                      <span class="ml-1 text-gray-400">⋮</span>
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice Date
                      <span class="ml-1 text-gray-400">⋮</span>
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                      <span class="ml-1 text-gray-400">⋮</span>
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                      <span class="ml-1 text-gray-400">⋮</span>
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status/Action
                      <span class="ml-1 text-gray-400">⋮</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="subscription.invoices.length === 0">
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                      No invoices yet
                    </td>
                  </tr>
                  <tr v-else v-for="invoice in subscription.invoices" :key="invoice.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ invoice.invoiceNo }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ invoice.invoiceDate }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ invoice.dueDate }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ invoice.total }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {{ invoice.status }}
                      </span>
                      <a v-for="invoice in subscription.invoices" :key="invoice.id" :href="invoice.downloadUrl" download
                        class="ml-4 text-green-600 hover:text-green-900 flex items-center inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          class="w-4 h-4 mr-1">
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

            <div class="flex justify-end items-center mt-4 text-sm text-gray-600">
              <p class="mr-4">
                Page {{ subscription.currentPage }} of
                {{ subscription.totalPages }}
              </p>
              <button @click="goToPage(subscription.currentPage - 1)" :disabled="subscription.currentPage === 1"
                class="flex items-center text-gray-400 hover:text-gray-600 disabled:opacity-50 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Prev
              </button>
              <button @click="goToPage(subscription.currentPage + 1)"
                :disabled="subscription.currentPage === subscription.totalPages"
                class="flex items-center text-gray-400 hover:text-gray-600 disabled:opacity-50">
                Next
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div v-else-if="activeTab === 'My Certificate'" class="space-y-10">
  <div class="p-6 md:p-10 bg-white rounded-xl shadow-lg border border-gray-200">
    <h2 class="text-2xl font-semibold mb-6 text-gray-800">My Certificates</h2>

    <div v-if="certificates.length > 0" class="space-y-12">
      <div v-for="cert in certificates" :key="cert.id" class="border-b pb-10 last:border-0">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <div>
            <h3 class="text-lg font-bold text-gray-800">{{ cert.course_title }}</h3>
            <p class="text-sm text-gray-500">
              Issued on: {{ new Date(cert.issued_date).toLocaleDateString() }}
            </p>
          </div>
          
          <button 
            @click="downloadCertificate(cert.id)"
            class="flex items-center justify-center px-5 py-2 bg-[#0c6b39] hover:bg-[#09572d] text-white rounded-lg text-sm font-bold transition shadow-md"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Download PDF
          </button>
        </div>

        <div class="bg-gray-50 border rounded-2xl p-4 flex flex-col items-center shadow-inner overflow-hidden">
          <div v-if="cert.image_file" class="w-full max-w-3xl">
            <img 
              :src="cert.image_file" 
              alt="Certificate Preview" 
              class="w-full h-auto rounded-lg shadow-lg border bg-white"
              @error="(e) => e.target.src = 'https://via.placeholder.com/800x600?text=Certificate+Preview'" 
            />
            <div class="mt-4 flex flex-col md:flex-row items-center justify-between gap-2 px-2">
              <p class="text-xs font-mono text-gray-400">ID: {{ cert.certificate_number || cert.id }}</p>
              <a v-if="cert.verify_url" :href="cert.verify_url" target="_blank" class="text-xs text-blue-500 hover:text-blue-700 underline font-medium">
                Verify Authenticity
              </a>
            </div>
          </div>
          
          <div v-else class="py-20 text-center">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-gray-500 text-sm mb-4">No preview available for this certificate</p>
            <button 
              @click="viewCertificateInNewTab(cert)"
              class="text-sm font-bold text-[#0c6b39] border border-[#0c6b39] px-4 py-2 rounded-lg hover:bg-green-50"
            >
              View Document
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="py-20 text-center text-gray-500">
      <p class="italic">No certificates have been issued to your account yet.</p>
    </div>
  </div>
</div>

        <div v-else class="p-10 text-center bg-white rounded-xl shadow-lg text-gray-500">
          <h2 class="text-2xl font-semibold mb-3">
            Content for {{ activeTab }}
          </h2>
          <p>
            This section will contain details related to your
            {{ activeTab }} preferences or status.
          </p>
        </div>
      </div>

      <div v-else class="p-10 text-center bg-white rounded-xl shadow-lg text-gray-500">
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
