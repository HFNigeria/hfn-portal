<template>
  <div class="get-involved-page font-sans bg-white overflow-x-hidden">
    <section v-if="!page.hero?.is_hidden"
      class="bg-[#f2f9f3] pt-12 pb-20 relative overflow-hidden"
      :style="{ backgroundColor: page.hero.backgroundColor || '#f2f9f3' }"
    >
      <div
        class="absolute top-0 right-0 w-1/3 h-full bg-green-100/50 skew-x-12 translate-x-1/2"
      ></div>

      <div class="container mx-auto px-4 md:px-8 relative z-10">
        <div
          class="flex flex-col lg:flex-row items-center justify-between gap-12"
        >
          <div class="lg:w-1/2">
            <h1
              class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight"
            >
              {{ page.hero.titleLine1 }}
              <span class="text-green-700">{{ page.hero.subTitle }}</span>
              <br />
              <span class="text-gray-800 text-3xl md:text-4xl font-semibold">{{
                page.hero.titleLine2
              }}</span>
            </h1>
            <p class="mt-6 text-gray-600 text-lg max-w-lg leading-relaxed">
              {{ page.hero.description }}
            </p>
          </div>

          <div class="lg:w-1/2 w-full">
            <div
              class="relative h-64 sm:h-80 lg:h-[400px] overflow-hidden rounded-2xl shadow-xl border-4 border-white"
            >
              <img
                :src="resolveImage(page.hero.image)"
                alt="HFN Impact"
                class="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <main class="container mx-auto px-4 md:px-8 py-16">
      <section v-if="!page.donations?.is_hidden" class="mb-24">
        <div
          class="flex flex-col md:flex-row gap-12 items-center bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm"
        >
          <div class="md:w-2/3">
            <div class="flex items-center space-x-3 mb-4">
              <span class="bg-green-700 text-white p-2 rounded-lg">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <h3 class="text-3xl font-bold text-gray-900">
                {{ page.donations?.title || "Donations" }}
              </h3>
            </div>
            <h4 class="text-xl font-semibold text-green-700 mb-4">
              {{
                page.donations?.subtitle ||
                "Support HFN's advocacy and sector-strengthening work"
              }}
            </h4>
            <p class="text-gray-600 mb-4 leading-relaxed">
              {{
                page.donations?.paragraphs?.[0] ||
                "HFN welcomes contributions that support our work in policy advocacy, stakeholder convening, research, and public–private collaboration."
              }}
            </p>
            <p class="text-gray-600 mb-6 leading-relaxed">
              {{
                page.donations?.paragraphs?.[1] ||
                "Contributions help sustain HFN's role as a credible platform for private sector engagement in health system reform."
              }}
              <span class="block mt-2 text-sm italic text-gray-500">{{
                page.donations?.note ||
                "Contributions are voluntary and support institutional activities aligned with HFN's mission."
              }}</span>
            </p>
            <button
              @click="showDonateModal = true"
              class="group flex items-center px-8 py-3 bg-green-700 text-white rounded-xl font-bold hover:bg-green-800 transition-all"
            >
              {{ page.donations?.buttonText || "Donate Now" }}
              <span
                class="ml-2 group-hover:translate-x-1 transition-transform"
              ></span>
            </button>
          </div>
          <div
            class="md:w-1/3 bg-green-50 p-8 rounded-2xl border-l-4 border-green-700"
          >
            <p class="text-green-800 font-medium italic">
              "{{
                page.donations?.quote ||
                "Your contribution helps us drive evidence-based reforms and build a more resilient healthcare ecosystem in Nigeria."
              }}"
            </p>
          </div>
        </div>
      </section>

      <section v-if="!page.partnerships?.is_hidden" class="mb-24">
        <div class="text-center mb-12">
          <h3 class="text-3xl font-bold text-gray-900">
            {{ page.partnerships?.title || "Partnerships & Sponsorships" }}
          </h3>
          <p class="text-green-700 font-semibold mt-2">
            {{ page.partnerships?.tagline || "Partner with HFN" }}
          </p>
          <p class="text-gray-600 max-w-2xl mx-auto mt-4">
            {{
              page.partnerships?.description ||
              "HFN works with local and international partners to deliver high-impact convenings, dialogues, and sector initiatives."
            }}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            class="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:border-green-200 transition-all"
          >
            <h4 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-2 h-2 bg-green-700 rounded-full mr-3"></span>
              {{ page.partnerships?.items?.[0]?.title || "Event Sponsorships" }}
            </h4>
            <p class="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
              {{
                page.partnerships?.items?.[0]?.description ||
                "Sponsorship of HFN conferences, roundtables, and stakeholder dialogues attended by policymakers, private sector leaders, and development partners."
              }}
            </p>
            <button
              @click="contactEmail"
              class="text-green-700 font-bold hover:underline flex items-center"
            >
              {{
                page.partnerships?.items?.[0]?.buttonText ||
                "Contact Us to Explore Partnerships"
              }}
            </button>
          </div>

          <div
            class="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:border-green-200 transition-all"
          >
            <h4 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-2 h-2 bg-green-700 rounded-full mr-3"></span>
              {{
                page.partnerships?.items?.[1]?.title ||
                "Programme & Initiative Support"
              }}
            </h4>
            <p class="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
              {{
                page.partnerships?.items?.[1]?.description ||
                "Collaboration on policy dialogues, capacity-building programmes, and sector initiatives aligned with shared objectives."
              }}
            </p>
            <button
              @click="contactEmail"
              class="text-green-700 font-bold hover:underline flex items-center"
            >
              {{
                page.partnerships?.items?.[1]?.buttonText ||
                "Contact Us to Explore Partnerships"
              }}
            </button>
          </div>
        </div>
      </section>

      <div v-if="!page.opportunities?.is_hidden" class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        <div class="bg-gray-50 p-8 rounded-3xl">
          <h3 class="text-2xl font-bold text-gray-900 mb-4">
            {{
              page.opportunities?.items?.[0]?.title || "Exhibitor Opportunities"
            }}
          </h3>
          <p class="text-gray-600 mb-6 leading-relaxed">
            {{
              page.opportunities?.items?.[0]?.description ||
              "HFN events provide opportunities for organisations to showcase products, services, and innovations to a targeted audience of healthcare decision-makers. Exhibitor packages are available for selected events."
            }}
          </p>
          <button
            @click="contactEmail"
            class="text-green-700 font-bold hover:underline"
          >
            {{
              page.opportunities?.items?.[0]?.buttonText ||
              "Contact Us for Exhibitor Opportunities"
            }}
          </button>
        </div>

        <div class="bg-gray-50 p-8 rounded-3xl">
          <h3 class="text-2xl font-bold text-gray-900 mb-4">
            {{
              page.opportunities?.items?.[1]?.title ||
              "Advertising & Visibility"
            }}
          </h3>
          <p class="text-gray-600 mb-6 leading-relaxed">
            {{
              page.opportunities?.items?.[1]?.description ||
              "HFN offers limited advertising opportunities across its communication platforms, including its newsletter and selected publications, subject to editorial review."
            }}
          </p>
          <button
            @click="contactEmail"
            class="text-green-700 font-bold hover:underline"
          >
            {{
              page.opportunities?.items?.[1]?.buttonText ||
              "Contact Us for Advertising Enquiries"
            }}
          </button>
        </div>
      </div>

      <section v-if="!page.volunteering?.is_hidden"
        class="text-white rounded-[2rem] p-10 md:p-16 relative overflow-hidden"
        :style="{
          backgroundColor: page.volunteering?.backgroundColor || '#14532D',
        }"
      >
        <div class="relative z-10">
          <h3 class="text-3xl font-bold mb-4">
            {{ page.volunteering?.title || "Volunteering" }}
          </h3>
          <p class="text-green-100 text-xl font-medium mb-6">
            {{
              page.volunteering?.subtitle || "Support HFN programmes and events"
            }}
          </p>
          <p class="text-green-100/80 mb-8 max-w-3xl leading-relaxed">
            {{
              page.volunteering?.description ||
              "HFN welcomes volunteers who wish to contribute time and expertise to support events, research, communications, and sector engagement activities. Volunteer opportunities are periodic and role-specific."
            }}
          </p>
          <button
            class="bg-white text-green-900 px-10 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors"
          >
            {{ page.volunteering?.buttonText || "Sign Up to Volunteer" }}
          </button>
        </div>
        <div
          class="absolute -bottom-10 -right-10 w-64 h-64 bg-green-800 rounded-full opacity-50"
        ></div>
      </section>
    </main>

    <div
      v-if="showDonateModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    >
      <div
        class="bg-white w-full max-w-2xl rounded-2xl p-8 relative animate-in fade-in zoom-in duration-300"
      >
        <button
          @click="showDonateModal = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ✕
        </button>
        <h3 class="text-2xl font-bold text-gray-900 mb-2 text-center">
          {{ page.donationModal?.title || "Support HFN's Mission" }}
        </h3>
        <p class="text-gray-600 text-center mb-8">
          {{ page.donationModal?.subtitle || "Choose a contribution category" }}
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            v-for="option in getDonationOptions()"
            :key="option.key"
            @click="selectDonation(option)"
            class="border-2 border-gray-100 rounded-xl p-5 text-left hover:border-green-700 hover:bg-green-50 transition-all"
          >
            <h4 class="font-bold text-gray-900 mb-1">{{ option.title }}</h4>
            <p class="text-xs text-gray-500 leading-relaxed">
              {{ option.description }}
            </p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getInvolvedPageSchema } from "@/schemas/pages/getInvolve.schema.js";
import pagesApi from "@/api/pageManagement";

const data = ref({});
const loading = ref(true);
const pageFromApi = ref(null);
const latest =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769892500/Women_gnwotm.jpg";
const showDonateModal = ref(false);

const imageMap = {
  "Women_gnwotm.jpg": latest,
};

const resolveImage = (image) => imageMap[image] || image;

onMounted(async () => {
  try {
    const res = await pagesApi.getPageByType("getinvolved");
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
    console.warn("Using local GetInvolved schema fallback");
  } finally {
    loading.value = false;
  }
});

const page = computed(() => {
  return {
    ...getInvolvedPageSchema,
    ...(pageFromApi.value || {}),
    hero: {
      ...getInvolvedPageSchema.hero,
      ...(pageFromApi.value?.hero || {}),
    },
    donations: {
      ...getInvolvedPageSchema.donations,
      ...(pageFromApi.value?.donations || {}),
    },
    partnerships: {
      ...getInvolvedPageSchema.partnerships,
      ...(pageFromApi.value?.partnerships || {}),
    },
    opportunities: {
      ...getInvolvedPageSchema.opportunities,
      ...(pageFromApi.value?.opportunities || {}),
    },
    volunteering: {
      ...getInvolvedPageSchema.volunteering,
      ...(pageFromApi.value?.volunteering || {}),
    },
    donationModal: {
      ...getInvolvedPageSchema.donationModal,
      ...(pageFromApi.value?.donationModal || {}),
    },
  };
});

const donationOptions = [
  {
    key: "advocacy",
    title: "Policy Advocacy",
    description: "Supporting HFN's work in legislative and policy reforms.",
  },
  {
    key: "research",
    title: "Research & Insights",
    description: "Funding for healthcare sector research and data gathering.",
  },
  {
    key: "convening",
    title: "Stakeholder Convening",
    description:
      "Supporting dialogues between public and private health sectors.",
  },
  {
    key: "general",
    title: "General Support",
    description:
      "Contributions toward institutional mission-aligned activities.",
  },
];

const selectDonation = (option) => {
  console.log("Donation selected:", option.key);
  showDonateModal.value = false;
};

const contactEmail = () => {
  window.location.href = `mailto:${
    page.value.partnerships?.contactEmail || "partnerships@hfnigeria.com"
  }`;
};

const getDonationOptions = () => {
  return page.value.donationModal?.options || donationOptions || [];
};
</script>
