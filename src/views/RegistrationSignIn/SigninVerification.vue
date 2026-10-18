<script setup>
import userRegister from "@/api/userRegister";
import registerImage from '@/assets/register.jpg';
import { useAuth } from '@/store/authStore';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();
const { login } = useAuth();
const verificationCode = ref(['', '', '', '', '', '']);
const timerSeconds = ref(3 * 60);
const isTimerRunning = ref(true);
const timerInterval = ref(null);
const inputRefs = ref([]);
const isLoading = ref(false);
const userEmail = ref('');

const displayTime = computed(() => {
  const minutes = Math.floor(timerSeconds.value / 60);
  const seconds = timerSeconds.value % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

const startTimer = () => {
  if (timerInterval.value) clearInterval(timerInterval.value);
  isTimerRunning.value = true;
  timerSeconds.value = 3 * 60;
  timerInterval.value = setInterval(() => {
    if (timerSeconds.value > 0) {
      timerSeconds.value--;
    } else {
      clearInterval(timerInterval.value);
      isTimerRunning.value = false;
    }
  }, 1000);
};

onMounted(() => {
  const savedEmail = localStorage.getItem("pendingVerificationEmail");
  if (savedEmail) {
    userEmail.value = savedEmail;
  } else {
    toast.error("No email found for verification. Please register first.");
  }
  
  startTimer();
  if (inputRefs.value[0]) {
    inputRefs.value[0].focus();
  }
});

onUnmounted(() => {
  clearInterval(timerInterval.value);
});

const handleInput = (index, event) => {
  const value = event.target.value;

  if (value.length > 1) {
    event.target.value = value.charAt(0);
    verificationCode.value[index] = value.charAt(0);
  } else {
    verificationCode.value[index] = value;
  }

  if (value && index < verificationCode.value.length - 1) {
    inputRefs.value[index + 1].focus();
  }
};

const handleKeydown = (index, event) => {
  if (
    event.key === 'Backspace' &&
    !verificationCode.value[index] &&
    index > 0
  ) {
    inputRefs.value[index - 1].focus();
    verificationCode.value[index - 1] = '';
  }
};

const fullCode = computed(() => verificationCode.value.join(''));

const handleVerification = async () => {
  if (fullCode.value.length !== 6) {
    toast.error("Please enter the full 6-digit code.");
    return;
  }

  if (!userEmail.value) {
    toast.error("Email not found. Please register again.");
    return;
  }

  try {
    isLoading.value = true;

    const payload = {
      email: userEmail.value,
      code: fullCode.value,
      purpose: "email_verification",
    };

    const response = await userRegister.verifyUser(payload);

    if (response?.status === "success") {
      toast.success(
        response.messages?.[0] || "Email verified successfully!"
      );

      localStorage.removeItem("pendingVerificationEmail");

      if (response.actions_required?.includes("make_payment")) {

        const paymentData = localStorage.getItem("membership_payment");

        if (!paymentData) {
          toast.error("Payment information not found. Please register again.");
          router.push("/register");
          return;
        }

        router.push("/registration-payment");
        return;
      }

      if (response.actions_required?.includes("login")) {
        router.push("/signin");
        return;
      }

      router.push("/");
    } else {
      toast.error(response.messages?.[0] || "Verification failed.");
    }

  } catch (error) {
    console.error("Verification error");

    if (error.response) {
      const errorMsg =
        error.response.data?.messages?.[0] ||
        error.response.data?.message ||
        `Error: ${error.response.status}`;
      toast.error(errorMsg);
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error("An unexpected error occurred.");
    }
  } finally {
    isLoading.value = false;
  }
};

const handleResend = async () => {
  if (!userEmail.value) {
    toast.error("No email found. Please register again.");
    return;
  }

  try {
    isLoading.value = true;
    
    const payload = {
      email: userEmail.value
    };

    console.log("Resending OTP with payload:", payload);
    
    const response = await userRegister.resendOtp(payload);
    
    if (response?.status === "success") {
      toast.success(response.data.messages?.[0] || "Verification code resent successfully!");
      
      startTimer();
      
      verificationCode.value = ['', '', '', '', '', ''];
      if (inputRefs.value[0]) {
        inputRefs.value[0].focus();
      }
    } else {
      const errorMessage = response.data?.messages?.[0] || "Failed to resend verification code.";
      toast.error(errorMessage);
    }
    
  } catch (error) {
    console.error("Resend error");
    
    if (error.response) {
      const errorMsg = error.response.data?.messages?.[0] || 
                      error.response.data?.message || 
                      `Error: ${error.response.status}`;
      toast.error(errorMsg);
    } else if (error.request) {
      toast.error("Network error. Please check your connection and try again.");
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  } finally {
    isLoading.value = false;
  }
};



</script>

<template>
  <div class="min-h-screen grid lg:grid-cols-5 bg-white w-full h-full">
    <div
      class="hidden lg:block lg:col-span-2 relative bg-cover bg-center rounded-r-[300px]"
      :style="{ backgroundImage: `url(${registerImage})` }"
    ></div>

    <div
      class="lg:col-span-3 p-8 md:p-12 lg:p-16 flex items-center justify-center w-full"
    >
      <div class="max-w-md w-full space-y-8">
        <div class="mb-16">
          <div
            class="w-full px-4 py-4 sm:px-6 rounded-2xl border-2 border-green-100 bg-white shadow-md text-center"
          >
            <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Email Verification
            </h2>
          </div>
        </div>

        <div v-if="userEmail" class="text-center text-gray-600 text-sm">
          <p>We've sent a 6-digit verification code to:</p>
          <p class="font-semibold mt-1">{{ userEmail }}</p>
          <p class="mt-2">Enter the code below to verify your email address.</p>
        </div>
        <div v-else class="text-center text-red-600 text-sm">
          <p>Email not found. Please complete registration first.</p>
        </div>

        <form @submit.prevent="handleVerification" class="space-y-6">
          <div class="flex justify-center space-x-2 sm:space-x-3">
            <input
              v-for="(digit, index) in verificationCode"
              :key="index"
              :ref="(el) => (inputRefs[index] = el)"
              :value="digit"
              @input="handleInput(index, $event)"
              @keydown="handleKeydown(index, $event)"
              type="text"
              maxlength="1"
              required
              inputmode="numeric"
              pattern="[0-9]*"
              class="w-1/6 aspect-square text-center text-2xl font-bold border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#0c6b39] focus:border-[#0c6b39] transition-all duration-150 ease-in-out"
              :disabled="isLoading"
              :class="{
                'opacity-50 pointer-events-none': !isTimerRunning,
                'bg-gray-50': isLoading
              }"
            />
          </div>

          <div class="flex justify-between items-center text-sm mt-4">
            <div class="text-gray-600">
              Didn't receive email?
              <button
                type="button"
                @click="handleResend"
                :disabled="isTimerRunning || isLoading"
                class="font-semibold transition-colors duration-150 ease-in-out ml-1"
                :class="
                  isTimerRunning || isLoading
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-[#0c6b39] hover:text-[#09572d]'
                "
              >
                Resend
              </button>
            </div>

            <span
              class="font-medium"
              :class="isTimerRunning ? 'text-gray-700' : 'text-red-600'"
            >
              {{ isTimerRunning ? displayTime : 'Expired' }}
            </span>
          </div>

          <div>
            <button
              type="submit"
              :disabled="fullCode.length !== 6 || !isTimerRunning || isLoading"
              class="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white shadow-sm transition-all duration-150 ease-in-out"
              :class="
                fullCode.length === 6 && isTimerRunning && !isLoading
                  ? 'bg-[#0c6b39] hover:bg-[#09572d]'
                  : 'bg-gray-400 cursor-not-allowed'
              "
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
              <span v-else>Verify & Continue</span>
            </button>
          </div>
        </form>

        <div class="text-center text-gray-500 text-xs mt-8">
          <p>If you don't see the email in your inbox, please check your spam folder.</p>
          <p class="mt-1">The verification code will expire in 3 minutes.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
.h-full {
  height: 100%;
}

input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus {
  -webkit-text-fill-color: #111827;
  -webkit-box-shadow: 0 0 0px 1000px white inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
