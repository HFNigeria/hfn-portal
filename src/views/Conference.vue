
<script setup>
const outlook = "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772037286/IMG-20260224-WA0000_okdvpl.jpg";  
const theme =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772034620/IMG-20260225-WA0000_up3tka.jpg";
const heroBg =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1770045591/243A7993_wxlzkg.jpg";
const roundTable =
  "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1770045588/IMG_9090_ugylgj.jpg";
  
const logos = [
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061214/SFH_Logo_o0klhu.png", scale: "scale-185" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061214/pharm-BSXKP_7c_ffhayw.png", scale: "scale-110" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061213/MTN_Foundation_pawphd.png", scale: "scale-125" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772529613/Hoffmann-La_Roche_logo_gbiyut.png", scale: "scale-90" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061212/Medison_Specialist_mpmexj.jpg", scale: "scale-130" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061212/tanit_medical_engineering_limited_logo_suno7n.jpg", scale: "scale-195" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061212/SYNLAB_LOGO_4c_OK_ee6i96.png", scale: "scale-110" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061212/Marcelle-Ruth-300x156_lgstuj.png", scale: "scale-95" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061211/Logo_3_l16icg.png", scale: "scale-100" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061210/eHealth-Africa-Donates-1.9m-to-eha-Impact-Ventures-EIV_avyrmo.png", scale: "scale-110" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061210/jnci-logo_x2oau2.png", scale: "scale-100" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061210/HRPayHub_LOGO_wpgja7.png", scale: "scale-165" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061209/cedarcrest-hospitals-logo-full-color-rgb-1-300x201_plcdzx.png", scale: "scale-105" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771066720/emzor-B-OOqpe8_bat5fl.png", scale: "scale-155" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771066719/hba-africa-BXqx92lp_j2kbgl.png", scale: "scale-135" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771066720/bridge-BbygTYH0_g9x0si.png", scale: "scale-110" },

  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535525/1688393209448_n5ksfa.jpg", scale: "scale-160" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535524/Capitol_Hill_Logo_hc_azqqrs.png", scale: "scale-100" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535524/Afrimedical_Logo_epd3ol.jpg", scale: "scale-155" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535513/Cerba_Lancet_obnoqm.jpg", scale: "scale-195" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535511/CH_LOGO_cyints.png", scale: "scale-215" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535511/Codix_Logo_mxkelg.png", scale: "scale-120" },
{ src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535509/Copy_of_myitura_tygw31.png", scale: "scale-70" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535509/DIgitax_ocdglv.png", scale: "scale-240" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535502/doroki_logo_b1zufs.jpg", scale: "scale-160" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535501/gabbi_Logo_yn9mo3.png", scale: "scale-95" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535500/IHS-Logo-Primary-Large_ia9x2r.png", scale: "scale-65" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535499/Instrat_Global_tmpqt0.jpg", scale: "scale-105" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535481/Iwosan_Logos_2_c4ygwa.png", scale: "scale-135" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535477/PUREHEALTH_1_fjapth.png", scale: "scale-110" },
{ src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535476/logo_bzsp8z.png", scale: "scale-100" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535476/International_SOS_logo_1_gbseap.png", scale: "scale-110" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535476/Sam_Pharm_LOGO-01_t80vxt.png", scale: "scale-150" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535475/Logo_-_Transparent_-_black_-_horizontal_e2dojm.png", scale: "scale-130" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535475/Medbury_qpgjqm.jpg", scale: "scale-105" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535475/Paga_logo_no_tagline_1_z01viu.png", scale: "scale-105" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535475/R4D_Logo_ngnkfl.png", scale: "scale-135" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535474/Mdoc_Logo_wwu5jj.png", scale: "scale-160" },
  { src: "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772535474/sfhaccess_logo_ouxu9n.jpg", scale: "scale-160" },

]

const highlightsStats = [
  { title: "500+", desc: "Participants Annually" },
  { title: "50+", desc: "Exhibitors" },
  { title: "Premier", desc: "Private-sector Platform" },
  { title: "Actionable", desc: "Policy Reform" },
];

const speakerImages = {
  "Dr. Iziaq Kunle Salako":
    "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061211/Dr._Iziaq_Kunle_Salako_na5voj.jpg",
  "Mrs. Bola Adesola":
    "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061212/Bola_Adesola_bwql8z.jpg",
  "Sen. Samaila Kaila":
    "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061210/Senator_Samaila_Kaila_nu9s8m.jpg",
  "Dr. Tomi Coker":
    "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061211/Dr._Tomi_Coker_v1nuaa.png",
  "Prof. Akin Abayomi":
    "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061210/Prof-Akin-Abayomi_nfxaru.png",
  "Njide Ndili (Host)":
    "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061210/Njide_Ndili_Host___ihm2no.jpg",
  "Dr. Tayo Aduloju":
    "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061212/Dr._Tayo_Aduloju_vl1rew.png",
  "Isabelle Hagner":
    "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061210/Isabelle_Hagner_nd7qar.jpg",
  "Dr. Ebere Okereke":
    "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061211/Dr._Ebere_Okereke_jptyhc.jpg",
  "Jane Egerton-Idehen":
    "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061210/Jane_Egerton-Idehen_cfi3kb.jpg",
  "Dr. Emmanuella Zamba":
    "https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771061211/Dr_Emmanuella_Zamba_kmo73a.jpg",
  
};

const speakers = [
  {
    name: "Dr. Iziaq Kunle Salako",
    role: "Hon. Minister of State for Health and Social Welfare",
  },
  { name: "Mrs. Bola Adesola", role: "Chair, HFN Board of Trustees" },
  {
    name: "Sen. Samaila Kaila",
    role: "Deputy Chairman, Senate Committee on Health",
  },
  { name: "Dr. Tomi Coker", role: "Hon. Commissioner for Health, Ogun State" },
  {
    name: "Prof. Akin Abayomi",
    role: "Hon. Commissioner for Health, Lagos State",
  },
  {
    name: "Njide Ndili (Host)",
    role: "President, Healthcare Federation of Nigeria",
  },
  {
    name: "Dr. Tayo Aduloju",
    role: "CEO, Nigerian Economic Summit Group (NESG)",
  },
  {
    name: "Isabelle Hagner",
    role: "Director of Public Health, MEA, International SOS",
  },
  { name: "Dr. Ebere Okereke", role: "Global Health Expert, Chatham House" },
  { name: "Jane Egerton-Idehen", role: "CEO, NIGCOMSAT" },
  { name: "Dr. Emmanuella Zamba", role: "PS & CEO, LASHMA" },
];

const agenda = [
  {
    day: "Day 1: Policy, Financing & Investment",
    items: [
      "Keynote Address",
      "Global Health Presentation",
      "Financing Panels",
      "Private Sector  Launch",
      "Women’s Forum (Evening)",
    ],
  },
  {
    day: "Day 2: State Implementation & Innovation",
    items: [
      "Public Sector Roundtable",
      "Innovation Showcase",
      "Emergency Medical Systems Panel",
      "Gala Dinner & Awards Night",
    ],
  },
];
</script>

<template>
  <div class="bg-white min-h-screen font-sans text-gray-900 overflow-x-hidden">
    <header class="relative h-screen flex items-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img
          :src="heroBg"
          class="w-full h-full object-cover brightness-[0.25]"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-green-950 via-green-950/40 to-transparent"
        ></div>
      </div>

      <div class="container mx-auto px-6 relative z-10">
        <div class="max-w-4xl">
          <div
            class="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-orange-400 text-sm font-bold uppercase tracking-widest mb-8"
          >
            <span class="relative flex h-3 w-3">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-3 w-3 bg-orange-500"
              ></span>
            </span>
            <span>4–5 March 2026 • The Oriental Hotel, VI, Lagos</span>
          </div>
          <h1
            class="text-5xl md:text-8xl font-black text-white leading-[1.1] mb-8"
          >
            HFN Annual <br />
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600"
              >Conference 2026</span
            >
          </h1>
          <p
            class="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed font-light max-w-2xl"
          >
            Leveraging Private Sector Innovation to Achieve Quality Outcomes and
            Universal Health Coverage (UHC).
          </p>
          <div class="flex flex-wrap gap-5">
            <a
              href="/buttons"
              class="px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-2xl hover:-translate-y-1"
            >
              Register Now
            </a>
            <a
  href="https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1771302048/HFN_Annual_Conference_2026_Sponsorship_Packages__ejkxtg.pdf"
  download
  target="_blank"
>
  <button
    class="px-10 py-5 border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white hover:text-green-950 transition-all backdrop-blur-sm"
  >
    Sponsorship Deck
  </button>
</a>

            <!-- <button
              class="px-10 py-5 border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white hover:text-green-950 transition-all backdrop-blur-sm"
            >
              Sponsorship Deck
            </button> -->
          </div>
        </div>
      </div>
    </header>

    <section class="py-24 container mx-auto px-6">
      <div class="grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <h4 class="text-orange-600 font-bold tracking-widest uppercase mb-4">
            The Voice of Private Health
          </h4>
          <h2
            class="text-4xl md:text-5xl font-black text-green-950 mb-8 leading-tight"
          >
            About the Conference
          </h2>
          <div class="space-y-6 text-gray-600 text-lg leading-relaxed">
            <p>
              The HFN Annual Conference has evolved into Nigeria’s leading
              private sector healthcare platform, convening over
              <strong>500 high-level participants</strong> annually, alongside
              more than 50 exhibitors and strategic partners.
            </p>
            <p>
              Hosted by the
              <strong>Healthcare Federation of Nigeria (HFN)</strong>, the
              conference provides a structured platform for dialogue,
              collaboration, and actionable reform.
            </p>
            <p>
              The 2026 edition builds on the momentum of recent health sector
              reforms and places deliberate focus on measurable outcomes,
              aligning innovation, financing, policy, and partnerships to
              accelerate Nigeria’s progress toward
              <strong>Universal Health Coverage (UHC)</strong>.
            </p>
          </div>
          <div class="grid grid-cols-2 gap-8 mt-12">
            <div
              v-for="stat in highlightsStats"
              :key="stat.title"
              class="bg-gray-50 p-6 rounded-2xl border-b-4 border-orange-500"
            >
              <h4 class="text-2xl font-black text-green-900">
                {{ stat.title }}
              </h4>
              <p class="text-sm text-gray-500 font-medium">{{ stat.desc }}</p>
            </div>
          </div>
        </div>
        <div class="relative group">
          <div
            class="absolute -inset-4 bg-green-900 rounded-[3rem] opacity-10 group-hover:rotate-0 transition-transform rotate-3"
          ></div>
          <img
            :src="theme"
            class="relative z-10 aspect-[4/5] object-cover rounded-[3rem] shadow-2xl"
          />
          <div
            class="absolute -bottom-10 -left-10 z-20 bg-orange-600 text-white p-10 rounded-3xl shadow-2xl max-w-xs"
          >
            <p
              class="text-sm font-bold uppercase opacity-80 mb-2 text-orange-200"
            >
              2026 Theme
            </p>
            <p class="text-lg font-bold leading-tight italic font-serif">
              "Transforming Healthcare: Leveraging Private Sector Innovation..."
            </p>
          </div>
        </div>
      </div>
    </section>

    <section
      class="py-24 bg-green-950 text-white rounded-[4rem] mx-4 overflow-hidden relative"
    >
      <div class="container mx-auto px-8 relative z-10">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-6xl font-black mb-6 italic">
            2026 Conference Background
          </h2>
          <p class="text-green-400 font-bold uppercase tracking-widest italic">
            Facing the Challenge. Seizing the Opportunity.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-12">
          <div class="bg-white/5 p-8 rounded-3xl border border-white/10">
            <div
              class="w-12 h-12 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center mb-6 font-black italic"
            >
              A
            </div>
            <h3 class="text-2xl font-bold mb-6 italic">The Challenge</h3>
            <ul class="space-y-4 text-green-100/70">
              <li class="flex items-start gap-3">
                <span class="text-orange-500 font-bold">•</span> High
                out-of-pocket expenditure (~70%)
              </li>
              <li class="flex items-start gap-3">
                <span class="text-orange-500 font-bold">•</span> Fragmented
                system & Quality gaps
              </li>
              <li class="flex items-start gap-3">
                <span class="text-orange-500 font-bold">•</span> Under-scaled
                private innovation
              </li>
            </ul>
          </div>
          <div class="bg-white/5 p-8 rounded-3xl border border-white/10">
            <div
              class="w-12 h-12 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center mb-6 font-black italic"
            >
              B
            </div>
            <h3 class="text-2xl font-bold mb-6 italic">The Opportunity</h3>
            <ul class="space-y-4 text-green-100/70">
              <li class="flex items-start gap-3">
                <span class="text-orange-500 font-bold">•</span> NHIA Act
                Implementation
              </li>
              <li class="flex items-start gap-3">
                <span class="text-orange-500 font-bold">•</span> BHCPF
                decentralisation
              </li>
              <li class="flex items-start gap-3">
                <span class="text-orange-500 font-bold">•</span> Local
                manufacturing reforms
              </li>
              <li class="flex items-start gap-3">
                <span class="text-orange-500 font-bold">•</span> Growing
                private-sector innovation
              </li>
            </ul>
          </div>
          <div
            class="bg-orange-600 p-8 rounded-3xl shadow-xl transform md:scale-110"
          >
            <div
              class="w-12 h-12 bg-white/20 text-white rounded-xl flex items-center justify-center mb-6 font-black italic"
            >
              C
            </div>
            <h3 class="text-2xl font-bold mb-4 italic">The Central Question</h3>
            <p class="text-orange-100 text-lg italic">
              "How do we systematically leverage private-sector ingenuity to
              improve quality, expand access and accelerate UHC?"
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 bg-gray-50">
      <div class="container mx-auto px-6">
        <div
          class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8"
        >
          <div class="max-w-xl">
            <h2 class="text-4xl font-black text-green-950 mb-4 italic">
              Strategic Objectives
            </h2>
            <p class="text-gray-600 text-lg">
              Our roadmap for the 2026 conference and beyond.
            </p>
          </div>
          <div class="h-1 w-24 bg-orange-500 hidden md:block"></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="obj in [
              'Showcase innovative and sustainable health financing models',
              'Strengthen Public–Private Collaboration',
              'Advocate enabling policies',
              'Promote Knowledge Exchange',
              'Facilitate Actionable Partnerships',
              'Advance Gender & Youth Inclusion',
            ]"
            :key="obj"
            class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group"
          >
            <div
              class="h-2 w-12 bg-green-900 group-hover:w-full transition-all duration-500 mb-6"
            ></div>
            <p class="text-xl font-bold text-green-900 italic">{{ obj }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 container mx-auto px-6">
      <h2 class="text-4xl font-black text-center text-green-950 mb-20 italic">
        Conference Highlights
      </h2>
      <div class="space-y-32">
        <div class="grid md:grid-cols-2 gap-16 items-center">
          <div class="order-2 md:order-1">
            <span
              class="text-orange-600 font-black tracking-tighter text-6xl opacity-20 block mb-4 italic"
              >01.</span
            >
            <h3
              class="text-3xl font-black text-green-900 mb-6 italic leading-tight"
            >
              Launch of the Nigeria Private Health Sector  2026
            </h3>
            <p class="text-gray-600 text-lg leading-relaxed mb-6">
              A flagship evidence-based publication supported by
              <strong>HFN, NESG, PVAC</strong>, and strategic partners. Provides
              a clear, data-driven assessment of Nigeria’s health market and
              growth opportunities.
            </p>
            <div class="flex gap-4">
              <span
                class="px-4 py-2 bg-green-100 text-green-800 text-xs font-bold rounded-full"
                >FLAGSHIP REPORT</span
              >
              <span
                class="px-4 py-2 bg-orange-100 text-orange-800 text-xs font-bold rounded-full"
                >DATA-DRIVEN</span
              >
            </div>
          </div>
          <div
  class="relative aspect-video rounded-3xl overflow-hidden order-1 md:order-2 shadow-2xl"
>
  <img
    :src="outlook"
    alt="Outlook 2026 Official Unveiling"
    class="w-full h-full object-cover"
  />

  <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
    <div class="text-white text-center border-4 border-orange-500 p-8">
      <h4 class="text-3xl font-black italic">OUTLOOK 2026</h4>
      <p class="mt-2 opacity-80">Official Unveiling</p>
    </div>
  </div>
</div>
        </div>

        <div class="grid md:grid-cols-2 gap-16 items-center">
          <div
            class="bg-gray-200 aspect-square rounded-[4rem] overflow-hidden shadow-2xl"
          >
            <img :src="roundTable" class="w-full h-full object-cover" />
          </div>
          <div>
            <span
              class="text-orange-600 font-black tracking-tighter text-6xl opacity-20 block mb-4 italic"
              >02.</span
            >
            <h3
              class="text-3xl font-black text-green-900 mb-6 italic leading-tight"
            >
              Public Sector Roundtable
            </h3>
            <p class="text-gray-600 text-lg leading-relaxed mb-6">
              Convenes State Commissioners for Health to share practical
              approaches to financing and delivering healthcare at the
              sub-national level. Focusing on real implementation
              realities—financing health where people live.
            </p>
            <ul class="grid grid-cols-2 gap-4">
              <li
                class="flex items-center gap-2 font-bold text-green-900 italic text-sm"
              >
                <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                Sub-national Reform
              </li>
              <li
                class="flex items-center gap-2 font-bold text-green-900 italic text-sm"
              >
                <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                Implementation Logic
              </li>
            </ul>
          </div>
        </div>
        <div class="grid md:grid-cols-2 gap-16 items-center">
          <div class="order-2 md:order-1">
            <span
              class="text-orange-600 font-black tracking-tighter text-6xl opacity-20 block mb-4 italic"
              >03.</span
            >
            <h3
              class="text-3xl font-black text-green-900 mb-6 italic leading-tight"
            >
              Innovation Showcase
            </h3>
            <p class="text-gray-600 text-lg leading-relaxed mb-6">
              Spotlighting scalable private-sector solutions across health
              technology, service delivery models, emergency medical systems,
              and digital platforms—demonstrating what works and how to scale it
              nationally.
            </p>
            <div class="grid grid-cols-2 gap-y-3">
              <div
                v-for="tag in [
                  'Health Tech',
                  'Emergency Systems',
                  'Financing Structures',
                  'Digital Platforms',
                ]"
                :key="tag"
                class="flex items-center gap-2 text-sm font-black text-orange-600 uppercase tracking-tighter"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                {{ tag }}
              </div>
            </div>
          </div>
          <div class="order-1 md:order-2 relative group">
            <div
              class="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2"
            ></div>
            <div
              class="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl translate-y-1/2"
            ></div>

            <div
              class="relative bg-green-950 rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden border border-white/10"
            >
              <div
                class="absolute inset-0 opacity-10"
                style="
                  background-image: radial-gradient(#fff 1px, transparent 1px);
                  background-size: 30px 30px;
                "
              ></div>

              <div class="relative z-10">
                <div class="flex items-center gap-3 mb-8">
                  <div
                    class="h-px flex-1 bg-gradient-to-r from-transparent to-orange-500"
                  ></div>
                  <span
                    class="text-orange-500 font-black text-xs uppercase tracking-[0.3em]"
                    >Exhibition Pillars</span
                  >
                  <div
                    class="h-px flex-1 bg-gradient-to-l from-transparent to-orange-500"
                  ></div>
                </div>

                <div class="grid grid-cols-1 gap-4">
                  <div
                    v-for="(pillar, idx) in [
                      'Health Technology',
                      'Service Delivery Models',
                      'Emergency Medical Systems',
                      'Financing Structures',
                      'Digital Platforms',
                    ]"
                    :key="idx"
                    class="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300 group/item"
                  >
                    <div class="flex items-center gap-4">
                      <span class="text-green-500 font-mono text-sm"
                        >0{{ idx + 1 }}</span
                      >
                      <span
                        class="text-white font-bold italic tracking-wide group-hover/item:text-orange-400 transition-colors"
                        >{{ pillar }}</span
                      >
                    </div>
                    <svg
                      class="w-5 h-5 text-white/20 group-hover/item:text-orange-400 group-hover/item:translate-x-1 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>

                <div class="mt-8 text-center">
                  <p
                    class="text-green-400/50 text-[10px] font-bold uppercase tracking-widest"
                  >
                    Demonstrating what works at scale
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-16 items-center">
          <div class="relative group">
            <div
              class="aspect-[16/10] bg-green-950 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-orange-500/20"
            >
              <img
                :src="heroBg"
                class="w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-110 transition-transform duration-700"
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center px-8">
                  <h4 class="text-white font-serif text-3xl italic mb-2">
                    Awards Night
                  </h4>
                  <div class="h-px w-20 bg-orange-400 mx-auto mb-2"></div>
                  <p
                    class="text-orange-400 font-black text-xs uppercase tracking-[0.3em]"
                  >
                    Excellence in Health
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <span
              class="text-orange-600 font-black tracking-tighter text-6xl opacity-20 block mb-4 italic"
              >04.</span
            >
            <h3
              class="text-3xl font-black text-green-900 mb-6 italic leading-tight"
            >
              HFN Women’s Forum & Gala Dinner
            </h3>
            <p class="text-gray-600 text-lg leading-relaxed mb-6">
              Celebrating leadership, innovation, and excellence within
              Nigeria’s healthcare ecosystem. The Conference will feature the
              HFN Women’s Forum followed by a prestigious Gala Dinner & Awards
              Night.
            </p>
            <div
              class="inline-flex items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100"
            >
              <div
                class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
                    clip-rule="evenodd"
                  ></path>
                  <path
                    d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z"
                  ></path>
                </svg>
              </div>
              <span class="text-sm font-black text-orange-900 uppercase"
                >Gala Dinner & Awards Night</span
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 bg-green-950 text-white rounded-[4rem] mx-4 mb-24">
      <div class="container mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-20">
          <h2 class="text-4xl md:text-5xl font-black mb-6 italic">
            Featured Speakers
          </h2>
          <p class="text-green-400 font-medium italic">
            Convening the most influential voices in Nigerian Healthcare.
          </p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div
            v-for="speaker in speakers"
            :key="speaker.name"
            class="group text-center"
          >
            <div class="relative mb-6 inline-block">
              <div
                class="aspect-[4/5] w-full max-w-[240px] bg-green-900 rounded-2xl overflow-hidden border border-white/10 group-hover:border-orange-500 transition-all duration-500 shadow-xl"
              >
                <img
                  :src="speakerImages[speaker.name]"
                  :alt="speaker.name"
                  class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  @error="
                    (e) =>
                      (e.target.src =
                        'https://via.placeholder.com/400x500?text=HFN+Speaker')
                  "
                />
              </div>
              <div
                class="absolute -bottom-2 -right-2 w-12 h-12 bg-orange-600 rounded-lg -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"
              ></div>
            </div>

            <h4 class="font-bold text-xl mb-2 italic leading-tight px-2">
              {{ speaker.name }}
            </h4>
            <div
              class="h-px w-8 bg-orange-500 mx-auto mb-3 opacity-50 group-hover:w-16 transition-all duration-500"
            ></div>
            <p
              class="text-[11px] text-green-400 font-bold uppercase tracking-[0.15em] px-4 leading-relaxed opacity-90"
            >
              {{ speaker.role }}
            </p>
          </div>
        </div>
        <p
          class="text-center mt-12 text-green-100 opacity-60 italic tracking-widest uppercase text-xs"
        >
          Among Other Distinguished speakers
        </p>
      </div>
    </section>

    <section class="py-24 container mx-auto px-6 max-w-5xl">
      <h2
        class="text-4xl font-black text-center text-green-950 mb-16 italic tracking-tighter"
      >
        Conference Agenda
      </h2>
      <div class="grid md:grid-cols-2 gap-12 italic">
        <div
          v-for="day in agenda"
          :key="day.day"
          class="bg-gray-50 rounded-3xl p-10 border border-gray-100"
        >
          <h3
            class="text-2xl font-black text-orange-600 mb-8 border-b border-orange-200 pb-4"
          >
            {{ day.day }}
          </h3>
          <ul class="space-y-6">
            <li
              v-for="item in day.items"
              :key="item"
              class="flex items-center gap-4 text-green-900 font-bold"
            >
              <span class="w-2 h-2 bg-green-900 rounded-full"></span>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-12 text-center">
        <p class="text-gray-400 font-medium italic mb-6">
          Full Agenda is available for download.
        </p>
        <a
    href="https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1772526251/Program_Brochure_-_HFN_2026_Annual_Conference-2_compressed_1_wgsa2o.pdf"
    download
    target="_blank"
    class="inline-block px-8 py-3 bg-green-900 text-white rounded-xl font-bold hover:bg-green-800 transition"
  >
    Download PDF Agenda
  </a>
      </div>
    </section>

    
    <section class="py-12 bg-gray-50 border-b overflow-hidden">
  <p class="text-center text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-8">
    Supported By Industry Giants
  </p>
  <div class="flex space-x-12 animate-scroll whitespace-nowrap">
    <div v-for="i in 2" :key="i" class="flex space-x-12 items-center">
      <div
  v-for="logo in logos"
  :key="logo.src"
  class="h-16 w-32 flex items-center justify-center"
>
  <img
    :src="logo.src"
    :class="[
      'max-h-full max-w-full object-contain transition',
      logo.scale
    ]"
    alt="Company logo"
  />
</div>
    </div>
  </div>
</section>

    <section
      class="py-24 bg-orange-600 rounded-t-[5rem] text-center text-white relative overflow-hidden"
    >
      <div class="relative z-10 max-w-3xl mx-auto px-6">
        <h2 class="text-5xl font-black mb-8 italic">
          Will you be in the room?
        </h2>
        
        <div class="flex flex-col sm:flex-row justify-center gap-6">
          <a
            href="/buttons"
            class="bg-white text-orange-600 px-12 py-5 rounded-2xl font-black shadow-2xl hover:bg-green-950 hover:text-white transition-all transform hover:scale-105"
            >Get Your Tickets</a
          >
          <!-- <button
            class="bg-green-950/20 border-2 border-white/30 text-white px-12 py-5 rounded-2xl font-black hover:bg-green-950 transition-all"
          >
            Sponsorship Inquiry
          </button> -->
        </div>
        <p class="text-orange-100 mt-12 text-xl leading-relaxed">
          For more sponsorship, partnership and exhibition opportunities: 
          <span>info@hfnigeria.com  |  +234 703 056 7554</span>
        </p>
      </div>
      <div
        class="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute -bottom-24 -right-24 w-96 h-96 bg-green-950/20 rounded-full blur-3xl"
      ></div>
    </section>
  </div>
</template>

<style scoped>
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-scroll {
  display: flex;
  width: max-content;
  animation: scroll 30s linear infinite;
}

.animate-scroll:hover {
  animation-play-state: paused;
}

.font-black {
  letter-spacing: -0.02em;
}
</style>
