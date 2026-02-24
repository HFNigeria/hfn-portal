<script setup>
import analyticsApi from "@/api/dashboard.js";
import membershipAPI from "@/api/membership.js";
import SuperAdminSidebar from "@/views/SuperAdmin/SuperAdminSidebar.vue";
import { computed, onMounted, watch } from "vue";

import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Eye,
  MoreVertical,
  Search,
  Trash2,
} from "lucide-vue-next";
import { ref } from "vue";

const showAddMemberModal = ref(false);
const membershipTypes = ref([]);
 const showMembershipTypeModal = ref(false)

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
  name: "",
  email: "",
  phone: "",
  membership_type_id: "",
  role: "",
  payment_method: "",
});

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
        value: data.new_members ?? 0,
        change: "",
        changeColor: "text-[#00cc66]",
      },
      {
        title: "Total Corporate",
        value: data.corporate ?? 0,
        change: "",
        changeColor: "text-gray-500",
      },
      {
        title: "Total Individual",
        value: data.individual ?? 0,
        change: "",
        changeColor: "text-gray-500",
      },
      {
        title: "Multinationals",
        value: data.multinationals ?? 0,
        change: "",
        changeColor: "text-gray-500",
      },
      {
        title: "Diaspora",
        value: data.diaspora ?? 0,
        change: "",
        changeColor: "text-[#00cc66]",
      },
      {
        title: "Health Guardians",
        value: data.health_guardians ?? 0,
        change: "",
        changeColor: "text-blue-300",
      },
      {
        title: "Total Associations",
        value: data.associations ?? 0,
        change: "",
        changeColor: "text-gray-500",
      },
    ];
  } catch (error) {
    console.error("Failed to load membership analytics", error);
  }
};

const submitNewMember = async () => {
  try {
    const payload = {
      name: newMemberForm.value.name,
      email: newMemberForm.value.email,
      phone: newMemberForm.value.phone,
      membership_type: newMemberForm.value.membership_type,
      membership_type_id: Number(newMemberForm.value.membership_type_id),
      role: newMemberForm.value.role,
      payment_method: newMemberForm.value.payment_method,
    };

    const application = await membershipAPI.createApplication(payload);

    await membershipAPI.approveApplication(application.id, {
      approved_by_admin: true,
    });

    showAddMemberModal.value = false;
    fetchMembers();

    // Reset form
    newMemberForm.value = {
      name: "",
      email: "",
      phone: "",
      membership_type: "",
      role: "",
      payment_method: "",
    };
  } catch (error) {
    console.error("Failed to add member", error);
  }
};

const fetchMembers = async () => {
  try {
    const data = await membershipAPI.listApplications({
      page: currentPage.value,
    });
    members.value = data.results || data.data || [];
    totalPages.value = data.count ? Math.ceil(data.count / itemsPerPage) : 1;
  } catch (error) {
    console.error("Failed to fetch members", error);
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

const handleAction = async (action, memberId) => {
  try {
    if (action === "Delete") {
      await membershipAPI.deleteApplication(memberId);
      members.value = members.value.filter((m) => m.id !== memberId);
    } else if (action === "Edit") {
      console.log(`Edit member ID: ${memberId}`);
    } else if (action === "View") {
      const data = await membershipAPI.getApplication(memberId);
      console.log("Member Details:", data);
    }
  } catch (error) {
    console.error(`${action} failed for member ${memberId}:`, error);
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchMembers();
  }
};

const filteredMembers = computed(() => {
  if (!searchTerm.value) return members.value;

  const term = searchTerm.value.toLowerCase();
  return list.filter(
    (m) =>
      (m.name || "").toLowerCase().includes(term) ||
      (m.category || "").toLowerCase().includes(term) ||
      (m.lastPayment || "").toLowerCase().includes(term)
  );
});

const paginatedMembers = computed(() => {
  const list = filteredMembers.value || [];
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return list.slice(start, end);
});

watch(
  [searchTerm, filters, currentPage],
  () => {
    currentPage.value = 1;
    fetchMembers();
  },
  { deep: true }
);
</script>

<template>
  <div class="flex min-h-screen font-sans">
    <SuperAdminSidebar />
    <main class="flex-1 p-8 overflow-auto bg-white">
      <div class="text-sm text-gray-500 mb-6">
        <span class="text-[#006633]">Home</span> > Members
      </div>

      <div class="flex gap-4 mb-6">
  <button
    v-for="tab in pageTabs"
    :key="tab"
    @click="currentPageTab = tab"
    :class="[
      'px-4 py-2 rounded-lg',
      currentPageTab === tab ? 'bg-[#006633] text-white' : 'bg-gray-100'
    ]"
  >
    {{ tab }}
  </button>
</div>


      <div class="text-center mb-8">
        <h1
          class="text-3xl font-bold text-gray-800 mb-6 border-b border-[#006633]/30 inline-block pb-3"
        >
          Members
        </h1>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div
            v-for="(stat, index) in statCards"
            :key="stat.title"
            class="flex-1 p-6 text-center bg-white shadow-lg border-y border-[#00cc66] relative overflow-hidden group transition-all duration-300"
            :class="{
              'rounded-tl-4xl rounded-br-4xl': index === 0,
              'rounded-tl-4xl rounded-br-4xl': index === statCards.length - 1,

              'rounded-tl-4xl rounded-br-4xl': true,
            }"
          >
            <div class="absolute inset-y-0 left-0 w-1 bg-[#00cc66]"></div>
            <div class="absolute inset-y-0 right-0 w-1 bg-[#00cc66]"></div>

            <p class="text-gray-600 text-sm mb-1">{{ stat.title }}</p>

            <div class="text-4xl font-bold text-gray-800 mb-1">
              <span v-if="stat.stars">
                <span class="text-[#ff9900]">★★★★</span
                ><span class="text-gray-300">★</span>
              </span>
              <span v-else>{{ stat.value }}</span>
            </div>

            <p :class="[stat.changeColor, 'text-sm font-medium']">
              {{ stat.change }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4"
      >
        <div class="flex gap-3">
    <button
      @click="showAddMemberModal = true"
      class="px-4 py-2 bg-[#006633] text-white rounded-lg hover:bg-[#005528]"
    >
      + Add Member
    </button>

    <button
      @click="showMembershipTypeModal = true"
      class="px-4 py-2 border border-[#006633] text-[#006633] rounded-lg hover:bg-[#f0fff0]"
    >
      + Membership Type
    </button>
  </div>
        <!-- Membership Type Modal -->
<div
  v-if="showMembershipTypeModal"
  class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
>
  <div class="bg-white w-full max-w-3xl rounded-xl p-6 shadow-lg overflow-y-auto max-h-[90vh]">

    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-800">
        Manage Membership Types
      </h2>

      <button
        @click="showMembershipTypeModal = false"
        class="text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
    </div>

    <!-- Create Section -->
    <div class="mb-8">
      <h3 class="font-semibold mb-3">Create Membership Type</h3>

      <div class="flex flex-col md:flex-row gap-3">
        <input
          v-model="newMembershipType.name"
          placeholder="Name"
          class="input"
        />
        <input v-model="newMembershipType.description" placeholder="Description" class="input" />
        <input
          v-model="newMembershipType.price"
          placeholder="Price"
          class="input"
        />
        <input
  v-model="newMembershipType.features"
  placeholder="Features (comma separated)"
  class="input"
/>

        <input v-model="newMembershipType.duration_days" placeholder="Duration (days)" class="input" type="number" />
        <input v-model="newMembershipType.max_courses" placeholder="Max Courses" class="input" type="number" />
        <label class="flex items-center gap-2">
  <input type="checkbox" v-model="newMembershipType.is_active" />
  Active
</label>
        <button
          @click="createMembershipType"
          class="px-4 py-2 bg-[#006633] text-white rounded-lg"
        >
          Create
        </button>
      </div>
    </div>

    <!-- Existing Types -->
    <div>
      <h3 class="font-semibold mb-3">Existing Types</h3>

      <div class="border rounded-lg overflow-hidden">
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
            <tr
              v-for="type in membershipTypes"
              :key="type.id"
              class="border-t"
            >
              <td class="p-3">{{ type.name }}</td>
              <td class="p-3">{{ type.price }}</td>
              <td class="p-3">{{ type.duration_days }} months</td>
              <td class="p-3 text-center">
                <button
                  @click="deleteMembershipType(type.id)"
                  class="text-red-600 hover:text-red-800"
                >
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

        <div
          class="flex flex-col sm:flex-row sm:items-center sm:gap-3 flex-wrap w-full md:w-auto"
        >
          <div class="relative w-full sm:w-64">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Search..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00cc66] focus:border-[#00cc66] transition-colors"
            />
          </div>

          <select v-model="filters.membership_type" class="filter">
            <option value="">All Memberships</option>
            <option
              v-for="type in membershipTypes"
              :key="type.id"
              :value="type.id"
            >
              {{ type.name }}
            </option>
          </select>

          <select v-model="filters.role" class="filter">
            <option value="">All Roles</option>
            <option value="individual">Admin</option>
            <option value="corporate">Member</option>
            <option value="admin">Learner</option>
            <option value="admin">Tutor</option>
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

          <button
            @click="resetFilters"
            class="px-3 py-2 border rounded-lg text-sm hover:bg-gray-100"
          >
            Reset
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr
              class="bg-[#f0fff0] text-gray-700 uppercase text-sm leading-normal border-b border-[#00cc66]/50"
            >
              <th class="py-3 px-3 text-left w-12 rounded-tl-lg">
                <input
                  type="checkbox"
                  class="h-4 w-4 text-[#00cc66] border-gray-300 rounded focus:ring-[#00cc66]"
                />
              </th>
              <th class="py-3 px-3 text-left flex items-center">
                Name
                <MoreVertical
                  class="w-4 h-4 ml-1 text-gray-500 cursor-pointer"
                />
              </th>
              <th class="py-3 px-3 text-left">
                Category
                <MoreVertical
                  class="w-4 h-4 ml-1 text-gray-500 cursor-pointer"
                />
              </th>
              <th class="py-3 px-3 text-left">
                Last Payment
                <MoreVertical
                  class="w-4 h-4 ml-1 text-gray-500 cursor-pointer"
                />
              </th>
              <th class="py-3 px-3 text-left">
                Status
                <MoreVertical
                  class="w-4 h-4 ml-1 text-gray-500 cursor-pointer"
                />
              </th>
              <th class="py-3 px-3 text-center rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody
            class="text-gray-600 text-sm font-light divide-y divide-gray-100"
          >
            <tr
              v-for="member in paginatedMembers"
              :key="member.id"
              class="hover:bg-[#f9fff9] transition-colors"
            >
              <td class="py-3 px-3 whitespace-nowrap">
                <input
                  type="checkbox"
                  class="h-4 w-4 text-[#00cc66] border-gray-300 rounded focus:ring-[#00cc66]"
                />
              </td>
              <td
                class="py-3 px-3 whitespace-nowrap font-medium text-[#006633]"
              >
                {{ member.name }}
              </td>
              <td class="py-3 px-3">
                {{ member.enrollments !== null ? member.enrollments : "-" }}
              </td>
              <td class="py-3 px-3">
                <span
                  :class="{
                    'text-green-600 font-semibold': (member.completion || '')
                      .toString()
                      .includes('100'),
                    'text-orange-500':
                      Number.parseFloat(member.completion) < 50 &&
                      member.completion !== '-',
                  }"
                >
                  {{ member.completion }}
                </span>
              </td>
              <td class="py-3 px-3">
                {{ member.lastUpdate }}
              </td>
              <td class="py-3 px-3 text-center">
                <div class="flex item-center justify-center space-x-2">
                  <button
                    @click="handleAction('View', member.id)"
                    class="w-6 h-6 transform hover:text-blue-500 hover:scale-110 transition-transform p-0.5"
                  >
                    <Eye
                      class="w-full h-full text-gray-500 hover:text-blue-500"
                    />
                  </button>
                  <button
                    @click="handleAction('Edit', member.id)"
                    class="w-6 h-6 transform hover:text-green-500 hover:scale-110 transition-transform p-0.5"
                  >
                    <Edit2
                      class="w-full h-full text-gray-500 hover:text-green-500"
                    />
                  </button>
                  <button
                    @click="handleAction('Delete', member.id)"
                    class="w-6 h-6 transform hover:text-red-500 hover:scale-110 transition-transform p-0.5"
                  >
                    <Trash2
                      class="w-full h-full text-gray-500 hover:text-red-500"
                    />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-end items-center mt-6 text-sm text-gray-600">
          <span class="mr-4">Page {{ currentPage }} of {{ totalPages }}</span>
          <div class="flex space-x-2">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              class="p-2 border rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              :class="{
                'opacity-50 cursor-not-allowed': currentPage === totalPages,
              }"
              class="p-2 border rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
    <div
      v-if="showAddMemberModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Add New Member</h2>

        <form @submit.prevent="submitNewMember" class="space-y-4">
          <input
            v-model="newMemberForm.name"
            placeholder="Full Name"
            class="input"
          />
          <input
            v-model="newMemberForm.email"
            placeholder="Email"
            class="input"
          />
          <input
            v-model="newMemberForm.phone"
            placeholder="Phone Number"
            class="input"
          />

          <select v-model="newMemberForm.membership_type_id" class="input">
            <option disabled value="">Select Membership Type</option>
            <option
              v-for="type in membershipTypes"
              :key="type.id"
              :value="type.id"
            >
              {{ type.name }}
            </option>
          </select>

          <select v-model="newMemberForm.role" class="input">
            <option disabled value="">Select Role</option>
            <option value="individual">Individual</option>
            <option value="corporate">Corporate</option>
            <option value="admin">Admin</option>
          </select>

          <select v-model="newMemberForm.payment_method" class="input">
            <option disabled value="">Payment Method</option>
            <option value="card">Card</option>
            <option value="transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
          </select>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showAddMemberModal = false"
              class="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-[#006633] text-white rounded-lg"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.filter {
  @apply px-3 py-2 border rounded-lg text-sm focus:ring-[#00cc66];
}
</style>

