<script setup>
import accessApi from "@/api/userRegister";
import AdminSidebar from "@/views/Admin/AdminSidebar.vue";
import { computed, onMounted, reactive, ref } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();
const currentView = ref("My Profile");
const activeTab = ref("My Profile");
const previewImageUrl = ref(null);
const uploadedFileName = ref(null);
const uploadStatus = ref("Awaiting Upload");
const fileInput = ref(null);
const profileImageUrl = ref(null);
const isOrganization = ref(false);
const signatures = reactive([]);
const isIndividualEditing = ref(false);
const isOrgEditing = ref(false);

let nextSignatureId = 3;
const profile = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  organizationName: "",
});

const toggleIndividualEdit = () => {
  if (isIndividualEditing.value) {
    toast.success("Profile updated successfully", "success");
  }
  isIndividualEditing.value = !isIndividualEditing.value;
};

const individualDetailsKeys = computed(() => [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email Address" },
  { key: "phone", label: "Phone Number" },
  { key: "password", label: "Password" },
]);

const profileKeys = computed(() => {
  if (isOrganization.value) {
    return [
      { key: "organizationName", label: "Organization Name" },
      { key: "email", label: "Email Address" },
      { key: "phone", label: "Phone Number" },
      { key: "password", label: "Password" },
    ];
  } else {
    return [
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "email", label: "Email Address" },
      { key: "phone", label: "Phone Number" },
      { key: "password", label: "Password" },
    ];
  }
});

const invitations = reactive([]);

const sentInvitesCount = computed(
  () => invitations.filter((i) => i.sent).length
);

const fetchProfile = async () => {
  try {
    const data = await accessApi.getUser();
    profile.firstName = data.first_name || "";
    profile.lastName = data.last_name || "";
    profile.email = data.email || "";
    profile.phone = data.phone_number || "";
    profile.organizationName = data.organization_name || "";
    profileImageUrl.value = data.profile || null;

    isOrganization.value = data.role === "organization";
  } catch (err) {
    console.error("Failed to load profile:", err);
    toast.error("Failed to load profile.", "error");
  }
};

const handleProfilePicUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
    toast.error("Please upload a valid JPG or PNG image.", "error");
    return;
  }

  if (file.size > 1024 * 1024) {
    toast.error("File size exceeds 1MB limit.", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    profileImageUrl.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  uploadedFileName.value = file ? file.name : null;

  if (!file) {
    clearPreview();
    uploadStatus.value = "No file selected";
    return;
  }

  if (
    ![
      "application/zip",
      "application/x-rar-compressed",
      "image/jpeg",
      "image/png",
    ].includes(file.type) &&
    file.type !== ""
  ) {
    toast.error(
      "Invalid file type. Please upload a zip, rar, jpg, or png file.",
      "error"
    );
    clearPreview();
    uploadStatus.value = "Invalid file type";
    return;
  }

  if (file.size > 1024 * 1024) {
    alert("File size exceeds 1MB limit.");
    clearPreview();
    uploadStatus.value = "File too large (Max 1Mb)";
    return;
  }

  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImageUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
    uploadStatus.value = `File ready: ${file.name}`;
  } else {
    previewImageUrl.value = null;
    uploadStatus.value = `File ready: ${file.name}`;
  }
};

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const clearPreview = () => {
  previewImageUrl.value = null;
  uploadedFileName.value = null;
  uploadStatus.value = "Awaiting Upload";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const sendInvitation = (id) => {
  const invite = invitations.find((i) => i.id === id);
  if (invite && invite.email !== "") {
    console.log(`Sending invite to: ${invite.email}`);
    invite.sent = true;
  }
};

const removeInvitation = (id) => {
  const invite = invitations.find((i) => i.id === id);
  if (invite) {
    invite.email = "";
    invite.sent = false;
  }
};

const addSignature = () => {
  if (!previewImageUrl.value) {
    alert("Please upload a valid image file first to add a signature.");
    return;
  }

  const newSignature = {
    id: nextSignatureId++,
    name: uploadedFileName.value
      ? uploadedFileName.value.split(".")[0]
      : `New Signature ${nextSignatureId - 1}`,
    date: `Uploaded on ${new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`,
    imageUrl: previewImageUrl.value,
  };

  signatures.push(newSignature);
  clearPreview();
  alert(`Signature "${newSignature.name}" added successfully!`);
};

const deleteSignature = (id) => {
  const index = signatures.findIndex((sig) => sig.id === id);
  if (index !== -1) {
    const deletedName = signatures[index].name;
    signatures.splice(index, 1);
    alert(`Signature "${deletedName}" deleted successfully.`);
  }
};

const downloadSignature = (imageUrl, fileName) => {
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = `${fileName || "signature"}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  console.log(`Signature "${fileName}" downloaded.`);
};

onMounted(() => {
  fetchProfile();
});

const showSidebar = ref(false);
const toggleSidebar = () => (showSidebar.value = !showSidebar.value);
const closeSidebar = () => (showSidebar.value = false);
</script>

<template>
  <div class="flex flex-col lg:flex-row min-h-screen font-sans relative">
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
      class="fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:translate-x-0 pt-16 lg:pt-0"
      :class="showSidebar ? 'translate-x-0' : '-translate-x-full'"
    >
      <AdminSidebar @closeSidebar="closeSidebar" class="h-full" />
    </div>

    <div
      v-if="showSidebar"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 z-30 lg:hidden"
      @click="closeSidebar"
    ></div>

    <main class="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full pt-10 lg:pt-0">
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
                  <img
                    v-if="profileImageUrl"
                    :src="profileImageUrl"
                    alt="Profile Picture"
                    class="w-full h-full object-cover"
                  />
                  <svg
                    v-else
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
                    @change="handleProfilePicUpload"
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
                      :disabled="!isOrgEditing"
                      :class="
                        isOrgEditing
                          ? 'bg-white border border-gray-400 rounded-md p-1.5'
                          : 'bg-transparent border-none'
                      "
                      class="text-right w-2/3 transition duration-150"
                    />
                  </div>
                </div>
              </div>
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
                {{ isIndividualEditing ? "Save Changes" : "Edit" }}
              </button>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
              <div
                class="flex flex-col items-center p-6 border border-gray-200 rounded-xl bg-gray-50"
              >
                <div
                  class="w-24 h-24 bg-white border border-gray-300 rounded-full flex items-center justify-center mb-3 shadow-inner overflow-hidden"
                >
                  <img
                    v-if="profileImageUrl"
                    :src="profileImageUrl"
                    alt="Profile Picture"
                    class="w-full h-full object-cover"
                  />
                  <svg
                    v-else
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
                    @change="handleProfilePicUpload"
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
                      v-model="profile[detail.key]"
                      :disabled="!isIndividualEditing"
                      :class="
                        isIndividualEditing
                          ? 'bg-white border border-gray-400 rounded-md p-1.5'
                          : 'bg-transparent border-none'
                      "
                      class="text-right w-2/3 transition duration-150"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="text-center mt-8 pt-6 border-t border-gray-200">
              <h3 class="text-xl font-bold mb-2 text-gray-800">
                Account Status: <span class="text-green-600">VERIFIED</span>
              </h3>
            </div>
          </div>

          <div v-if="isOrganization" class="p-6 bg-white shadow-lg">
            <h2 class="text-xl font-semibold mb-6">Invitations</h2>
            <p class="text-gray-600 mb-4">
              You have sent
              <span class="font-semibold text-gray-800"
                >{{ sentInvitesCount }} of {{ invitations.length }}</span
              >
              invites.
            </p>

            <div class="space-y-4">
              <div
                v-for="invite in invitations"
                :key="invite.id"
                class="flex items-center space-x-3"
              >
                <input
                  type="email"
                  :placeholder="'Enter email for invite ' + invite.id"
                  v-model="invite.email"
                  :readonly="invite.sent"
                  :disabled="invite.sent"
                  :class="
                    invite.sent
                      ? 'bg-gray-100'
                      : 'bg-white focus:ring-primary-green focus:border-primary-green'
                  "
                  class="flex-grow p-3 border border-gray-300 rounded-lg"
                />
                <button
                  v-if="invite.sent"
                  @click="removeInvitation(invite.id)"
                  class="text-red-600 text-sm font-semibold hover:underline"
                >
                  Remove
                </button>
                <button
                  v-else
                  :disabled="invite.email === ''"
                  @click="sendInvitation(invite.id)"
                  class="text-sm font-semibold px-4 py-2 text-white rounded-lg main-button w-24 disabled:opacity-50"
                >
                  Invite
                </button>
              </div>
            </div>
          </div>
        </div>

        
      </div>

      <div
        v-else
        class="p-10 text-center bg-white rounded-xl shadow-lg text-gray-500"
      >
        <h2 class="text-2xl font-semibold mb-3">
          Welcome to the {{ currentView }} Page
        </h2>
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
  font-family: "Inter", sans-serif;
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
