import type { HomepageContent } from "../types";

export const siteData: Pick<HomepageContent, "site" | "seo" | "header"> = {
  site: {
    siteName: "Christian Garcia",
    siteUrl: "https://www.christiangarcia.xyz",
    locale: "en_US",
    twitterHandle: "@garciatsx",
    defaultOgImage: "/og-image.jpg",
    defaultOgImageAlt: "Christian Garcia, founder of Algility",
    jobTitle: "Founder of Algility",
    sameAsLinks: [
      "https://github.com/christsx",
      "https://cursor.com/@christiangarcia",
      "https://www.linkedin.com/in/christiangarcia0/",
      "https://algility.com/",

      "https://www.linkedin.com/company/algility",
    ],
  },
  seo: {
    title: "Christian Garcia | Founder of Algility",
    description:
      "Christian Garcia is the founder of Algility — AI-native systems for sales, growth, and customer acquisition for SMBs and enterprises.",
    imageAlt: "Christian Garcia, founder of Algility",
    keywords: [
      "Christian Garcia",
      "Algility",
      "Algility founder",
      "AI-native growth",
      "AI sales systems",
      "Founder",
      "Portfolio",
    ],
  },
  header: {
    h1: "Christian Garcia - Founder of Algility",
  },
};
