<script setup>
import pagesApi from "@/api/pageManagement";
import logo from "@/assets/logo.png";
import { footerSchema } from "@/schemas/pages/footer.schema";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const currentYear = new Date().getFullYear();

const footerFromApi = ref(null);

const footer = computed(() => ({
  ...footerSchema,
  ...(footerFromApi.value || {}),
  contact: { ...footerSchema.contact, ...(footerFromApi.value?.contact || {}) },
  navColumns: footerFromApi.value?.navColumns?.length ? footerFromApi.value.navColumns : footerSchema.navColumns,
  socials: footerFromApi.value?.socials?.length ? footerFromApi.value.socials : footerSchema.socials,
  legal: footerFromApi.value?.legal?.length ? footerFromApi.value.legal : footerSchema.legal,
  copyrightSuffix: footerFromApi.value?.copyrightSuffix || footerSchema.copyrightSuffix,
}));

onMounted(async () => {
  // TODO: Footer API not yet available in backend
  // try {
  //   const res = await pagesApi.getPageByType("footer");
  //   const content = res?.content || null;
  //   if (content) {
  //     if (content._hidden) {
  //       for (const key of content._hidden) {
  //         if (content[key]) content[key].is_hidden = true;
  //       }
  //       delete content._hidden;
  //     }
  //     footerFromApi.value = content;
  //   }
  // } catch (e) {
  //   console.warn("Using local footer schema fallback");
  // }
});

const navigate = (url) => {
  if (url.startsWith("http")) {
    window.open(url, "_blank");
  } else {
    router.push(url);
  }
};
</script>

<template>
  <footer class="w-full">
    <div class="bg-green-50 pt-16 pb-12 rounded-t-[2rem] shadow-inner border-t border-green-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-y-10">
          <div class="md:col-span-4 lg:col-span-3 flex flex-col space-y-4 pr-4">
            <div class="mb-4">
              <img :src="logo" alt="HFN Logo" class="h-19 w-auto" />
            </div>

            <div class="flex items-start space-x-2 text-base text-gray-700">
              <svg class="w-5 h-5 mt-0.5 text-green-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span class="leading-relaxed whitespace-pre-line">{{ footer.contact.address }}</span>
            </div>

            <div class="flex items-center space-x-2 text-base text-gray-700">
              <svg class="w-5 h-5 text-green-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <a :href="'mailto:' + footer.contact.email" class="hover:text-green-700 transition">{{ footer.contact.email }}</a>
            </div>

            <div class="flex items-center space-x-2 text-base text-gray-700">
              <svg class="w-5 h-5 text-green-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <a :href="footer.contact.phoneLink || 'tel:' + footer.contact.phone.replace(/\s/g, '')" class="hover:text-green-700 transition">{{ footer.contact.phone }}</a>
            </div>
          </div>

          <div class="md:col-span-8 lg:col-span-9 grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 gap-y-10 md:gap-x-4 lg:gap-x-8">
            <div v-for="(col, colIdx) in footer.navColumns" :key="colIdx">
              <h5 class="font-bold text-lg mb-3 text-gray-900">
                <span class="border-b-2 border-green-700 pb-0.5">{{ col.title }}</span>
              </h5>
              <ul class="space-y-2 text-base text-gray-700">
                <li v-for="(link, linkIdx) in col.links" :key="linkIdx">
                  <a v-if="link.url.startsWith('http')" :href="link.url" target="_blank" class="hover:text-green-700 transition cursor-pointer">{{ link.label }}</a>
                  <RouterLink v-else :to="link.url" class="hover:text-green-700 transition">{{ link.label }}</RouterLink>
                </li>
              </ul>
            </div>

            <div class="col-span-2 sm:col-span-1 flex flex-col justify-start">
              <h5 class="font-bold text-lg mb-3 text-gray-900">
                <span class="border-b-2 border-green-700 pb-0.5">Contact Us</span>
              </h5>

              <h5 class="font-bold text-lg mb-3 mt-6 text-gray-900">
                <span class="border-b-2 border-green-700 pb-0.5">Follow Us</span>
              </h5>

              <div class="flex space-x-4 text-green-700">
                <a v-for="(social, sIdx) in footer.socials" :key="sIdx"
                  :href="social.url" target="_blank" :aria-label="social.platform"
                  class="hover:text-green-600 transition">
                  <i :class="social.icon + ' text-2xl'"></i>
                </a>
              </div>

              <div class="mt-8 text-right">
                <ul class="flex space-x-4 text-sm text-green-700 justify-end">
                  <li v-for="(item, lIdx) in footer.legal" :key="lIdx">
                    <a v-if="item.url.startsWith('http')" :href="item.url" target="_blank" class="hover:underline transition text-xs">{{ item.label }}</a>
                    <RouterLink v-else :to="item.url" class="hover:underline transition text-xs">{{ item.label }}</RouterLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-green-900 text-white text-center py-4 text-sm">
      &copy; {{ currentYear }}. {{ footer.copyrightSuffix }}
    </div>
  </footer>
</template>
