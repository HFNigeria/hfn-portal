<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
    <div class="max-w-md w-full">
      <div class="text-center mb-10">
        <h1 class="text-2xl font-black text-green-900 uppercase tracking-tight italic">
          Conference Registration
        </h1>
        <p class="text-gray-500 text-sm mt-2">Please select your registration category to continue</p>
      </div>

      <div class="flex flex-col gap-4">
        
        <a
          href="https://tix.africa/claim/2026-hfn-annual-conference/VGlja2V0LTgzOWNmYmQ3LTliNDUtNGE3Ny1iNTM1LTI5ZWFjZWQ5MTgxOQ=="
          target="_blank"
          rel="noopener noreferrer"
          class="group relative flex items-center justify-between px-8 py-5 bg-green-900 text-white rounded-2xl shadow-lg hover:bg-green-800 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div class="flex flex-col">
            <span class="font-black text-lg italic uppercase tracking-wide">Register Now</span>
            <span class="text-green-300 text-xs font-medium">HFN MEMBERS</span>
          </div>
          <svg class="w-6 h-6 text-orange-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>

        <a
          href="https://tix.africa/discover/2026-hfn-annual-conference?utm_source=sendpulse&utm_medium=email&utm_campaign=hfn-anual-conference-2026-met-&spush=YmVuamFtaW5iYWJpbmVAZ21haWwuY29t"
          target="_blank"
          rel="noopener noreferrer"
          class="group relative flex items-center justify-between px-8 py-5 bg-white border-2 border-green-900 text-green-900 rounded-2xl shadow-md hover:bg-green-50 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div class="flex flex-col">
            <span class="font-black text-lg italic uppercase tracking-wide">NON MEMBERS</span>
            <span class="text-gray-500 text-xs font-medium">Naira Payment</span>
          </div>
          <svg class="w-6 h-6 text-green-900 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>

        <a
          href="https://www.eventbrite.com/e/2026-hfn-annual-conference-tickets-1980514831174?aff=oddtdtcreator&utm_source=sendpulse&utm_medium=email&utm_campaign=hfn-anual-conference-2026-met-&spush=YmVuamFtaW5iYWJpbmVAZ21haWwuY29t"
          target="_blank"
          rel="noopener noreferrer"
          class="group relative flex items-center justify-between px-8 py-5 bg-orange-600 text-white rounded-2xl shadow-lg hover:bg-orange-700 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div class="flex flex-col">
            <span class="font-black text-lg italic uppercase tracking-wide">Dollar Payment</span>
            <span class="text-orange-100 text-xs font-medium">NON MEMBERS</span>
          </div>
          <svg class="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>

      </div>

      <div class="mt-12 text-center">
        <router-link to="/" class="text-sm font-bold text-green-900 hover:underline">
          ← Back to Conference Details
        </router-link>
        <p class="text-[10px] text-gray-400 mt-8 uppercase tracking-[0.2em]">
          Securely processed by Tix.Africa
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>

div {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
