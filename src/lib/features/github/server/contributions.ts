import { githubData } from "$lib/content/data/github";

type ContributionCalendar = {
  totalContributions?: number;
  weeks?: Array<{
    contributionDays?: Array<{
      contributionCount?: number;
      date?: string;
    }>;
  }>;
};

type GitHubGraphQLResponse = {
  data?: {
    viewer?: {
      login?: string;
      contributionsCollection?: {
        totalCommitContributions?: number;
        totalIssueContributions?: number;
        totalPullRequestContributions?: number;
        totalPullRequestReviewContributions?: number;
        restrictedContributionsCount?: number;
        contributionCalendar?: ContributionCalendar;
      };
    };
    user?: {
      contributionsCollection?: {
        contributionCalendar?: ContributionCalendar;
      };
    };
  };
  errors?: Array<{ message?: string }>;
};

export type GitHubContribution = {
  date: string;
  count: number;
};

const DEFAULT_GITHUB_USERNAME = "github";

export const GITHUB_USERNAME =
  githubData.githubCard.username.trim().length > 0 ? githubData.githubCard.username.trim() : DEFAULT_GITHUB_USERNAME;

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const GRAPH_DAYS = 365;
const GITHUB_TIMEOUT_MS = 8000;
const GITHUB_CACHE_TTL_MS = 5 * 60 * 1000;
const IN_FLIGHT_STALE_MS = 10 * 1000;

// Prefer viewer so private contributions are included for the authenticated account.
const viewerContributionsQuery = `
query Contributions($from: DateTime!, $to: DateTime!) {
  viewer {
    login
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalIssueContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}
`;

const userContributionsQuery = `
query Contributions($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}
`;

let cache: {
  expiresAt: number;
  data: GitHubContribution[] | null;
} | null = null;

let inFlight: Promise<GitHubContribution[] | null> | null = null;
let inFlightStartedAt = 0;

function hasFreshCache(): boolean {
  return Boolean(cache && Date.now() < cache.expiresAt);
}

function buildRequestRange() {
  const to = new Date();
  const from = new Date(to);
  from.setUTCDate(to.getUTCDate() - (GRAPH_DAYS - 1));
  from.setUTCHours(0, 0, 0, 0);
  return { from, to };
}

function calendarToContributions(calendar: ContributionCalendar | undefined): GitHubContribution[] | null {
  const weeks = calendar?.weeks ?? [];
  const contributions = weeks
    .flatMap((week) => week.contributionDays ?? [])
    .map((day) => ({
      date: day.date ?? "",
      count: Math.max(0, day.contributionCount ?? 0),
    }))
    .filter((day) => day.date.length > 0);

  return contributions.length > 0 ? contributions : null;
}

async function requestGitHubContributions(fetchFn: typeof fetch, token: string): Promise<GitHubContribution[] | null> {
  const { from, to } = buildRequestRange();
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), GITHUB_TIMEOUT_MS);

  try {
    const response = await fetchFn(GITHUB_GRAPHQL_URL, {
      method: "POST",
      signal: abortController.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "portfolio",
      },
      body: JSON.stringify({
        query: viewerContributionsQuery,
        variables: {
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
    });

    if (!response.ok) {
      console.error("[github] HTTP error:", response.status);
      return null;
    }

    const payload = (await response.json()) as GitHubGraphQLResponse;

    if (payload.errors?.length) {
      console.error("[github] GraphQL errors:", payload.errors.map((e) => e.message).join("; "));
      return null;
    }

    const viewerLogin = payload.data?.viewer?.login?.trim().toLowerCase();
    const expectedLogin = GITHUB_USERNAME.toLowerCase();

    // If the token belongs to someone else, fall back to public user calendar.
    if (viewerLogin && viewerLogin !== expectedLogin) {
      console.warn(
        `[github] Token viewer (${viewerLogin}) != portfolio username (${expectedLogin}); using public user calendar.`,
      );
      return requestPublicUserContributions(fetchFn, token, from, to);
    }

    const collection = payload.data?.viewer?.contributionsCollection;
    const calendar = collection?.contributionCalendar;
    const total = calendar?.totalContributions ?? 0;
    console.info(
      `[github] Loaded ${total} contributions for ${viewerLogin ?? expectedLogin}` +
        ` (commits=${collection?.totalCommitContributions ?? 0}` +
        `, prs=${collection?.totalPullRequestContributions ?? 0}` +
        `, reviews=${collection?.totalPullRequestReviewContributions ?? 0}` +
        `, issues=${collection?.totalIssueContributions ?? 0}` +
        `, restricted=${collection?.restrictedContributionsCount ?? 0})`,
    );
    return calendarToContributions(calendar);
  } catch (error) {
    console.error("[github] Fetch failed:", error);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function requestPublicUserContributions(
  fetchFn: typeof fetch,
  token: string,
  from: Date,
  to: Date,
): Promise<GitHubContribution[] | null> {
  const response = await fetchFn(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "portfolio",
    },
    body: JSON.stringify({
      query: userContributionsQuery,
      variables: {
        login: GITHUB_USERNAME,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as GitHubGraphQLResponse;
  if (payload.errors?.length) {
    console.error("[github] GraphQL errors:", payload.errors.map((e) => e.message).join("; "));
    return null;
  }

  return calendarToContributions(payload.data?.user?.contributionsCollection?.contributionCalendar);
}

function startRefresh(fetchFn: typeof fetch, token: string): Promise<GitHubContribution[] | null> {
  if (inFlight && Date.now() - inFlightStartedAt < IN_FLIGHT_STALE_MS) {
    return inFlight;
  }

  if (inFlight) {
    inFlight = null;
    inFlightStartedAt = 0;
  }

  inFlightStartedAt = Date.now();

  inFlight = Promise.race([
    requestGitHubContributions(fetchFn, token),
    new Promise<GitHubContribution[] | null>((resolve) => {
      setTimeout(() => resolve(null), GITHUB_TIMEOUT_MS + 400);
    }),
  ])
    .then((data) => {
      cache = {
        data,
        expiresAt: Date.now() + GITHUB_CACHE_TTL_MS,
      };
      return data;
    })
    .finally(() => {
      inFlight = null;
      inFlightStartedAt = 0;
    });

  return inFlight;
}

export function getCachedGitHubContributions(): GitHubContribution[] | null {
  return cache?.data ?? null;
}

export function warmGitHubContributions(fetchFn: typeof fetch, token: string | undefined): void {
  if (!token || hasFreshCache()) {
    return;
  }

  void startRefresh(fetchFn, token);
}

export async function getGitHubContributions(
  fetchFn: typeof fetch,
  token: string | undefined,
): Promise<GitHubContribution[] | null> {
  if (!token) {
    return null;
  }

  if (hasFreshCache()) {
    return cache?.data ?? null;
  }

  return startRefresh(fetchFn, token);
}

/** Clear in-memory cache (e.g. after token/username changes in dev). */
export function clearGitHubContributionsCache(): void {
  cache = null;
  inFlight = null;
  inFlightStartedAt = 0;
}
