<script setup>
import UserSidebar from '@/components/layout/UserSidebar.vue';
import { computed, reactive, ref } from 'vue';

const membershipTypes = reactive([
  {
    title: 'Individual',
    description: 'For individual registered businesses.',
    price: '₦50,000 per year.',
  },
  {
    title: 'Association',
    description: 'For registered healthcare professional associations.',
    price: '₦150,000 per year.',
  },
  {
    title: 'Corporate',
    description: 'For locally registered healthcare businesses.',
    price: '₦200,000 per year.',
  },
  {
    title: 'Multinational',
    description: 'For international healthcare organizations.',
    price: '₦500,000 per year.',
  },
  
  {
    title: 'Diaspora',
    description: 'For healthcare professionals residing outside the country.',
    price: '$50 per year.',
  },
]);

const selectedType = ref('Corporate');
const showSidebar = ref(false);

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

const closeSidebar = () => {
  showSidebar.value = false;
};

const selectedDetail = computed(() =>
  membershipTypes.find((type) => type.title === selectedType.value)
);

const showPaymentDialog = ref(false);

const bankDetails = reactive({
  bankName: 'Zenith Bank',
  accountName: 'Healthcare Federation Of Nigeria',
  accountNumber: '1013784059',
});

const openPaymentDialog = () => {
  showPaymentDialog.value = true;
};

const closePaymentDialog = () => {
  showPaymentDialog.value = false;
};

  
</script>

<template>
  <div class="relative flex h-screen bg-gray-50">
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
      <UserSidebar @closeSidebar="closeSidebar" />
    </div>

    <div class="flex-1 flex flex-col overflow-hidden relative">
      <header class="p-6 bg-white border-t border-gray-200">
        <div class="text-sm text-gray-500">
          <span class="hover:underline cursor-pointer">Home</span>
          &gt;
          <span class="font-semibold text-gray-800">
            Membership Subscription
          </span>
        </div>
      </header>

      <main
        class="flex-1 overflow-x-hidden overflow-y-auto bg-white p-6 sm:p-10"
      >
        <h1 class="text-3xl font-bold text-center mb-10 text-gray-800">
          Membership Subscription
        </h1>

        <div
          class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-100"
        >
          <p class="text-center text-gray-600 mb-6">
            Kindly confirm your subscription. You will be redirected to our
            payment gateway.
          </p>

          <div class="flex justify-center space-x-4 mb-8">
            <button
              v-for="type in membershipTypes"
              :key="type.title"
              @click="selectedType = type.title"
              :class="[
                'px-6 py-2 rounded-lg font-semibold transition-all duration-300 border-2 relative',
                selectedType === type.title
                  ? 'active-tab-curve'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#006633]',
              ]"
            >
              {{ type.title }}
            </button>
          </div>

          <div
            class="relative p-6 border-2 border-gray-200 rounded-lg bg-white"
          >
            <div class="text-center">
              <h2 class="text-2xl font-bold mb-4 text-gray-800">
                {{ selectedDetail.title }}
              </h2>
              <p class="text-gray-600 mb-6">
                {{ selectedDetail.description }}
              </p>
              <p class="text-2xl font-bold text-[#006633] mb-6">
                {{ selectedDetail.price }}
              </p>
              <button
                @click="openPaymentDialog"
                class="flex items-center justify-center mx-auto px-6 py-3 bg-[#006633] text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors"
              >
                Proceed to Payment
                <svg
                  class="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
      
<div
  v-if="showPaymentDialog"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
>
  <div
    class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn"
  >
    <button
      @click="closePaymentDialog"
      class="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
    >
      ✕
    </button>

    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        Bank Transfer Details
      </h2>

      <p class="text-gray-600 mb-6">
        Kindly transfer your subscription fee to the account below.
      </p>

      <div class="bg-gray-50 border rounded-xl p-5 space-y-4 text-left">
        <div>
          <p class="text-sm text-gray-500">Bank Name</p>
          <p class="font-semibold text-gray-800">
            {{ bankDetails.bankName }}
          </p>
        </div>

        <div>
          <p class="text-sm text-gray-500">Account Name</p>
          <p class="font-semibold text-gray-800">
            {{ bankDetails.accountName }}
          </p>
        </div>

        <div>
          <p class="text-sm text-gray-500">Account Number</p>

          <div class="flex items-center justify-between">
            <p class="font-bold text-2xl text-[#006633] tracking-wider">
              {{ bankDetails.accountNumber }}
            </p>

            <button
              @click="navigator.clipboard.writeText(bankDetails.accountNumber)"
              class="text-sm bg-[#006633] text-white px-3 py-1 rounded-lg hover:bg-green-700"
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <p class="text-sm text-gray-500">Membership Type</p>
          <p class="font-semibold text-gray-800">
            {{ selectedDetail.title }}
          </p>
        </div>

        <div>
          <p class="text-sm text-gray-500">Amount</p>
          <p class="font-bold text-[#006633]">
            {{ selectedDetail.price }}
          </p>
        </div>
      </div>

      <button
        @click="closePaymentDialog"
        class="mt-6 w-full py-3 rounded-xl bg-[#006633] text-white font-semibold hover:bg-green-700 transition"
      >
        I Have Made Payment
      </button>
    </div>
  </div>
</div>
    </div>
  </div>
</template>

<style scoped>
.active-tab-curve {
  background-color: #006633 !important;
  color: white !important;
  border: none !important;
  padding: 10px 24px;
  border-radius: 8px;
  z-index: 1;
}

.active-tab-curve::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid #d1d5db;
  border-radius: 12px;
  background-color: transparent;
  z-index: -1;
}

.animate-fadeIn {
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

  
</style>
