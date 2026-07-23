import type { ProjectItem } from "../types";

export const projectsData: { title: string; ctaLabel: string; githubCtaLabel: string; items: ProjectItem[] } = {
  title: "Projects",
  ctaLabel: "View project",
  githubCtaLabel: "GitHub",
  items: [
    {
      title: "Algility",
      description: "AI-native systems for sales, growth, and customer acquisition.",
      image: "/images/works/algility.webp",
      href: "https://algility.com/",
    },
    {
      title: "Attoray",
      description: "Kinetic interceptors and terminal guidance for UAS defense.",
      image: "/images/works/attoray.webp",
      href: "https://www.attoray.com/",
    },
    {
      title: "PlayPilot",
      description: "Eligibility insights for student athletes and school compliance.",
      image: "/images/works/playpilot.webp",
      href: "https://playpilot.ai/",
    },
    {
      title: "Fundraisr",
      description: "AI infrastructure layer for fundraising and investor relations.",
      image: "/images/works/fundraisr.webp",
      href: "https://www.fundraisr.ai/",
    },
    {
      title: "8AM World",
      description: "AI powered life accelerator for creative entrepreneurs.",
      image: "/images/works/8am.webp",
      href: "https://8amapp.com/",
    },
    {
      title: "Quevo",
      description: "Pedagogical reasoning engine for schools and inquiry learning.",
      image: "/images/works/quevo.webp",
      href: "https://quevo.ai/",
    },
    {
      title: "Oruco",
      description: "AI operating system for agents, workflows, and dashboards.",
      image: "/images/works/oruco.webp",
      href: "https://oruco.com/",
    },
  ],
};
