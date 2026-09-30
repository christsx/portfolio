<script lang="ts">
  import type { GitHubActivityOverview } from "../types";

  let { data, username }: { data: GitHubActivityOverview | null; username: string } = $props();
  const summary = $derived(
    data
      ? `${data.commits}% commits, ${data.pullRequests}% pull requests, ${data.issues}% issues, ${data.codeReview}% code reviews in the last year.`
      : "GitHub activity breakdown is temporarily unavailable.",
  );
  const points = $derived(
    data
      ? [
          [200, 130 - data.codeReview * 0.9],
          [200 + data.issues * 0.9, 130],
          [200, 130 + data.pullRequests * 0.9],
          [200 - data.commits * 0.9, 130],
        ]
      : [],
  );
</script>

<div class="bg-background card mt-1.5 rounded-md p-4">
  <div class="flex items-center justify-between gap-3">
    <h2 class="text-sm font-medium">Activity overview</h2>
    <a class="text-foreground-muted text-xs underline-offset-4 hover:underline" href={`https://github.com/${username}`}
      >View on GitHub</a
    >
  </div>
  {#if data}
    <p class="text-foreground-muted mt-1 text-xs">Contribution breakdown · Last year</p>
    <svg viewBox="0 0 400 260" class="mx-auto block w-full max-w-md" role="img" aria-label={summary}>
      <title>{summary}</title>
      <g class="text-green-500" stroke="currentColor">
        <path d="M200 40V220M110 130H290" stroke-width="1.5" stroke-opacity="0.35" />
        <polygon
          points={points.map((point) => point.join(",")).join(" ")}
          fill="currentColor"
          fill-opacity="0.25"
          stroke-width="2"
          stroke-linejoin="round"
        />
        {#each points as point, index (index)}
          <circle cx={point[0]} cy={point[1]} r="3" fill="currentColor" stroke-width="0" />
        {/each}
      </g>
      <g fill="currentColor" text-anchor="middle" class="text-foreground-muted text-xs">
        <text x="200" y="18"
          ><tspan class="text-foreground font-medium">{data.codeReview}%</tspan><tspan x="200" dy="16"
            >Code review</tspan
          ></text
        >
        <text x="302" y="126" text-anchor="start"
          ><tspan class="text-foreground font-medium">{data.issues}%</tspan><tspan x="302" dy="16">Issues</tspan></text
        >
        <text x="200" y="238"
          ><tspan class="text-foreground font-medium">{data.pullRequests}%</tspan><tspan x="200" dy="16"
            >Pull requests</tspan
          ></text
        >
        <text x="98" y="126" text-anchor="end"
          ><tspan class="text-foreground font-medium">{data.commits}%</tspan><tspan x="98" dy="16">Commits</tspan></text
        >
      </g>
    </svg>
  {:else}
    <p class="text-foreground-muted mt-3 text-sm" role="status">{summary}</p>
  {/if}
</div>
