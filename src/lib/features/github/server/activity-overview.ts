import { GITHUB_USERNAME } from "./contributions";
import type { GitHubActivityOverview } from "../types";

const CACHE_TTL_MS = 5 * 60 * 1000;
let cache: { data: GitHubActivityOverview | null; expiresAt: number } | undefined;
let inFlight: Promise<GitHubActivityOverview | null> | undefined;

export function parseActivityOverview(html: string): GitHubActivityOverview | null {
  const attribute = html.match(/data-percentages="([^"]+)"/)?.[1];
  if (!attribute) return null;

  try {
    const data = JSON.parse(attribute.replaceAll("&quot;", '"'));
    const values = [data.Commits, data["Pull requests"], data.Issues, data["Code review"]];
    if (!values.every((value) => typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100)) {
      return null;
    }
    const total = values.reduce((sum, value) => sum + value, 0);
    // GitHub rounds each percentage independently; empty accounts can total zero.
    if (total !== 0 && Math.abs(total - 100) > 2) return null;
    return { commits: values[0], pullRequests: values[1], issues: values[2], codeReview: values[3] };
  } catch {
    return null;
  }
}

export async function getGitHubActivityOverview(fetchFn: typeof fetch): Promise<GitHubActivityOverview | null> {
  if (cache && Date.now() < cache.expiresAt) return cache.data;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    let data: GitHubActivityOverview | null = null;
    try {
      const query = new URLSearchParams({
        action: "show",
        controller: "profiles",
        tab: "contributions",
        user_id: GITHUB_USERNAME,
      });
      const response = await fetchFn(`https://github.com/${encodeURIComponent(GITHUB_USERNAME)}?${query}`, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Accept: "text/html",
          "Accept-Language": "en-US",
          "User-Agent": "portfolio",
        },
        signal: AbortSignal.timeout(8000),
      });
      if (response.ok) data = parseActivityOverview(await response.text());
    } catch {
      // Keep the last successful breakdown through a temporary upstream outage.
    }
    cache = { data: data ?? cache?.data ?? null, expiresAt: Date.now() + (data ? CACHE_TTL_MS : 30_000) };
    return cache.data;
  })().finally(() => {
    inFlight = undefined;
  });

  return inFlight;
}
