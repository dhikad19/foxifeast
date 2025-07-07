<template>
  <div>
    <BannerGrid />
    <Random />
    <BannerType />
  </div>
</template>

<script>
  import Random from "@/components/Random";
  import BannerGrid from "@/components/Banner/BannerGrid.vue";
  import BannerType from "@/components/Banner/BannerType.vue";
  export default {
    components: {
      BannerGrid,
      BannerType,
      Random,
    },
  };
</script>
