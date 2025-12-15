<template>
  <div v-if="shouldShowAds" class="ad-banner">
    <adsbygoogle 
      :ad-client="config.public.googleAdsenseId"
      :ad-slot="adSlot"
      :ad-format="adFormat"
      :ad-layout-key="adLayoutKey"
      :style="{ display: 'block' }"
      :data-full-width-responsive="fullWidthResponsive"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  adSlot: string
  adFormat?: string
  adLayoutKey?: string
  fullWidthResponsive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  adFormat: 'auto',
  fullWidthResponsive: true
})

const config = useRuntimeConfig()

const shouldShowAds = computed(() => {
  return config.public.nuxtEnv !== 'development' && config.public.googleAdsenseId
})
</script>

<style scoped>
.ad-banner {
  margin: 1rem 0;
  text-align: center;
}
</style>