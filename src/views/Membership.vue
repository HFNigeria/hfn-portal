<script setup>
import membership from "@/assets/membership.jpg";
import pagesApi from "@/api/pageManagement";
import { membershipPageSchema } from "@/schemas/pages/membership.schema.js";
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import userRegister from "@/api/userRegister";

const imageMap = {
  "membership.jpg": membership,
};

const resolveHeroImage = (img) => {
  if (!img) return membership;
  if (typeof img === "string" && (img.startsWith("http") || img.startsWith("data:image"))) return img;
  return imageMap[img] || membership;
};

const router = useRouter();
const isSubmitting = ref(false);
const pageFromApi = ref(null);

const page = computed(() => ({
  ...membershipPageSchema,
  ...(pageFromApi.value || {}),
  hero: { ...membershipPageSchema.hero, ...(pageFromApi.value?.hero || {}) },
  categories: pageFromApi.value?.categories?.length ? pageFromApi.value.categories : membershipPageSchema.categories,
}));

const hero = computed(() => page.value.hero);
const joinNow = () => {
  router.push("/register");
};

const tabs = [
  {
    id: "policy",
    name: "Policy Influence and Advocacy.",
    titleHtml: "Policy Influence <br />and Advocacy.",
    color: "default",
    contentHtml: `
      <p>
        <strong>Representation in Policy and Decision-Making:</strong>
        Members are represented in high-level national health policy
        discussions through HFN’s recognized advocacy platforms.
      </p>
      <p>
        <strong>Policy Advocacy:</strong> As the officially recognized
        body for the private health sector, HFN maintains close rapport
        with government policymakers while ensuring constant feedback on
        critical health matters.
      </p>
      <p>
        <strong>Improvement of the Operating Environment:</strong> HFN
        actively engages in lobbying and advocacy to create a more
        enabling and sustainable environment for healthcare operations.
      </p>
      <p>
        <strong>Opportunity to Shape the Future:</strong> Members enjoy
        ongoing opportunity to contribute to shaping the policies and
        frameworks that determine the fortunes of Nigeria’s healthcare
        sector.
      </p>
    `,
  },
  {
    id: "collaboration",
    name: "Collaboration, Networking, and Exposure.",
    titleHtml: "Collaboration, <br />Networking, <br />and Exposure.",
    color: "orange",
    contentHtml: `
      <p>
        <strong>Opportunities for Collaboration:</strong> Through its
        diverse membership base, HFN promotes sectoral, inter-sectoral,
        and multi-stakeholder collaboration across the healthcare value
        chain.
      </p>
      <p>
        <strong>Networking with Industry Leaders:</strong> Members enjoy
        access to exclusive networking events such as dinners,
        luncheons, and business forums with public and private industry
        policymakers, and international partners.
      </p>
      <p>
        <strong>Linkages and Business Development:</strong> Members gain
        access to both local and international partnerships, with
        referrals through business/private sector groups such as LCCI,
        NASIMA, and the Nigeria-South Africa Chamber of Commerce.
      </p>
      <p>
        <strong>Enhanced Access to Investment Opportunities:</strong>
        Members benefit from linkages to funding and investment
        institutions for health innovation and expansion.
      </p>
      <p>
        <strong>Invitation to Field Trips and International Programs:</strong>
        Participate in study tours, exchange programs, and global health
        forums.
      </p>
    `,
  },
  {
    id: "knowledge",
    name: "Information, Knowledge, and Capacity Development.",
    titleHtml: "Information, Knowledge, <br /> and Capacity Development.",
    color: "green",
    contentHtml: `
      <p>
        <strong>Access to Data and Sector Information:</strong> Members
        have exclusive access to research data, policy briefs, and
        insights on healthcare trends and opportunities.
      </p>
      <p>
        <strong>Information on Policies and Regulations:</strong>
        Receive timely updates on emerging policies and how they impact
        members’ businesses.
      </p>
      <p>
        <strong>Subsidized Training and Conferences:</strong> Members
        enjoy discounted participation in HFN conferences, training
        programs, and workshops.
      </p>
      <p>
        <strong>Right of First Refusal:</strong> Members receive
        priority consideration for opportunities and initiatives within
        the Federation.
      </p>
    `,
  },
  {
    id: "digital",
    name: "Digital and Media Visibility.",
    titleHtml: "Digital and <br />Media Visibility.",
    color: "orange",
    contentHtml: `
      <p>
        <strong>Membership Access to Website:</strong> Fully-subscribed
        members have unlimited access to restricted sections of the HFN
        website, containing premium content and opportunities.
      </p>
      <p>
        <strong>Increased Publicity:</strong> Registered members’
        profiles are published on the HFN website, providing visibility
        to potential partners and clients.
      </p>
      <p>
        <strong>Advertisement Opportunities:</strong> Members can
        advertise products and services on the HFN website and through
        HFN communication channels.
      </p>
      <p>
        <strong>International Exposure:</strong> Through HFN’s
        partnerships with international bodies such as the IFC and other
        development agencies, members gain global recognition and
        visibility.
      </p>
    `,
  },
  {
    id: "support",
    name: "Member Support, Benefits, and Privileges.",
    titleHtml: "Member Support, Benefits, <br /> and Privileges.",
    color: "green",
    contentHtml: `
      <p>
        <strong>HFN Support and Endorsement:</strong> Members benefit
        from the Federation’s credibility, brand recognition, and
        endorsements.
      </p>
      <p>
        <strong>Access to Discounted Services:</strong> Enjoy exclusive
        discounts on products and services offered by fellow members and
        partner organizations.
      </p>
      <p>
        <strong>Membership Card:</strong> Members receive an official
        HFN Membership Card which grants access to discounts and
        benefits.
      </p>
      <p>
        <strong>Job Offers and Recruitment Support:</strong> Members can
        access job postings, recruitment adverts, and downloadable
        resumes from the HFN database.
      </p>
    `,
  },
];

const activeTab = ref(tabs[0].id);
const searchQuery = ref("");
const members = ref([]);
const loadingMembers = ref(false);

const selectedLetter = ref("A");

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const filterByLetter = (letter) => {
  selectedLetter.value = letter;
  fetchCorporateMembers();
};

// const fetchCorporateMembers = async () => {
//   try {
//     loadingMembers.value = true;
//     const allUsers = await userRegister.getCorporateUsers();
//     members.value = allUsers.filter(
//       (user) => user.member_category?.toLowerCase() === "corporate"
//     );
//   } catch (error) {
//     console.error("Failed to fetch members:", error);
//   } finally {
//     loadingMembers.value = false;
//   }
// };


const fetchCorporateMembers = async () => {
  try {
    loadingMembers.value = true;

    const allUsers = await userRegister.getCorporateUsers({
      member_type: "corporate",
      starts_with: selectedLetter.value,
    });

    members.value = allUsers.results || allUsers;
  } catch (error) {
    console.error("Failed to fetch members:", error);
  } finally {
    loadingMembers.value = false;
  }
};


onMounted(async () => {
  fetchCorporateMembers();
  try {
    const res = await pagesApi.getPageByType("member");
    const content = res?.content || null;
    if (content?._hidden) {
      for (const key of content._hidden) {
        if (content[key]) content[key].is_hidden = true;
      }
      delete content._hidden;
    }
    pageFromApi.value = content;
  } catch (e) {
    console.warn("Using local membership schema fallback");
  }
});

const selectedMember = ref(null);
const showDialog = ref(false);

// Filtered search
const filteredMembers = computed(() => {
  if (!searchQuery.value) return members.value;
  return members.value.filter((m) =>
    (m.company_name || m.business_name || m.name || "")
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  );
});

function openDialog(member, event) {
  selectedMember.value = member;
  showDialog.value = true;
}

function closeDialog() {
  showDialog.value = false;
}

const getMemberDisplayName = (member) => {
  return member.company_name || member.business_name || member.name || "Unknown";
};

const categories = ref([
  {
    name: "Individual",
    description: "Ideal for private and insurance companies",
    plans: [
      {
        title: "Individual ",
        price: "₦50,000 per year",
        audience: "Ideal for private companies",
        benefits: [
          "Advocacy/Public-Private Engagement project",
          "Networking/High Profile Breakfast Meetings",
          "Access to Finance",
          "Promotion & Brand Visibility",

          "Access to Industry Information for Members Only",
          "Partnership & Engagement with International Organizations",
        ],
      },
    ],
  },
  {
    name: "Association",
    description: "For registered professional or trade associations",
    plans: [
      {
        title: "Association Member",
        price: "₦150,000 per year",
        audience: "Ideal for professional bodies",
        benefits: [
          "Advocacy/Public-Private Engagement project",
          "Networking/High Profile Breakfast Meetings",
          "Access to Finance",
          "Promotion & Brand Visibility",
          "Access to Industry Information for Members Only",
          "Partnership & Engagement with International Organizations",
        ],
      },
    ],
  },
  {
    name: "Corporate",
    description: "Ideal for private and insurance companies",
    plans: [
      {
        title: "Corporate ",
        price: "₦200,000 per year",
        audience: "Ideal for private companies",
        benefits: [
          "Advocacy/Public-Private Engagement project",
          "Networking/High Profile Breakfast Meetings",
          "Access to Finance",
          "Promotion & Brand Visibility",

          "Access to Industry Information for Members Only",
          "Partnership & Engagement with International Organizations",
        ],
      },
    ],
  },
  {
    name: "Multinational",
    description: "Designed for international and cross-border organizations",
    plans: [
      {
        title: "Global Partner ",
        price: "₦750,000 per year",
        audience: "Ideal for international firms",
        benefits: [
          "Advocacy/Public-Private Engagement project",
          "Networking/High Profile Breakfast Meetings",
          "Access to Finance",
          "Promotion & Brand Visibility",

          "Access to Industry Information for Members Only",
          "Partnership & Engagement with International Organizations",
        ],
      },
    ],
  },

  {
    name: "Diaspora",
    description:
      "For professionals or organizations abroad supporting local development",
    plans: [
      {
        title: "Diaspora Partner",
        price: "$50 per year",
        audience: "Ideal for Nigerians in diaspora",
        benefits: [
          "Advocacy/Public-Private Engagement project",
          "Networking/High Profile Breakfast Meetings",
          "Access to Finance",
          "Promotion & Brand Visibility",

          "Access to Industry Information for Members Only",
          "Partnership & Engagement with International Organizations",
        ],
      },
    ],
  },
]);

const activeCategory = ref(categories.value[0]);
const activePlan = computed(() => activeCategory.value.plans[0]);
</script>

<template>
  <div>
    <section v-if="!hero?.is_hidden" :style="{ backgroundColor: hero.backgroundColor || '#F2F9F3' }" class="py-16 lg:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div class="mb-12 lg:mb-0">
            <h2
              class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4"
            >
              <span class="text-orange-500 block">{{ hero.headlineTop }}</span>
              <span class="text-green-700 block mt-2">{{
                hero.headlineBottom
              }}</span>
            </h2>
            <p class="mt-6 text-lg text-gray-600 max-w-xl">
              {{ hero.description }}
            </p>
          </div>

          <div class="flex justify-center lg:justify-end">
            <div
              class="relative w-[320px] h-[240px] sm:w-[400px] sm:h-[300px] lg:w-[500px] lg:h-[375px] rounded-[30px] overflow-hidden shadow-2xl"
            >
              <img
                :src="resolveHeroImage(hero.image)"
                alt="Diverse hands joining in a heart shape, symbolizing unity and healthcare"
                class="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="py-10 sm:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          class="text-3xl px-4 py-4 sm:px-6 rounded-2xl border-2 border-green-100 bg-white shadow-md sm:text-4xl font-sans font-extrabold text-gray-900 text-center mb-12"
        >
          {{ hero.sectionTitle }}
        </h2>

        <div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div
            class="flex flex-wrap justify-center space-x-2 sm:space-x-4 mb-8"
          >
            <button
              v-for="category in categories"
              :key="category.name"
              @click="activeCategory = category"
              :class="[
                'px-5 py-2 rounded-lg font-medium transition duration-200 ease-in-out whitespace-nowrap',
                activeCategory.name === category.name
                  ? 'bg-green-700 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-green-700 hover:text-green-700',
              ]"
            >
              {{ category.name }}
            </button>
          </div>

          <div
            class="p-6 sm:p-10 rounded-[30px] border-2 border-green-200 bg-white shadow-xl flex flex-col gap-6"
          >
            <div class="text-center mb-6">
              <p class="text-3xl font-extrabold text-green-700">
                {{ activePlan.price }}
              </p>
            </div>

            <h3 class="text-2xl font-bold text-center text-gray-900 -mt-4">
              {{ activeCategory.name }} Membership
            </h3>

            <div class="benefits-section p-6 rounded-xl">
              <h5
                class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-300"
              >
                Benefits to Members
              </h5>
              <ul class="space-y-3 text-gray-700 text-base">
                <li
                  v-for="(benefit, i) in activePlan.benefits"
                  :key="i"
                  class="flex items-start"
                >
                  <svg
                    class="w-5 h-5 mr-3 text-green-700 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span class="text-gray-700">{{ benefit }}</span>
                </li>
              </ul>
            </div>

            <div class="text-center mt-4">
              <button
                @click="joinNow"
                :disabled="isSubmitting"
                class="inline-flex items-center justify-center px-10 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-green-800 hover:bg-green-900 transition transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span v-if="!isSubmitting">Join Now</span>
                <span v-else>Processing...</span>
              </button>
            </div>
          </div>
        </div>
        <!-- <section class="bg-white">
        <div class="max-w-6xl mx-auto px-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-10">
            HFN Members enjoy…
          </h2>

          <div
            class="flex flex-wrap justify-center md:justify-start gap-4 mb-10"
          >
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @mouseenter="activeTab = tab.id"
              :class="[
                'relative w-[200px] h-[200px] p-3 shadow-sm flex flex-col justify-center text-left transition-all duration-300 transform',
                'rounded-tr-[30px] rounded-bl-[30px]',

                tab.color === 'green' || tab.color === 'default'
                  ? 'bg-green-50'
                  : 'bg-[#E87A1814]',

                activeTab === tab.id
                  ? 'ring-2 ring-offset-2 scale-105 shadow-md ' +
                    (tab.color === 'green' || tab.color === 'default'
                      ? 'ring-green-700'
                      : 'ring-orange-500')
                  : 'hover:shadow-md hover:scale-[1.02]',
              ]"
            >
              <div
                :class="[
                  'absolute top-0 right-0 w-1 h-full rounded-tr-[30px] rounded-br-none',
                  tab.color === 'green' || tab.color === 'default'
                    ? 'bg-green-700'
                    : 'bg-orange-500',
                ]"
              ></div>

              <div class="relative z-10 pr-2">
                <div class="mb-2">
                  <img
                    :src="logo"
                    alt="Logo Icon"
                    class="inline-block w-8 h-8 object-contain opacity-75"
                  />
                </div>

                <span
                  :class="[
                    'font-bold text-lg leading-snug',
                    tab.color === 'green' || tab.color === 'default'
                      ? 'text-green-800'
                      : 'text-orange-800',
                  ]"
                  v-html="tab.titleHtml"
                >
                </span>
              </div>
            </button>
          </div>

          <div v-for="tab in tabs" :key="tab.id">
            <div v-if="activeTab === tab.id">
              <div
                class="text-gray-700 text-xl leading-relaxed space-y-5 px-6 py-4 border-l-4"
                :class="[
                  tab.color === 'green' || tab.color === 'default'
                    ? 'border-green-700'
                    : 'border-orange-500',
                ]"
                v-html="tab.contentHtml"
              ></div>
            </div>
          </div>
        </div>
      </section> -->
      </div>
    </section>
    <section v-if="!page.memberDirectory?.is_hidden" class="sm:py-14 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          class="text-3xl px-4 py-4 sm:px-6 rounded-2xl border-2 border-green-100 bg-white shadow-md sm:text-4xl font-serif font-extrabold text-gray-900 text-center mb-10"
        >
          {{ page.memberDirectory.title }}
        </h2>

        <div
          class="p-4 sm:p-8 rounded-[30px] border-2 border-green-200 bg-white shadow-xl max-w-6xl mx-auto"
        >
          <div
            class="flex flex-col sm:flex-row justify-between items-center mb-8"
          >
            <div
              class="relative flex-grow w-full sm:w-auto sm:max-w-xl mb-4 sm:mb-0"
            >
              <input
                type="text"
                placeholder="Search"
                v-model="searchQuery"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <svg
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>

            <button
              class="px-6 py-2 text-white bg-green-700 rounded-lg shadow-md font-medium hover:bg-green-800 transition"
            >
              Sort By
              <svg
                class="w-4 h-4 inline-block ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
          </div>

          <div
            class="flex flex-wrap justify-start border-b border-gray-200 pb-2 mb-8"
          >
            <button
              v-for="letter in letters"
              :key="letter"
              @click="filterByLetter(letter)"
              :class="[
                'px-3 py-1 rounded-md text-sm mx-1 my-1 border',
                selectedLetter === letter
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
              ]"
            >
              {{ letter }}
            </button>
          </div>

          <div
            v-if="loadingMembers"
            class="flex justify-center items-center py-12"
          >
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          </div>

          <div
            v-else-if="filteredMembers.length === 0"
            class="text-center py-12 text-gray-500"
          >
            No corporate members found
          </div>

          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-gray-800 text-sm mb-8"
          >
            <div
              v-for="(member, index) in filteredMembers"
              :key="index"
              class="relative group"
            >
              <!-- Member name -->
              <div
                class="p-1 text-gray-800 font-medium cursor-pointer hover:text-green-700 transition"
                @click="openDialog(member, $event)"
              >
                {{ getMemberDisplayName(member) }}
              </div>

              <!-- Dialog under clicked name -->
              <transition name="fade">
                <div
                  v-if="showDialog && selectedMember === member"
                  class="mt-2 w-full bg-white border border-gray-200 rounded-lg p-4 relative z-50"
                >
                  <button
                    class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg"
                    @click="closeDialog"
                  >
                    &times;
                  </button>

                  <p class="font-semibold text-gray-900 mb-3 text-sm">
                    Connect with {{ getMemberDisplayName(member) }}
                  </p>

                  <button
                    class="w-full py-1.5 border border-green-700 text-green-700 rounded-md text-sm font-medium hover:bg-green-50 transition"
                  >
                    Connect
                  </button>
                  <p class="font-san text-orange-600 mb-3 mt-3 text-sm">
                    Only registered members can connect*.
                  </p>
                </div>
              </transition>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button
              class="flex items-center text-sm font-medium text-green-700 px-3 py-2 border border-green-700 rounded-lg hover:bg-green-50 transition"
            >
              Page 1 of 10
              <svg
                class="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.benefits-section {
  background-color: #e87a1814;
  border-radius: 0.75rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
