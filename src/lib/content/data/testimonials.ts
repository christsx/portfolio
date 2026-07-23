import type { TweetData } from "../types";

/** Most recent first — names/avatars from https://www.untitledui.com/resources/avatars */
export const testimonialTweets: TweetData[] = [
  {
    id_str: "t1",
    text: "@garciatsx Yo, that's sick. 🔥🔥",
    user: {
      id_str: "u1",
      name: "Olivia Rhye",
      screen_name: "oliviarhye",
      profile_image_url_https: "/images/avatars/olivia-rhye.webp",
      verified: false,
      is_blue_verified: true,
    },
  },
  {
    id_str: "t2",
    text: "That looks so gooood!",
    user: {
      id_str: "u2",
      name: "Phoenix Baker",
      screen_name: "phoenixbaker",
      profile_image_url_https: "/images/avatars/phoenix-baker.webp",
      verified: false,
      is_blue_verified: true,
    },
  },
  {
    id_str: "t3",
    text: "I love what you’re building man",
    user: {
      id_str: "u3",
      name: "Candice Wu",
      screen_name: "candicewu",
      profile_image_url_https: "/images/avatars/candice-wu.webp",
      verified: false,
      is_blue_verified: false,
    },
  },
  {
    id_str: "t4",
    text: "It’s looking very nice Christian! 👌",
    user: {
      id_str: "u4",
      name: "Drew Cano",
      screen_name: "drewcano",
      profile_image_url_https: "/images/avatars/drew-cano.webp",
      verified: false,
      is_blue_verified: true,
    },
  },
  {
    id_str: "t5",
    text: "niiiiice",
    user: {
      id_str: "u5",
      name: "Natali Craig",
      screen_name: "natalicraig",
      profile_image_url_https: "/images/avatars/natali-craig.webp",
      verified: false,
      is_blue_verified: false,
    },
  },
  {
    id_str: "t6",
    text: "ok this is actually crazy",
    user: {
      id_str: "u6",
      name: "Koray Okumus",
      screen_name: "korayokumus",
      profile_image_url_https: "/images/avatars/koray-okumus.webp",
      verified: false,
      is_blue_verified: false,
    },
  },
];

export const testimonialsData = {
  title: "What people say",
  /** Empty = skip live X prefetch; content comes from `testimonialTweets`. */
  tweetIds: [] as string[],
  items: testimonialTweets,
};
