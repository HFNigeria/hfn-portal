<script setup>
import accessAPI from "@/api/accessManagement.js";
import SuperAdminSidebar from "@/views/SuperAdmin/SuperAdminSidebar.vue";
import { computed, onMounted, ref } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

const TABS = ["Overview", "Invitations"];
const overviewHeaders = ["Name", "Role", "Invited On", "Status"];

const USERS = ref([]);
const INVITATIONS_DATA = ref({ admin: [], editor: [], tutor: [] });

const currentTab = ref("Overview");
const searchTerm = ref("");
const currentPage = ref(1);
const itemsPerPage = 8;
const showSidebar = ref(false);

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

const closeSidebar = () => {
  showSidebar.value = false;
};

const showHistoryDialog = ref(false);
const roleHistory = ref([]);
const selectedUserEmail = ref("");
const tabs = TABS;

const getRoleBadgeClass = (role) => {
  if (role.includes("Tutor")) return "bg-purple-100 text-purple-700";
  if (role === "Admin") return "bg-pink-100 text-pink-700";
  if (role === "Editor") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-700";
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Accepted":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-orange-100 text-orange-700";
    case "Removed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const fetchUsers = async () => {
  try {
    const [userRes, inviteRes] = await Promise.all([
      accessAPI.viewAccessLogs(),
      accessAPI.listRoleInvites(),
    ]);

    const existingUsers = (userRes.users || []).map((user) => ({
      id: user.id,
      name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      role: user.role?.charAt(0).toUpperCase() + user.role?.slice(1),
      invitedOn: user.created_at
        ? new Date(user.created_at).toLocaleDateString()
        : "",
      status: "Accepted",
      isSelected: false,
    }));

    const invites = (inviteRes.data || inviteRes).map((invite) => ({
      id: invite.id,
      name: invite.invited_email,
      role: invite.role.charAt(0).toUpperCase() + invite.role.slice(1),
      invitedOn: invite.created_at
        ? new Date(invite.created_at).toLocaleDateString()
        : "",
      status:
        invite.status === "pending"
          ? "Pending"
          : invite.status === "accepted"
          ? "Accepted"
          : invite.status === "sent"
          ? "Sent"
          : "Removed",
      isSelected: false,
    }));

    USERS.value = [...existingUsers, ...invites];
  } catch (error) {
    console.error("Failed to fetch users or invitations");
  }
};

const revokeInvitation = async (inviteId) => {
  try {
    await accessAPI.revokeRoleInvite(inviteId);

    toast.success("Invitation revoked");

    await fetchInvitations();
    await fetchUsers();
  } catch (error) {
    console.error("Failed to revoke invite");

    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Failed to revoke invitation";

    toast.error(message);
  }
};

const fetchInvitations = async () => {
  try {
    const data = await accessAPI.listRoleInvites();

    const grouped = {
      admin: [],
      editor: [],
      tutor: [],
    };

    data.forEach((invite) => {
      const roleKey = invite.role?.toLowerCase();
      if (!roleKey) return;
      grouped[roleKey].push({
        id: invite.id,
        firstName: invite.first_name || "",
        surname: invite.last_name || "",
        email: invite.invited_email,
        organization: invite.organization || "",
        status:
          invite.status === "pending"
            ? "Pending"
            : invite.status === "accepted"
            ? "Accepted"
            : "Sent",
        invitedOn: invite.created_at,
        inviteLink: invite.invite_link,
      });
    });

    INVITATIONS_DATA.value = grouped;
  } catch (error) {
    console.error("Failed to fetch invitations");
  }
};

onMounted(() => {
  fetchUsers();
  fetchInvitations();
});

const filteredUsers = computed(() => {
  if (!searchTerm.value) return USERS.value;

  const lowerSearch = searchTerm.value.toLowerCase();

  return USERS.value.filter((user) => {
    return (
      (user.name && user.name.toLowerCase().includes(lowerSearch)) ||
      (user.role && user.role.toLowerCase().includes(lowerSearch)) ||
      (user.invitedOn &&
        String(user.invitedOn).toLowerCase().includes(lowerSearch))
    );
  });
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage);
});

const allSelected = computed(() => {
  return (
    filteredUsers.value.length > 0 &&
    filteredUsers.value.every((user) => user.isSelected)
  );
});

const invitationsByRole = computed(() => {
  return INVITATIONS_DATA.value;
});

const toggleSelectAll = (event) => {
  const isChecked = event.target.checked;
  filteredUsers.value.forEach((user) => {
    user.isSelected = isChecked;
  });
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const changeTab = (tab) => {
  currentTab.value = tab;
  searchTerm.value = "";
  currentPage.value = 1;
};

const handleAction = async (action, user) => {
  try {
    if (action === "delete") {
      await accessAPI.removeUserRole({ user_id: user.id });
      USERS.value = USERS.value.filter((u) => u.id !== user.id);
      toast.success("User removed successfully");
    } else if (action === "view") {
      const history = await accessAPI.viewRoleHistory({ userId: user.id });
      roleHistory.value = history || [];
      selectedUserEmail.value = user.name || user.email || "User";

      showHistoryDialog.value = true;
      console.log("Role History:", history);
    }
  } catch (error) {
    console.error("Action failed");
  }
};

const addNewInvitation = (roleKey) => {
  const newId = Date.now();
  INVITATIONS_DATA.value[roleKey].push({
    id: newId,
    firstName: "",
    surname: "",
    email: "",
    organization: "",
    status: "Send",
  });
};

const sendInvitation = async (invite, roleKey, index) => {
  if (!invite.email) {
    console.error("Please fill in email before sending the invitation.");
    toast.error("Please fill in email before sending the invitation.");
    return;
  }

  try {
    const payload = {
      email: invite.email,
      role: roleKey,
    };
    await accessAPI.createRoleInvite(payload);
    INVITATIONS_DATA.value[roleKey][index].status = "Sent";
    toast.success("Invitation sent successfully");
  } catch (error) {
    console.error("Failed to send invitation");
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Failed to send invitation";

    toast.error(message);
  }
};

const resendInvitation = async (inviteId) => {
  try {
    await accessAPI.resendRoleInvite(inviteId);
    toast.success("Invite resent!");
  } catch (error) {
    console.error("Failed to resend invite");
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Failed to resend invite";

    toast.error(message);
  }
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 font-sans flex flex-col sm:flex-row">
    <button
      @click="toggleSidebar"
      class="lg:hidden fixed top-20 right-4 z-50 bg-[#004d33] text-white p-2 rounded-md shadow-md"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
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
      <SuperAdminSidebar @closeSidebar="closeSidebar" />
    </div>

    <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <span class="text-sm text-gray-500">Home > Access Management</span>
      <div class="mx-auto max-w-7xl">
        <div class="flex flex-col sm:flex-row justify-center items-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Access Management
          </h1>
        </div>

        <div class="flex justify-center w-full mb-6">
          <div class="border-b border-gray-200 w-full max-w-lg">
            <div class="flex text-lg font-medium justify-center">
              <button
                v-for="tab in tabs"
                :key="tab"
                @click="changeTab(tab)"
                :class="[
                  'py-2 px-6 transition border-b-2 mx-1 focus:outline-none',
                  currentTab === tab
                    ? 'font-semibold border-emerald-600 text-emerald-600'
                    : 'text-gray-500 hover:text-gray-900 border-transparent hover:border-gray-300',
                ]"
              >
                {{ tab }}
              </button>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <div v-if="currentTab === 'Overview'">
            <div class="flex justify-center mb-6">
              <div class="relative w-full max-w-2xl">
                <input
                  type="text"
                  v-model="searchTerm"
                  placeholder="Search..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition"
                />
                <svg
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                  />
                </svg>
              </div>
            </div>

            <div
              class="mt-8 overflow-x-auto rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-200"
            >
              <table class="min-w-full divide-y divide-gray-200 bg-white">
                <thead class="bg-emerald-50/50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left w-12">
                      <input
                        type="checkbox"
                        @change="toggleSelectAll"
                        :checked="allSelected"
                        class="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </th>
                    <th
                      v-for="header in overviewHeaders"
                      :key="header"
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      <div class="flex items-center">
                        <span>{{ header }}</span>
                        <svg
                          class="w-4 h-4 ml-2 text-gray-400 cursor-pointer hover:text-gray-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M5 10c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm10 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"
                          />
                        </svg>
                      </div>
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="user in paginatedUsers"
                    :key="user.id"
                    class="hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <td class="px-6 py-4 whitespace-nowrap w-12">
                      <input
                        type="checkbox"
                        v-model="user.isSelected"
                        class="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.name }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="getRoleBadgeClass(user.role)"
                        class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium leading-none"
                      >
                        {{ user.role }}
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ user.invitedOn }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="getStatusBadgeClass(user.status)"
                        class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium leading-none"
                      >
                        {{ user.status }}
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
                    >
                      <button
                        v-if="user.status === 'Pending'"
                        @click="revokeInvitation(user.id)"
                        class="text-red-600 text-xs hover:underline"
                      >
                        Revoke
                      </button>

                      <button
                        v-if="
                          user.status === 'Pending' || user.status === 'Removed'
                        "
                        @click="handleAction('view', user)"
                        class="text-gray-500 hover:text-indigo-600"
                      >
                        View
                      </button>

                      <button
                        v-if="user.status === 'Accepted'"
                        @click="handleAction('delete', user)"
                        class="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  <tr v-if="filteredUsers.length === 0">
                    <td
                      colspan="6"
                      class="px-6 py-10 text-center text-gray-500 text-lg"
                    >
                      No users match your criteria.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              class="flex justify-end items-center mt-4 max-w-4xl mx-auto text-sm"
            >
              <span class="text-gray-600 mr-4"
                >Page {{ currentPage }} of {{ totalPages }}</span
              >
              <div class="flex space-x-2">
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="p-2 rounded-lg transition"
                  :class="{
                    'text-gray-400 cursor-not-allowed': currentPage === 1,
                    'text-emerald-600 hover:bg-emerald-50': currentPage > 1,
                  }"
                >
                  <svg
                    class="w-5 h-5 transform rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </button>
                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="p-2 rounded-lg transition"
                  :class="{
                    'text-gray-400 cursor-not-allowed':
                      currentPage === totalPages,
                    'text-emerald-600 hover:bg-emerald-50':
                      currentPage < totalPages,
                  }"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div
            v-else-if="currentTab === 'Invitations'"
            class="max-w-4xl mx-auto space-y-8 mt-8"
          >
            <div
              v-for="(invitationsForRole, roleKey) in invitationsByRole"
              :key="roleKey"
              class="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div class="flex justify-between items-center mb-4 border-b pb-3">
                <h3 class="text-xl font-semibold text-gray-800">
                  Invitations to {{ roleKey }}
                  <span class="text-gray-500 text-base ml-2"
                    >You have sent
                    {{
                      invitationsForRole.filter(
                        (inv) =>
                          inv.status === "Pending" || inv.status === "Sent"
                      ).length
                    }}
                    Invites</span
                  >
                </h3>
                <button
                  @click="addNewInvitation(roleKey)"
                  class="flex items-center text-emerald-600 hover:text-emerald-800 transition font-medium"
                >
                  <svg
                    class="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                  Add new
                </button>
              </div>
              <div class="space-y-4">
                <div
                  v-for="(invite, index) in invitationsForRole"
                  :key="index"
                  class="grid grid-cols-6 gap-3 items-center"
                >
                  <div
                    class="text-gray-600 font-medium text-sm col-span-1 md:col-span-1"
                  >
                    {{ index + 1 }}.
                  </div>
                  <input
                    type="text"
                    v-model="invite.firstName"
                    placeholder="First Name"
                    class="col-span-2 md:col-span-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  />
                  <input
                    type="text"
                    v-model="invite.surname"
                    placeholder="Surname"
                    class="col-span-2 md:col-span-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  />
                  <input
                    type="email"
                    v-model="invite.email"
                    placeholder="Email Address"
                    class="col-span-3 md:col-span-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  />
                  <input
                    type="text"
                    v-model="invite.organization"
                    placeholder="Organization"
                    class="col-span-3 md:col-span-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  />
                  <button
                    @click="sendInvitation(invite, roleKey, index)"
                    :disabled="invite.status === 'Sent'"
                    :class="[
                      'px-4 py-2 rounded-md font-medium text-sm transition w-full',
                      invite.status === 'Sent'
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
                    ]"
                  >
                    {{ invite.status }}
                  </button>
                </div>
                <div
                  v-if="Object.keys(invitationsByRole).length === 0"
                  class="text-center text-gray-500 py-4"
                >
                  No pending invitations for this role. Click "Add new" to
                  invite.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  <div
  v-if="showHistoryDialog"
  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
>
  <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
    
    
    <button
      @click="showHistoryDialog = false"
      class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
    >
      ✕
    </button>

    <h2 class="text-xl font-semibold mb-4">
      Role History - {{ selectedUserEmail }}
    </h2>

    <div v-if="roleHistory.length === 0" class="text-gray-500">
      No history available.
    </div>

    <div v-else class="space-y-4 max-h-96 overflow-y-auto">
      <div
        v-for="item in roleHistory"
        :key="item.id"
        class="border rounded-md p-4 bg-gray-50"
      >
        <div class="text-sm text-gray-700">
          <strong>Change:</strong> {{ item.change_type }}
        </div>

        <div class="text-sm text-gray-700">
          <strong>Old Role:</strong> {{ item.old_role }}
        </div>

        <div class="text-sm text-gray-700">
          <strong>New Role:</strong> {{ item.new_role }}
        </div>

        <div class="text-sm text-gray-700">
          <strong>Changed By:</strong> {{ item.changed_by_email }}
        </div>

        <div class="text-sm text-gray-700">
          <strong>Reason:</strong> {{ item.reason }}
        </div>

        <div class="text-xs text-gray-500 mt-2">
          {{ new Date(item.created_at).toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background-color: #f3f4f6;
}
</style>
