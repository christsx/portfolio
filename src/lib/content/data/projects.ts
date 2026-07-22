import type { ProjectItem } from "../types";

export const projectsData: { title: string; ctaLabel: string; githubCtaLabel: string; items: ProjectItem[] } = {
  title: "Ventures",
  ctaLabel: "View venture",
  githubCtaLabel: "GitHub",
  items: [
    {
      title: "Algility",
      description: "AI-native systems for sales, growth, and customer acquisition.",
      image: "/images/works/algility.webp",
      href: "https://algility.com/",
    },
  ],
};
