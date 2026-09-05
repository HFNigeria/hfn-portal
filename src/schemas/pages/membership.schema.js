export const membershipPageSchema = {
  hero: {
    headlineTop: 'Engagement Access Quality',
    headlineBottom: 'A coalition driving policy and innovation',
    description:
      'Membership of the Healthcare Federation of Nigeria (HFN) provides access to a trusted professional network that strengthens private sector participation in policy, investment, and health system reform. HFN members engage through structured advocacy platforms, strategic partnerships, and sector-wide collaborations that shape Nigeria’s healthcare landscape.',
    image: 'membership.jpg',
    sectionTitle: 'Membership Categories',
  },

  categories: [
    {
      id: 'individual',
      name: 'Individual',
      description: 'Ideal for private and insurance companies',
      plans: [
        {
          title: 'Individual',
          price: '₦50,000 per year',
          audience: 'Ideal for private companies',
          benefits: [
            'Advocacy/Public-Private Engagement project',
            'Networking/High Profile Breakfast Meetings',
            'Access to Finance',
            'Promotion & Brand Visibility',
            'Access to Industry Information for Members Only',
            'Partnership & Engagement with International Organizations',
          ],
        },
      ],
    },
    {
      id: 'association',
      name: 'Association',
      description: 'For registered professional or trade associations',
      plans: [
        {
          title: 'Association Member',
          price: '₦150,000 per year',
          audience: 'Ideal for professional bodies',
          benefits: [
            'Advocacy/Public-Private Engagement project',
            'Networking/High Profile Breakfast Meetings',
            'Access to Finance',
            'Promotion & Brand Visibility',
            'Access to Industry Information for Members Only',
            'Partnership & Engagement with International Organizations',
          ],
        },
      ],
    },
    {
      id: 'corporate',
      name: 'Corporate',
      description: 'Ideal for private and insurance companies',
      plans: [
        {
          title: 'Corporate',
          price: '₦200,000 per year',
          audience: 'Ideal for private companies',
          benefits: [
            'Advocacy/Public-Private Engagement project',
            'Networking/High Profile Breakfast Meetings',
            'Access to Finance',
            'Promotion & Brand Visibility',
            'Access to Industry Information for Members Only',
            'Partnership & Engagement with International Organizations',
          ],
        },
      ],
    },
    {
      id: 'multinational',
      name: 'Multinational',
      description: 'Designed for international and cross-border organizations',
      plans: [
        {
          title: 'Global Partner',
          price: '₦750,000 per year',
          audience: 'Ideal for international firms',
          benefits: [
            'Advocacy/Public-Private Engagement project',
            'Networking/High Profile Breakfast Meetings',
            'Access to Finance',
            'Promotion & Brand Visibility',
            'Access to Industry Information for Members Only',
            'Partnership & Engagement with International Organizations',
          ],
        },
      ],
    },
    {
      id: 'diaspora',
      name: 'Diaspora',
      description:
        'For professionals or organizations abroad supporting local development',
      plans: [
        {
          title: 'Diaspora Partner',
          price: '$50 per year',
          audience: 'Ideal for Nigerians in diaspora',
          benefits: [
            'Advocacy/Public-Private Engagement project',
            'Networking/High Profile Breakfast Meetings',
            'Access to Finance',
            'Promotion & Brand Visibility',
            'Access to Industry Information for Members Only',
            'Partnership & Engagement with International Organizations',
          ],
        },
      ],
    },
  ],

  memberDirectory: {
    title: 'Member Directory',
  },
};
