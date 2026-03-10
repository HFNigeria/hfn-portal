<template>
  <div class="news-page font-sans bg-white">
    <section class="bg-[#E87A1814] pt-10 pb-16">
      <div class="container mx-auto px-4 md:px-8">
        <div
          class="flex flex-col lg:flex-row items-start lg:items-center justify-between"
        >
          <div class="lg:w-1/2 mb-8 lg:mb-0">
            <h1
              class="text-4xl md:text-5xl font-bold text-gray-800 leading-tight"
            >
              <span class="text-green-700">Stay Informed:</span>
              <br />
              <span class="text-gray-900"
                >Latest Healthcare News & Updates</span
              >
            </h1>
            <p class="mt-4 text-gray-600 max-w-lg">
              Get the latest insights, announcements, and policy developments
              from the Healthcare Federation of Nigeria and across the health
              sector.
            </p>
          </div>

          <div
            class="lg:w-1/2 flex justify-center w-full h-64 sm:h-80 lg:h-96 relative"
          >
            <img
              :src="latest"
              alt="Latest news and updates"
              class="object-cover w-full h-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>

    <main class="container mx-auto px-4 md:px-8 py-16">
      <h2 class="text-4xl font-bold text-gray-900 text-center mb-12">
        Newsletters
      </h2>
      <div
        class="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16"
      >
        <div
          v-for="(item, index) in newsletters"
          :key="index"
          class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col"
        >
          <div class="relative group h-60 overflow-hidden bg-gray-100">
            <img
              :src="getPdfPreview(item.pdfUrl)"
              alt="Newsletter Preview"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              @error="(e) => (e.target.src = newsletter_placeholder)"
            />
            <div
              class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <span class="text-white bg-green-700 px-3 py-1 rounded text-xs"
                >View Document</span
              >
            </div>
          </div>

          <div class="p-6 flex-grow flex flex-col">
            <p class="text-sm text-orange-500 mb-4 flex items-center space-x-4">
              <span class="flex items-center">
                {{ item.date }}
              </span>
            </p>
            <p class="text-gray-700 text-base mb-4 flex-grow">
              {{ item.text }}
            </p>

            <div class="mt-auto pt-4 flex space-x-2">
              <a
                :href="item.pdfUrl"
                download
                target="_blank"
                class="flex-1 text-center bg-green-700 text-white text-sm px-5 py-2 rounded-full hover:bg-green-800 transition-colors"
              >
                Download PDF
              </a>

              <a
                :href="item.pdfUrl"
                target="_blank"
                class="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                title="Open in browser"
              >
                <svg
                  class="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-12"></h2>
      </div>

      <div
        class="flex justify-center items-center space-x-4 text-gray-600 mb-20"
      >
        <span class="text-sm">Page 1 of 2</span>
        <a
          href="https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1770067797/IMPACT_REPORT_-_Updated_p18np1.pdf"
          class="flex items-center space-x-1 text-green-700 hover:underline"
        >
          <span>Next</span>
          <svg
            class="w-4 h-4"
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
        </a>
      </div>

      <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Publications</h2>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16 py-10 px-10 rounded-3xl bg-[#F2F9F3]"
      >
        <div
          v-for="(pub, index) in publications"
          :key="index"
          class="flex flex-col text-center"
        >
          <div
            style="display: inline-table;"
            class="w-full h-48 mb-4 rounded-xl overflow-hidden border-2 border-green-400/50 shadow-md flex items-center justify-center bg-white"
          >
            <img
              :src="getPdfPreview(pub.pdfUrl)"
              alt="Publication preview"
              class="w-full h-full object-contain"
              @error="(e) => (e.target.src = hands)"
            />
          </div>

          <h4 class="text-lg font-semibold text-gray-900 mb-2">
            {{ pub.title }}
          </h4>

          <p class="text-gray-600 text-sm mb-4">
            
          </p>

          <a
            @click="handleDownload(pub)"
            class="inline-block bg-green-700 text-white text-sm px-5 py-2 rounded-full hover:bg-green-800 transition-colors"
          >
            Download
          </a>
        </div>
      </div>
      <div class="flex justify-center items-center space-x-4 text-gray-600">
        <span class="text-sm">Page 1 of 2</span>
        <a
          href="#"
          class="flex items-center space-x-1 text-green-700 hover:underline"
        >
          <span>Next</span>
          <svg
            class="w-4 h-4"
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
        </a>
      </div>
    </main>
  </div>
  <!-- PAYMENT MODAL -->
<div v-if="showPaymentDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div class="bg-white rounded-xl p-8 w-[420px] shadow-xl">
    
    <h3 class="text-xl font-bold mb-4 text-gray-900">
      Purchase Document
    </h3>

    <p class="text-gray-600 mb-4">
      Nigeria Private Health Sector Market Outlook 2026
    </p>

    <div class="bg-gray-50 p-4 rounded-lg mb-4">
      <p class="text-sm text-gray-700">Price</p>
      <p class="text-lg font-bold text-green-700">₦15,000</p>
    </div>

    <div class="bg-green-50 p-4 rounded-lg mb-4">
      <p class="text-sm font-semibold">Bank Transfer</p>
      <p class="text-sm">Bank: Access Bank</p>
      <p class="text-sm">Account Name: Healthcare Federation of Nigeria</p>
      <p class="text-sm">Account Number: 0123456789</p>
    </div>

    <div class="mb-4">
      <label class="text-sm font-medium text-gray-700">Your Email</label>
      <input
        v-model="buyerEmail"
        type="email"
        class="w-full border rounded-lg px-3 py-2 mt-1"
        placeholder="Enter email to receive document"
      />
    </div>

    <p class="text-xs text-gray-500 mb-4">
      Session expires in {{ timer }} seconds
    </p>

    <button
      @click="confirmPayment"
      class="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
    >
      I Have Made Payment
    </button>

    <button
      @click="showPaymentDialog = false"
      class="w-full mt-3 text-sm text-gray-500"
    >
      Cancel
    </button>

  </div>
</div>


<!-- SUCCESS MODAL -->
<div v-if="showSuccessDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div class="bg-white rounded-xl p-8 w-[380px] text-center shadow-xl">

    <h3 class="text-xl font-bold text-green-700 mb-3">
      Payment Confirmation
    </h3>

    <p class="text-gray-600 mb-6">
      Your document will be emailed to you shortly after payment confirmation.
    </p>

    <button
      @click="showSuccessDialog = false"
      class="bg-green-700 text-white px-6 py-2 rounded-lg"
    >
      OK
    </button>

  </div>
</div>
</template>

<script setup>
import hands from "@/assets/hands.png";
import latest from "@/assets/latest_news.png";
import newsletter from "@/assets/newsletter.png";
import { ref } from "vue";

const showPaymentDialog = ref(false);
const showSuccessDialog = ref(false);

const buyerEmail = ref("");
const timer = ref(300); // 5 minutes

let interval = null;

const handleDownload = (pub) => {
  if (pub.title === "Nigeria Private Health Sector Market Outlook 2026") {
    showPaymentDialog.value = true;
    startTimer();
  } else {
    window.open(pub.pdfUrl, "_blank");
  }
};

const startTimer = () => {
  timer.value = 300;

  interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(interval);
      showPaymentDialog.value = false;
    }
  }, 1000);
};

const confirmPayment = () => {
  if (!buyerEmail.value) {
    alert("Please enter your email.");
    return;
  }

  clearInterval(interval);
  showPaymentDialog.value = false;
  showSuccessDialog.value = true;

  console.log("User email for document:", buyerEmail.value);
};
const getPdfPreview = (url) => {
  return url.replace(".pdf", ".jpg");
};

const publications = [
  {
    title:
      "Transforming Nigeria’s Healthcare Landscape Through Strategic Advocacy and Private Sector Leadership",
    description:
      "HFN is uniquely positioned to leverage its deep understanding of both the healthcare sector and the policy landscape to facilitate transformative change. We have the expertise to connect public and private sectors, mobilize financing, and advocate for reforms that drive long-term, sustainable growth in the healthcare industry.",
    pdfUrl:
      "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1770067797/IMPACT_REPORT_-_Updated_p18np1.pdf",
  },
  {
    title: "THE HEALTHCARE FEDERATION OF NIGERIA In partnership with WHX Lagos",
    description:
      "The 2025 Healthcare Leadership Conference hosted by the Healthcare Federation of Nigeria (HFN), in partnership with WHX Lagos, themed “Accelerating UHC and Health Sovereignty: Scaling Up Best Practices Through Public-Private Integration,” convened distinguished leaders, policymakers, and system innovators to advance Nigeria’s journey toward Universal Health Coverage (UHC) and health sovereignty. The conference delivered not just vision, but actionable roadmaps.",
    pdfUrl:
      "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1770067796/2025-hfn-hlc-report_fyxosp.pdf",
  },
  {
    title:
      "Expanding Access to Quality Healthcare: Transforming Nigeria through Innovation, Partnership, and Sustainability",
    description:
      "The 2025 Annual General Conference of the Healthcare Federation of Nigeria (HFN) was a landmark gathering convened to commemorate a decade of transformative advocacy, sectoral leadership, and policy influence by the private healthcare sector in Nigeria.",
    pdfUrl:
      "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1770067793/2025-hfn-conference-report_hapfj9.pdf",
  },
  {
    title: "High-Level Roundtable on Local Manufacturing of Medicines in Nigeria",
    description: "The Healthcare Federation of Nigeria (HFN), in collaboration with the West Africa Private Healthcare Federation (FOASPS), the Presidential Initiative for Unlocking the Healthcare Value Chain (PVAC), the African Union Development Agency (AUDA-NEPAD), and the World Bank, convened a High-Level Roundtable on Local Manufacturing of Medicines in Nigeria on Wednesday, October 22, 2025, in Abuja",
    pdfUrl:
      "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1770067783/hfn-report_roundtable-on-local-manufacturing_esqq68.pdf",
  },
  {
    title: "Nigeria Private Health Sector Market Outlook 2026",
    description: "The Healthcare Federation of Nigeria (HFN), in collaboration with the West Africa Private Healthcare Federation (FOASPS), the Presidential Initiative for Unlocking the Healthcare Value Chain (PVAC), the African Union Development Agency (AUDA-NEPAD), and the World Bank, convened a High-Level Roundtable on Local Manufacturing of Medicines in Nigeria on Wednesday, October 22, 2025, in Abuja",
    pdfUrl:
      "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772817006/Nigeria_Private_Health_Sector_Market_Outlook_2026_c4ql1j.pdf",
  },
];

const newsletters = [
  {
    date: "October 8, 2025",
    comments: 0,
    text: "Q4 Quarterly Newsletter, 2025 (October-December, 2025)",
    pdfUrl:
      "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1770067786/2025-hfn-quarterly-newsletter-q4_gd0aj6.pdf",
  },
  {
    date: "July 2, 2025",
    comments: 0,
    text: "Q3 Quarterly Newsletter, 2025 (July-September, 2025)",
    pdfUrl:
      "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1770067785/2025-hfn-quarterly-newsletter-q3_g4ks3t.pdf",
  },
  {
    date: "April 7, 2025",
    comments: 0,
    text: "Q2 Quarterly Newsletter, 2025 (April-June, 2025)",
    pdfUrl:
      "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1770067784/hfn-quarterly-newsletter-q-2---2025_jfakrt.pdf",
  },
  {
    date: "February 27, 2025",
    comments: 0,
    text: "Q1 Quarterly Newsletter, 2025 (January-March, 2025)",
    pdfUrl:
      "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1770067784/1st-quarter-2025-hfn-newsletter1_nznhgn.pdf",
  },
  {
    date: "October 3, 2024",
    comments: 0,
    text: "Q4 Quarterly Newsletter, 2024 (October-December, 2024)",
    pdfUrl:
      "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1770067784/hfn-quarterly-newsletter-q-4_2024_rqpvhf.pdf",
  },
  
];
</script>


<style scoped>
</style>
