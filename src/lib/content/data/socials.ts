import IconGithub from "carbon-icons-svelte/lib/LogoGithub.svelte";
import IconLinkedin from "carbon-icons-svelte/lib/LogoLinkedin.svelte";
import IconCursor from "$lib/components/icons/IconCursor.svelte";
import type { HomeSocialLink } from "../types";

export const socialLinks: HomeSocialLink[] = [
  {
    platform: "GitHub",
    handle: "@christsx",
    href: "https://github.com/christsx",
    icon: IconGithub,
  },
  {
    platform: "Cursor",
    handle: "@christiangarcia",
    href: "https://cursor.com/@christiangarcia",
    icon: IconCursor,
  },
  {
    platform: "LinkedIn",
    handle: "christiangarcia0",
    href: "https://www.linkedin.com/in/christiangarcia0/",
    icon: IconLinkedin,
  },
];
