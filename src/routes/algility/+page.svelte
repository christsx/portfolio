<script lang="ts">
  import { page } from "$app/state";
  import FooterSection from "$lib/components/home/sections/FooterSection.svelte";
  import Separator from "$lib/components/ui/Separator.svelte";
  import { homepageContent } from "$lib/content/homepage-content";
  import { buildOrganizationJsonLd, buildPersonJsonLd, buildSeoMeta, toJsonLdScript } from "$lib/seo/meta";

  const seo = $derived(
    buildSeoMeta({
      title: "Algility | Founded by Christian Garcia",
      description:
        "Algility is an AI-native growth company founded by Christian Garcia. We build and deploy systems for sales, growth, and customer acquisition.",
      path: "/algility",
      currentUrl: page.url,
      keywords: [
        "Algility",
        "Algility AI",
        "Christian Garcia Algility",
        "AI-native growth",
        "AI sales systems",
        "SMB automation",
      ],
    }),
  );

  const organizationJsonLdScript = $derived(toJsonLdScript(buildOrganizationJsonLd(page.url)));
  const personJsonLdScript = $derived(toJsonLdScript(buildPersonJsonLd(page.url)));
</script>

<svelte:head>
  <title>{seo.title}</title>
  <link rel="canonical" href={seo.canonicalUrl} />
  {#each seo.metaTags as tag, index (`${tag.name ?? tag.property ?? "meta"}-${index}-${tag.content}`)}
    {#if tag.name}
      <meta name={tag.name} content={tag.content} />
    {:else if tag.property}
      <meta property={tag.property} content={tag.content} />
    {/if}
  {/each}
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html organizationJsonLdScript}
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html personJsonLdScript}
</svelte:head>

<div class="w-full p-4">
  <a
    href="/"
    class="text-foreground-muted hover:text-foreground inline-flex items-center gap-1.5 text-xs leading-none font-medium duration-150 ease-out"
  >
    ← Back to home
  </a>

  <Separator class="my-4" />

  <article class="text-foreground-muted space-y-4 text-sm leading-relaxed">
    <p class="text-foreground-muted text-xs tracking-wide uppercase">Company</p>
    <h1 class="text-foreground text-2xl leading-tight font-medium">Algility</h1>
    <p class="text-foreground text-base">
      AI-native systems for sales, growth, and customer acquisition.
    </p>

    <p>
      Algility was founded in 2024 by <strong class="text-foreground">Christian Garcia</strong>.
      The company builds and deploys AI-native systems for SMBs and enterprises — not another
      dashboard, the operating layer that connects the tools teams already pay for.
    </p>

    <p>
      Core work: sales systems, growth systems, customer acquisition workflows. Stack includes CRM,
      inbox, Airtable, Zapier, OpenAI, Claude, and custom automation.
    </p>

    <p>
      Official site:
      <a class="text-foreground underline underline-offset-2" href="https://algility.com/" rel="external noreferrer noopener"
        >algility.com</a
      >
    </p>

    <p>
      Full Stack Developer:
      <a class="text-foreground underline underline-offset-2" href="/">Christian Garcia</a>
      ·
      <a
        class="text-foreground underline underline-offset-2"
        href="https://www.linkedin.com/company/algility"
        rel="external noreferrer noopener">Algility on LinkedIn</a
      >
    </p>
  </article>
</div>

<Separator class="my-4" />

<FooterSection
  headline={homepageContent.footer.headline}
  description={homepageContent.footer.description}
  socialLinks={homepageContent.footer.socialLinks}
  copyrightName={homepageContent.footer.copyrightName}
  copyrightSuffix={homepageContent.footer.copyrightSuffix}
/>
