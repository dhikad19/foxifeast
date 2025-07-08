<template>
  <div>
    <Carousel />
    <!-- <BannerGrid /> -->
    <Random />
    <BannerType />
    <ChatBot />
  </div>
</template>

<script>
  import Carousel from "@/components/Carousel"
  import ChatBot from "@/components/ChatBot/Float";
  import Random from "@/components/Random";
  // import BannerGrid from "@/components/Banner/BannerGrid.vue";
  import BannerType from "@/components/Banner/BannerType.vue";
  export default {
    components: {
      Carousel,
      // BannerGrid,
      BannerType,
      Random,
      ChatBot,
    },
  };
</script>
