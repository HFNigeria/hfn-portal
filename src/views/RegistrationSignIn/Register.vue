<script setup>
// import registerImage from "@/assets/register.jpg";
import userRegister from "@/api/userRegister";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();
const registerImage =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769798445/HFN_Office_h0se9v.jpg";
const form = ref({
  firstName: "",
  otherName: "",
  lastName: "",
  phone: "",
  alternatePhone: "",
  email: "",
  confirmEmail: "",
  password: "",
  confirmPassword: "",
  organizationName: "",
  organizationContactPerson: "",
});

const membershipCategories = ref([
  { id: 1, name: "Individual", amount: 50000, currency: "NGN" },
  { id: 2, name: "Association", amount: 150000, currency: "NGN" },
  { id: 3, name: "Corporate", amount: 200000, currency: "NGN" },
  { id: 4, name: "Multinational", amount: 750000, currency: "NGN" },
  { id: 5, name: "Diaspora", amount: 50, currency: "USD" },
]);

const selectedCategoryId = ref("");

const selectedCategory = computed(() =>
  membershipCategories.value.find((c) => c.id === selectedCategoryId.value)
);

const currencySymbol = computed(() => {
  if (!selectedCategory.value) return "";
  return selectedCategory.value.currency === "USD" ? "$" : "₦";
});

const activeTab = ref("individual");
const isLoading = ref(false);
const customAlert = ref({
  show: false,
  message: "",
  type: "error", // can be 'error', 'success', 'warning'
});

const passwordRules = computed(() => {
  const p = form.value.password;
  return [
    { text: "Must be at least 8 characters", valid: p.length >= 8 },
    {
      text: "Must contain at least 1 Uppercase letter",
      valid: /[A-Z]/.test(p),
    },
    {
      text: "Must contain at least 1 Lowercase letter",
      valid: /[a-z]/.test(p),
    },
    { text: "Must contain at least 1 number", valid: /[0-9]/.test(p) },
    {
      text: "Must contain at least 1 special character",
      valid: /[^A-Za-z0-9]/.test(p),
    },
  ];
});

const isPasswordValid = computed(() => {
  return passwordRules.value.every((rule) => rule.valid);
});

const formatPhoneNumber = (phone) => {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("234")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.startsWith("0")) {
    return cleaned;
  }
  return "0" + cleaned;
};

const prepareOrganizationPayload = () => {
  return {
    email: form.value.email,
    organization_name: form.value.organizationName.trim(),
    contact_person: form.value.organizationContactPerson.trim(),
    phone_number: formatPhoneNumber(form.value.phone),
    password: form.value.password,
    role: "learner",
  };
};

const prepareIndividualPayload = () => {
  const payload = {
    email: form.value.email,
    first_name: form.value.firstName.trim(),
    last_name: form.value.lastName.trim(),
    phone_number: formatPhoneNumber(form.value.phone),
    password: form.value.password,
    role: "learner",
  };

  if (form.value.otherName && form.value.otherName.trim()) {
    payload.other_name = form.value.otherName.trim();
  }

  return payload;
};

const validateForm = () => {
  if (activeTab.value === "individual") {
    if (!form.value.firstName.trim()) {
      showCustomAlert("First name is required", "error");
      return false;
    }

    if (!form.value.lastName.trim()) {
      showCustomAlert("Last name is required", "error");
      return false;
    }
  }

  if (!form.value.email.trim()) {
    showCustomAlert("Email is required", "error");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.value.email)) {
    showCustomAlert("Please enter a valid email address", "error");
    return false;
  }

  if (!form.value.phone.trim()) {
    showCustomAlert("Phone number is required", "error");
    return false;
  }

  const formattedPhone = formatPhoneNumber(form.value.phone);
  if (formattedPhone.length < 10) {
    showCustomAlert("Please enter a valid phone number", "error");
    return false;
  }

  if (!form.value.password) {
    showCustomAlert("Password is required", "error");
    return false;
  }

  if (form.value.email !== form.value.confirmEmail && activeTab.value === "individual") {
    showCustomAlert("Email addresses do not match", "error");
    return false;
  }

  if (form.value.password !== form.value.confirmPassword) {
    showCustomAlert("Passwords do not match", "error");
    return false;
  }

  if (!isPasswordValid.value) {
    showCustomAlert("Please ensure all password requirements are met", "error");
    return false;
  }

  if (activeTab.value === "organization") {
    if (!form.value.organizationName?.trim()) {
      showCustomAlert("Organization name is required", "error");
      return false;
    }

    if (!form.value.organizationContactPerson?.trim()) {
      showCustomAlert("Contact person is required", "error");
      return false;
    }
  }

  return true;
};

const handleRegistration = async () => {
  if (!validateForm()) return;

  try {
    isLoading.value = true;

    let payload;

    if (activeTab.value === "individual") {
      payload = prepareIndividualPayload();
    } else {
      payload = prepareOrganizationPayload();
    }

    const response = await userRegister.createUser(payload);

    if (response.status === "success") {
      toast.success(response.messages?.[0] || "Registration successful!");

      if (selectedCategory.value) {
        localStorage.setItem(
          "membership_payment",
          JSON.stringify({
            category_id: selectedCategory.value.id,
            category_name: selectedCategory.value.name,
            amount: selectedCategory.value.amount,
            currency: selectedCategory.value.currency,
            email: payload.email,
          })
        );
      }

      // If email verification is required
      if (response.actions_required?.includes("verify_email")) {
        localStorage.setItem("pendingVerificationEmail", payload.email);
        router.push("/signinverification");
        return;
      }

      // If payment required immediately
      if (response.actions_required?.includes("make_payment")) {
        router.push("/registration-payment");
        return;
      }

      // fallback
      router.push("/signin");
    } else {
      const errorMessage =
        response.messages?.[0] || "Registration failed. Please try again.";
      showCustomAlert(errorMessage, "error");
    }
  } catch (error) {
  console.error("Registration error:", error);

  if (error.response) {
    const data = error.response.data;

    let errorMsg = "Registration failed. Please try again.";

    if (typeof data === "object") {
      const firstKey = Object.keys(data)[0];

      if (Array.isArray(data[firstKey])) {
        errorMsg = data[firstKey][0];
      } else if (typeof data[firstKey] === "string") {
        errorMsg = data[firstKey];
      }
    }

    showCustomAlert(errorMsg, "error");

  } else if (error.request) {
    showCustomAlert(
      "Network error. Please check your connection and try again.",
      "error"
    );
  } else {
    showCustomAlert(
      "An unexpected error occurred. Please try again.",
      "error"
    );
  }
} finally {
    isLoading.value = false;
  }
};

const showCustomAlert = (message, type = "error") => {
  customAlert.value = {
    show: true,
    message,
    type,
  };

  setTimeout(() => {
    customAlert.value.show = false;
  }, 5000);
};

const changeTab = (tab) => {
  activeTab.value = tab;
  selectedCategoryId.value = ""; 
  form.value = {
    firstName: "",
    otherName: "",
    lastName: "",
    phone: "",
    alternatePhone: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
  };
};
</script>

<template>
  <div>
    <div
      v-if="customAlert.show"
      :class="[
        'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-lg shadow-xl transition-opacity duration-300',
        customAlert.type === 'error'
          ? 'bg-red-600 text-white'
          : customAlert.type === 'warning'
          ? 'bg-yellow-500 text-black'
          : 'bg-green-600 text-white',
      ]"
      style="min-width: 300px; max-width: 90%"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg
            v-if="customAlert.type === 'error'"
            class="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else-if="customAlert.type === 'warning'"
            class="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{{ customAlert.message }}</span>
        </div>
        <button
          @click="customAlert.show = false"
          class="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="relative min-h-screen font-inter bg-gray-50">
      <div class="fixed top-1/2 right-0 z-50 transform -translate-y-1/2">
        <button
          class="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 px-6 rounded-l-lg shadow-lg origin-top-right transform rotate-90 translate-x-1/2 translate-y-20 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-orange-300/80"
        >
          Feedback
        </button>
      </div>

      <div
        class="max-w-8xl mx-auto grid lg:grid-cols-5 shadow-lg min-h-[800px] bg-white rounded-xl overflow-hidden mb-20"
      >
        <div
          class="hidden lg:block lg:col-span-2 relative bg-cover bg-center rounded-r-[300px] overflow-hidden"
          :style="{ backgroundImage: `url(${registerImage})` }"
        >
          <div
            class="absolute right-0 bottom-0 w-full h-full rounded-r-[300px]"
            style="
              box-shadow: 30px 40px 80px 0 rgba(255, 228, 230, 0.6);
              z-index: -1;
            "
          ></div>
        </div>

        <div class="lg:col-span-3 p-8 md:p-12 lg:p-16">
          <div class="mb-16">
            <div
              class="w-full px-4 py-4 sm:px-6 rounded-2xl border-2 border-green-100 bg-white shadow-md text-center"
            >
              <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">
                Account Registration
              </h2>
            </div>
          </div>

          <div class="flex border-b border-gray-200 mb-8 justify-center">
            <button
              @click="changeTab('individual')"
              :class="[
                'px-6 py-3 text-lg font-semibold transition duration-200',
                activeTab === 'individual'
                  ? 'text-green-700 border-b-4 border-green-700'
                  : 'text-gray-500 hover:text-gray-700',
              ]"
            >
              Individual
            </button>
            <button
              @click="changeTab('organization')"
              :class="[
                'px-6 py-3 text-lg font-semibold transition duration-200',
                activeTab === 'organization'
                  ? 'text-green-700 border-b-4 border-green-700'
                  : 'text-gray-500 hover:text-gray-700',
              ]"
            >
              Organization
            </button>
          </div>

          <button
            class="flex items-center justify-center w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150 mb-6 shadow-sm"
          >
            <!-- <svg
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
          </svg> -->
            <router-link
              to="/signin"
              class="text-green-700 font-semibold hover:text-green-800 transition duration-150"
              >Sign in here</router-link
            >
          </button>

          <div class="text-center text-gray-400 mb-6">OR</div>

          <form @submit.prevent="handleRegistration" class="space-y-4">
            <template v-if="activeTab === 'individual'">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="col-span-1">
                  <label
                    for="firstName"
                    class="block text-sm font-medium text-gray-700"
                    >First Name*</label
                  >
                  <input
                    type="text"
                    id="firstName"
                    v-model="form.firstName"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5"
                  />
                </div>
                <div class="col-span-1">
                  <label
                    for="otherName"
                    class="block text-sm font-medium text-gray-700"
                    >Other Name (optional)</label
                  >
                  <input
                    type="text"
                    id="otherName"
                    v-model="form.otherName"
                    class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5"
                  />
                </div>
                <div class="col-span-1">
                  <label
                    for="lastName"
                    class="block text-sm font-medium text-gray-700"
                    >Last Name*</label
                  >
                  <input
                    type="text"
                    id="lastName"
                    v-model="form.lastName"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    for="phone"
                    class="block text-sm font-medium text-gray-700"
                    >Phone Number*</label
                  >
                  <div class="mt-1 flex rounded-lg shadow-sm">
                    <span
                      class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                    >
                      +234
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      v-model="form.phone"
                      required
                      placeholder="8012345678"
                      class="flex-1 block w-full border-gray-300 rounded-r-lg focus:border-green-500 focus:ring-green-500 p-2.5"
                    />
                  </div>
                  <p class="mt-1 text-xs text-gray-500">
                    Enter your phone number without the leading 0
                  </p>
                </div>
                <div>
                  <label
                    for="alternatePhone"
                    class="block text-sm font-medium text-gray-700"
                    >Alternate Number (optional)</label
                  >
                  <div class="mt-1 flex rounded-lg shadow-sm">
                    <span
                      class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                    >
                      +234
                    </span>
                    <input
                      type="tel"
                      id="alternatePhone"
                      v-model="form.alternatePhone"
                      placeholder="Optional"
                      class="flex-1 block w-full border-gray-300 rounded-r-lg focus:border-green-500 focus:ring-green-500 p-2.5"
                    />
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700"
                    >Email Address*</label
                  >
                  <input
                    type="email"
                    id="email"
                    v-model="form.email"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5"
                  />
                </div>
                <div>
                  <label
                    for="confirmEmail"
                    class="block text-sm font-medium text-gray-700"
                    >Confirm Email Address*</label
                  >
                  <input
                    type="email"
                    id="confirmEmail"
                    v-model="form.confirmEmail"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Membership Category*
                </label>

                <select
                  v-model="selectedCategoryId"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2.5"
                >
                  <option disabled value="">Select a category</option>

                  <option
                    v-for="category in membershipCategories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>

                <p
                  v-if="selectedCategory"
                  class="mt-2 font-semibold text-green-700"
                >
                  Amount:
                  {{ currencySymbol }}
                  {{ selectedCategory.amount.toLocaleString() }}
                  <span class="text-sm text-gray-500">
                    ({{ selectedCategory.currency }})
                  </span>
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    for="password"
                    class="block text-sm font-medium text-gray-700"
                    >Password*</label
                  >
                  <input
                    type="password"
                    id="password"
                    v-model="form.password"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5"
                  />
                </div>
                <div>
                  <label
                    for="confirmPassword"
                    class="block text-sm font-medium text-gray-700"
                    >Confirm Password*</label
                  >
                  <input
                    type="password"
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5"
                  />
                </div>
              </div>

              <div class="pt-2 text-sm space-y-1">
                <div
                  v-for="rule in passwordRules"
                  :key="rule.text"
                  class="flex items-center text-gray-600"
                >
                  <svg
                    :class="[
                      'w-4 h-4 mr-2',
                      rule.valid ? 'text-green-500' : 'text-gray-400',
                    ]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      v-if="rule.valid"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                    <path
                      v-else
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M18 12H6"
                    ></path>
                  </svg>
                  <span>{{ rule.text }}</span>
                </div>
              </div>

              <div class="pt-4 flex justify-center">
                <button
                  type="submit"
                  :disabled="!isPasswordValid || isLoading"
                  class="w-full md:w-auto px-10 py-3 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
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
                    Processing...
                  </span>
                  <span v-else>Register</span>
                </button>
              </div>
            </template>

             <template v-else>
  <div class="space-y-4">

    <div>
      <label class="block text-sm font-medium text-gray-700">
        Organization Name*
      </label>
      <input
        type="text"
        v-model="form.organizationName"
        required
        class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">
        Contact Person*
      </label>
      <input
        type="text"
        v-model="form.organizationContactPerson"
        required
        class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">
        Official Email*
      </label>
      <input
        type="email"
        v-model="form.email"
        required
        class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">
        Phone Number*
      </label>
      <div class="mt-1 flex rounded-lg shadow-sm">
        <span
          class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
        >
          +234
        </span>
        <input
          type="tel"
          v-model="form.phone"
          required
          class="flex-1 block w-full border-gray-300 rounded-r-lg focus:border-green-500 focus:ring-green-500 p-2.5"
        />
      </div>
    </div>

    <div>
  <label class="block text-sm font-medium text-gray-700">
    Membership Category*
  </label>

  <select
    v-model="selectedCategoryId"
    required
    class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2.5"
  >
    <option disabled value="">Select a category</option>

    <option
      v-for="category in membershipCategories"
      :key="category.id"
      :value="category.id"
    >
      {{ category.name }}
    </option>
  </select>

  <p
    v-if="selectedCategory"
    class="mt-2 font-semibold text-green-700"
  >
    Amount:
    {{ currencySymbol }}
    {{ selectedCategory.amount.toLocaleString() }}
    <span class="text-sm text-gray-500">
      ({{ selectedCategory.currency }})
    </span>
  </p>
</div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Password*
        </label>
        <input
          type="password"
          v-model="form.password"
          required
          class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          Confirm Password*
        </label>
        <input
          type="password"
          v-model="form.confirmPassword"
          required
          class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5"
        />
      </div>
    </div>

    <div class="pt-4 flex justify-center">
      <button
        type="submit"
        :disabled="!isPasswordValid || isLoading"
        class="w-full md:w-auto px-10 py-3 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition duration-150 disabled:bg-gray-400"
      >
        <span v-if="isLoading">Processing...</span>
        <span v-else>Register Organization</span>
      </button>
    </div>

  </div>
</template>

          </form>

          <div class="mt-6 text-center text-gray-600">
            Already have an account?
            <router-link
              to="/signin"
              class="text-green-700 font-semibold hover:text-green-800 transition duration-150"
              >Sign in here</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-inter {
  font-family: "Inter", sans-serif;
}

.min-h-screen {
  min-height: 100vh;
}

h1 {
  letter-spacing: -0.5px;
}

input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #15803d33;
}

button[type="submit"] {
  transition: transform 0.2s ease;
}
button[type="submit"]:hover:not(:disabled) {
  transform: scale(1.02);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
