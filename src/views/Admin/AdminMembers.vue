<script setup>
import analyticsApi from "@/api/dashboard.js";
import membershipAPI from "@/api/membership.js";
import userList from "@/api/userRegister.js";

import AdminSidebar from "@/views/Admin/AdminSidebar.vue";
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Eye,
  MoreVertical,
  Search,
  Trash2,
} from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";
import { useToast } from "vue-toastification";

const showAddMemberModal = ref(false);
const membershipTypes = ref([]);
const showMembershipTypeModal = ref(false)
const showMemberDetailsModal = ref(false);
const selectedMember = ref(null);
const isAddingMember = ref(false);
const isUpdating = ref(false);
const toast = useToast();
const newMembershipType = ref({
  name: '',
  description: '',
  price: '',
  duration_days: '',
  features: [],
  is_active: true,
  max_courses: ''
});


const filters = ref({
  membership_type: "",
  role: "",
  status: "",
  payment_method: "",
});

const newMemberForm = ref({
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  membership_type_id: "",
  payment_method: "",
});

const updateMemberForm = ref({
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  membership_type_id: "",
  role: "",
});

const showUpdateMemberModal = ref(false);

const resetFilters = () => {
  filters.value = {
    membership_type: "",
    role: "",
    status: "",
    payment_method: "",
  };
  searchTerm.value = "";
  currentPage.value = 1;
  fetchMembers();
};

const courseTabs = ref(["Published", "Drafts", "Archived"]);
const currentTab = ref("Published");
const members = ref([]);
const itemsPerPage = 10;
const searchTerm = ref("");
const statCards = ref([]);

const currentPage = ref(1);
const totalPages = ref(1);

const loadMembershipAnalytics = async () => {
  try {
    const data = await analyticsApi.fetchMembershipAnalytics();

    statCards.value = [
      {
        title: "Total Members",
        value: data.total_members ?? 0,
        change: "",
        changeColor: "text-blue-300",
      },
      {
        title: "Total New Members",
        value: data.total_new_members ?? 0,
        change: "",
        changeColor: "text-[#00cc66]",
      },
      {
        title: "Total Corporate",
        value: data.total_corporate ?? 0,
        change: "",
        changeColor: "text-gray-500",
      },
      {
        title: "Total Individual",
        value: data.total_individual ?? 0,
        change: "",
        changeColor: "text-gray-500",
      },
      {
        title: "Multinationals",
        value: data.total_multinationals ?? 0,
        change: "",
        changeColor: "text-gray-500",
      },
      {
        title: "Diaspora",
        value: data.total_diaspora ?? 0,
        change: "",
        changeColor: "text-[#00cc66]",
      },
      {
        title: "Health Guardians",
        value: data.total_health_guardians ?? 0,
        change: "",
        changeColor: "text-blue-300",
      },
      {
        title: "Total Associations",
        value: data.total_associations ?? 0,
        change: "",
        changeColor: "text-gray-500",
      },
    ];
  } catch (error) {
    console.error("Failed to load membership analytics");
  }
};

const submitNewMember = async () => {
  try {
    isAddingMember.value = true;
    const payload = {
      first_name: newMemberForm.value.first_name,
      last_name: newMemberForm.value.last_name,
      email: newMemberForm.value.email,
      phone_number: newMemberForm.value.phone_number,
      membership_type_id: Number(newMemberForm.value.membership_type_id),
      payment_method: newMemberForm.value.payment_method
    };

    const response = await membershipAPI.createMember(payload);

    if (response.status === "success") {

      showAddMemberModal.value = false;

      toast.success("Member added successfully", "success");

      // Reload members
      fetchMembers();

      // Reset form
      newMemberForm.value = {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        membership_type_id: "",
        payment_method: ""
      };
    }

  } catch (error) {

    const errors = error?.response?.data;

    if (errors) {
      const firstValue = Object.values(errors)[0];
      const message = Array.isArray(firstValue) ? firstValue[0] : firstValue;
      toast.error(message || "Failed to add member");
    } else {
      toast.error("Something went wrong");
    }

    console.error("Failed to add member");
  } finally {
    isAddingMember.value = false;
  }
};

const updateMember = async () => {
  try {
    isUpdating.value = true;
    const payload = {
      first_name: updateMemberForm.value.first_name,
      last_name: updateMemberForm.value.last_name,
      email: updateMemberForm.value.email,
      phone_number: updateMemberForm.value.phone_number,
      membership_type_id: updateMemberForm.value.membership_type_id ? Number(updateMemberForm.value.membership_type_id) : undefined,
      role: updateMemberForm.value.member_category
    };

    const response = await membershipAPI.updateApplication(selectedMember.value.id, payload);

    if (response.status === "success" || response.id) {
      showUpdateMemberModal.value = false;
      showMemberDetailsModal.value = false;
      toast.success("Member updated successfully", "success");
      fetchMembers();
    }
  } catch (error) {
    const errors = error?.response?.data;
    if (errors) {
      const firstValue = Object.values(errors)[0];
      const message = Array.isArray(firstValue) ? firstValue[0] : firstValue;
      toast.error(message || "Failed to update member");
    } else {
      toast.error("Something went wrong");
    }
    console.error("Failed to update member");
  } finally {
    isUpdating.value = false;
  }
};

const openUpdateModal = (member) => {
  selectedMember.value = member;
  updateMemberForm.value = {
    first_name: member.first_name || "",
    last_name: member.last_name || "",
    email: member.email || "",
    phone_number: member.phone_number || "",
    membership_type_id: member.membership_type_id || "",
    role: member.member_category || member.role || ""
  };
  showUpdateMemberModal.value = true;
  showMemberDetailsModal.value = false;
};


const fetchMembers = async () => {
  try {
    const data = await userList.getUserList();
    console.log('response', data)
    members.value = data;

  } catch (error) {
    console.error("Failed to fetch members");
  }
};

const loadMembershipTypes = async () => {
  try {
    membershipTypes.value = await membershipAPI.listMembershipTypes();
  } catch (e) {
    console.error("Failed to load membership types", e);
  }
};

const createMembershipType = async () => {
  try {
    const payload = {
      ...newMembershipType.value,
      duration_days: Number(newMembershipType.value.duration_days),
      max_courses: Number(newMembershipType.value.max_courses),
      price: String(newMembershipType.value.price),
      features: newMembershipType.value.features
        ? newMembershipType.value.features
          .split(',')
          .map(f => f.trim())
        : []
    };

    await membershipAPI.createMembershipType(payload);

    await loadMembershipTypes();

    showCreateDialog.value = false;

    newMembershipType.value = {
      name: '',
      description: '',
      price: '',
      duration_days: '',
      features: '',
      is_active: true,
      max_courses: ''
    };

  } catch (err) {
    console.error("Create failed:", err.response?.data || err);
  }
};


const deleteMembershipType = async (id) => {
  try {
    await membershipAPI.deleteMembershipType(id)
    membershipTypes.value = membershipTypes.value.filter(t => t.id !== id)
  } catch (e) {
    console.error('Failed to delete type', e)
  }
}



onMounted(() => {
  fetchMembers();
  loadMembershipAnalytics();
  loadMembershipTypes();
});

const showSidebar = ref(false);
const toggleSidebar = () => (showSidebar.value = !showSidebar.value);
const closeSidebar = () => (showSidebar.value = false);

const handleAction = async (action, memberId) => {
  try {
    if (action === "Delete") {
      await membershipAPI.deleteApplication(memberId);
      members.value = members.value.filter((m) => m.id !== memberId);
    } else if (action === "Edit") {
      const member = members.value.find((m) => m.id === memberId);
      if (member) {
        selectedMember.value = member;
        showMemberDetailsModal.value = true;
      }

    } else if (action === "View") {
      const member = members.value.find((m) => m.id === memberId);
      if (member) {
        selectedMember.value = member;
        showMemberDetailsModal.value = true;
      }

    }
  } catch (error) {
    console.error(`${action} failed for member ${memberId}`);
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchMembers();
  }
};


const filteredMembers = computed(() => {
  return members.value.filter(m => {
    const term = searchTerm.value.toLowerCase();

    // Search logic
    const matchesSearch =
      (m.first_name || "").toLowerCase().includes(term) ||
      (m.email || "").toLowerCase().includes(term) ||
      (m.membership_type || "").toLowerCase().includes(term);

    // Role Filter
    const matchesRole = filters.value.member_category ? m.member_category === filters.value.member_category : true;

    const matchesMembership = filters.value.membership_type
      ? m.membership_type === filters.value.membership_type || m.membership_type_id === Number(filters.value.membership_type)
      : true;

    return matchesSearch && matchesRole && matchesMembership;
  });
});

const paginatedMembers = computed(() => {
  return filteredMembers.value;
});


watch(
  [searchTerm, filters],
  () => {
    currentPage.value = 1;
    fetchMembers();
  }
);

watch(currentPage, () => {
  fetchMembers();
});

</script>

<template>
  <div class="flex min-h-screen font-sans relative">
    <button @click="toggleSidebar"
      class="lg:hidden fixed top-20 right-4 z-50 bg-[#004d33] text-white p-2 rounded-md shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <div
      class="fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:translate-x-0 pt-16 lg:pt-0"
      :class="showSidebar ? 'translate-x-0' : '-translate-x-full'">
      <AdminSidebar @closeSidebar="closeSidebar" class="h-full" />
    </div>

    <div v-if="showSidebar" class="fixed inset-0 bg-gray-500 bg-opacity-50 z-30 lg:hidden" @click="closeSidebar"></div>

    <main class="flex-1 p-8 overflow-auto bg-white">
      <div class="text-sm text-gray-500 mb-6 pt-10 lg:pt-0">
        <span class="text-[#006633]">Home</span> > Members
      </div>

      <div class="flex gap-4 mb-6">
        <button v-for="tab in pageTabs" :key="tab" @click="currentPageTab = tab" :class="[
          'px-4 py-2 rounded-lg',
          currentPageTab === tab ? 'bg-[#006633] text-white' : 'bg-gray-100'
        ]">
          {{ tab }}
        </button>
      </div>


      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6 border-b border-[#006633]/30 inline-block pb-3">
          Members
        </h1>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div v-for="(stat, index) in statCards" :key="stat.title"
            class="flex-1 p-6 text-center bg-white shadow-lg border-y border-[#00cc66] relative overflow-hidden group transition-all duration-300"
            :class="{
              'rounded-tl-4xl rounded-br-4xl': index === 0,
              'rounded-tl-4xl rounded-br-4xl': index === statCards.length - 1,

              'rounded-tl-4xl rounded-br-4xl': true,
            }">
            <div class="absolute inset-y-0 left-0 w-1 bg-[#00cc66]"></div>
            <div class="absolute inset-y-0 right-0 w-1 bg-[#00cc66]"></div>

            <p class="text-gray-600 text-sm mb-1">{{ stat.title }}</p>

            <div class="text-4xl font-bold text-gray-800 mb-1">
              <span v-if="stat.stars">
                <span class="text-[#ff9900]">★★★★</span><span class="text-gray-300">★</span>
              </span>
              <span v-else>{{ stat.value }}</span>
            </div>

            <p :class="[stat.changeColor, 'text-sm font-medium']">
              {{ stat.change }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div class="flex gap-3">
          <button @click="showAddMemberModal = true"
            class="px-4 py-2 bg-[#006633] text-white rounded-lg hover:bg-[#005528]">
            + Add Member
          </button>

          <button @click="showMembershipTypeModal = true"
            class="px-4 py-2 border border-[#006633] text-[#006633] rounded-lg hover:bg-[#f0fff0]">
            + Membership Type
          </button>
        </div>
        <!-- Membership Type Modal -->
        <div v-if="showMembershipTypeModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div class="bg-white w-full max-w-3xl rounded-xl p-6 shadow-lg overflow-y-auto max-h-[90vh]">

            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-800">
                Manage Membership Types
              </h2>

              <button @click="showMembershipTypeModal = false" class="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <!-- Create Section -->
            <div class="mb-8">
              <h3 class="font-semibold mb-3">Create Membership Type</h3>

              <div class="flex flex-col md:flex-row gap-3">
                <input v-model="newMembershipType.name" placeholder="Name" class="input" />
                <input v-model="newMembershipType.description" placeholder="Description" class="input" />
                <input v-model="newMembershipType.price" placeholder="Price" class="input" />
                <input v-model="newMembershipType.features" placeholder="Features (comma separated)" class="input" />

                <input v-model="newMembershipType.duration_days" placeholder="Duration (days)" class="input"
                  type="number" />
                <input v-model="newMembershipType.max_courses" placeholder="Max Courses" class="input" type="number" />
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="newMembershipType.is_active" />
                  Active
                </label>
                <button @click="createMembershipType" class="px-4 py-2 bg-[#006633] text-white rounded-lg">
                  Create
                </button>
              </div>
            </div>

            <!-- Existing Types -->
            <div>
              <h3 class="font-semibold mb-3">Existing Types</h3>

              <div class="border rounded-lg overflow-x-auto">
                <table class="min-w-full text-sm">
                  <thead class="bg-[#f0fff0]">
                    <tr>
                      <th class="p-3 text-left">Name</th>
                      <th class="p-3 text-left">Price</th>
                      <th class="p-3 text-left">Duration</th>
                      <th class="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="type in membershipTypes" :key="type.id" class="border-t">
                      <td class="p-3">{{ type.name }}</td>
                      <td class="p-3">{{ type.price }}</td>
                      <td class="p-3">{{ type.duration_days }} months</td>
                      <td class="p-3 text-center">
                        <button @click="deleteMembershipType(type.id)" class="text-red-600 hover:text-red-800">
                          Delete
                        </button>
                      </td>
                    </tr>

                    <tr v-if="!membershipTypes.length">
                      <td colspan="4" class="p-4 text-center text-gray-400">
                        No membership types created yet
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center sm:gap-3 flex-wrap w-full md:w-auto">
          <div class="relative w-full sm:w-64">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" v-model="searchTerm" placeholder="Search..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00cc66] focus:border-[#00cc66] transition-colors" />
          </div>

          <select v-model="filters.membership_type" class="filter">
            <option value="">All Memberships</option>
            <option v-for="type in membershipTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>

          <select v-model="filters.member_category" class="filter">
            <option value="">All Roles</option>
            <!-- <option value="admin">Admin</option> -->
            <option value="individual">Individual</option>
            <option value="corporate">Corporate</option>
            <option value="multinational">Multinational</option>
            <option value="diaspora">Diaspora</option>
          </select>

          <select v-model="filters.status" class="filter">
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <select v-model="filters.payment_method" class="filter">
            <option value="">All Payments</option>
            <option value="card">Card</option>
            <option value="transfer">Transfer</option>
            <option value="cash">Cash</option>
          </select>

          <button @click="resetFilters" class="px-3 py-2 border rounded-lg text-sm hover:bg-gray-100">
            Reset
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 overflow-x-auto">

        <table class="min-w-full table-fixed divide-y divide-gray-200">
          <thead>
            <tr class="bg-[#f0fff0] text-gray-700 uppercase text-sm leading-normal border-b border-[#00cc66]/50">

              <th class="py-3 px-3 text-left w-12 rounded-tl-lg">
                <input type="checkbox" class="h-4 w-4 text-[#00cc66] border-gray-300 rounded focus:ring-[#00cc66]" />
              </th>

              <th class="py-3 px-3 text-left">
                <div class="flex items-center gap-1">
                  Name
                  <MoreVertical class="w-4 h-4 text-gray-500 cursor-pointer" />
                </div>
              </th>

              <th class="py-3 px-3 text-left">
                <div class="flex items-center gap-1">
                  Email
                  <MoreVertical class="w-4 h-4 text-gray-500 cursor-pointer" />
                </div>
              </th>

              <th class="py-3 px-3 text-left">
                <div class="flex items-center gap-1">
                  Category
                  <MoreVertical class="w-4 h-4 text-gray-500 cursor-pointer" />
                </div>
              </th>

              <th class="py-3 px-3 text-left">
                <div class="flex items-center gap-1">
                  Phone
                  <MoreVertical class="w-4 h-4 text-gray-500 cursor-pointer" />
                </div>
              </th>

              <th class="py-3 px-3 text-left">
                <div class="flex items-center gap-1">
                  Date Joined
                  <MoreVertical class="w-4 h-4 text-gray-500 cursor-pointer" />
                </div>
              </th>

              <th class="py-3 px-3 text-center rounded-tr-lg">
                Action
              </th>

            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light divide-y divide-gray-100">
            <tr v-for="member in paginatedMembers" :key="member.id" class="hover:bg-[#f9fff9] transition-colors">
              <td class="py-3 px-3 whitespace-nowrap">
                <input type="checkbox" class="h-4 w-4 text-[#00cc66] border-gray-300 rounded focus:ring-[#00cc66]" />
              </td>
              <td class="py-3 px-3 whitespace-nowrap font-medium text-[#006633]">
                {{ member.first_name }}
              </td>
              <td class="py-3 px-3 whitespace-nowrap font-medium text-[#006633]">
                {{ member.email }}
              </td>
              <td class="py-3 px-3">
                {{ member.membership_type || member.member_category || '-' }}
              </td>
              <td class="py-3 px-3">
                {{ member.phone_number || '-' }}
              </td>
              
              <td class="py-3 px-3">
                {{ member.date_joined }}
              </td>

              <td class="py-3 px-3 text-center">
                <div class="flex item-center justify-center space-x-2">
                  <button @click="handleAction('View', member.id)"
                    class="w-6 h-6 transform hover:text-blue-500 hover:scale-110 transition-transform p-0.5">
                    <Eye class="w-full h-full text-gray-500 hover:text-blue-500" />
                  </button>
                  <button @click="handleAction('Edit', member.id)"
                    disabled
                    class="w-6 h-6 transform hover:scale-110 transition-transform p-0.5 opacity-30 cursor-not-allowed">
                    <Edit2 class="w-full h-full text-gray-500" />
                  </button>
                  <button @click="handleAction('Delete', member.id)"
                    class="w-6 h-6 transform hover:text-red-500 hover:scale-110 transition-transform p-0.5">
                    <Trash2 class="w-full h-full text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-end items-center mt-6 text-sm text-gray-600">
          <span class="mr-4">Page {{ currentPage }} of {{ totalPages }}</span>
          <div class="flex space-x-2">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              class="p-2 border rounded-full hover:bg-gray-100 transition-colors">
              <ChevronLeft class="w-4 h-4" />
            </button>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" :class="{
              'opacity-50 cursor-not-allowed': currentPage === totalPages,
            }" class="p-2 border rounded-full hover:bg-gray-100 transition-colors">
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
    <div v-if="showAddMemberModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Add New Member</h2>

        <form @submit.prevent="submitNewMember" class="space-y-4">
          <input v-model="newMemberForm.first_name" placeholder="First Name" class="input" />
          <input v-model="newMemberForm.last_name" placeholder="Last Name" class="input" />
          <input v-model="newMemberForm.email" placeholder="Email" class="input" />
          <input v-model="newMemberForm.phone_number" placeholder="Phone Number" class="input" />

          <select v-model="newMemberForm.membership_type_id" class="input">
            <option disabled value="">Select Membership Type</option>
            <option v-for="type in membershipTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>



          <select v-model="newMemberForm.payment_method" class="input">
            <option disabled value="">Payment Method</option>
            <option value="card">Card</option>
            <option value="transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
          </select>

          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="showAddMemberModal = false" class="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button type="submit" :disabled="isAddingMember"
              class="px-4 py-2 bg-[#006633] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center">
              <svg v-if="isAddingMember" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span>{{ isAddingMember ? 'Adding...' : 'Add Member' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div v-if="showMemberDetailsModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">Member Details</h2>
        <button @click="showMemberDetailsModal = false" class="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div class="space-y-2">
        <p><strong>Name:</strong> {{ selectedMember.first_name }}</p>
        <p><strong>Email:</strong> {{ selectedMember.email }}</p>
        <p><strong>Phone:</strong> {{ selectedMember.phone_number }}</p>
        <p><strong>Membership Type:</strong> {{ selectedMember.membership_type }}</p>
        <p><strong>Role:</strong> {{ selectedMember.member_category }}</p>
        <p><strong>Status:</strong> {{ selectedMember.status }}</p>
        <p><strong>Date Joined:</strong> {{ selectedMember.date_joined }}</p>
      </div>

      <div class="flex justify-between pt-6">
        <button disabled class="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
          Update
        </button>

        <button @click="showMemberDetailsModal = false" class="px-4 py-2 border rounded-lg">
          Close
        </button>
      </div>
    </div>
  </div>
  <div v-if="showUpdateMemberModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">Update Member</h2>
        <button @click="showUpdateMemberModal = false" class="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <form @submit.prevent="updateMember" class="space-y-4">
        <input v-model="updateMemberForm.first_name" placeholder="First Name" class="input" />
        <input v-model="updateMemberForm.last_name" placeholder="Last Name" class="input" />
        <input v-model="updateMemberForm.email" placeholder="Email" class="input" />
        <input v-model="updateMemberForm.phone_number" placeholder="Phone Number" class="input" />

        <select v-model="updateMemberForm.membership_type_id" class="input">
          <option disabled value="">Select Membership Type</option>
          <option v-for="type in membershipTypes" :key="type.id" :value="type.id">
            {{ type.name }}
          </option>
        </select>

        <select v-model="updateMemberForm.member_category" class="input">
          <option disabled value="">Select Category</option>
          <option value="individual">Individual</option>
          <option value="corporate">Corporate</option>
          <option value="multinational">Multinational</option>
          <option value="diaspora">Diaspora</option>
        </select>

        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" @click="showUpdateMemberModal = false" class="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button type="submit" :disabled="isUpdating"
            class="px-4 py-2 bg-[#006633] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center">
            <svg v-if="isUpdating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span>{{ isUpdating ? 'Updating...' : 'Update Member' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.filter {
  @apply px-3 py-2 border rounded-lg text-sm focus:ring-[#00cc66];
}
</style>
