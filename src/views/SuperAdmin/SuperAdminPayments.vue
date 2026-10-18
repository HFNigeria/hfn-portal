<script setup>
import analyticsApi from "@/api/dashboard.js";
import memberResourcesApi from "@/api/memberResources.js";
import membershipApi from "@/api/membership.js";
import paymentApi from "@/api/payments.js";
import DashboardLoader from "@/components/layout/DashboardLoader.vue";
import SuperAdminSidebar from "@/views/SuperAdmin/SuperAdminSidebar.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useToast } from "vue-toastification";

import {
    ChevronLeft,
    ChevronRight,
    Edit2,
    Eye,
    MoreVertical,
    Search,
    Trash2,
} from "lucide-vue-next";
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();
const registration = ref([]);
const purchases = ref([]);
const isEditModalOpen = ref(false);
const selectedPayment = ref(null);
const dashboardStats = ref(null);
const revenueData = ref([]);
const paymentTrendData = ref([]);
const isConfirmModalOpen = ref(false);
const paymentToConfirm = ref(null);
const loadingAnalytics = ref(false);
const unpaidMembersCount = ref(0);
const isViewModalOpen = ref(false);
const paymentToView = ref(null);
const isDeleteModalOpen = ref(false);
const paymentToDelete = ref(null);
const loading = ref(false);
const searchQuery = ref("");
const membershipTypes = ref([]);

const confirmForm = ref({
  payment_type: "",
  membership_type_id: "",
  amount: "",
  valid_from: "",
  valid_till: "",
});

const paymentTypeOptions = [
  { label: "Subscription", value: "subscription" },
  { label: "Course", value: "course" },
  { label: "Donation", value: "donation" },
  { label: "Registration", value: "registration" },
];

const activeCourses = computed(() => {
  const data =
    currentTab.value === "Renewal" ? registration.value : purchases.value;

  if (!searchQuery.value) return data;
  return data.filter((item) =>
    item.title?.toLowerCase?.().includes(searchQuery.value.toLowerCase())
  );
});

const openConfirmDialog = (payment) => {
  paymentToConfirm.value = payment;
  const raw = payment.raw;
  confirmForm.value = {
    payment_type: raw.payment_type || "",
    membership_type_id: raw.membership_type?.id || "",
    amount: raw.amount || "",
    valid_from: raw.valid_from ? raw.valid_from.split("T")[0] : "",
    valid_till: raw.valid_till ? raw.valid_till.split("T")[0] : "",
  };
  isConfirmModalOpen.value = true;
};

const closeConfirmDialog = () => {
  isConfirmModalOpen.value = false;
  paymentToConfirm.value = null;
  confirmForm.value = {
    payment_type: "",
    membership_type_id: "",
    amount: "",
    valid_from: "",
    valid_till: "",
  };
};

const onMembershipTypeChange = () => {
  const selected = membershipTypes.value.find(
    (t) => t.id === confirmForm.value.membership_type_id
  );
  if (selected) {
    confirmForm.value.amount = selected.price;
  }
};

const onValidFromChange = () => {
  if (confirmForm.value.valid_from) {
    const fromDate = new Date(confirmForm.value.valid_from);
    fromDate.setFullYear(fromDate.getFullYear() + 1);
    confirmForm.value.valid_till = fromDate.toISOString().split("T")[0];
  }
};

const openViewModal = (payment) => {
  paymentToView.value = payment;
  isViewModalOpen.value = true;
};

const closeViewModal = () => {
  isViewModalOpen.value = false;
  paymentToView.value = null;
};

const openMessageModal = async (title) => {
  if (title === "Unpaid members") {
    try {
      const unpaid = await membershipApi.getUnpaidMembers();
      unpaidMembersCount.value = unpaid?.length || 0;
      isMessageModalOpen.value = true;
    } catch (error) {
      toast.error("Failed to fetch unpaid members");
    }
  }
};

const fetchMembershipTypes = async () => {
  try {
    const data = await membershipApi.listMembershipTypes();
    membershipTypes.value = data.results || data || [];
  } catch (error) {
    console.error("Failed to fetch membership types:", error);
  }
};

const fetchPayments = async () => {
  loading.value = true;
  try {
    if (currentTab.value === "Renewal") {
      const res = await paymentApi.getUnpaidMembers();
      registration.value = (res.results || []).map(normalizePayment);
    } else {
      const [purchasesRes, downloadsRes] = await Promise.all([
        paymentApi.getPurchases(),
        memberResourcesApi.getDownloadList(1),
      ]);

      const purchasesData = (purchasesRes || []).map(normalizePayment);

      const downloadsData = (downloadsRes?.submissions || []).map(
        normalizeDownload
      );

      purchases.value = [...purchasesData, ...downloadsData];
    }
  } finally {
    loading.value = false;
  }
};

const normalizeDownload = (item) => {
  return {
    id: `download-${item.id}`,
    title: item.full_name || item.email || "Download User",
    email: item.email || "-",
    enrollments: "Download",
    completion: "-",
    amount: "-",
    status: "completed",
    lastUpdate: item.submitted_at
      ? new Date(item.submitted_at).toLocaleDateString()
      : "-",
    raw: item,
  };
};

const normalizePayment = (item) => {
  if (item.user) {
    const rawDate = item.payment_date || 
                    item.last_payment_date || 
                    item.subscription?.created_at || 
                    item.created_at;
    return {
      id: item.id,
      title: item.user?.full_name || item.user?.email || "Unknown",
      email: item.user?.email || "-",
      enrollments: item.payment_type_display || "-",
      completion: item.amount || "-",
      amount: item.amount,
      status: item.status,
      lastUpdate: rawDate
        ? new Date(rawDate).toLocaleDateString()
        : "-",
      raw: item,
    };
  }

  return {
    id: item.id,
    title: item.full_name || item.email || "Unknown",
    email: item.email || "-",
    enrollments: item.role || "Member",
    completion: "-",
    amount: null,
    status: item.has_active_subscription ? "completed" : "pending",
    lastUpdate: item.membership_expires_at
      ? new Date(item.membership_expires_at).toLocaleDateString()
      : "-",
    raw: item,
  };
};

const openEditModal = (payment) => {
  selectedPayment.value = { ...payment };
  isEditModalOpen.value = true;
};

const saveEdit = async () => {
  await paymentApi.editPayment(selectedPayment.value.id, {
    amount: selectedPayment.value.amount,
    category: selectedPayment.value.enrollments,
  });

  isEditModalOpen.value = false;
  fetchPayments();
};

const currentMonth = new Date().getMonth() + 1; 

const recentRevenueData = computed(() => {
  const allData = revenueData.value;
  return allData.filter((item) => {
    const monthIndex = new Date(item.month + " 1, 2026").getMonth() + 1;
    return monthIndex <= currentMonth;
  }).slice(-12);
});

const maxRevenue = computed(() => {
  if (!recentRevenueData.value.length) return 0;
  return Math.max(...recentRevenueData.value.map((r) => Number(r.amount) || 0));
});

const maxCount = computed(() => {
  return Math.max(...paymentTrendData.value.map((d) => d.count)) || 1;
});

const courseTabs = ref(["Renewal", "Registrations"]);
const currentTab = ref("Renewal");

const activeStatCards = computed(() => {
  return currentTab.value === "Renewal"
    ? statCards.value
    : statCards1.value;
});

const fetchDashboardAnalytics = async () => {
  loadingAnalytics.value = true;

  try {
    const dashboard = await analyticsApi.fetchDashboard();
    const revenue = await analyticsApi.fetchRevenueAnalytics();
    const membership = await analyticsApi.fetchMembershipAnalytics();

    const memberCount =
      dashboard.users_by_role?.find((r) => r.role === "member")?.count || 0;

    dashboardStats.value = {
      totalAccounts: dashboard.total_accounts,
      totalIndividuals: memberCount,
      newSignups: dashboard.new_signups_30_days,
      unpaid: membership.unpaid_members,
      purchases: dashboard.total_purchases,
      memberPurchases: dashboard.member_purchases,
      guestPurchases: dashboard.guest_purchases,
      revenue: revenue.total_revenue,
    };

    revenueData.value = Object.entries(revenue.monthly_revenue).map(
      ([month, amount]) => ({
        month,
        amount,
      })
    );
    paymentTrendData.value = (revenue.payment_method_distribution || []).map(
      (item) => ({
        day: item.payment_method,
        count: item.count,
      })
    );
  } catch (error) {
    toast.error("Failed to load dashboard analytics");
  } finally {
    loadingAnalytics.value = false;
  }
};

const openDeleteDialog = (payment) => {
  paymentToDelete.value = payment;
  isDeleteModalOpen.value = true;
};

const closeDeleteDialog = () => {
  isDeleteModalOpen.value = false;
  paymentToDelete.value = null;
};

const confirmDelete = async () => {
  const payment = paymentToDelete.value;

  try {
    loading.value = true;
    await paymentApi.paymentDelete(payment.id);
    toast.success("Payment deleted successfully");
    closeDeleteDialog();
    fetchPayments();
  } catch (error) {
    toast.error("Failed to delete payment");
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this payment?")) return;

  try {
    await paymentApi.removePayment(id);

    toast.success("Payment deleted successfully");

    fetchPayments();
  } catch (error) {
    toast.error("Failed to delete payment");
  }
};

const handleAction = (action, course) => {
  switch (action) {
    case "View":
      openViewModal(course);
      break;

    case "Edit":
      openEditModal(course);
      break;

    case "Delete":
      openDeleteDialog(course);
      break;

    case "Paid":
      markAsPaid(course);
      break;
  }
};


const markAsPaid = async () => {
  const payment = paymentToConfirm.value;
  const raw = payment.raw;
  const form = confirmForm.value;

  try {
    loading.value = true;

    const payload = {
      user_id: raw.user?.id || raw.user_id || raw.id,
      payment_type: form.payment_type,
      membership_type_id: form.membership_type_id || null,
      course_id: raw.course?.id || null,
      amount: parseFloat(form.amount) || raw.amount,
      payment_method: raw.payment_method || "cash",
      transaction_id: raw.transaction_id,
      payment_reference: raw.payment_reference,
      payment_date: raw.payment_date || new Date().toISOString(),
      valid_from: form.valid_from || null,
      valid_till: form.valid_till || null,
      donation_purpose: raw.donation_purpose || "",
      metadata: "",
    };

    await paymentApi.confirmPayment(payload, payment.id);

    toast.success(`Payment for ${payment.title} marked as completed`);

    closeConfirmDialog();
    fetchPayments();
    fetchDashboardAnalytics();
  } catch (error) {
    toast.error(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Error confirming payment"
    );
  } finally {
    loading.value = false;
  }
};
   
const statCards = computed(() => {
  if (!dashboardStats.value) return [];

  return [
    {
      title: "Total Accounts",
      value: dashboardStats.value.totalAccounts,
      change: "—",
      changeColor: "text-gray-500",
    },
    {
      title: "Total Individuals",
      value: dashboardStats.value.totalIndividuals,
      change: "—",
      changeColor: "text-gray-500",
    },
    {
      title: "New Sign Ups (30 days)",
      value: dashboardStats.value.newSignups,
      change: "—",
      changeColor: "text-gray-500",
    },
    {
      title: "Unpaid members",
      value: dashboardStats.value.unpaid,
      change: "Action Required",
      changeColor: "text-red-500",
    },
  ];
});

const statCards1 = computed(() => {
  if (!dashboardStats.value) return [];

  return [
    {
      title: "Total Course Purchased",
      value: dashboardStats.value.totalAccounts,
      change: "—",
      changeColor: "text-gray-500",
    },
    {
      title: "Total Member Purchase",
      value: dashboardStats.value.totalIndividuals,
      change: "—",
      changeColor: "text-gray-500",
    },
    {
      title: "Total New Signups",
      value: dashboardStats.value.newSignups,
      change: "—",
      changeColor: "text-gray-500",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(dashboardStats.value.revenue),
      change: "—",
      changeColor: "text-[#00cc66]",
    },
  ];
});

const currentPage = ref(1);
const totalPages = 2;

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages) {
    currentPage.value = page;
  }
};

const formatCurrency = (value) => {
  if (!value && value !== 0) return "₦0";

  return `₦${Number(value).toLocaleString()}`;
};

const getBarHeight = (amount) => {
  return `${(amount / maxRevenue.value) * 100}%`;
};

const isMessageModalOpen = ref(false);
const messageSubject = ref("Action Required: Your Account Status");
const messageContent = ref(
  "Dear user, we noticed your account is currently unpaid. Please complete your payment to continue enjoying full access to our services. Thank you."
);

const closeMessageModal = () => {
  isMessageModalOpen.value = false;
};

const sending = ref(false);

const sendMessage = async () => {
  sending.value = true;

  try {
    const payload = {
      subject: messageSubject.value,
      message: messageContent.value,
    };

    console.log("Payload being sent:", payload);

    const res = await paymentApi.broadcastToUnpaid(payload);

    console.log("API response:", res);

    toast.success("Message sent to all unpaid members");
    closeMessageModal();
  } catch (error) {
    console.error("API error:", error.response?.data);
    toast.error("Failed to send message");
  } finally {
    sending.value = false;
  }
};

onMounted(() => {
  fetchPayments();
  fetchDashboardAnalytics();
  fetchMembershipTypes();
});

watch(currentTab, () => {
  fetchPayments();
});

const showSidebar = ref(false);
const toggleSidebar = () => (showSidebar.value = !showSidebar.value);
const closeSidebar = () => (showSidebar.value = false);
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
      <SuperAdminSidebar @closeSidebar="closeSidebar" class="h-full" />
    </div>

    <div v-if="showSidebar" class="fixed inset-0 bg-gray-500 bg-opacity-50 z-30 lg:hidden" @click="closeSidebar"></div>

    <main class="flex-1 p-8 overflow-auto bg-white">
      <DashboardLoader v-if="loading" message="Loading payments..." />
      <template v-else>
        <div class="text-sm text-gray-500 mb-6 pt-10 lg:pt-0">
          <span class="text-[#006633]">Home</span> > Payments
        </div>

        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-6 border-b border-[#006633]/30 inline-block pb-3">
            Payments
          </h1>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div class="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">
                Monthly Revenue Overview
              </h2>
              <div class="h-64 flex items-end justify-between gap-1 px-4 pb-2">
                <div v-for="data in recentRevenueData" :key="data.month"
                  class="flex-1 h-full flex flex-col items-center justify-end group cursor-pointer">
                  <div :style="{ height: getBarHeight(data.amount) }"
                    class="w-8 md:w-10 bg-[#00cc66] rounded-t-lg transition-all duration-300 hover:bg-[#00994d] relative">
                    <span
                      class="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                      {{ formatCurrency(data.amount) }}
                    </span>
                  </div>
                  <p class="mt-2 text-xs text-gray-600 truncate">{{ String(data.month).slice(0, 3) }}</p>
                </div>
              </div>
              <p class="mt-4 text-xs text-gray-500 text-right">
                Maximum Revenue: {{ formatCurrency(maxRevenue) }}
              </p>
            </div>

            <div class="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">
                Weekly Payment Count
              </h2>
              <div class="relative h-64 p-4">
                <div class="absolute top-0 left-0 text-xs text-gray-400">
                  {{ maxCount }}
                </div>
                <div class="absolute bottom-6 left-0 right-0 h-px bg-gray-300"></div>

                <div class="flex h-full pb-6 relative">
                  <div v-for="(data, index) in paymentTrendData" :key="data.day || index"
                    class="flex-1 flex flex-col items-center justify-end relative z-10">
                    <div :style="{
                      bottom: `${(data.count / maxCount) * 200 + 10}px`,
                    }"
                      class="absolute w-3 h-3 rounded-full bg-[#006633] shadow-md transition-all duration-500 group cursor-pointer">
                      <span
                        class="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                        {{ data.count }} payments
                      </span>
                    </div>
                    <p class="mt-2 text-sm text-gray-600 absolute bottom-0">
                      {{ data.day }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="relative flex justify-center items-center">
            <div class="flex border-b border-gray-200 space-x-4">
              <button v-for="tab in courseTabs" :key="tab" @click="currentTab = tab"
                class="py-2 px-4 text-lg font-medium transition-colors" :class="{
                  'text-[#006633] border-b-2 border-[#00cc66]':
                    currentTab === tab,
                  'text-gray-500 hover:text-[#00994d]': currentTab !== tab,
                }">
                {{ tab }}
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 mt-10">
            <div v-for="(stat, index) in activeStatCards" :key="stat.title || index"
              class="p-6 text-center bg-white shadow-lg border-y border-[#00cc66] relative overflow-hidden group transition-all duration-300"
              :class="{
                'rounded-tl-4xl rounded-br-4xl': index === 0,
                'rounded-tl-4xl rounded-br-4xl':
                  index === activeStatCards.length - 1,
                'rounded-tl-4xl rounded-br-4xl': true,
                'cursor-pointer hover:shadow-xl transform hover:scale-[1.02]':
                  stat.title === 'Unpaid members',
              }" @click="openMessageModal(stat.title)">
              <div class="absolute inset-y-0 left-0 w-1 bg-[#00cc66]"></div>
              <div class="absolute inset-y-0 right-0 w-1 bg-[#00cc66]"></div>

              <p class="text-gray-600 text-sm mb-1">{{ stat.title }}</p>

              <div class="text-4xl font-bold text-gray-800 mb-1">
                <span v-if="stat.stars">
                  <span class="text-[#ff9900]">★★★★</span>
                  <span class="text-gray-300">★</span>
                </span>
                <span v-else>{{ stat.value }}</span>
              </div>

              <p :class="[stat.changeColor, 'text-sm font-medium']">
                {{ stat.change }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div class="flex justify-end mb-6">
            <div class="relative w-full max-w-sm">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" v-model="searchQuery" placeholder="Search..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00cc66] focus:border-[#00cc66] transition-colors" />
            </div>
          </div>

          <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr class="bg-[#f0fff0] text-gray-700 uppercase text-sm leading-normal border-b border-[#00cc66]/50">
                <th class="py-3 px-3 text-left w-12 rounded-tl-lg">
                  <input type="checkbox" class="h-4 w-4 text-[#00cc66] border-gray-300 rounded focus:ring-[#00cc66]" />
                </th>
                <th class="py-3 px-3 text-left flex items-center">
                  Name
                  <MoreVertical class="w-4 h-4 ml-1 text-gray-500 cursor-pointer" />
                </th>
                <th class="py-3 px-3 text-left">
                  Category
                  <MoreVertical class="w-4 h-4 ml-1 text-gray-500 cursor-pointer" />
                </th>
                <th class="py-3 px-3 text-left">
                  Amount
                  <MoreVertical class="w-4 h-4 ml-1 text-gray-500 cursor-pointer" />
                </th>
                <th class="py-3 px-3 text-left">
                  Email
                  <MoreVertical class="w-4 h-4 ml-1 text-gray-500 cursor-pointer" />
                </th>
                <th class="py-3 px-3 text-center rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm font-light divide-y divide-gray-100">
              <tr v-for="course in activeCourses" :key="course.id" class="hover:bg-[#f9fff9] transition-colors">
                <td class="py-3 px-3 whitespace-nowrap">
                  <input type="checkbox" class="h-4 w-4 text-[#00cc66] border-gray-300 rounded focus:ring-[#00cc66]" />
                </td>
                <td class="py-3 px-3 whitespace-nowrap font-medium text-[#006633]">
                  {{ course.title }}
                </td>
                <td class="py-3 px-3">
                  {{ course.enrollments !== null ? course.enrollments : '-' }}
                </td>
                <td class="py-3 px-3">
                  <span :class="{
                    'text-green-600 font-semibold':
                      course.completion?.includes?.('100'),
                    'text-orange-500':
                      course.completion &&
                      parseFloat(course.completion) < 50 &&
                      course.completion !== '-',
                  }">
                    {{ course.completion ?? '-' }}
                  </span>

                </td>
                <td class="py-3 px-3">
                  {{ course.email }}
                </td>
                <td class="py-3 px-3 text-center">
                  <div class="flex item-center justify-center space-x-2">
                    <button @click="handleAction('View', course)"
                      class="w-6 h-6 transform hover:text-blue-500 hover:scale-110 transition-transform p-0.5">
                      <Eye class="w-full h-full text-gray-500 hover:text-blue-500" />
                    </button>
                    <button @click="handleAction('Edit', course)"
                      class="w-6 h-6 transform hover:text-green-500 hover:scale-110 transition-transform p-0.5">
                      <Edit2 class="w-full h-full text-gray-500 hover:text-green-500" />
                    </button>
                    <button @click="handleAction('Delete', course)"
                      class="w-6 h-6 transform hover:text-red-500 hover:scale-110 transition-transform p-0.5">
                      <Trash2 class="w-full h-full text-gray-500 hover:text-red-500" />
                    </button>
                    <button v-if="course.status !== 'completed'" @click="openConfirmDialog(course)"
                      class="px-2 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm">
                      Confirm
                    </button>

                    <button v-else disabled
                      class="px-2 py-1 bg-green-600 text-white rounded-lg text-sm cursor-not-allowed">
                      Paid
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            </table>
          </div>

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
        <div v-if="isMessageModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="fixed inset-0 bg-opacity-50 transition-opacity" @click="closeMessageModal"></div>

          <div class="flex items-center justify-center min-h-screen p-4">
            <div
              class="bg-white rounded-xl shadow-2xl w-full max-w-lg transition-all transform scale-100 p-6 border-t-4 border-[#00cc66]">
              <h3 class="text-2xl font-bold text-gray-800 mb-4 flex justify-between items-center">
                Message All Unpaid Users
                <button @click="closeMessageModal" class="text-gray-400 hover:text-gray-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                    </path>
                  </svg>
                </button>
              </h3>
              <p class="text-sm text-gray-600 mb-6">
                This message will be sent to all
                <strong>{{ statCards[3]?.value }}</strong> unpaid users.
              </p>

              <form @submit.prevent="sendMessage">
                <div class="mb-4">
                  <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input id="subject" v-model="messageSubject" type="text" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00cc66] focus:border-[#00cc66] transition-colors"
                    placeholder="Enter message subject" />
                </div>

                <div class="mb-6">
                  <label for="content" class="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
                  <textarea id="content" v-model="messageContent" rows="6" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00cc66] focus:border-[#00cc66] transition-colors resize-none"
                    placeholder="Write your message here..."></textarea>
                </div>

                <div class="flex justify-end space-x-3">
                  <button type="button" @click="closeMessageModal"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors shadow-md">
                    Cancel
                  </button>
                  <button type="submit" :disabled="sending"
                    class="px-6 py-2 text-sm font-medium text-white bg-[#006633] rounded-lg hover:bg-[#00994d] transition-colors shadow-lg">
                    <span v-if="sending">Sending...</span>
                    <span v-else>Send Message</span>
                  </button>

                </div>
              </form>
            </div>
          </div>
        </div>
        <div v-if="isConfirmModalOpen" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black/40" @click="closeConfirmDialog"></div>

          <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative z-10 max-h-[90vh] overflow-y-auto">

            <h3 class="text-xl font-bold mb-4 text-gray-800">
              Confirm Payment
            </h3>

            <p class="text-gray-600 mb-4">
              Confirm payment for <strong>{{ paymentToConfirm?.title }}</strong>
            </p>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                <select v-model="confirmForm.payment_type"
                  class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#00cc66] focus:border-[#00cc66]">
                  <option value="">Select payment type</option>
                  <option v-for="option in paymentTypeOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
                <select v-model="confirmForm.membership_type_id" @change="onMembershipTypeChange"
                  class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#00cc66] focus:border-[#00cc66]">
                  <option value="">Select membership type</option>
                  <option v-for="type in membershipTypes" :key="type.id" :value="type.id">
                    {{ type.name }} - &#8358;{{ type.price }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Amount (&#8358;)</label>
                <input v-model="confirmForm.amount" type="number" step="0.01"
                  class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#00cc66] focus:border-[#00cc66]"
                  placeholder="Enter amount" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                <input v-model="confirmForm.valid_from" type="date" @change="onValidFromChange"
                  class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#00cc66] focus:border-[#00cc66]" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Valid Till</label>
                <input v-model="confirmForm.valid_till" type="date"
                  class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#00cc66] focus:border-[#00cc66]" />
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button @click="closeConfirmDialog" class="px-4 py-2 bg-gray-200 rounded-lg">
                Cancel
              </button>

              <button @click="markAsPaid" :disabled="loading" class="px-4 py-2 bg-[#006633] text-white rounded-lg">
                <span v-if="loading">Confirming...</span>
                <span v-else>Confirm Payment</span>
              </button>
            </div>

          </div>
        </div>
        <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black/40" @click="closeDeleteDialog"></div>

          <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative z-10">
            <h3 class="text-xl font-bold mb-4 text-gray-800">
              Delete Payment
            </h3>

            <p class="text-gray-600 mb-4">
              Are you sure you want to delete the payment for <strong>{{ paymentToDelete?.title }}</strong>? This action cannot be undone.
            </p>

            <div class="flex justify-end gap-3 mt-6">
              <button @click="closeDeleteDialog" class="px-4 py-2 bg-gray-200 rounded-lg">
                Cancel
              </button>

              <button @click="confirmDelete" :disabled="loading" class="px-4 py-2 bg-red-600 text-white rounded-lg">
                <span v-if="loading">Deleting...</span>
                <span v-else>Delete</span>
              </button>
            </div>
          </div>
        </div>
        <div v-if="isEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black/40" @click="isEditModalOpen = false"></div>

          <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative z-10">
            <h3 class="text-xl font-bold mb-4">Edit Payment</h3>

            <div class="space-y-4">
              <div>
                <label class="text-sm text-gray-600">Name</label>
                <input v-model="selectedPayment.title" class="w-full border rounded-lg px-3 py-2" disabled />
              </div>

              <div>
                <label class="text-sm text-gray-600">Amount</label>
                <input v-model="selectedPayment.amount" type="number" class="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button @click="isEditModalOpen = false" class="px-4 py-2 bg-gray-200 rounded-lg">
                Cancel
              </button>

              <button @click="saveEdit" class="px-4 py-2 bg-[#006633] text-white rounded-lg">
                Save
              </button>
            </div>
          </div>

          <div v-if="isViewModalOpen" class="fixed inset-0 z-50 flex items-center justify-center">
            <div class="absolute inset-0 bg-black/40" @click="closeViewModal"></div>

            <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative z-10">

              <h3 class="text-xl font-bold mb-4">Payment Details</h3>

              <div class="space-y-3 text-sm">

                <p><strong>Name:</strong> {{ paymentToView?.title }}</p>

                <p><strong>Email:</strong> {{ paymentToView?.email }}</p>

                <p><strong>Category:</strong> {{ paymentToView?.enrollments }}</p>

                <p><strong>Amount:</strong> {{ formatCurrency(paymentToView?.amount) }}</p>

                <p><strong>Status:</strong> {{ paymentToView?.status }}</p>

                <p><strong>Date:</strong> {{ paymentToView?.lastUpdate }}</p>

              </div>

              <div class="flex justify-end mt-6">
                <button @click="closeViewModal" class="px-4 py-2 bg-gray-200 rounded-lg">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped></style>
