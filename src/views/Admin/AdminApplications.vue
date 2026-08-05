<script setup>
import membershipAPI from "@/api/membership.js";
import userList from "@/api/userRegister.js";
import DashboardLoader from "@/components/layout/DashboardLoader.vue";
import AdminSidebar from "@/views/Admin/AdminSidebar.vue";
import {
    ChevronLeft,
    ChevronRight,
    Search,
} from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();
const applications = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const filterDateFrom = ref("");
const filterDateTo = ref("");
const filterCategory = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;

const showRejectModal = ref(false);
const showSuccessModal = ref(false);
const showTransactionModal = ref(false);
const showDetailsModal = ref(false);
const selectedApplication = ref(null);
const rejectionReason = ref("");
const actionLoading = ref(null);

const transactionForm = ref({
  user_id: null,
  membership_type_id: "",
  start_date: "",
  end_date: "",
  amount: "",
  confirmed: true,
  payment_method: "cash",
  auto_renew: false,
  is_trial: false,
  metadata: {},
});

const membershipTypes = ref([]);

const fetchMembershipTypes = async () => {
  try {
    const data = await membershipAPI.listMembershipTypes();
    membershipTypes.value = data.results || data || [];
  } catch (error) {
    console.error("Failed to fetch membership types:", error);
  }
};

const fetchApplications = async () => {
  loading.value = true;
  try {
    const [individualData, corporateData] = await Promise.all([
      membershipAPI.listApplications(),
      userList.getCorporateUsers(),
    ]);

    const individualApps = individualData?.results || individualData?.data || (Array.isArray(individualData) ? individualData : []);
    const corporateApps = corporateData?.results || corporateData?.data || (Array.isArray(corporateData) ? corporateData : []);

    const filteredCorporate = corporateApps.filter(
      (app) => app.member_category === "association" || app.member_category === "corporate"
    );

    applications.value = [...individualApps, ...filteredCorporate];
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    toast.error("Failed to load applications");
  } finally {
    loading.value = false;
  }
};

const getApplicationDate = (app) => {
  return app.created_at || app.date_joined || null;
};

const resolveUserId = (app) => {
  if (!app) return null;
  if (app.created_user) return app.created_user;
  if (app.user_id) return app.user_id;
  if (app.user?.id) return app.user.id;
  if (app.member_category === "association" || app.member_category === "corporate" || app.member_category === "individual") return app.id;
  return null;
};

const filteredApplications = computed(() => {
  return applications.value.filter((app) => {
    const matchesSearch =
      !searchQuery.value ||
      app.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchQuery.value.toLowerCase());

    const appDate = getApplicationDate(app);
    let matchesDateFrom = true;
    let matchesDateTo = true;

    if (filterDateFrom.value && appDate) {
      matchesDateFrom =
        new Date(appDate) >= new Date(filterDateFrom.value);
    }
    if (filterDateTo.value && appDate) {
      const toEnd = new Date(filterDateTo.value);
      toEnd.setHours(23, 59, 59, 999);
      matchesDateTo = new Date(appDate) <= toEnd;
    }

    let matchesCategory = true;
    if (filterCategory.value === "corporate") {
      matchesCategory =
        app.member_category === "association" ||
        app.member_category === "corporate";
    } else if (filterCategory.value === "individual") {
      matchesCategory =
        !app.member_category || app.member_category === "individual";
    }

    return matchesSearch && matchesDateFrom && matchesDateTo && matchesCategory;
  });
});

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredApplications.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredApplications.value.length / itemsPerPage) || 1);

const openRejectModal = (application) => {
  selectedApplication.value = application;
  rejectionReason.value = "";
  showRejectModal.value = true;
};

const openDetailsModal = (application) => {
  selectedApplication.value = application;
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedApplication.value = null;
};

const confirmReject = async () => {
  const appId = getApplicationId(selectedApplication.value);
  if (!appId) {
    toast.error("Invalid application ID");
    return;
  }
  if (!rejectionReason.value.trim()) {
    toast.error("Please provide a reason for rejection");
    return;
  }
  try {
    actionLoading.value = selectedApplication.value.id;
    await membershipAPI.rejectRegistration({
      application_id: appId,
      rejection_reason: rejectionReason.value,
    });
    toast.success("Application rejected successfully");
    showRejectModal.value = false;
    fetchApplications();
  } catch (error) {
    console.error("Failed to reject application:", error);
    toast.error("Failed to reject application");
  } finally {
    actionLoading.value = null;
  }
};

const getApplicationId = (app) => {
  return app.id || app.pk || app.user_id || app.id || null;
};

const openSuccessModal = async (application) => {
  const appId = getApplicationId(application);
  if (!appId) {
    toast.error("Invalid application ID");
    return;
  }

  try {
    actionLoading.value = application.id;

    const response = await membershipAPI.approveApplication({
      application_id: appId,
    });

    toast.success("Application approved successfully!");

    selectedApplication.value = response.application;

    showSuccessModal.value = true;
    fetchApplications();
  } catch (error) {
    console.error("Failed to approve application:", error);
    toast.error("Failed to approve application");
  } finally {
    actionLoading.value = null;
  }
};


const goToCreateTransaction = () => {
  showSuccessModal.value = false;
  resetTransactionForm();
  showTransactionModal.value = true;
};

const resetTransactionForm = () => {
  transactionForm.value = {
    user_id: resolveUserId(selectedApplication.value),
    membership_type_id: "",
    start_date: "",
    end_date: "",
    amount: "",
    confirmed: true,
    payment_method: "cash",
    auto_renew: false,
    is_trial: false,
    metadata: {},
  };
};

const handleMembershipTypeChange = () => {
  const selected = membershipTypes.value.find(m => m.id === transactionForm.value.membership_type_id);
  if (selected) {
    transactionForm.value.amount = selected.price || "";
    if (selected.duration_days) {
      const start = new Date(transactionForm.value.start_date || new Date());
      const end = new Date(start);
      end.setDate(end.getDate() + selected.duration_days);
      transactionForm.value.end_date = end.toISOString().split("T")[0];
    }
  }
};

const createTransaction = async () => {
  if (!transactionForm.value.membership_type_id || !transactionForm.value.start_date) {
    toast.error("Please fill in all required fields");
    return;
  }
  try {
    actionLoading.value = "create";
    await membershipAPI.createSubscription(transactionForm.value);
    toast.success("Transaction created successfully");
    showTransactionModal.value = false;
    fetchApplications();
  } catch (error) {
    console.error("Failed to create transaction:", error);
    const data = error.response?.data;
    const message =
      (Array.isArray(data) && data[0]) ||
      data?.detail ||
      data?.error ||
      data?.message ||
      data?.non_field_errors?.[0] ||
      "Failed to create transaction";
    toast.error(message);
  } finally {
    actionLoading.value = null;
  }
};

const openTransactionFromApproved = (application) => {
  selectedApplication.value = application;

  resetTransactionForm();
  showTransactionModal.value = true;
};

const showSidebar = ref(false);
const toggleSidebar = () => (showSidebar.value = !showSidebar.value);
const closeSidebar = () => (showSidebar.value = false);

watch([searchQuery, filterDateFrom, filterDateTo, filterCategory], () => { currentPage.value = 1; });

onMounted(() => {
  fetchApplications();
  fetchMembershipTypes();
});
</script>

<template>
  <div class="flex min-h-screen font-sans relative">
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

    <main class="flex-1 p-8 overflow-auto bg-white">
      <DashboardLoader v-if="loading" message="Loading applications..." />
      <template v-else>
        <div class="text-sm text-gray-500 mb-6 pt-10 lg:pt-0">
          <span class="text-[#006633]">Home</span> > Applications
        </div>

        <div class="text-center mb-8">
          <h1
            class="text-3xl font-bold text-gray-800 mb-6 border-b border-[#006633]/30 inline-block pb-3"
          >
            Applications
          </h1>
        </div>

        <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 overflow-x-auto">
          <div class="flex flex-wrap gap-4 mb-6 items-center">
            <div class="relative flex-1 min-w-[200px]">
              <Search
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              />
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search applications..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00cc66] focus:border-[#00cc66] transition-colors"
              />
            </div>
            <select
              v-model="filterCategory"
              class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#00cc66] focus:border-[#00cc66]"
            >
              <option value="">All</option>
              <option value="corporate">Corporate</option>
              <option value="individual">Individual</option>
            </select>
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600 whitespace-nowrap">From:</label>
              <input
                type="date"
                v-model="filterDateFrom"
                class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#00cc66] focus:border-[#00cc66]"
              />
            </div>
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600 whitespace-nowrap">To:</label>
              <input
                type="date"
                v-model="filterDateTo"
                class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#00cc66] focus:border-[#00cc66]"
              />
            </div>
          </div>

          <div v-if="paginatedApplications.length === 0" class="text-center py-12 text-gray-500">
            No applications found
          </div>

          <table v-else class="min-w-full divide-y divide-gray-200">
            <thead class="bg-[#f0fff0]">
              <tr>
                <th class="py-3 px-4 text-left text-sm font-medium text-gray-700">Name</th>
                <th class="py-3 px-4 text-left text-sm font-medium text-gray-700">Email</th>
                <th class="py-3 px-4 text-left text-sm font-medium text-gray-700">Phone</th>
                <th class="py-3 px-4 text-left text-sm font-medium text-gray-700">Role</th>
                <th class="py-3 px-4 text-left text-sm font-medium text-gray-700">Status</th>
                <th class="py-3 px-4 text-left text-sm font-medium text-gray-700">Date Applied</th>
                <th class="py-3 px-4 text-center text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
<tr
                  v-for="application in paginatedApplications"
  :key="application.id"
  class="hover:bg-gray-50 cursor-pointer"
  @click="openDetailsModal(application)"
>
                <td class="py-3 px-4 text-sm text-gray-800">
                  {{ application.name || application.first_name + ' ' + application.last_name || application.company_name }}
                </td>
                <td class="py-3 px-4 text-sm text-gray-800">
                  {{ application.email }}
                </td>
                <td class="py-3 px-4 text-sm text-gray-800">
                  {{ application.phone_number }}
                </td>
                <td class="py-3 px-4 text-sm">
<button
  @click.stop="openDetailsModal(application)"
  class="text-[#006633] hover:underline font-medium"
>
                    {{ application.member_category || "individual" }}
                  </button>
                </td>
                <td class="py-3 px-4 text-sm">
                  <span
                    :class="{
                      'bg-yellow-100 text-yellow-800': application.status === 'pending',
                      'bg-green-100 text-green-800': application.status === 'approved',
                      'bg-red-100 text-red-800': application.status === 'rejected',
                    }"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ application.status || 'pending' }}
                  </span>
                </td>
                <td class="py-3 px-4 text-sm text-gray-800">
                  {{ getApplicationDate(application) ? new Date(getApplicationDate(application)).toLocaleDateString() : '-' }}
                </td>
                <td class="py-3 px-4 text-center" @click.stop>
                  <div v-if="application.status === 'pending'" class="flex justify-center space-x-2">
                      <button
                        @click="openSuccessModal(application)"
                        :disabled="actionLoading === application.id"
                        class="p-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
                        title="Approve"
                      >
                        <svg v-if="actionLoading === application.id" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <svg v-else class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        @click="openRejectModal(application)"
                        class="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        title="Reject"
                      >
                        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  <div
                    v-else-if="application.status === 'approved'"
                    class="flex justify-center space-x-2"
                  >
                    <span class="text-green-600 text-sm font-medium"
                      >Approved</span
                    >

                    <button
                      @click="openTransactionFromApproved(application)"
                      class="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition inline-flex items-center justify-center"
                      title="Create Transaction"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.25 8.25h19.5m-16.5 9h15m-18-13.5h19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H2.25a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 012.25 4.5z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div v-else class="text-red-600 text-sm font-medium">
                    Rejected
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="flex justify-end items-center mt-6 text-sm text-gray-600">
            <span class="mr-4">Page {{ currentPage }} of {{ totalPages }}</span>
            <div class="flex space-x-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                class="p-2 border rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft class="w-4 h-4" />
              </button>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                class="p-2 border rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </template>
    </main>

    <!-- Reject Modal -->
    <div
      v-if="showRejectModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showRejectModal = false"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h3 class="text-lg font-bold text-gray-800 mb-4">Reject Application</h3>
        <p class="text-gray-600 mb-4">
          Please provide a reason for rejecting this application.
        </p>
        <textarea
          v-model="rejectionReason"
          placeholder="Enter rejection reason..."
          rows="4"
          class="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-[#00cc66] focus:border-[#00cc66]"
        ></textarea>
        <div class="flex justify-end space-x-3">
          <button
            @click="showRejectModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            @click="confirmReject"
            :disabled="actionLoading === selectedApplication?.id"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {{ actionLoading === selectedApplication?.id ? 'Rejecting...' : 'Reject' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeDetailsModal"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-bold text-gray-800 mb-4">Application Details</h3>
        <div class="space-y-3 text-sm">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-gray-500">Full Name</p>
              <p class="font-medium text-gray-800">{{ selectedApplication?.first_name }} {{ selectedApplication?.last_name }}</p>
            </div>
            <div>
              <p class="text-gray-500">Email</p>
              <p class="font-medium text-gray-800">{{ selectedApplication?.email }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-gray-500">Phone Number</p>
              <p class="font-medium text-gray-800">{{ selectedApplication?.phone_number || "-" }}</p>
            </div>
            <div>
              <p class="text-gray-500">Member Category</p>
              <p class="font-medium text-gray-800 capitalize">{{ selectedApplication?.member_category || "-" }}</p>
            </div>
          </div>
          <div>
            <p class="text-gray-500">Professional Background</p>
            <p class="font-medium text-gray-800">{{ selectedApplication?.professional_background || "-" }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-gray-500">Current Organization</p>
              <p class="font-medium text-gray-800">{{ selectedApplication?.current_organization || "-" }}</p>
            </div>
            <div>
              <p class="text-gray-500">Area of Interest</p>
              <p class="font-medium text-gray-800">{{ selectedApplication?.area_of_interest || "-" }}</p>
            </div>
          </div>
          <div>
            <p class="text-gray-500">Statement of Interest</p>
            <p class="font-medium text-gray-800">{{ selectedApplication?.statement_of_interest || "-" }}</p>
          </div>
          <div>
            <p class="text-gray-500">Notes</p>
            <p class="font-medium text-gray-800">{{ selectedApplication?.notes || "-" }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-gray-500">Status</p>
              <p class="font-medium capitalize">{{ selectedApplication?.status || "-" }}</p>
            </div>
            <div>
              <p class="text-gray-500">Date Applied</p>
              <p class="font-medium">{{ getApplicationDate(selectedApplication) ? new Date(getApplicationDate(selectedApplication)).toLocaleDateString() : "-" }}</p>
            </div>
          </div>
          <div v-if="selectedApplication?.approved_at" class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-gray-500">Approved At</p>
              <p class="font-medium">{{ new Date(selectedApplication.approved_at).toLocaleDateString() }}</p>
            </div>
            <div>
              <p class="text-gray-500">Approved By</p>
              <p class="font-medium">{{ selectedApplication?.approved_by || "-" }}</p>
            </div>
          </div>
        </div>
        <div class="flex justify-end pt-4">
          <button
            @click="closeDetailsModal"
            class="px-4 py-2 bg-[#006633] text-white rounded-lg hover:bg-[#004d33] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showSuccessModal = false"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-2">Application Approved!</h3>
        <p class="text-gray-600 mb-6">
          The application has been approved successfully. Would you like to create a transaction for this member?
        </p>
        <div class="flex justify-center space-x-3">
          <button
            @click="showSuccessModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Close
          </button>
          <button
            @click="goToCreateTransaction"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Create Transaction
          </button>
        </div>
      </div>
    </div>

    <!-- Transaction Modal -->
    <div
      v-if="showTransactionModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showTransactionModal = false"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
        <h3 class="text-lg font-bold text-gray-800 mb-6">Create Transaction</h3>
        <form @submit.prevent="createTransaction" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Membership Type *</label>
            <select
              v-model="transactionForm.membership_type_id"
              @change="handleMembershipTypeChange"
              class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#00cc66] focus:border-[#00cc66]"
            >
              <option value="">Select membership type</option>
              <option
                v-for="type in membershipTypes"
                :key="type.id"
                :value="type.id"
              >
                {{ type.name }} - ₦{{ type.price }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input
                type="date"
                v-model="transactionForm.start_date"
                @change="handleMembershipTypeChange"
                class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#00cc66] focus:border-[#00cc66]"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                v-model="transactionForm.end_date"
                class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#00cc66] focus:border-[#00cc66]"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
            <input
              type="number"
              v-model="transactionForm.amount"
              step="0.01"
              class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#00cc66] focus:border-[#00cc66]"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              v-model="transactionForm.payment_method"
              class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#00cc66] focus:border-[#00cc66]"
            >
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Card</option>
              <option value="online">Online Payment</option>
            </select>
          </div>

          <div class="flex items-center">
            <input
              type="checkbox"
              v-model="transactionForm.auto_renew"
              id="auto_renew"
              class="h-4 w-4 text-[#00cc66] border-gray-300 rounded focus:ring-[#00cc66]"
            />
            <label for="auto_renew" class="ml-2 text-sm text-gray-700">Auto-renew subscription</label>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showTransactionModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="actionLoading === 'create'"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {{ actionLoading === 'create' ? 'Creating...' : 'Create Transaction' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
