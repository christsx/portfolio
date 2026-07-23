import IconGithub from "carbon-icons-svelte/lib/LogoGithub.svelte";
import IconLinkedin from "carbon-icons-svelte/lib/LogoLinkedin.svelte";
import IconX from "carbon-icons-svelte/lib/LogoX.svelte";
import type { HomeSocialLink } from "../types";

export const socialLinks: HomeSocialLink[] = [
  {
    platform: "X",
    handle: "@garciatsx",
    href: "https://x.com/garciatsx",
    icon: IconX,
  },
  {
    platform: "GitHub",
    handle: "@christsx",
    href: "https://github.com/christsx",
    icon: IconGithub,
  },
  {
    platform: "LinkedIn",
    handle: "christiangarcia0",
    href: "https://www.linkedin.com/in/christiangarcia0/",
    icon: IconLinkedin,
  },
];
