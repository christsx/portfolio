import { homepageContent } from "$lib/content/homepage-content";
import { env } from "$env/dynamic/public";
import type { RequestHandler } from "./$types";

const directives = ["User-agent: *", "Allow: /", "Disallow: /blog/raw/"];

function resolveOrigin(requestOrigin: string): string {
  const configured = env.PUBLIC_SITE_URL?.trim();
  if (configured) {
    return new URL(configured).origin;
  }

  if (requestOrigin && !requestOrigin.includes("localhost")) {
    return requestOrigin;
  }

  const fallback = homepageContent.site.siteUrl;
  if (fallback && !fallback.includes("localhost")) {
    return new URL(fallback).origin;
  }

  return requestOrigin;
}

export const GET: RequestHandler = ({ url }) => {
  const origin = resolveOrigin(url.origin);
  const lines = [...directives, `Sitemap: ${new URL("/sitemap.xml", origin).toString()}`];
  const body = lines.join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
};
