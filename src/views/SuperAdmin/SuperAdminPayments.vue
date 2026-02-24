<script setup>
import analyticsApi from '@/api/dashboard.js';
import paymentApi from '@/api/payments.js';
import messagingApi from '@/api/messaging.js';
import membershipApi from '@/api/membership.js';
import { useToast } from 'vue-toastification';
import SuperAdminSidebar from '@/views/SuperAdmin/SuperAdminSidebar.vue';
import { computed, onMounted, ref, watch } from 'vue';

import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Eye,
  MoreVertical,
  Search,
  Trash2,
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();
const registration = ref([]);
const purchases = ref([]);
const isEditModalOpen = ref(false);
const selectedPayment = ref(null);
const dashboardStats = ref(null);
const revenueData = ref([]);
const paymentTrendData = ref([]);

const loadingAnalytics = ref(false);

const loading = ref(false);
const searchQuery = ref('');

const activeCourses = computed(() => {
  const data =
    currentTab.value === 'Registration' ? registration.value : purchases.value;

  if (!searchQuery.value) return data;
  return data.filter((item) =>
     item.title?.toLowerCase?.().includes(searchQuery.value.toLowerCase())
);

});


const unpaidMembersCount = ref(0);

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


const fetchPayments = async () => {
  loading.value = true;
  try {
    if (currentTab.value === 'Registration') {
      const res = await paymentApi.getUnpaidMembers();
      registration.value = (res.results || []).map(normalizePayment);
    } else {
      const res = await paymentApi.getPurchases();
      purchases.value = (res.results || []).map(normalizePayment);
    }
  } finally {
    loading.value = false;
  }
};

const normalizePayment = (item) => {
  return {
    id: item.id,
    title: item.user?.full_name || item.user?.email || '—',
    enrollments: item.payment_type_display || '—',
    completion: item.amount || '—',
    amount: item.amount,
    lastUpdate: item.created_at
      ? new Date(item.created_at).toLocaleDateString()
      : '—',
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

const maxRevenue = computed(() => {
  return Math.max(...revenueData.value.map((d) => d.amount)) || 1;
});

const maxCount = computed(() => {
  return Math.max(...paymentTrendData.value.map((d) => d.count)) || 1;
});

const courseTabs = ref(['Registration', 'Purchases']);
const currentTab = ref('Registration');

const activeStatCards = computed(() => {
  return currentTab.value === 'Registration' ? statCards.value : statCards1.value;
});

const fetchDashboardAnalytics = async () => {
  loadingAnalytics.value = true;

  try {
    const dashboard = await analyticsApi.fetchDashboard();
    const revenue = await analyticsApi.fetchRevenueAnalytics();
    const membership = await analyticsApi.fetchMembershipAnalytics();

    dashboardStats.value = {
      registrations: dashboard.total_registrations,
      individuals: dashboard.total_individuals,
      organizations: dashboard.total_organizations,
      unpaid: membership.unpaid_members,
      purchases: dashboard.total_purchases,
      memberPurchases: dashboard.member_purchases,
      guestPurchases: dashboard.guest_purchases,
      revenue: revenue.total_revenue,
    };

    revenueData.value = revenue.monthly.map((item) => ({
      month: item.month,
      amount: item.amount,
    }));
    paymentTrendData.value = (dashboard.weekly_payments || []).map((item) => ({
      day: item.day,
      count: item.count,
    }));

  } catch (error) {
    toast.error('Failed to load dashboard analytics');
  } finally {
    loadingAnalytics.value = false;
  }
};

const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this payment?')) return;

  await paymentApi.removePayment(id);
  fetchPayments();
};

const handleAction = (action, course) => {
  switch (action) {
    case 'View':
      router.push(`/admin/payments/${course.id}`);
      break;

    case 'Edit':
      openEditModal(course);
      break;

    case 'Delete':
      handleDelete(course.id);
      break;

    case 'Paid':
      markAsPaid(course);
      break;
  
  }
};


  const markAsPaid = async (payment) => {
  if (!confirm(`Are you sure you want to mark payment for ${payment.title} as PAID?`)) return;

  try {
    loading.value = true;

    const paymentDetails = await paymentApi.retrievePayment(payment.id);

    if (!paymentDetails?.transaction_id) {
      toast.error("Transaction ID not found for this payment");
      return;
    }

    const payload = {
      transaction_id: paymentDetails.transaction_id,
      status: "completed",
      payment_reference: paymentDetails.payment_reference,
      metadata: null,
    };

    const response = await paymentApi.confirmPayment(payload, payment.id);

    toast.success(`Payment for ${payment.title} marked as completed`);

    fetchPayments();
    fetchDashboardAnalytics();

  } catch (error) {
    console.error(error);
    toast.error("Error confirming payment. Please try again.");
  } finally {
    loading.value = false;
  }
};

  

const statCards = computed(() => {
  if (!dashboardStats.value) return [];

  return [
    {
      title: 'Total Registrations',
      value: dashboardStats.value.registrations,
      change: '—',
      changeColor: 'text-gray-500',
    },
    {
      title: 'Total Individuals',
      value: dashboardStats.value.individuals,
      change: '—',
      changeColor: 'text-gray-500',
    },
    {
      title: 'Total Organizations',
      value: dashboardStats.value.organizations,
      change: '—',
      changeColor: 'text-gray-500',
    },
    {
      title: 'Unpaid members',
      value: dashboardStats.value.unpaid,
      change: 'Action Required',
      changeColor: 'text-red-500',
    },
  ];
});

const statCards1 = computed(() => {
  if (!dashboardStats.value) return [];

  return [
    {
      title: 'Total Course Purchased',
      value: dashboardStats.value.purchases,
      change: '—',
      changeColor: 'text-gray-500',
    },
    {
      title: 'Total Member Purchase',
      value: dashboardStats.value.memberPurchases,
      change: '—',
      changeColor: 'text-gray-500',
    },
    {
      title: 'Total Guest Purchase',
      value: dashboardStats.value.guestPurchases,
      change: '—',
      changeColor: 'text-gray-500',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(dashboardStats.value.revenue),
      change: '—',
      changeColor: 'text-[#00cc66]',
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

const formatCurrency = (amount) => {
  return `₦${amount.toLocaleString('en-US')}`;
};

const getBarHeight = (amount) => {
  return `${(amount / maxRevenue.value) * 100}%`;
};

const isMessageModalOpen = ref(false);
const messageSubject = ref('Action Required: Your Account Status');
const messageContent = ref(
  'Dear user, we noticed your account is currently unpaid. Please complete your payment to continue enjoying full access to our services. Thank you.'
);

// const openMessageModal = (title) => {
//   if (title === 'Unpaid members') {
//     isMessageModalOpen.value = true;
//   }
// };

const closeMessageModal = () => {
  isMessageModalOpen.value = false;
};

const sending = ref(false);

const sendMessage = async () => {
  sending.value = true;

  try {
    await messagingApi.broadcastMessage({
      subject: messageSubject.value,
      message: messageContent.value,
    });

    toast.success('Message sent to all unpaid members');
    closeMessageModal();
  } catch (error) {
    toast.error('Failed to send message');
  } finally {
    sending.value = false;
  }
};

onMounted(() => {
  fetchPayments();
  fetchDashboardAnalytics();
});

watch(currentTab, () => {
  fetchPayments();
});
</script>

<template>
  <div class="flex min-h-screen font-sans">
    <SuperAdminSidebar />
    <main class="flex-1 p-8 overflow-auto bg-white">
      <div class="text-sm text-gray-500 mb-6">
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
            <div class="h-64 flex items-end justify-between space-x-2 p-2">
              <div v-for="data in revenueData" :key="data.month"
                class="flex-1 h-full flex flex-col items-center justify-end group cursor-pointer">
                <div :style="{ height: getBarHeight(data.amount) }"
                  class="w-8 md:w-10 bg-[#00cc66] rounded-t-lg transition-all duration-300 hover:bg-[#00994d] relative">
                  <span
                    class="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                    {{ formatCurrency(data.amount) }}
                  </span>
                </div>
                <p class="mt-2 text-sm text-gray-600">{{ data.month }}</p>
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

        <div class="flex justify-between items-stretch mb-10 mt-10 space-x-6">
          <div v-for="(stat, index) in activeStatCards" :key="stat.title || index"
            class="flex-1 p-6 text-center bg-white shadow-lg border-y border-[#00cc66] relative overflow-hidden group transition-all duration-300"
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
                Payment Date
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
                <span
  :class="{
    'text-green-600 font-semibold':
      course.completion?.includes?.('100'),
    'text-orange-500':
      course.completion &&
      parseFloat(course.completion) < 50 &&
      course.completion !== '-',
  }"
>
  {{ course.completion ?? '-' }}
</span>

              </td>
              <td class="py-3 px-3">
                {{ course.lastUpdate }}
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
                  <button @click="handleAction('Paid', course)" class="px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                    Paid
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
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
                <button
  type="submit"
  :disabled="sending"
  class="px-6 py-2 text-sm font-medium text-white bg-[#006633] rounded-lg hover:bg-[#00994d] transition-colors shadow-lg"
>
  <span v-if="sending">Sending...</span>
  <span v-else>Send Message</span>
</button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
