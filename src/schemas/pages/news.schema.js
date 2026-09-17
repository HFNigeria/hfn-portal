export const newsPageSchema = {
  hero: {
    titleLine1: 'Stay Informed:',
    titleLine2: 'Latest Healthcare News & Updates',
    description:
      'Get the latest insights, announcements, and policy developments from the Healthcare Federation of Nigeria and across the health sector.',
    image: 'latest_news.png',
    backgroundColor: '#E87A1814',
  },

  latestNewsSection: {
    title: 'Latest News',
    filters: ['January 2026', 'December 2025', 'November 2025'],
    articles: [
      {
        id: 1,
        title: 'UHC Day 2025 High-Level Convening - 11th December, 2025',
        excerpt:
          'Quality on the supply side is the single most important lever to unlock demand for health insurance and finally make Universal Health Coverage real.',
        image: 'group1.png',
        date: 'December 11, 2025',
        created_at: '2025-12-11',
        description: `Quality on the supply side is the single most important lever to unlock demand for health insurance and finally make Universal Health Coverage real.
At the UHC Day 2025 High-Level Convening, themed “Unaffordable health cost? We are sick of it,” the President Healthcare Federation of Nigeria (HFN) and Country Director PharmAccess Nigeria, Njide Ndili, delivered a clear and compelling message:
Nigeria cannot achieve Universal Health Coverage without strengthening supply-side quality and scaling the solutions that already work.
 
In her remarks, Njide emphasized that quality is the catalyst that unlocks trust, stimulates demand for health insurance, and drives sustainable financing. She further highlighted the urgent need for coordinated public–private action to close the gaps that continue to burden millions of Nigerians.
 
She also underscored the concrete progress HFN has made in advancing UHC through collaboration, advocacy, and real-world implementation:
 
✅ HFN is now a co-signatory to Nigeria’s first UHC Compact, securing a national KPI for private-sector contribution; a historic milestone.
✅ Private sector participation in BHCPF was achieved for the first time, enabling eligible private facilities to deliver PHC services at scale.
✅ HFN-led PPP in Delta State revitalized 15 PHCs from non-functional to fully operational, recording zero maternal mortality over three years, a model now before the Governors’ Forum for national replication.
✅ HFN initiated collaboration with NCDC to integrate private-sector data into national emergency preparedness systems.
✅ HFN secured major policy wins, including the VAT waiver on pharmaceutical APIs and improved customs processes that reduce the cost of care.
✅ Through our MoU with PVAC, private providers have begun accessing new streams of investment capital.
✅ HFN mobilized private sector engagement with NHIA, driving innovation to reach the informal sector through technology-enabled insurance models.
✅ We continue to push systemic reforms in power, supply chain, strategic purchasing, and quality-linked financing to strengthen the entire healthcare value chain.
 
Njide reiterated that HFN’s mission remains consistent: to ensure that the private sector is fully integrated into national UHC strategy and that proven, high-quality, scalable models are replicated across the country.
 
As she noted, the pathway to UHC requires bold decisions, aligned incentives, and collective action. HFN remains committed to leading with evidence, partnership, and solutions that improve access, affordability, and quality for all Nigerians.
`,
        commentCount: 0,
        link: '/news/kaduna-solar-clinics',
        slug: 'uhc-day-2025-high-level-convening',
        tag: 'News',
      },
      {
        id: 2,
        title:
          'Driving the Digital Health Agenda Forward at #GDHF2025 - 5th December, 2025',
        excerpt:
          'At the Global Digital Health Forum 2025 in Nairobi, the President Healthcare Federation of Nigeria and Country Director PharmAccess Nigeria, Njide Ndili, a Founding Member of the Digital Transformation for Health Lab(DTH-Lab), delivered a powerful keynote on: Digital Determinants of Health Framework.',
        image:
          'https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769715460/84d92881fff843d7a1d8f64ef8dce88f_M_pufrzc.jpg',
        date: 'December 5, 2025',
        created_at: '2025-12-05',
        commentCount: 0,
        description: `At the Global Digital Health Forum 2025 in Nairobi, the President Healthcare Federation of Nigeria and Country Director PharmAccess Nigeria, Njide Ndili, a Founding Member of the Digital Transformation for Health Lab(DTH-Lab), delivered a powerful keynote on:
Digital Determinants of Health Framework.

Her presentation underscored a critical message: digital systems are no longer optional layers in health; they are now core determinants that shape equity, access, safety, and well-being.

She underscored the following critical actions:

Addressing digital determinants must become a public health priority
Close digital divides and extend benefits of digitalisation to all
Closer collaboration between groups working on digital health, online safety and digital/AI governance
The health sector must be at the table in shaping new policies and laws to tackle digital determinants and hold industry to account
Learn lessons from other public health challenges to address risks of technology use and boost digital well-being
Digital citizenship for health - empower people to use technology in ways that improve health

As digitalisation rapidly transforms health systems, leaders like Njide Ndili are helping chart the frameworks, conversations, and policies needed to protect populations and strengthen resilience.

Her contribution today is a reminder that the future of public health will be shaped not only by medical advancements but by how effectively we govern, use, and democratise digital tools.


`,
        link: '/news/digital-health-convention',
        slug: 'driving-the-digital-health',
        tag: 'News',
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 2,
    },
  },

  policyAdvocacySection: {
    title: 'Policy & Advocacy',
    backgroundColor: '#F2F9F3',
    updates: [
      {
        id: 1,
        title:
          'Strengthening Emergency Healthcare in Nigeria through Partnership.',
        description:
          'HFN and the Federal Ministry of Health jointly announced a new partnership model to enhance emergency medical infrastructure across Nigeria’s six geopolitical zones.',
        image: 'hands.png',
        link: '#',
        slug: 'strengthening-emergency-healthcare',
        tag: 'News',
      },
      {
        id: 2,
        title: 'Policy Framework for Health Technology Adoption',
        description:
          'HFN’s Policy and Advocacy team released a new white paper encouraging structured regulation and faster adoption of digital health tools in clinical settings.',
        image: 'hands1.png',
        link: '#',
        slug: 'policy-framework-for-health',
        tag: 'News',
      },
      {
        id: 3,
        title: 'Public-Private Dialogue on Universal Health Coverage (UHC)',
        description:
          'Stakeholders met in Abuja to evaluate funding mechanisms and policy frameworks driving Nigeria’s progress toward universal access to affordable healthcare.',
        image: 'hands2.png',
        link: '#',
        slug: 'public-private-dialogue',
        tag: 'News',
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 2,
    },
  },
};
