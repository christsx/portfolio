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
    <div class="absolute inset-1.5 card flex items-center justify-center overflow-hidden rounded-md bg-black">
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
          class="hero-avatar size-full object-cover"
          src={avatarSrc}
          alt={avatarAlt}
          width="1080"
          height="1350"
          decoding="async"
          fetchpriority="high"
        />
      </div>
    </div>
  </div>
</SectionBlock>

<style>
  /* Fit the full horse, slight zoom, keep mane clear of the top edge */
  .hero-video {
    object-fit: contain;
    object-position: center 42%;
    transform: scale(1.06);
    transform-origin: center center;
  }

  /* Face crop from full-res photo (avoids blurry upscaled bake) */
  .hero-avatar {
    object-position: 48% 40%;
    transform: scale(2.75);
    transform-origin: 48% 40%;
  }
</style>
