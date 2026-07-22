import type { HomepageContent } from "../types";

export const siteData: Pick<HomepageContent, "site" | "seo" | "header"> = {
  site: {
    siteName: "Christian Garcia",
    siteUrl: "https://madebyhex.com",
    locale: "en_US",
    twitterHandle: "@christsx",
    defaultOgImage: "/og-image.jpg",
    defaultOgImageAlt: "Christian Garcia portfolio banner",
    jobTitle: "Developer, Founder & Investor",
    sameAsLinks: [
      "https://github.com/christsx",
      "https://www.linkedin.com/in/christiangarcia0/",
      "https://x.com/christsx",
    ],
  },
  seo: {
    title: "Christian Garcia | Developer, Founder & Investor",
    description:
      "Portfolio of Christian Garcia — developer, founder, and investor building products and backing the next wave of startups.",
    imageAlt: "Open Graph Image for Christian Garcia's Portfolio",
    keywords: [
      "Christian Garcia",
      "Developer",
      "Founder",
      "Investor",
      "Builder",
      "Startup",
      "Portfolio",
    ],
  },
  header: {
    h1: "Christian Garcia - Developer, Founder & Investor portfolio",
  },
};
