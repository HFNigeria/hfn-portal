<script setup>
import pagesApi from "@/api/pageManagement";
import { pageSchemas } from "@/schemas/pageSchemas";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import HomeHeroEditor from "./components/cms/home/HomeHeroEditor.vue";
import SuperAdminSidebar from "./SuperAdminSidebar.vue";

import HomeAboutEditor from "./components/cms/home/HomeAboutEditor.vue";
import HomeExecutivesEditor from "./components/cms/home/HomeExecutivesEditor.vue";
import HomeMandateEditor from "./components/cms/home/HomeMandateEditor.vue";
import HomeNewsEditor from "./components/cms/home/HomeNewsEditor.vue";
import HomePartnerEditor from "./components/cms/home/HomePartnerEditor.vue";

import AboutCommitmentSection from "./components/cms/about/AboutCommitmentSection.vue";
import AboutCtaSectionEditor from "./components/cms/about/AboutCtaSectionEditor.vue";
import AboutGovernanceEditor from "./components/cms/about/AboutGovernanceEditor.vue";
import AboutHeroEditor from "./components/cms/about/AboutHeroEditor.vue";
import AboutHistoryEditor from "./components/cms/about/AboutHistoryEditor.vue";
import AboutItemEditor from "./components/cms/about/AboutItemEditor.vue";
import AboutRoleSectionEditor from "./components/cms/about/AboutRoleSectionEditor.vue";
import AboutStoryEditor from "./components/cms/about/AboutStoryEditor.vue";

import BoardOfTrusteesEditor from "./components/cms/governance/GovernanceBoardOfTrustees.vue";
import ExecutiveCommitteeEditor from "./components/cms/governance/GovernanceExecutiveCommittee.vue";
import GovernanceHeroEditor from "./components/cms/governance/GovernanceHeroEditor.vue";

import NewsHeroEditor from "./components/cms/news/NewsHeroEditor.vue";
import NewsLatestEditor from "./components/cms/news/NewsLatestEditor.vue";
import NewsPolicyEditor from "./components/cms/news/NewsPolicyEditor.vue";

import ResourcesHeroEditor from "./components/cms/resources/ResourcesHeroEditor.vue";
import ResourcesNewsletterEditor from "./components/cms/resources/ResourcesNewsletterEditor.vue";
import ResourcesPublicationEditor from "./components/cms/resources/ResourcesPublicationEditor.vue";

import EventFeaturedEditor from "./components/cms/events/EventFeaturedEditor.vue";
import EventHeroEditor from "./components/cms/events/EventHeroEditor.vue";
import EventLatestEditor from "./components/cms/events/EventLatestEditor.vue";
import EventPastEditor from "./components/cms/events/EventPastEditor.vue";
import EventSearchAndFilterEditor from "./components/cms/events/EventSearchAndFilterEditor.vue";

import GalleryFilterEditor from "./components/cms/gallery/GalleryFilterEditor.vue";
import GalleryHeroEditor from "./components/cms/gallery/GalleryHeroEditor.vue";
import GalleryListEditor from "./components/cms/gallery/GalleryListEditor.vue";

import GetinvolvedDonationsEditor from "./components/cms/getinvolved/GetinvolvedDonationsEditor.vue";
import GetinvolvedHeroEditor from "./components/cms/getinvolved/GetinvolvedHeroEditor.vue";
import GetinvolvedModalEditor from "./components/cms/getinvolved/GetinvolvedModalEditor.vue";
import GetinvolvedOpportunitiesEditor from "./components/cms/getinvolved/GetinvolvedOpportunitiesEditor.vue";
import GetinvolvedPartnershipsEditor from "./components/cms/getinvolved/GetinvolvedPartnershipsEditor.vue";
import GetinvolvedVolunteeringEditor from "./components/cms/getinvolved/GetinvolvedVolunteeringEditor.vue";

import MemberCategoriesEditor from "./components/cms/member/MemberCategoriesEditor.vue";
import MemberHeroEditor from "./components/cms/member/MemberHeroEditor.vue";

import ContactDetailsEditor from "./components/cms/contact/ContactDetailsEditor.vue";
import ContactFormEditor from "./components/cms/contact/ContactFormEditor.vue";
import ContactHeroEditor from "./components/cms/contact/ContactHeroEditor.vue";
import ContactMapEditor from "./components/cms/contact/ContactMapEditor.vue";

import FooterEditor from "./components/cms/footer/FooterEditor.vue";
import ProgramHero from "./components/cms/programs/ProgramHero.vue";
import ProgramOngoing from "./components/cms/programs/ProgramOngoing.vue";
import ProgramPast from "./components/cms/programs/ProgramPast.vue";

const currentView = ref("manager");
const activePage = ref(null);
const activeSection = ref("hero");
const router = useRouter();
const hasPages = computed(() => pages.value && pages.value.length > 0);
const currentSectionData = ref(null);

const componentMap = {
  home: {
    hero: HomeHeroEditor,
    about: HomeAboutEditor,
    mandate: HomeMandateEditor,
    news: HomeNewsEditor,
    executives: HomeExecutivesEditor,
    partners: HomePartnerEditor,
  },
  about: {
    hero: AboutHeroEditor,
    story: AboutStoryEditor,
    roleSection: AboutRoleSectionEditor,
    history: AboutHistoryEditor,
    governance: AboutGovernanceEditor,
    items: AboutItemEditor,
    ctaSection: AboutCtaSectionEditor,
    commitment: AboutCommitmentSection,
  },
  governance: {
    hero: GovernanceHeroEditor,
    boardOfTrustees: BoardOfTrusteesEditor,
    executiveCommittee: ExecutiveCommitteeEditor,
  },
  latestnews: {
    hero: NewsHeroEditor,
    latestNewsSection: NewsLatestEditor,
    policyAdvocacySection: NewsPolicyEditor,
  },
  resources: {
    hero: ResourcesHeroEditor,
    newsletterSection: ResourcesNewsletterEditor,
    publicationsSection: ResourcesPublicationEditor,
  },
  events: {
    hero: EventHeroEditor,
    searchAndFilter: EventSearchAndFilterEditor,
    featuredEvent: EventFeaturedEditor,
    latestEvents: EventLatestEditor,
    pastEvents: EventPastEditor,
  },
  gallery: {
    hero: GalleryHeroEditor,
    filtering: GalleryFilterEditor,
    galleryList: GalleryListEditor,
  },
  getinvolved: {
    hero: GetinvolvedHeroEditor,
    donations: GetinvolvedDonationsEditor,
    partnerships: GetinvolvedPartnershipsEditor,
    opportunities: GetinvolvedOpportunitiesEditor,
    volunteering: GetinvolvedVolunteeringEditor,
    donationModal: GetinvolvedModalEditor,
  },
  member: {
    hero: MemberHeroEditor,
    categories: MemberCategoriesEditor,
  },
  contact: {
    hero: ContactHeroEditor,
    form: ContactFormEditor,
    details: ContactDetailsEditor,
    map: ContactMapEditor,
  },
  programs: {
    hero: ProgramHero,
    ongoing: ProgramOngoing,
    past: ProgramPast,
  },
  footer: {
    main: FooterEditor,
  },
};

const availablePageTypes = computed(() => Object.keys(pageSchemas));

const pages = ref([]);
const isLoading = ref(false);

const createPage = async (pageName) => {
  try {
    const pageType = pageName.toLowerCase().trim().replace(/\s+/g, "-");
    const schema = structuredClone(pageSchemas[pageType]);

    const exists = pages.value.some((p) => p.page_type === pageType);
    if (exists) {
      console.log(`${pageName} page already exists`);
      return;
    }

    const payload = {
      page_type: pageType,
      name: pageName,
      status: "draft",
      is_visible: false,
      content: schema,
    };

    const newPage = await pagesApi.createPage(payload);

    pages.value.push({
      ...newPage,
      title: newPage.name,
      slug: `/${pageType}`,
      sections: structuredClone(schema),
    });
    await fetchPages();
    editPage(newPage);
  } catch (e) {
    console.error("Failed to create page", e);
  }
};

const fetchPages = async () => {
  isLoading.value = true;
  try {
    const deepMerge = (schemaObj, apiObj) => {
      if (!apiObj || typeof apiObj !== 'object' || Array.isArray(apiObj)) return apiObj ?? schemaObj;
      const result = { ...schemaObj };
      for (const key of Object.keys(apiObj)) {
        if (typeof apiObj[key] === 'object' && !Array.isArray(apiObj[key]) && apiObj[key] !== null &&
            typeof schemaObj[key] === 'object' && !Array.isArray(schemaObj[key]) && schemaObj[key] !== null) {
          result[key] = deepMerge(schemaObj[key], apiObj[key]);
        } else {
          result[key] = apiObj[key];
        }
      }
      return result;
    };

    const rawPages = await pagesApi.listPages();
    pages.value = rawPages.map((page) => {
      const schema = pageSchemas[page.page_type?.toLowerCase()] ?? {};

      const content = structuredClone(schema ?? {});

      const pageTypeLower = page.page_type?.toLowerCase();

      if (
        schema &&
        Object.keys(schema).length > 0 &&
        page.content &&
        typeof page.content === "object"
      ) {
        for (const sectionKey in schema) {
          if (page.content?.[sectionKey]) {
            content[sectionKey] = deepMerge(schema[sectionKey], page.content[sectionKey]);
          }
        }
      }

      if (page.content?._hidden) {
        for (const key of page.content._hidden) {
          if (content[key]) {
            content[key].is_hidden = true;
          }
        }
      }

      if (pageTypeLower === 'governance') {
        if (content.boardOfTrustees) {
          content.boardOfTrustees = {
            ...schema.boardOfTrustees,
            ...content.boardOfTrustees,
            chair: { ...schema.boardOfTrustees.chair, ...(content.boardOfTrustees.chair || {}) },
            trustees: content.boardOfTrustees.trustees?.length
              ? content.boardOfTrustees.trustees
              : schema.boardOfTrustees.trustees,
          };
        }
        if (content.executiveCommittee) {
          content.executiveCommittee = {
            ...schema.executiveCommittee,
            ...content.executiveCommittee,
            executives: content.executiveCommittee.executives?.length
              ? content.executiveCommittee.executives
              : schema.executiveCommittee.executives,
          };
        }
      }

      return {
        ...page,
        title: page.name ?? page.page_type_display,
        slug: `/${(page.name ?? page.page_type)
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
        sections: content,
      };
    });
  } catch (e) {
    console.error("Failed to load pages", e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchPages);

const sectionKeys = computed(() => {
  if (!activePage.value?.sections) return [];
  return Object.keys(activePage.value.sections);
});

const toggleSectionVisibility = (key) => {
  const section = activePage.value.sections[key];
  if (section) {
    section.is_hidden = !section.is_hidden;
  }
};

const newPageTitle = ref("");

const viewPage = (page) => {
  router.push({
    path: page.slug,
    query: { preview: "true" },
  });
};

const uploadSectionImage = async (event, sectionKey) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const { url } = await pagesApi.uploadImage(file);
    activePage.value.sections[sectionKey].imageUrl = url;
    activePage.value.sections[sectionKey].previewUrl = url;
  } catch (e) {
    console.error("Image upload failed", e);
  }
};

const editPage = (page) => {
  activePage.value = page;
  if (!activePage.value.sections) {
    activePage.value.sections = activePage.value.content || {};
  }
  activeSection.value = "hero";
  currentView.value = "editor";
};

const goBackToManager = () => {
  currentView.value = "manager";
  activePage.value = null;
};

const deletePage = async (id) => {
  if (!confirm("Are you sure you want to delete this page?")) return;

  try {
    await pagesApi.deletePage(id);
    pages.value = pages.value.filter((page) => page.id !== id);
    fetchPages();
    console.log(`Deleted page with slug: ${id}`);
  } catch (e) {
    console.error("Failed to delete page", e);
  }
};

const addNewSection = () => {
  console.log("Simulating 'Add New Section' action.");
};

const addNewLogo = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const { url } = await pagesApi.uploadImage(file);

  activePage.value.sections.section1.logos.push({
    id: Date.now(),
    name: "New Logo",
    src: url,
  });
};

const deleteLogo = (logoId) => {
  const section = activePage.value.sections["section1"];
  if (section && section.logos) {
    section.logos = section.logos.filter((logo) => logo.id !== logoId);
    console.log(`Deleted logo with ID: ${logoId}`);
  }
};

const addNewMetric = () => {
  const section = activePage.value.sections["section2"];
  if (section && section.metrics) {
    const newId = Math.max(...section.metrics.map((m) => m.id), 0) + 1;
    section.metrics.push({
      id: newId,
      label: `New Metric ${newId}`,
      color: "text-gray-600",
      text: "New detail text here.",
    });
  }
  console.log("Added new metric placeholder.");
};

const deleteMetric = (metricId) => {
  const section = activePage.value.sections["section2"];
  if (section && section.metrics) {
    section.metrics = section.metrics.filter((m) => m.id !== metricId);
    console.log(`Deleted metric with ID: ${metricId}`);
  }
};

const activeSecondaryContent = ref(null);

const toggleSecondaryContent = (itemId) => {
  activeSecondaryContent.value =
    activeSecondaryContent.value === itemId ? null : itemId;
};

const saveChanges = async () => {
  try {
    activePage.value.sections[activeSection.value] = JSON.parse(
      JSON.stringify(currentSectionData.value)
    );

    const payload = {
      content: activePage.value.sections,
    };

    await pagesApi.updatePage(activePage.value.page_type, payload);

    goBackToManager();
  } catch (e) {
    console.error("Failed to save page", e);
  }
};

const breadcrumbViewName = computed(() => {
  if (currentView.value === "view") return `View: ${activePage.value.title}`;
  if (currentView.value === "editor") return `Edit: ${activePage.value.title}`;
  return "Page Manager";
});

watch(
  [activePage, activeSection],
  () => {
    if (!activePage.value) return;

    const section = activePage.value.sections?.[activeSection.value];

    currentSectionData.value =
      section ??
      structuredClone(
        pageSchemas[activePage.value.page_type?.toLowerCase()]?.[
          activeSection.value
        ]
      );
  },
  { immediate: true }
);

const toggleVisibility = async (page) => {
  page.is_visible = !page.is_visible;
  try {
    await pagesApi.updatePageVisibility(
      page.page_type.toLowerCase(),
      page.is_visible
    );
  } catch (e) {
    page.is_visible = !page.is_visible;
  }
};

watch(activePage, (page) => {
  if (!page) return;

  const pageType = page.page_type?.toLowerCase();

  if (pageType === "footer") {
    activeSection.value = "main";
    return;
  }

  const schema = pageSchemas[pageType];
  const firstSection = schema ? Object.keys(schema)[0] : "hero";

  activeSection.value = firstSection;
});
</script>

<template>
  <div class="flex min-h-screen font-sans">
    <SuperAdminSidebar />
    <div class="flex-1 p-6 bg-white border-0 min-w-0">
      <nav class="mb-6 text-sm text-gray-500">
        <a href="#" class="hover:underline">Home</a>
        <span class="mx-1">></span>
        <button @click="goBackToManager" class="hover:underline text-gray-500">
          Page Manager
        </button>
        <span v-if="currentView !== 'manager'" class="mx-1">></span>
        <span
          v-if="currentView !== 'manager'"
          class="text-green-700 font-medium"
          >{{ breadcrumbViewName }}</span
        >
      </nav>

      <div v-if="currentView === 'manager'">
        <div class="mb-8 p-4 bg-white rounded-lg shadow-md">
          <h1 class="text-3xl font-bold text-gray-800 text-center">
            Page Manager
          </h1>
        </div>
        <div class="flex items-center space-x-3 mb-6">
          <select
            @change="createPage($event.target.value)"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="" disabled selected>Select page type</option>
            <option
              v-for="type in availablePageTypes"
              :key="type"
              :value="type"
            >
              {{ type.toUpperCase() }}
            </option>
          </select>
          <p>Create page by selecting page type</p>
        </div>

        <div class="space-y-3">
          <div v-if="isLoading" class="text-center text-gray-500 py-10">
            Loading pages...
          </div>

          <div
            v-else-if="!hasPages"
            class="text-center py-16 bg-gray-50 border border-dashed border-gray-300 rounded-xl"
          >
            <h3 class="text-lg font-semibold text-gray-700 mb-2">
              No pages yet
            </h3>
            <p class="text-sm text-gray-500">
              Pages you create will appear here.
            </p>
          </div>
          <div
            v-else
            v-for="page in pages"
            :key="page.id"
            class="flex items-center justify-between bg-white p-4 rounded-xl shadow-lg border border-gray-100 transform hover:shadow-xl hover:scale-[1.005] transition duration-200"
          >
            <div class="flex items-center space-x-3">
              <button
                @click="toggleVisibility(page)"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition"
                :class="page.is_visible ? 'bg-green-600' : 'bg-gray-300'"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                  :class="page.is_visible ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>

              <span
                class="px-3 py-1 text-xs font-semibold rounded-full min-w-[70px] text-center cursor-pointer"
                :class="
                  page.is_visible
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
                @click="toggleVisibility(page)"
                title="Click to toggle visibility"
              >
                {{ page.is_visible ? "VISIBLE" : "HIDDEN" }}
              </span>
              <span class="text-gray-700 font-medium">{{
                page.page_type
              }}</span>
            </div>

            <div class="flex items-center space-x-3">
              <button
                @click="viewPage(page)"
                class="text-blue-500 hover:text-blue-700 transition duration-200 p-2 rounded-full hover:bg-gray-100"
                aria-label="View Page"
                title="View Page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>

              <button
                @click="editPage(page)"
                class="text-green-500 hover:text-green-700 transition duration-200 p-2 rounded-full hover:bg-gray-100"
                aria-label="Edit Page"
                title="Edit Page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5L2 22l1.5-5.5L17 3z"
                  />
                </svg>
              </button>

              <button
                @click="deletePage(page.page_type)"
                class="text-red-500 hover:text-red-700 transition duration-200 p-2 rounded-full hover:bg-red-50"
                aria-label="Delete Page"
                title="Delete Page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="currentView === 'editor' && activePage">
        <div
          class="mb-8 flex flex-col items-center justify-center text-center space-y-3"
        >
          <h1 class="text-3xl font-bold text-gray-800">
            {{ activePage.title }}
          </h1>
        </div>

        <div
          class="flex justify-center border-b border-gray-200 mb-8 overflow-x-auto"
        >
          <button
            v-for="key in sectionKeys"
            :key="key"
            @click="activeSection = key"
            class="px-4 py-3 text-sm font-medium transition duration-200 whitespace-nowrap flex items-center gap-2"
            :class="{
              'text-green-700 border-b-2 border-green-700 bg-green-50':
                activeSection === key,
              'text-gray-500 hover:text-gray-700 hover:bg-gray-100':
                activeSection !== key,
            }"
          >
            <span :class="{ 'opacity-40': activePage.sections[key]?.is_hidden }">
              {{
                activePage.sections[key]?.name ||
                key.replace("section", "Section ")
              }}
            </span>
            <span
              @click.stop="toggleSectionVisibility(key)"
              class="cursor-pointer hover:scale-110 transition-transform"
              :title="activePage.sections[key]?.is_hidden ? 'Show this section' : 'Hide this section'"
            >
              <svg
                v-if="!activePage.sections[key]?.is_hidden"
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </span>
          </button>
        </div>

        <div class="space-y-6">
          <div
            class="p-4 border border-gray-300 rounded-xl flex items-center justify-center"
          >
            <div class="w-1/4 text-center text-orange-600 font-bold text-xl">
              Preview
            </div>
            <img
              v-if="
                currentSectionData?.previewUrl || currentSectionData?.heroImage
              "
              :src="
                currentSectionData.previewUrl ?? currentSectionData.heroImage
              "
              alt="Section Preview"
            />
          </div>

          <div
            v-if="
              activeSection !== 'section1' &&
              activeSection !== 'section2' &&
              activeSection !== 'section5'
            "
            class="flex items-center p-2 bg-white border border-gray-200 rounded-lg space-x-4"
          >
            <select class="p-1 border border-gray-300 rounded text-sm bg-white">
              <option>Paragraph</option>
              <option>Heading 1</option>
              <option>Heading 2</option>
            </select>
            <input
              type="number"
              value="14"
              class="w-12 text-center p-1 border border-gray-300 rounded text-sm"
            />

            <button
              title="Bold"
              class="p-1 text-gray-700 hover:bg-gray-100 rounded font-bold"
            >
              A
            </button>
            <button
              title="Italic"
              class="p-1 text-gray-700 hover:bg-gray-100 rounded italic"
            >
              I
            </button>
            <button
              title="Underline"
              class="p-1 text-gray-700 hover:bg-gray-100 rounded underline"
            >
              U
            </button>

            <span class="text-gray-300">|</span>

            <button
              title="Left Align"
              class="p-1 text-gray-700 hover:bg-gray-100 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="17" y2="18"></line>
              </svg>
            </button>
            <button
              title="Center Align"
              class="p-1 text-gray-700 hover:bg-gray-100 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="21" y1="12" x2="3" y2="12"></line>
                <line x1="17" y1="6" x2="7" y2="6"></line>
                <line x1="17" y1="18" x2="7" y2="18"></line>
              </svg>
            </button>
            <button
              title="Right Align"
              class="p-1 text-gray-700 hover:bg-gray-100 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="21" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="21" y1="18" x2="7" y2="18"></line>
              </svg>
            </button>
            <button
              title="Link"
              class="p-1 text-gray-700 hover:bg-gray-100 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                ></path>
                <path
                  d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                ></path>
              </svg>
            </button>
            <button
              title="Image"
              class="p-1 text-gray-700 hover:bg-gray-100 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </button>
            <button
              title="More options"
              class="p-1 text-gray-700 hover:bg-gray-100 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>

          <component
            v-if="activePage.page_type.toLowerCase() === 'home'"
            :is="componentMap.home?.[activeSection]"
            v-model="currentSectionData"
          />
          <component
            v-if="activePage.page_type.toLowerCase() === 'about'"
            :is="componentMap.about?.[activeSection]"
            v-model="currentSectionData"
          />
          <component
            v-if="activePage.page_type.toLowerCase() === 'governance'"
            :is="componentMap.governance?.[activeSection]"
            v-model="currentSectionData"
          />
          <component
            v-if="activePage.page_type.toLowerCase() === 'latestnews'"
            :is="componentMap.latestnews?.[activeSection]"
            v-model="currentSectionData"
          />
          <component
            v-if="activePage.page_type.toLowerCase() === 'resources'"
            :is="componentMap.resources?.[activeSection]"
            v-model="currentSectionData"
          />
          <component
            v-if="activePage.page_type.toLowerCase() === 'events'"
            :is="componentMap.events?.[activeSection]"
            v-model="currentSectionData"
          />
          <component
            v-if="activePage.page_type.toLowerCase() === 'gallery'"
            :is="componentMap.gallery?.[activeSection]"
            v-model="currentSectionData"
          />
          <component
            v-if="activePage.page_type.toLowerCase() === 'getinvolved'"
            :is="componentMap.getinvolved?.[activeSection]"
            v-model="currentSectionData"
          />
          <component
            v-if="activePage.page_type.toLowerCase() === 'member'"
            :is="componentMap.member?.[activeSection]"
            v-model="currentSectionData"
          />
          <component
            v-if="activePage.page_type.toLowerCase() === 'contact'"
            :is="componentMap.contact?.[activeSection]"
            v-model="currentSectionData"
          />
          <component
            v-if="activePage.page_type.toLowerCase() === 'programs'"
            :is="componentMap.programs?.[activeSection]"
            v-model="currentSectionData"
          />
          <component
            v-if="activePage.page_type.toLowerCase() === 'footer'"
            :is="componentMap.footer?.[activeSection]"
            v-model="currentSectionData"
          />

          <div
            class="mt-10 flex justify-end space-x-4 border-t pt-4 border-gray-200"
          >
            <button
              @click="goBackToManager"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-100 transition duration-200"
            >
              Cancel
            </button>
            <button
              @click="saveChanges"
              class="px-6 py-3 bg-green-800 text-white rounded-2xl hover:bg-green-900 transition duration-200 shadow-lg shadow-green-200"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
input[type="color"]::-webkit-color-swatch {
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
