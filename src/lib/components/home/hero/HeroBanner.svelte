<script lang="ts">
  import SectionBlock from "$lib/components/layout/SectionBlock.svelte";

  type Props = {
    avatarSrc: string;
    avatarAlt: string;
    videoSrc: string;
    videoAlt: string;
  };

  let { avatarSrc, avatarAlt, videoSrc, videoAlt }: Props = $props();
</script>

<SectionBlock>
  <div class="bg-background-inset inset-shadow rounded-lg relative h-54 w-full">
    <div class="absolute inset-1.5 card flex items-start justify-center overflow-hidden rounded-md bg-black pt-0.5">
      <video
        class="hero-video h-full w-full"
        src={videoSrc}
        aria-label={videoAlt}
        autoplay
        muted
        loop
        playsinline
        preload="auto"
      ></video>
    </div>

    <div class="bg-background-inset inset-shadow absolute bottom-0 left-4 z-5 size-32 translate-y-1/2 rounded-full p-1.5">
      <div class="card size-full overflow-hidden rounded-full">
        <img
          class="size-full object-cover object-center"
          src={avatarSrc}
          alt={avatarAlt}
          width="310"
          height="310"
          decoding="async"
          fetchpriority="high"
        />
      </div>
    </div>
  </div>
</SectionBlock>

<style>
  /* Zoom from the top so the mane stays in frame */
  .hero-video {
    object-fit: contain;
    transform: scale(1.1);
    transform-origin: center top;
  }
</style>
