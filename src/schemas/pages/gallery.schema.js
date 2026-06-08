export const galleryPageSchema = {
    hero: {
      titleLine1: "Event Gallery",
      titleLine2: "Relive Our Moments",
      description: "Explore the highlights of our past conferences, workshops, and community engagements. Witness the impact and the vibrant energy of our network in action.",
      image: "latest_news.png",
      backgroundColor: "#E87A1814"
    },

    filtering: {
      title: "Filter Memories",
      years: ["2026", "2025", "2024"],
      categories: [
        "Conferences", 
        "Workshops", 
        "Community Outreaches", 
        "Webinar", 
        "Gala"
      ]
    },

    galleryList: {
      items: [],
      hasMore: true,
      nextCursor: 2
    }
};
