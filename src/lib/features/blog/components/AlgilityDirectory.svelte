<script lang="ts">
  const groups = [
    {
      title: "Official channels",
      links: [
        {
          name: "Algility.com",
          description: "Official website and current services",
          href: "https://www.algility.com/",
        },
        { name: "Algility.us", description: "Official directory of links and profiles", href: "https://algility.us/" },
        { name: "LinkedIn", description: "Algility’s company page", href: "https://www.linkedin.com/company/algility" },
        {
          name: "Instagram",
          description: "Company updates from @algilityai",
          href: "https://www.instagram.com/algilityai/",
        },
        { name: "Book a call", description: "Schedule a conversation with Algility", href: "https://cal.com/algility" },
      ],
    },
    {
      title: "Reviews and company listings",
      links: [
        {
          name: "Clutch",
          description: "Company profile and client reviews",
          href: "https://clutch.co/profile/algility",
        },
        {
          name: "GoodFirms",
          description: "Company listing and service information",
          href: "https://www.goodfirms.co/company/algility",
        },
        {
          name: "The Manifest",
          description: "Agency profile and project information",
          href: "https://themanifest.com/company/algility",
        },
      ],
    },
  ];
</script>

<div class="my-6 space-y-6" aria-label="Algility official links and company profiles">
  {#each groups as group (group.title)}
    <section aria-label={group.title}>
      <h3 class="text-foreground mb-3 text-sm font-medium">{group.title}</h3>
      <ul class="grid list-none gap-2 p-0 sm:grid-cols-2">
        {#each group.links as link (link.href)}
          <li class="m-0 list-none">
            <a
              href={link.href}
              target="_blank"
              rel="external noopener noreferrer"
              class="bg-background-inset hover:bg-background-muted focus-visible:ring-foreground flex h-full items-center justify-between gap-4 rounded-lg border border-current/10 p-4 transition-colors focus-visible:ring-2"
            >
              <span class="min-w-0">
                <span class="text-foreground block font-medium">{link.name}</span>
                <span class="mt-1 block text-xs leading-relaxed">{link.description}</span>
              </span>
              <span aria-hidden="true" class="text-foreground-muted shrink-0">↗</span>
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>
