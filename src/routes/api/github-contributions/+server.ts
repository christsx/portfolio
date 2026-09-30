import { getGitHubActivityOverview } from "$lib/features/github/server/activity-overview";
import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";
import { GITHUB_USERNAME, getGitHubContributions } from "$lib/features/github/server/contributions";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, setHeaders, platform }) => {
  setHeaders({
    "cache-control": "public, max-age=0, s-maxage=60",
  });

  const githubToken =
    platform?.env?.GITHUB_TOKEN ?? platform?.env?.PORTFOLIO_TOKEN ?? env.GITHUB_TOKEN ?? env.PORTFOLIO_TOKEN;
  const [githubContributions, githubActivityOverview] = await Promise.all([
    getGitHubContributions(fetch, githubToken),
    getGitHubActivityOverview(fetch),
  ]);
  return json({
    apiConfigured: Boolean(githubToken),
    githubContributions,
    githubActivityOverview,
    githubUsername: GITHUB_USERNAME,
  });
};
