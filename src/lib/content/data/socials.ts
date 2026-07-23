import IconGithub from "carbon-icons-svelte/lib/LogoGithub.svelte";
import IconLinkedin from "carbon-icons-svelte/lib/LogoLinkedin.svelte";
import IconX from "carbon-icons-svelte/lib/LogoX.svelte";
// import IconFile from "carbon-icons-svelte/lib/Document.svelte";
import type { HomeSocialLink } from "../types";

export const socialLinks: HomeSocialLink[] = [
  {
    platform: "GitHub",
    handle: "@christsx",
    href: "https://github.com/christsx",
    icon: IconGithub,
  },
  {
    platform: "LinkedIn",
    handle: "",
    href: "https://www.linkedin.com/in/christiangarcia0/",
    icon: IconLinkedin,
  },
  {
    platform: "X",
    handle: "@garciatsx",
    href: "https://x.com/garciatsx",
    icon: IconX,
  },
  // {
  //   platform: "Resume",
  //   handle: "",
  //   href: "/resume.pdf",
  //   icon: IconFile,
  // },
];
