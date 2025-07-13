<template>
  <div>
    <Carousel />
    <!-- <BannerGrid /> -->
    <ChatBot />
    <BannerType />
    <SideBlog />
    <Random />
  </div>
</template>

<script>
  import Carousel from "@/components/Carousel";
  import ChatBot from "@/components/ChatBot";
  import Random from "@/components/Random";
  import SideBlog from "@/components/Blog/Side";
  // import BannerGrid from "@/components/Banner/BannerGrid.vue";
  import BannerType from "@/components/Banner/BannerType.vue";
  export default {
    components: {
      Carousel,
      // BannerGrid,
      BannerType,
      SideBlog,
      Random,
      ChatBot,
    },
  };
</script>
