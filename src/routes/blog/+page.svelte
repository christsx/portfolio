<script lang="ts">
  import BlogSection from "$lib/components/home/sections/BlogSection.svelte";
  import FooterSection from "$lib/components/home/sections/FooterSection.svelte";
  import Separator from "$lib/components/ui/Separator.svelte";
  import { homepageContent } from "$lib/content/homepage-content";
  import { buildSeoMeta } from "$lib/seo/meta";
  import { page } from "$app/state";

  type Props = {
    data: {
      posts: {
        slug: string;
        title: string;
        description: string;
        date: string;
        tags: string[];
        published: boolean;
      }[];
    };
  };

  let { data }: Props = $props();

  const seo = $derived(
    buildSeoMeta({
      title: "Blog | Christian Garcia",
      description: "Short notes on building Algility, hiring, partnerships, and shipping systems.",
      path: "/blog",
      currentUrl: page.url,
    }),
  );
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
</svelte:head>

<div class="w-full p-4">
  <a
    href="/"
    class="text-foreground-muted hover:text-foreground inline-flex items-center gap-1.5 text-xs leading-none font-medium duration-150 ease-out"
    aria-label="Back to home"
  >
    ← Back to home
  </a>
</div>

<Separator class="mb-2" />

<div class="w-full px-4 pb-4">
  <BlogSection
    posts={data.posts}
    title={homepageContent.blog.title}
    emptyStateLabel={homepageContent.blog.emptyStateLabel}
    readArticleLabel={homepageContent.blog.readArticleLabel}
  />
</div>

<Separator class="my-4" />

<FooterSection
  headline={homepageContent.footer.headline}
  description={homepageContent.footer.description}
  socialLinks={homepageContent.footer.socialLinks}
  copyrightName={homepageContent.footer.copyrightName}
  copyrightSuffix={homepageContent.footer.copyrightSuffix}
/>
