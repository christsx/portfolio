import { getAllBlogPosts } from "$lib/features/blog/server/posts";
import { homepageContent } from "$lib/content/homepage-content";
import { env } from "$env/dynamic/public";
import type { RequestHandler } from "./$types";

type SitemapUrl = {
  loc: string;
  lastmod?: string;
};

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

function toAbsoluteUrl(origin: string, pathname: string): string {
  return new URL(pathname, origin).toString();
}

function normalizeDate(date: string | undefined): string | undefined {
  if (!date) {
    return undefined;
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString();
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export const GET: RequestHandler = async ({ url, setHeaders }) => {
  const origin = resolveOrigin(url.origin);
  const posts = getAllBlogPosts();

  const urls: SitemapUrl[] = [
    { loc: toAbsoluteUrl(origin, "/") },
    { loc: toAbsoluteUrl(origin, "/blog") },
    { loc: toAbsoluteUrl(origin, "/algility") },
    { loc: toAbsoluteUrl(origin, "/llms.txt") },
    ...posts.map((post) => ({
      loc: toAbsoluteUrl(origin, `/blog/${post.slug}`),
      lastmod: normalizeDate(post.date),
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>${
      entry.lastmod
        ? `
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`
        : ""
    }
  </url>`,
  )
  .join("\n")}
</urlset>`;

  setHeaders({
    "cache-control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
  });

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
    },
  });
};
