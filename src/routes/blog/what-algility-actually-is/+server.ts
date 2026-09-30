import { redirect } from "@sveltejs/kit";

export const GET = () => {
  redirect(301, "/blog/algility-official-links-and-profiles");
};
