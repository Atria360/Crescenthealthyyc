// Central content model for the Healthcare Hub.
// This drives the entire marketing site and will later be editable via the CMS admin.

const LOGOS = {
  pharmasave:
    "https://customer-assets-4nw71qhi.emergentagent.net/job_8d3ec219-8596-4c66-bad8-677f53c921e9/artifacts/rtq43l3p_4_Pharmasave_Primary_Logo_RGB.png",
  crescent:
    "https://customer-assets-4nw71qhi.emergentagent.net/job_8d3ec219-8596-4c66-bad8-677f53c921e9/artifacts/ej2sgj35_Transparent%2BPNG%2B-%2Busable%2Beverywhere.-01-01%2B%282%29%2B%281%29%2B%281%29%20%282%29.png",
  physio:
    "https://customer-assets-4nw71qhi.emergentagent.net/job_8d3ec219-8596-4c66-bad8-677f53c921e9/artifacts/edocribc_physio-horizontal.png",
};

const IMAGES = {
  hero: "https://static.prod-images.emergentagent.com/jobs/8d3ec219-8596-4c66-bad8-677f53c921e9/images/af4c083fd347977db1678e7bf3097a96bf232f26c4d673a2fbd71579f57b20f3.png",
  pharmacy:
    "https://static.prod-images.emergentagent.com/jobs/8d3ec219-8596-4c66-bad8-677f53c921e9/images/d206d16469dc5d67c44748644eeaf6e69d23981ca3bcce3312f7e063265c327c.png",
  clinic:
    "https://static.prod-images.emergentagent.com/jobs/8d3ec219-8596-4c66-bad8-677f53c921e9/images/aab8a605fbe23e2a0b6bb08c86d12fa48bcbea80ff539316e2de62c26d8bed5f.png",
  physio:
    "https://static.prod-images.emergentagent.com/jobs/8d3ec219-8596-4c66-bad8-677f53c921e9/images/e627d3942bc317ffbd7c7253e8ba0fdfb7a2eb9165cde808ac4079816a9fd5f9.png",
};

export const brandColors = {
  pharmasave: "#D31245",
  crescent: "#1B4F9C",
  physio: "#1E3A5F",
};

export const siteContent = {
  brandName: "Crescent Wellness Centre",

  hero: {
    eyebrow: "Pharmacy · Medical Clinic · Physiotherapy",
    titleLines: ["Complete Wellness,", "Under One Roof"],
    subheadline:
      "Pharmacy · Medical Clinic · Physiotherapy — proudly serving Calgary.",
    heroImage: IMAGES.hero,
    pickerPrompt: "What do you need today?",
    picker: [
      {
        key: "pharmasave",
        icon: "pill",
        label: "Prescriptions & everyday health",
        target: "Pharmasave",
      },
      {
        key: "crescent",
        icon: "stethoscope",
        label: "See a doctor",
        target: "Crescent Medical",
      },
      {
        key: "physio",
        icon: "activity",
        label: "Injury, pain & recovery",
        target: "The Physio Studio",
      },
    ],
  },

  brands: [
    {
      key: "pharmasave",
      name: "Pharmasave",
      short: "Pharmasave",
      logo: LOGOS.pharmasave,
      accent: "#D31245",
      surface: "#FDF2F4",
      image: IMAGES.pharmacy,
      imageAlt: "Warm modern pharmacy interior with wooden shelves",
      oneLiner:
        "Your neighbourhood pharmacy — prescriptions and everyday health.",
      badges: ["Free Local Rx Delivery"],
      hours: [
        "Mon–Fri · 9:30 AM – 6:00 PM",
        "Sat · 10:00 AM – 4:00 PM",
        "Sun · Closed",
      ],
      address: "150-909 5 Avenue SW, Calgary, AB",
      phone: "(403) 555-0100",
      phoneRaw: "+14035550100",
      primaryLabel: "Refill a Prescription",
      primaryHref: "#",
      website: "https://pharmasave.com",
      websiteLabel: "Visit Pharmasave website",
      services: [
        "Prescription Refills & Transfers",
        "Blister Packs",
        "Medication Reviews",
        "Vaccinations & Flu Shots",
        "Front Store Essentials",
      ],
      extras: [
        {
          title: "Switching pharmacies?",
          text: "We'll move your prescriptions over in minutes — just bring your current bottle or call us.",
        },
      ],
    },
    {
      key: "crescent",
      name: "Crescent Medical Centre",
      short: "Crescent Medical Centre",
      logo: LOGOS.crescent,
      accent: "#1B4F9C",
      accent2: "#1FA48A",
      gold: "#D4AF37",
      surface: "#F0F7F9",
      image: IMAGES.clinic,
      imageAlt: "Bright modern medical clinic reception in blue and teal tones",
      oneLiner:
        "Family physicians providing comprehensive, compassionate care in downtown Calgary.",
      badges: ["Accepting New Patients", "Walk-Ins Welcome"],
      hours: [
        "Mon–Fri · 8:30 AM – 5:00 PM",
        "Sat · By Appointment",
        "Sun · Closed",
      ],
      address: "150-909 5 Avenue SW, Calgary, AB",
      phone: "(403) 555-0150",
      phoneRaw: "+14035550150",
      primaryLabel: "Book Appointment",
      primaryHref: "#",
      website: "https://crescentmedical.ca",
      websiteLabel: "Visit Crescent website",
      services: [
        "Family Medicine",
        "New Patient Registration",
        "Preventive Care & Checkups",
        "Referrals",
        "Prescription Renewals",
      ],
      extras: [
        {
          title: "What to bring",
          text: "Please bring your Alberta Health Care card to every visit.",
        },
      ],
    },
    {
      key: "physio",
      name: "The Physio Studio",
      short: "The Physio Studio",
      logo: LOGOS.physio,
      accent: "#1E3A5F",
      accent2: "#9BB8A5",
      surface: "#F2F6F4",
      image: IMAGES.physio,
      imageAlt: "Modern physiotherapy studio in navy and sage tones",
      oneLiner:
        "Modern physiotherapy and wellness care to get you moving, pain-free.",
      badges: ["Direct Billing Available", "No Referral Needed"],
      hours: [
        "Mon–Fri · 7:00 AM – 7:00 PM",
        "Sat · 9:00 AM – 2:00 PM",
        "Sun · Closed",
      ],
      address: "150-909 5 Avenue SW, Calgary, AB",
      phone: "(403) 555-0175",
      phoneRaw: "+14035550175",
      primaryLabel: "Book Now",
      primaryHref: "#",
      website: "https://physiostudiohealth.ca",
      websiteLabel: "Visit The Physio Studio website",
      services: [
        "Physiotherapy",
        "Sports Injury Rehab",
        "Post-Surgical Recovery",
        "Chronic Pain Management",
        "Massage Therapy",
      ],
      extras: [
        {
          title: "Your first visit",
          text: "Your initial assessment takes 45–60 minutes and includes a personalized treatment plan.",
        },
        {
          title: "Direct billing",
          text: "We direct-bill most major insurers, including Alberta Blue Cross.",
        },
      ],
    },
  ],

  testimonials: [
    {
      brandKey: "pharmasave",
      brandName: "Pharmasave",
      stars: 5,
      text: "The team went above and beyond to transfer all my prescriptions and set up blister packs for my mom. Genuinely caring service.",
      name: "Sarah M.",
    },
    {
      brandKey: "crescent",
      brandName: "Crescent Medical Centre",
      stars: 5,
      text: "Finally a family doctor who listens. Booking was easy and I never feel rushed during my appointments.",
      name: "David R.",
    },
    {
      brandKey: "physio",
      brandName: "The Physio Studio",
      stars: 5,
      text: "After my knee surgery, their rehab plan had me back on the trails months ahead of schedule. Highly recommend.",
      name: "Priya K.",
    },
  ],

  about: {
    eyebrow: "About the family",
    heading: "Three local practices, one commitment.",
    blurb:
      "Making complete healthcare simple for Calgarians. From filling your prescription to seeing your family doctor to recovering from injury — we work together so your care does too.",
    chapters: [
      {
        no: "01",
        verb: "See",
        brand: "Clinic",
        text: "Family physicians offering comprehensive, compassionate care right in downtown Calgary.",
        color: "#1FA48A",
      },
      {
        no: "02",
        verb: "Fill",
        brand: "Pharmacy",
        text: "Prescriptions, transfers, blister packs and everyday health essentials — all handled.",
        color: "#D31245",
      },
      {
        no: "03",
        verb: "Recover",
        brand: "Physio",
        text: "Modern physiotherapy and wellness care to get you moving — and keep you moving.",
        color: "#9BB8A5",
      },
    ],
  },

  faq: [
    {
      q: "Do you accept walk-ins?",
      a: "Yes — Crescent Medical Centre welcomes walk-ins during opening hours, and you're also welcome to call ahead or book online to reserve a time. Pharmasave and The Physio Studio are happy to see you any time during business hours too.",
    },
    {
      q: "How do I transfer my prescriptions?",
      a: "It takes just a few minutes. Bring your current prescription bottle to Pharmasave or give us a call, and we'll move your prescriptions over from your previous pharmacy for you.",
    },
    {
      q: "Do you offer direct billing for physiotherapy?",
      a: "Yes — The Physio Studio direct-bills most major insurers, including Alberta Blue Cross. Bring your insurance details to your visit and we'll take care of the paperwork.",
    },
    {
      q: "What should I bring to my first visit?",
      a: "For the medical clinic, please bring your Alberta Health Care card. For physiotherapy, your initial assessment takes 45–60 minutes and includes a personalized treatment plan — wear comfortable clothing.",
    },
    {
      q: "Where are you located and is there parking?",
      a: "All three practices share one downtown address: 150-909 5 Avenue SW, Calgary, AB. See the map above for directions and nearby parking options.",
    },
    {
      q: "Do you deliver prescriptions?",
      a: "Yes — Pharmasave offers free local prescription delivery. Just ask our team or request delivery when you refill online.",
    },
  ],

  marquee: ["Crescent Wellness Centre", "Under One Roof", "Calgary · Alberta"],

  footer: {
    tagline: "Independently owned and operated in Calgary, Alberta.",
    legal: "© 2026 Crescent Wellness Centre",
    privacyLabel: "Privacy Policy",
  },
};

export const mapUrl = (address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
