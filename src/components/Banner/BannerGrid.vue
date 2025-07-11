<template>
  <v-row class="mt-6" :dense="$vuetify.display.smAndDown">
    <v-col cols="12">
      <p style="font-weight: bold;" :style="$vuetify.display.smAndDown ? 'font-size: 20px' : 'font-size: 25px'">Meal Type</p>
    </v-col>
    <v-col :cols="$vuetify.display.smAndDown ? 6 : 6">
      <v-img src="/assets/banner/soup.png"></v-img>
      <p :class="$vuetify.display.smAndDown ? 'title-mobile' : 'title'">Easy and Delicious Homemade Soups</p>
    </v-col>
    <v-col :cols="$vuetify.display.smAndDown ? 6 : 6">
      <v-img src="/assets/banner/fried-rice.png"> </v-img>
      <p :class="$vuetify.display.smAndDown ? 'title-mobile' : 'title'">Easy Homemade Fried Rice You’ll Love</p>
    </v-col>
    <v-col :cols="$vuetify.display.smAndDown ? 4 : 4">
      <v-img src="/assets/banner/salad.png"></v-img>
      <p :class="$vuetify.display.smAndDown ? 'title-mobile' : 'title'">Simple Salads That Taste Amazing</p>
    </v-col>
    <v-col :cols="$vuetify.display.smAndDown ? 4 : 4">
      <v-img
        src="/assets/banner/spagethi.png"></v-img>
      <p :class="$vuetify.display.smAndDown ? 'title-mobile' : 'title'">The Ultimate 10 Spaghetti Recipe You Need to Try</p>
    </v-col>
    <v-col :cols="$vuetify.display.smAndDown ? 4 : 4">
      <v-img src="/assets/banner/sandwich.png"> </v-img>
      <p :class="$vuetify.display.smAndDown ? 'title-mobile' : 'title'">Quick Sandwich Ideas for Busy Days</p>
    </v-col>
  </v-row>
</template>

<style scoped>
  .title {
    margin-top: 10px;
    font-size: 18px;
    font-weight: bold;
    line-height: normal;
  }
  .title-mobile {
    margin-top: 10px;
    font-size: 14px;
    line-height: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>
