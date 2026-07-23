import { socialLinks } from "./socials";
import type { HomepageContent } from "../types";

export const footerData: Pick<HomepageContent, "footer"> = {
  footer: {
    headline: "Let's build something useful.",
    description: "Building Algility. Open to the right problems.",
    socialLinks: socialLinks,
    copyrightName: "Christian Garcia",
    copyrightSuffix: "",
  },
};
