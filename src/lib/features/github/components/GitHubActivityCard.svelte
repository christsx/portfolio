<script lang="ts">
  import type { HomepageContent } from "$lib/content/homepage-content";
  import type { GitHubActivityOverview as ActivityOverview } from "../types";
  import { onMount } from "svelte";
  import GitHubContributionGraph from "./GitHubContributionGraph.svelte";
  import GitHubActivityOverview from "./GitHubActivityOverview.svelte";
  import SectionBlock from "$lib/components/layout/SectionBlock.svelte";

  type GitHubContribution = { date: string; count: number };
  type Props = {
    username: string;
    contributions?: GitHubContribution[];
    overview: ActivityOverview | null;
    graphText: HomepageContent["githubCard"]["graphText"];
  };

  let { username, contributions, overview, graphText }: Props = $props();
  let clientContributions = $state<GitHubContribution[]>();
  let clientOverview = $state<ActivityOverview>();
  const contributionData = $derived(clientContributions ?? contributions);
  const overviewData = $derived(clientOverview ?? overview);

  onMount(() => {
    let active = true;
    let controller: AbortController | undefined;
    const loadActivity = async () => {
      if (document.hidden || controller) return;
      controller = new AbortController();
      const timeoutId = setTimeout(() => controller?.abort(), 18000);
      try {
        const response = await fetch("/api/github-contributions", { signal: controller.signal, cache: "no-cache" });
        if (!response.ok || !active) return;
        const payload = (await response.json()) as {
          githubContributions?: GitHubContribution[] | null;
          githubActivityOverview?: ActivityOverview | null;
        };
        if (!active) return;
        if (payload.githubContributions?.length) clientContributions = payload.githubContributions;
        if (payload.githubActivityOverview) clientOverview = payload.githubActivityOverview;
      } catch {
        // Preserve the last successful graph data if a refresh fails.
      } finally {
        clearTimeout(timeoutId);
        controller = undefined;
      }
    };

    if (!contributionData?.length || !overviewData) void loadActivity();
    const intervalId = setInterval(loadActivity, 5 * 60 * 1000);
    document.addEventListener("visibilitychange", loadActivity);
    return () => {
      active = false;
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", loadActivity);
      controller?.abort();
    };
  });
</script>

<SectionBlock>
  <div class="inset-shadow bg-background-inset rounded-lg p-1.5">
    {#if contributionData?.length}
      <GitHubContributionGraph {username} data={contributionData} text={graphText} />
    {:else}
      <p class="text-foreground-muted p-4 text-sm" role="status">
        GitHub activity is temporarily unavailable.
        <a class="underline" href={`https://github.com/${username}`}>View activity on GitHub</a>
      </p>
    {/if}
    <GitHubActivityOverview {username} data={overviewData} />
  </div>
</SectionBlock>
