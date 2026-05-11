<script setup>
import globe from "@/assets/globe.png";
import { ref, computed, onMounted } from "vue";
import contactApi from "@/api/userRegister";
import pagesApi from "@/api/pageManagement";
import { contactPageSchema } from "@/schemas/pages/contact.schema";

const form = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});

const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const loadingPage = ref(true);
const pageFromApi = ref(null);

onMounted(async () => {
  try {
    const res = await pagesApi.getPageByType("contact");
    const content = res?.content || null;
    if (content?._hidden) {
      for (const key of content._hidden) {
        if (content[key]) {
          content[key].is_hidden = true;
        }
      }
      delete content._hidden;
    }
    pageFromApi.value = content;
  } catch (e) {
    console.warn("Using local Contact schema fallback");
  } finally {
    loadingPage.value = false;
  }
});

const page = computed(() => {
  return {
    ...contactPageSchema,
    ...(pageFromApi.value || {}),
    hero: {
      ...contactPageSchema.hero,
      ...(pageFromApi.value?.hero || {}),
    },
    form: {
      ...contactPageSchema.form,
      ...(pageFromApi.value?.form || {}),
    },
    contactDetails: {
      ...contactPageSchema.contactDetails,
      ...(pageFromApi.value?.contactDetails || {}),
    },
    map: {
      ...contactPageSchema.map,
      ...(pageFromApi.value?.map || {}),
    },
  };
});

const submitForm = async () => {
  loading.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    await contactApi.contactForm(form.value);

    successMessage.value =
      "Thank you for reaching out. Our team will get back to you within 24 hours.";

    form.value = {
      name: "",
      email: "",
      subject: "",
      message: "",
    };
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message ||
      "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <section v-if="!page.hero?.is_hidden" class="bg-[#F2F9F3] py-16 lg:py-24" :class="page.hero.backgroundColor || 'bg-[#F2F9F3]'">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-16 items-center py-16">
          <div class="mb-12 lg:mb-0">
            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-6"
            >
              <span
                class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"
              ></span>
              <span
                class="text-orange-600 text-xs font-bold uppercase tracking-widest"
                >{{ page.hero.badgeText || 'Connect With Us' }}</span
              >
            </div>

            <h2
              class="text-4xl lg:text-6xl font-black mb-6 text-[#004d33] leading-[1.1]"
            >
              {{ page.hero.headline?.line1 || 'Get in touch with' }} <br />
              <span class="text-gray-900">{{ page.hero.headline?.line2 || 'HFN Nigeria' }}</span>
            </h2>

            <p
              class="mt-2 text-lg md:text-xl font-medium text-gray-600 leading-relaxed border-l-4 border-[#004d33] pl-6"
            >
              {{ page.hero.subheadline || 'Healthcare Federation of Nigeria (HFN) welcomes enquiries from members, partners, policymakers, development organisations, media, and individuals interested in engaging with our work.' }}
            </p>

            <div class="mt-8 flex items-center gap-4">
              <div class="flex -space-x-3">
                <div
                  v-for="i in 3"
                  :key="i"
                  class="w-10 h-10 rounded-full border-2 border-white bg-gray-200"
                ></div>
              </div>
              <p class="text-sm text-gray-500 font-semibold">
                {{ page.hero.responseNote || 'Our team typically responds within 24 hours.' }}
              </p>
            </div>
          </div>

          <div class="flex justify-center lg:justify-end relative">
            <div
              class="absolute inset-0 bg-[#004d33] opacity-5 blur-[100px] rounded-full"
            ></div>

            <div
              class="relative w-full max-w-[500px] aspect-square rounded-[3rem] overflow-hidden shadow-2xl flex items-center justify-center p-8 bg-white border border-gray-50 group"
            >
              <img
                :src="globe"
                alt="Global connectivity"
                class="object-contain w-full h-full group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-if="!page.form?.is_hidden" class="py-16 sm:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2
            class="text-3xl px-4 py-4 sm:px-6 rounded-2xl border-2 border-green-100 bg-white shadow-md sm:text-4xl font-sans font-extrabold text-gray-900 mb-2"
          >
            {{ page.form?.title || 'Contact Us' }}
          </h2>
          <p class="text-gray-500 max-w-2xl mx-auto mt-5">
            <br class="hidden sm:block" />
            {{ page.form?.description || 'Whether you are seeking information about membership, partnerships, events, advocacy, or general enquiries, our team is available to assist.' }}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div
            class="lg:col-span-2 p-6 sm:p-8 rounded-[20px] border-2 border-green-200 bg-white shadow-lg"
          >
            <form class="space-y-6" @submit.prevent="submitForm">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-700"
                    >Name</label
                  >
                  <input
                    type="text"
                    v-model="form.name"
                    id="name"
                    placeholder="Enter name"
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700"
                    >Email Address</label
                  >
                  <input
                    type="email"
                    v-model="form.email"
                    id="email"
                    placeholder="Enter email"
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label
                  for="subject"
                  class="block text-sm font-medium text-gray-700"
                  >Subject</label
                >
                <input
                  type="text"
                  id="subject"
                  v-model="form.subject"
                  class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label
                  for="message"
                  class="block text-sm font-medium text-gray-700"
                  >Message</label
                >
                <textarea
                  id="message"
                  rows="5"
                  v-model="form.message"
                  class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-green-500 focus:border-green-500"
                ></textarea>
              </div>

              <div
                v-if="successMessage"
                class="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-semibold"
              >
                {{ successMessage }}
              </div>

              <div
                v-if="errorMessage"
                class="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-semibold"
              >
                {{ errorMessage }}
              </div>

              <div class="pt-2">
                <button
                  type="submit"
                  :disabled="loading"
                  class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-700 hover:bg-green-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span v-if="!loading">Send Message</span>
                  <span v-else>Sending...</span>

                  <svg
                    v-if="!loading"
                    class="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <div
            class="lg:col-span-1 p-6 sm:p-8 rounded-[20px] border-2 border-green-200 bg-white shadow-lg space-y-8"
          >
            <div class="flex items-start">
              <svg
                class="w-6 h-6 mr-3 text-green-700 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              <p class="text-gray-700 text-base">
                {{ page.contactDetails?.address?.text || '109, Awolowo Road, Ikoyi, Opposite Standard Chartered Bank, Lagos.' }}
              </p>
            </div>

            <div class="flex items-center">
              <svg
                class="w-6 h-6 mr-3 text-green-700 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              <p class="text-gray-700 text-base">{{ page.contactDetails?.emails?.[0]?.address || 'info@hfnigeria.com' }}</p>
            </div>

            <div class="flex items-center">
              <svg
                class="w-6 h-6 mr-3 text-green-700 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 3h2a2 2 0 012 2v2M16 21h2a2 2 0 002-2v-2M4 21h2a2 2 0 002-2v-2M4 3h2a2 2 0 012 2v2m0 0h8m-8 0H8m0 0a2 2 0 012-2h4a2 2 0 012 2m-2-5v14"
                ></path>
              </svg>
              <p class="text-gray-700 text-base">{{ page.contactDetails?.phone || '+234 803 975 3274' }}</p>
            </div>
            <div class="pt-4 border-t border-green-100 space-y-4">
              <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mr-2 text-green-700"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                </svg>
                Connect With Us
              </h3>
            </div>

            <div
              class="flex items-center space-x-5 pt-4 border-t border-green-100"
            >
              <a
                href="https://www.facebook.com/hfnigeria"
                target="_blank"
                aria-label="Facebook"
                class="text-green-700 hover:text-green-900 transition"
              >
                <i class="fab fa-square-facebook text-2xl"></i>
              </a>

              <a
                href="https://www.instagram.com/hfn_nigeria?igsh=MWR1ODI1aW5kaWwyaA=="
                target="_blank"
                aria-label="Instagram"
                class="text-green-700 hover:text-green-900 transition"
              >
                <i class="fab fa-square-instagram text-2xl"></i>
              </a>

              <a
                href="https://www.linkedin.com/company/healthcare-federation-of-nigeria-hfn/posts/?feedView=all"
                target="_blank"
                aria-label="LinkedIn"
                class="text-green-700 hover:text-green-900 transition"
              >
                <i class="fa-brands fa-linkedin text-2xl"></i>
              </a>

              <a
                href="https://x.com/hfn_nigeria"
                target="_blank"
                aria-label="Twitter"
                class="text-green-700 hover:text-green-900 transition"
              >
                <i class="fab fa-square-x-twitter text-2xl"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-if="!page.map?.is_hidden" class="py-16 sm:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="max-w-6xl mx-auto rounded-[20px] overflow-hidden shadow-2xl border-4 border-green-200"
        >
          <iframe
            src="https://maps.google.com/maps?q=109+Awolowo+Road,+Ikoyi,+Lagos,+Nigeria&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="500"
            frameborder="0"
            style="border: 0; border-radius: 18px"
            allowfullscreen=""
            aria-hidden="false"
            tabindex="0"
          ></iframe>
        </div>
      </div>
    </section>
  </div>
</template>
