































































































export const contactPageSchema = {
  hero: {
    badgeText: 'Connect With Us',

    headline: {
      line1: 'Get in touch with',
      line2: 'HFN Nigeria',
    },

    subheadline:
      'Healthcare Federation of Nigeria (HFN) welcomes enquiries from members, partners, policymakers, development organisations, media, and individuals interested in engaging with our work.',

    responseNote: 'Our team typically responds within 24 hours.',

    image: {
      src: 'globe.png',
      alt: 'Global connectivity',
    },

    backgroundColor: 'bg-[#F2F9F3]',
  },

  form: {
    title: 'Contact Us',
    description:
      'Whether you are seeking information about membership, partnerships, events, advocacy, or general enquiries, our team is available to assist.',

    fields: [
      { id: 'name', label: 'Name', type: 'text', placeholder: 'Enter name', required: true },
      { id: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter email', required: true },
      { id: 'subject', label: 'Subject', type: 'text', placeholder: 'Enter subject', required: true },
      { id: 'message', label: 'Message', type: 'textarea', placeholder: 'Write your message...', rows: 5, required: true },
    ],

    submitButtonText: 'Send Message',
    successMessage:
      'Thank you for reaching out. Our team will get back to you within 24 hours.',
  },

  contactDetails: {
    address: {
      text: '109, Awolowo Road, Ikoyi, Opposite Standard Chartered Bank, Lagos.',
      googleMapsUrl:
        'https://maps.google.com/maps?q=109+Awolowo+Road,+Ikoyi,+Lagos,+Nigeria',
    },

    emails: [
      { label: 'General Inquiries', address: 'info@hfnigeria.com' },
    ],

    phone: '+234 803 975 3274',

    socialMedia: [
      { platform: 'Facebook', url: 'https://www.facebook.com/hfnigeria', icon: 'fab fa-square-facebook' },
      { platform: 'Instagram', url: 'https://www.instagram.com/hfn_nigeria', icon: 'fab fa-square-instagram' },
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/healthcare-federation-of-nigeria-hfn/posts/?feedView=all', icon: 'fa-brands fa-linkedin' },
      { platform: 'Twitter/X', url: 'https://x.com/hfn_nigeria', icon: 'fab fa-square-x-twitter' },
    ],
  },

  map: {
    iframeUrl:
      'https://maps.google.com/maps?q=109+Awolowo+Road,+Ikoyi,+Lagos,+Nigeria&t=&z=15&ie=UTF8&iwloc=&output=embed',
    height: 500,
    borderWeight: 4,
    borderColor: 'border-green-200',
  },
};