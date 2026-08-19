<script setup>
import userRegister from "@/api/userRegister";
// import registerImage from '@/assets/register.jpg';
import { useAuth } from "@/store/authStore";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const username = ref("");
const password = ref("");
const rememberMe = ref(false);
const isLoading = ref(false);
const router = useRouter();
const toast = useToast();
const { login } = useAuth();
const showForgotModal = ref(false);
const forgotEmail = ref("");
const forgotLoading = ref(false);  

const showResetCodeDialog = ref(false);
const resetEmail = ref("");
const resetCode = ref("");
  
const registerImage =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769798445/HFN_Office_h0se9v.jpg";

const handleSignIn = async () => {
  if (!username.value.trim()) {
    toast.error("Please enter your email");
    return;
  }

  if (!password.value) {
    toast.error("Please enter your password");
    return;
  }

  try {
    isLoading.value = true;

    const payload = {
      email: username.value.trim(),
      password: password.value,
      remember_me: rememberMe.value,
    };

    const response = await userRegister.loginUser(payload);
    if (response?.status === "success") {
      toast.success(response.messages?.[0] || "Login successful!");

      if (response.actions_required?.includes("verify_2fa")) {
        localStorage.setItem("pending2FAEmail", username.value.trim());
        localStorage.setItem(
          "loginTokens",
          JSON.stringify(response.tokens || {})
        );

        setTimeout(() => {
          router.push("/verify-2fa");
        }, 1000);
      } else if (response.actions_required?.includes("verify_email")) {
        toast.warning(response.messages?.[1] || "Email verification required.");

        localStorage.setItem("pendingVerificationEmail", username.value.trim());

        setTimeout(() => {
          router.push("/signinverification");
        }, 1500);
      } else {
        if (response.tokens) {
          const tokenStorage = rememberMe.value ? localStorage : sessionStorage;
          tokenStorage.setItem("token", response.tokens.access);
          tokenStorage.setItem("refresh", response.tokens.refresh);

          if (rememberMe.value) {
            localStorage.setItem("rememberedEmail", username.value.trim());
          } else {
            localStorage.removeItem("rememberedEmail");
          }

          const role = (response.role || "member").toLowerCase();

          try {
            const userProfile = await userRegister.getUser();
            const rawUser =
              userProfile?.data?.user || userProfile?.data || userProfile;

            const normalizedUser = {
              ...rawUser,
              role,
            };

            login({
              role,
              user: normalizedUser,
            }, rememberMe.value);

            handleRoleBasedRedirect(role);
          } catch (err) {
            console.error("Failed to fetch user profile");
            toast.error("Login failed: unable to load user profile.");
          }
        }
      }
    } else if (response?.status === "warning") {
      toast.warning(response.messages?.[0] || "Action required.");

      if (response.actions_required?.includes("verify_email")) {
        localStorage.setItem("pendingVerificationEmail", username.value.trim());

        setTimeout(() => {
          router.push("/signinverification");
        }, 1500);
      }
    } else {
      const errorMessage =
        response?.messages?.[0] || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  } catch (error) {
    console.error("Login error");

    if (error.response) {
      const data = error.response.data;

      const errorMsg =
        data?.non_field_errors?.[0] || 
        data?.messages?.[0] || 
        data?.message || 
        `Error: ${error.response.status}`;

      toast.error(errorMsg);

      if (data?.actions_required?.includes("verify_email")) {
        localStorage.setItem("pendingVerificationEmail", username.value.trim());
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection and try again.");
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (route.query.message === "session-expired") {
    toast.error("Your session has expired. Please login.");
  }

  const rememberedEmail = localStorage.getItem("rememberedEmail");
  if (rememberedEmail) {
    username.value = rememberedEmail;
    rememberMe.value = true;
  }
});

const handleRoleBasedRedirect = (role) => {
  const roleMap = {
    superadmin: "/superadmin/dashboard",
    admin: "/admin/dashboard",
    editor: "/editor/dashboard",
    tutor: "/tutor/dashboard",
    learner: "/learner/dashboard",
    member: "/user/dashboard",
  };

  const targetPath = roleMap[role.toLowerCase()] || "/user/dashboard";

  if (role.toLowerCase() === "member") {
    const hasSelectedInterests = localStorage.getItem("hasSelectedInterests");
    if (!hasSelectedInterests) {
      router.push("/user/interests");
      return;
    }
  }

  router.push(targetPath);
};

const handleGoogleSignIn = () => {
  console.log("Google Sign-in initiated");
  toast.info("Google Sign-in will be implemented soon.");
};


const handleForgotPassword = () => {
  forgotEmail.value = username.value || "";
  showForgotModal.value = true;
};


const verifyResetCode = async () => {
  try {
    const response = await userRegister.verifyUser({
      email: resetEmail.value,
      code: resetCode.value,
    });

    if (response.status === "success") {
      toast.success("Code verified");

      showResetCodeDialog.value = false;

    }
  } catch (error) {
    toast.error("Invalid or expired code");
  }
};
  

const submitForgotPassword = async () => {
  if (!forgotEmail.value.trim()) {
    toast.error("Please enter your email");
    return;
  }

  try {
    forgotLoading.value = true;

    const res = await userRegister.forgotPassword({
      email: forgotEmail.value.trim(),
    });

    if (res.status === "success") {
      toast.success(res.messages?.[0]);

      if (res.actions_required?.includes("reset_password")) {
        showForgotModal.value = false;
        showResetCodeDialog.value = true;

        resetEmail.value = forgotEmail.value.trim();
      }
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Failed to send reset code. Try again."
    );
  } finally {
    forgotLoading.value = false;
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
              Sign In
            </h2>
          </div>
        </div>

        
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-white px-2 text-gray-500"> OR </span>
          <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-gray-300"></div>
          </div>
        </div>

        <form @submit.prevent="handleSignIn" class="space-y-6">
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="username"
              name="username"
              type="email"
              v-model="username"
              required
              :disabled="isLoading"
              class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[#0c6b39] focus:border-[#0c6b39] sm:text-sm transition-all duration-150 ease-in-out disabled:bg-gray-50 disabled:opacity-70"
              placeholder="your@email.com"
              autocomplete="email"
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password-field"
              name="password"
              type="password"
              v-model="password"
              required
              :disabled="isLoading"
              class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[#0c6b39] focus:border-[#0c6b39] sm:text-sm transition-all duration-150 ease-in-out disabled:bg-gray-50 disabled:opacity-70"
              placeholder="Enter your password"
              autocomplete="current-password"
            />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                v-model="rememberMe"
                :disabled="isLoading"
                class="h-4 w-4 text-[#0c6b39] focus:ring-[#0c6b39] border-gray-300 rounded transition-colors duration-150 ease-in-out disabled:opacity-50"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <button
                type="button"
                @click="handleForgotPassword"
                :disabled="isLoading"
                class="text-[#0c6b39] hover:text-[#09572d] font-medium transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Forgot Password
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center items-center py-3 px-4 rounded-lg bg-[#0c6b39] text-white font-medium hover:bg-[#09572d] transition-all duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </span>
              <span v-else>Sign In</span>
            </button>
          </div>
        </form>

        <div class="text-center text-sm text-gray-600">
          Don't have an account?
          <router-link
            to="/register"
            :class="[
              'text-[#0c6b39] hover:text-[#09572d] font-medium transition-colors duration-150 ease-in-out',
              isLoading ? 'opacity-50' : '',
            ]"
            :disabled="isLoading"
          >
            Register here
          </router-link>
        </div>
      </div>
    </div>
    <div
  v-if="showResetCodeDialog"
  class="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
>
  <div class="bg-white rounded-xl p-6 w-full max-w-md">
    <h3 class="text-lg font-bold mb-4 text-gray-800">
      Enter Reset Code
    </h3>

    <input
      v-model="resetCode"
      type="text"
      placeholder="Enter code sent to your email"
      class="w-full border border-gray-300 rounded-lg p-2.5 mb-4"
    />

    <div class="flex justify-end gap-3">
      <button
        @click="showResetCodeDialog = false"
        class="px-4 py-2 bg-gray-200 rounded-lg"
      >
        Cancel
      </button>

      <button
        @click="verifyResetCode"
        class="px-4 py-2 bg-green-700 text-white rounded-lg"
      >
        Verify
      </button>
    </div>
  </div>
</div>
    <!-- Forgot Password Modal -->
<div
  v-if="showForgotModal"
  class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
>
  <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
    <h3 class="text-xl font-bold text-[#333] mb-4">
      Reset Password
    </h3>

    <p class="text-sm text-gray-600 mb-4">
      Enter your email address to receive a password reset link.
    </p>

    <input
      type="email"
      v-model="forgotEmail"
      placeholder="your@email.com"
      class="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-[#0c6b39] focus:border-[#0c6b39]"
    />

    <div class="flex gap-3">
      <button
        @click="showForgotModal = false"
        class="flex-1 border border-gray-300 rounded-lg py-2"
      >
        Cancel
      </button>

      <button
        @click="submitForgotPassword"
        :disabled="forgotLoading"
        class="flex-1 bg-[#0c6b39] text-white rounded-lg py-2 font-semibold hover:bg-[#09572d]"
      >
        <span v-if="forgotLoading">Sending...</span>
        <span v-else>Send Link</span>
      </button>
    </div>
  </div>
</div>
  </div>
</template>

<style scoped>
.font-inter {
  font-family: "Inter", sans-serif;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: #111827;
  -webkit-box-shadow: 0 0 0px 1000px white inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
