import { getAllBlogPosts } from "$lib/features/blog/server/posts";

export function load() {
  return {
    posts: getAllBlogPosts(),
  };
}
