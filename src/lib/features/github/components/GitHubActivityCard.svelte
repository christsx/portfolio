<script lang="ts" module>
  type GitHubContributionCache = {
    date: string;
    count: number;
  };

  let cachedClientContributions: GitHubContributionCache[] | undefined;

  function getCachedClientContributions(): GitHubContributionCache[] | undefined {
    return cachedClientContributions;
  }

  function setCachedClientContributions(value: GitHubContributionCache[]): void {
    cachedClientContributions = value;
  }
</script>

<script lang="ts">
  import type { HomepageContent } from "$lib/content/homepage-content";
  import { onMount } from "svelte";
  import GitHubContributionGraph from "./GitHubContributionGraph.svelte";
  import SectionBlock from "$lib/components/layout/SectionBlock.svelte";

  type GitHubContribution = {
    date: string;
    count: number;
  };

  type Props = {
    username: string;
    contributions?: GitHubContribution[];
    graphText: HomepageContent["githubCard"]["graphText"];
  };

  let { username, contributions = undefined, graphText }: Props = $props();

  let clientContributions = $state<GitHubContribution[] | undefined>(getCachedClientContributions());
  const contributionData = $derived(contributions && contributions.length > 0 ? contributions : clientContributions);

  $effect(() => {
    if (contributions && contributions.length > 0) {
      setCachedClientContributions(contributions);
    }
  });

  onMount(() => {
    if (contributionData && contributionData.length > 0) {
      return;
    }

    let active = true;

    const loadContributions = async () => {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 18000);

      try {
        const response = await fetch("/api/github-contributions", { signal: abortController.signal });
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as {
          githubContributions?: GitHubContribution[] | null;
        };

        if (!active || !payload.githubContributions) {
          return;
        }

        clientContributions = payload.githubContributions;
        setCachedClientContributions(payload.githubContributions);
      } catch {
        // Keep current fallback graph state on fetch errors.
      } finally {
        clearTimeout(timeoutId);
      }
    };

    void loadContributions();

    return () => {
      active = false;
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
  </div>
</SectionBlock>
