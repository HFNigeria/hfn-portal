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
    };

    const response = await userRegister.loginUser(payload);
    console.log("Login payload:", response);
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
          localStorage.setItem("token", response.tokens.access);
          localStorage.setItem("refresh", response.tokens.refresh);

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
            });

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
    console.error("Login error:", error);

    if (error.response) {
      const errorMsg =
        error.response?.messages?.[0] ||
        error.response?.message ||
        `Error: ${error.response.status}`;
      toast.error(errorMsg);

      if (error.response?.actions_required?.includes("verify_email")) {
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
  if (!username.value.trim()) {
    toast.warning("Please enter your email first to reset password");
    return;
  }

  localStorage.setItem("passwordResetEmail", username.value.trim());

  router.push("/forgot-password");
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

        <button
          @click="handleGoogleSignIn"
          :disabled="isLoading"
          class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            class="w-5 h-5 mr-3"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.312-5.748 7.257-10.666 7.257-6.046 0-10.923-4.908-10.923-10.953 0-6.045 4.877-10.953 10.923-10.953 3.03 0 5.673 1.25 7.627 3.097l5.48-5.353C33.723 9.47 28.536 7 24 7c-9.06 0-16.398 7.373-16.398 16.423 0 9.05 7.338 16.423 16.398 16.423 9.324 0 16.634-6.52 16.634-16.22C40.634 22.924 43.431 20.835 43.611 20.083z"
            />
            <path
              fill="#FF3D00"
              d="M7.674 24.327l-.004-.004L7.673 24.321C7.397 23.376 7.25 22.395 7.25 21.378c0-1.02.147-2.003.424-2.95l-.004-.004L3.65 14.54l-.005.011C2.56 16.409 2 18.804 2 21.378c0 2.574.56 4.969 1.645 6.828l4.029-3.834z"
            />
            <path
              fill="#4CAF50"
              d="M24 39.75c6.241 0 11.458-4.321 12.868-10.038H24v-7.917h17.653c.123.70.187 1.432.187 2.183 0 1.93-.357 3.792-1.033 5.487-.71 1.83-1.64 3.498-2.825 5.044-3.564 4.79-8.995 7.917-15.982 7.917z"
            />
            <path
              fill="#1976D2"
              d="M24 8.75c3.27 0 6.27.79 8.94 2.164l5.48-5.354C34.78 3.518 29.593 1 24 1 18.96 1 14.28 2.872 10.667 6.036l4.029 3.833C17.31 8.5 20.59 7.75 24 7.75z"
            />
          </svg>
          Sign in with Google
        </button>

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
