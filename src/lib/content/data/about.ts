import type { AboutListItem } from "../types";

export const aboutData: { title: string; items: AboutListItem[] } = {
  title: "About",
  items: [
    {
      content: [
        { type: "highlight", text: "Developer, Founder & Investor" },
        {
          type: "text",
          text: " with 4+ years of full-stack experience, known for passion for design and strong attention to small details.",
        },
      ],
    },
    {
      content: [
        { type: "text", text: "Skilled in " },
        { type: "highlight", text: "React" },
        { type: "text", text: ", " },
        { type: "highlight", text: "TypeScript" },
        { type: "text", text: ", " },
        { type: "highlight", text: "Svelte" },
        { type: "text", text: ", and " },
        { type: "highlight", text: "modern shading languages" },
        { type: "text", text: "; building high-quality web applications." },
      ],
    },
    {
      content: [
        { type: "text", text: "Open-source contributor to " },
        { type: "link", text: "opencode", href: "https://github.com/anomalyco/opencode" },
        {
          type: "text",
          text: ", a widely-used open source AI coding agent (",
        },
        { type: "highlight", text: "185k+ stars" },
        { type: "text", text: ")." },
      ],
    },
    {
      content: [
        { type: "text", text: "Open-source contributor to " },
        { type: "link", text: "Raycast Extensions", href: "https://github.com/raycast/extensions" },
        {
          type: "text",
          text: ", the community extension ecosystem for the Raycast productivity launcher.",
        },
      ],
    },
  ],
};
