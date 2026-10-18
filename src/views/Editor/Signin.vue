
<script setup>
import registerImage from '@/assets/register.jpg';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter(); 

const form = ref({
  username: '',
  password: '',
});

const activeTab = ref('super admin');
const username = ref('');
const password = ref('');

const passwordRules = computed(() => {
  const p = form.value.password;
  return [
    { text: 'Must be at least 8 characters', valid: p.length >= 8 },
    { text: 'Must contain at least 1 Uppercase letter', valid: /[A-Z]/.test(p) },
    { text: 'Must contain at least 1 Lowercase letter', valid: /[a-z]/.test(p) },
    { text: 'Must contain at least 1 number', valid: /[0-9]/.test(p) },
    { text: 'Must contain at least 1 special character', valid: /[^A-Za-z0-9]/.test(p) },
  ];
});

const isPasswordValid = computed(() => {
  return passwordRules.value.every((rule) => rule.valid);
});

const changeTab = (tab) => {
  activeTab.value = tab;
};

const handleSignIn = () => {
  
  router.push('/signin');
};

const alert = (message) => {
  const alertBox = document.getElementById('custom-alert');
  alertBox.textContent = message;
  alertBox.classList.remove('hidden');
  setTimeout(() => {
    alertBox.classList.add('hidden');
  }, 3000);
};
</script>



<template>
  <div
    id="custom-alert"
    class="hidden fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white p-3 rounded-lg shadow-xl transition-opacity duration-300"
  ></div>

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
              Sign in
            </h2>
          </div>
        </div>

        <div class="flex border-b border-gray-200 mb-8 justify-center">
          <button
            @click="changeTab('super admin')"
            :class="[
              'px-6 py-3 text-lg font-semibold transition duration-200',
              activeTab === 'super admin'
                ? 'text-green-700 border-b-4 border-green-700'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            Super Admin
          </button>
          <button
            @click="changeTab('editor')"
            :class="[
              'px-6 py-3 text-lg font-semibold transition duration-200',
              activeTab === 'editor'
                ? 'text-green-700 border-b-4 border-green-700'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            Editor
          </button>
        </div>

        <button
          class="flex items-center justify-center w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150 mb-6 shadow-sm"
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
          Sign up with Google
        </button>

        <div class="text-center text-gray-400 mb-6">OR</div>

        <form @submit.prevent="handleSignIn" class="space-y-6">
            
            <!-- Username Field -->
            <div class="relative pt-6">
              <input 
                id="username" 
                type="text" 
                v-model="username" 
                required 
                placeholder=" "
                class="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 appearance-none peer"
              >
              <label 
                for="username" 
                class="absolute left-4 top-2 text-xs text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:text-xs peer-focus:text-green-600 peer-focus:-translate-y-0"
              >
                Username
              </label>
            </div>

            <!-- Password Field -->
            <div class="relative pt-6">
              <input 
                id="password" 
                type="password" 
                v-model="password" 
                required 
                placeholder=" "
                class="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 appearance-none peer"
              >
              <label 
                for="password" 
                class="absolute left-4 top-2 text-xs text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:text-xs peer-focus:text-green-600 peer-focus:-translate-y-0"
              >
                Password
              </label>
            </div>

            <!-- Remember Me / Forgot Password -->
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500">
                <label for="remember-me" class="ml-2 text-gray-600">
                  Remember me
                </label>
              </div>

              <a href="#" class="font-medium text-green-600 hover:text-green-500 transition duration-150 ease-in-out">
                Forgot Password
              </a>
            </div>

            <!-- Sign In Button -->
            <div class="pt-4">
              <button
                type="submit"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-800 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
              >
                Login
              </button>
            </div>
          </form>

        
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-inter {
  font-family: 'Inter', sans-serif;
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

button[type='submit'] {
  transition: transform 0.2s ease;
}
button[type='submit']:hover {
  transform: scale(1.02);
}
</style>
