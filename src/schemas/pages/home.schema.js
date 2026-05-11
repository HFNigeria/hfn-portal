import bridge from '@/assets/bridge.png';
import emzor from '@/assets/emzor.png';
import group from '@/assets/group.png';
import health from '@/assets/hfn-news5.PNG';
import wef from '@/assets/hfn-news6.PNG';
import event from '@/assets/hfn-news7.PNG';
import hba from '@/assets/hba-africa.png';
import oando from '@/assets/oando_logo.png';
import pharm from '@/assets/pharm.png';
import ayodele from '@/assets/ayodele.png';
import babarinde from '@/assets/babarinde.png';
import chinyere from '@/assets/chinyere.png';
import jennifer from '@/assets/jennifer.png';
import njide from '@/assets/njide.png';
import reagan from '@/assets/reagan.png';

const hfn_partner =
  'https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769715457/16268da44f149e859e5069f5fcdbf9fb_S_j9rsms.jpg';

const society =
  'https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769734457/Society_For_Family_Health_Logo_1_a5qcrp.png';
export const homePageSchema = {
  hero: {
    titleHighlight: 'The Voice of Nigeria’s',
    titleMain: 'Private Health Sector',
    introLine: 'Advancing Universal Health Coverage',
    introText: 'through private sector activation.',
    subText: '',
    ctaText: 'Join The Coalition ->',
    ctaLink: '/register',
    slides: [
      'https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769773405/1_1_uebqmc.jpg',
      'https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769801024/2_evqlkd.jpg',
      'https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769773393/3_nvepaa.jpg',
    ],
  },

  partners: {
    title: 'Health Guardians',
    logos: ['pharm', 'society', 'bridge', 'emzor', 'hba'],
  },

  about: {
    badge: 'Who We Are',
    title: "Strengthening Nigeria's Healthcare System",
    description: `Healthcare Federation of Nigeria (HFN) is a coalition of private healthcare stakeholders committed to strengthening Nigeria’s health system through strategic advocacy, collaboration, and private sector leadership. HFN serves as a unified platform for engaging government, influencing health policy, and enabling private sector contributions that expand access, improve quality, and accelerate progress toward Universal Health Coverage.`,
    image:
      'https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769803836/1_hkuaio.jpg',
    stats: {
      number: '6+',
      label: 'Health Guardians',
    },
    features: [
      { title: 'Unified Platform', sub: 'Engagement & Policy' },
      { title: 'Universal Progress', sub: 'Universal Coverage' },
    ],
  },

  mandate: {
    badge: 'Our Core Mandate',
    title: 'What We Do',
    description:
      "Driving measurable change in Nigeria's healthcare landscape through four strategic pillars.",
    actions: [
      {
        title: 'Policy Advocacy',
        description:
          'We engage policymakers to shape evidence-based reforms that enable effective regulation, sustainable financing, and private sector participation in health system strengthening.',
        icon: 'ScaleIcon',
      },
      {
        title: 'Stakeholder Convening',
        description:
          'We bring together private sector actors, government institutions, and development partners to align priorities, share knowledge, and drive collective action.',
        icon: 'UserGroupIcon',
      },
      {
        title: 'Sector Intelligence & Thought Leadership',
        description:
          'We generate insights, reports, and high-level dialogues that inform policy decisions, investment, and strategic engagement across the health sector.',
        icon: 'LightBulbIcon',
      },
      {
        title: 'Public–Private Collaboration',
        description:
          'We support partnerships that leverage private sector capacity to improve service delivery, emergency care, and access to quality healthcare.',
        icon: 'HandRaisedIcon',
      },
    ],
  },

  news: {
    months: {
      'December 2025': {
        featured: {
          title:
            'Driving Nigeria Toward Universal Health Coverage: A Landmark HFN–NHIA Private Sector Roundtable, theme: Leveraging the Private Sector to Accelerate Health Insurance Coverage in Nigeria',
          slug: 'hfn-nhia-private-sector-roundtable',
          image: hfn_partner,
          tag: 'Programs & Initiatives',
          date: 'December 1, 2025',
          comments: 0,
          description:
            'Healthcare Federation of Nigeria (HFN), in partnership with the  National Health Insurance Authority (NHIA),hosted a high-impact Private Sector Roundtable Breakfast Meeting today in Lagos. More than a stakeholder engagement, the event marked a decisive step in reshaping Nigeria’s health insurance landscape, uniting participants around one shared ambition: accelerating coverage through bold private sector leadership.',
        },
        newsList: [
          {
            title: 'Driving the Digital Health Agenda Forward at #GDHF2025',
            slug: 'digital-health-agenda-gdhf-2025',
            image: health,
            tag: 'Programs',
            date: 'December 15, 2025',
            comments: 0,
            description:
              'At the Global Digital Health Forum 2025 in Nairobi, the President Healthcare Federation of Nigeria and Country Director PharmAccess Nigeria, Njide Ndili, a Founding Member of the Digital Transformation for Health Lab(DTH-Lab), delivered a powerful keynote on Digital Determinants of Health Framework. Her presentation underscored a critical message: digital systems are no longer optional layers in health; they are now core determinants that shape equity, access, safety, and well-being.',
          },
          {
            title:
              'NCDC Private Sector Engagement Roundtable on National Health Security',
            slug: 'ncdc-private-sector-engagement',
            image: wef,
            tag: 'Health Alert',
            date: 'December 5, 2025',
            comments: 0,
            description:
              'The Nigeria Centre for Disease Control and Prevention (NCDC) convened a high-level Private Sector Engagement Roundtable focused on strengthening national health security through strategic collaboration. Healthcare Federation of Nigeria(HFN) was duly represented by Dr Benson Ayodele Cole(First Vice President 1), Mr Olufemi Akingbade(Executive Secretary), and Uchechi Amiloat the session.',
          },
          {
            title:
              'The Digital Health Revolution – Unlocking Investment in Africa’s HealthTech Ecosystem',
            slug: 'the-digital-health-revolution',
            image: event,
            tag: 'Public Health Stories',
            date: 'December 10, 2025',
            comments: 0,
            description:
              'The Digital Health Revolution is reshaping how Africa delivers, finances, and experiences healthcare. To unlock real investment in the continent’s HealthTech ecosystem, innovators, providers, regulators, and funders must align behind a shared transformation agenda. Digital innovation is no longer optional; it’s a strategic imperative for achieving Universal Health Coverage (UHC). At the World Health Expo Leaders Africa in Accra, Njide Ndili, President HFN and Country Director PharmAccess Nigeria, joined a high-level panel on “The Digital Health Revolution – Unlocking Investment in Africa’s HealthTech Ecosystem.',
          },
        ],
      },
      'September 2025': {
        featured: {
          title: 'Strengthening Healthcare Policy Frameworks',
          slug: 'strengthening-policy-frameworks',
          image: group,
          tag: 'Health Policy',
          date: 'September 18, 2025',
          comments: 0,
          description:
            'HFN met with the Federal Ministry of Health to discuss strengthening healthcare policy frameworks.',
        },
        newsList: [
          {
            title: 'Pharmaceutical Collaboration for Quality Medicine',
            slug: 'pharmaceutical-collaboration-quality-medicine',
            image: pharm,
            tag: 'Programs & Initiatives',
            date: 'September 15, 2025',
            comments: 0,
            description:
              'HFN continues its collaboration with pharmaceutical partners to ensure access to quality medicines.',
          },
          {
            title:
              'Oando Foundation and HFN partner to improve workplace health and wellness programs.',
            slug: 'oando-foundation-and-hfn-partner',
            image: oando,
            tag: 'Health Alert',
            date: 'September 10, 2025',
            comments: 0,
            description:
              'Oando Foundation and HFN partner to improve workplace health and wellness programs.',
          },
          {
            title:
              'HFN hosted a national workshop on healthcare business sustainability strategies.',
            slug: 'hfn-hosted-a-national-workshop',
            image: hba,
            tag: 'Public Health Stories',
            date: 'September 2, 2025',
            comments: 0,
            description:
              'HFN hosted a national workshop on healthcare business sustainability strategies.',
          },
        ],
      },
      'August 2025': {
        featured: {
          title:
            'HFN collaborated with Emzor Pharmaceuticals to discuss the future of local drug production.',
          slug: 'hfn-collaborated-with-emzor',
          image: emzor,
          tag: 'Programs & Initiatives',
          date: 'August 20, 2025',
          comments: 0,
          description:
            'HFN collaborated with Emzor Pharmaceuticals to discuss the future of local drug production.',
        },
        newsList: [
          {
            title:
              'Society for Family Health and HFN partner to improve primary care delivery systems.',
            slug: 'society-for-family-health',
            image: society,
            tag: 'Health Alert',
            date: 'August 18, 2025',
            comments: 0,
            description:
              'Society for Family Health and HFN partner to improve primary care delivery systems.',
          },
          {
            title:
              'Bridge Clinic joins HFN network to promote advanced fertility care across Nigeria.',
            slug: 'bridge-clinic-joins-hfn',
            image: bridge,
            tag: 'Public Health Stories',
            date: 'August 12, 2025',
            comments: 0,
            description:
              'Bridge Clinic joins HFN network to promote advanced fertility care across Nigeria.',
          },
          {
            title:
              'INAUGURATION OF THE IMPLEMENTATION COMMITTEE FOR THE NATIONAL STAKEHOLDERS DIALOGUE ON POWER IN THE HEALTH SECTOR',
            slug: 'inauguration-of-the-implementation-committee',
            image: health,
            tag: 'Programs & Initiatives',
            date: 'August 5, 2025',
            comments: 0,
            description:
              'This committee is tasked with convening a National Stakeholders Dialogue, implementing key recommendations, and mobilizing resources for the sustainable electrification of healthcare facilities. The committee, chaired by the Honourable Minister of State for Health, includes distinguished members such as: Dr. Babatunde Ipaye (Vice Chairman), Mrs. Njide Ndili (President of HFN), representatives from the Ministry of Health, Ministry of Power, NPHCDA, REA, NSIA, World Bank, WHO, UNDP, Global Fund, CHAI, PharmAccess, and NESG. This initiative is a major step toward ensuring uninterrupted power for better healthcare delivery in Nigeria! In line with our mandate to represent the private sector, HFN will be conducting a survey to gain deeper insights into the power challenges faced by our members. This initiative is a major step toward ensuring uninterrupted power for better healthcare delivery in Nigeria! In line with our mandate to represent the private sector, HFN will be conducting a survey to gain deeper insights into the power challenges faced by our members.',
          },
        ],
      },
    },
  },
  executives: [
    {
      name: 'Njide Ndili',
      position: 'President, HFN',
      role: 'Country Director, PharmAccess',
      image: njide,
    },
    {
      name: 'Dr. Benson Ayodele-Cole',
      position: '1st Vice President, HFN',
      role: 'CEO, Benson Coleman & Associates',
      image: ayodele,
    },
    {
      name: 'Dr. Jennifer Anyanti',
      position: '2nd Vice President, HFN',
      role: 'Deputy Managing Director, Society for Family Health',
      image: jennifer,
    },
    {
      name: 'Chinyere Okorocha',
      position: 'Public Relations Secretary, HFN',
      role: 'Head of Sectors, Jackson, Etti & Edu',
      image: chinyere,
    },
    {
      name: 'Olayode Babarinde',
      position: 'Financial Secretary, HFN',
      role: 'Healthcare System Partner – Policy, Roche',
      image: babarinde,
    },
    {
      name: 'Reagan Rowland',
      position: 'Treasurer, HFN',
      role: 'Founder/CEO, OneClick Med',
      image: reagan,
    },
  ],


};
