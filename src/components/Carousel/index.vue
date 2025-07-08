<template>
  <v-row :dense="$vuetify.display.smAndDown">
    <v-col :cols="$vuetify.display.smAndDown ? 12 : 8">
      <v-carousel
        height="100%"
        show-arrows
        cycle
        hide-delimiter-background
      >
      <v-carousel-item v-for="(slide, i) in carouselData" :key="i">
        <v-sheet height="100%">
          <v-img
            :src="slide.img"
            style="border-radius: 4px"
            :max-height="$vuetify.display.smAndDown ? 250 : 388"
            cover
            @load="slide.loading = false"
          >
            <!-- Skeleton loader saat loading -->
            <template v-if="slide.loading">
              <div style="background-color: #4f4f4f" :style="$vuetify.display.smAndDown ? 'min-height: 250px' : 'min-height: 388px'">

              </div>
            </template>
      
            <!-- Tampilkan text overlay saat gambar sudah loaded -->
            <template v-else>
              <div class="image-text-overlay">
                <span class="text-white font-weight-bold"
                  style="overflow: hidden; text-overflow: ellipsis; max-width: 90%; white-space: nowrap">
                  {{ slide.name }}
                </span>
              </div>
            </template>
          </v-img>
        </v-sheet>
      </v-carousel-item>
      
      </v-carousel>
    </v-col>
    <v-col :cols="$vuetify.display.smAndDown ? 12 : 4">
      <v-row :dense="$vuetify.display.smAndDown">
        <v-col :cols="$vuetify.display.smAndDown ? 6 : 12">
          <v-img style="border-radius: 4px" cover max-height="200" src="/assets/banner/soup.png">
            <div class="image-text-overlay">
              <span class="text-white font-weight-bold" style="overflow: hidden; text-overflow: ellipsis; max-width: 90%; white-space: nowrap">Easy and Delicious Homemade Soups</span>
            </div>
          </v-img>
          <p :class="$vuetify.display.smAndDown ? 'title-mobile' : 'title'"></p>
        </v-col>
        <v-col :cols="$vuetify.display.smAndDown ? 6 : 12">
          <v-img style="border-radius: 4px" cover max-height="200" src="/assets/banner/fried-rice.png">
            <div class="image-text-overlay">
              <span class="text-white font-weight-bold" style="overflow: hidden; text-overflow: ellipsis; max-width: 90%; white-space: nowrap">Easy Homemade Fried Rice You’ll Love</span>
            </div>
          </v-img>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "CarouselComponent",
  data () {
    return {
      carouselData: [
        {
          img: '/assets/banner/salad.png',
          name: 'Simple Salads That Taste Amazing',
          loading: true
        },
        {
          img: '/assets/banner/spagethi.png',
          name: 'The Ultimate 10 Spaghetti Recipe You Need to Try',
          loading: true
        },
        {
          img: '/assets/banner/sandwich.png',
          name: 'Quick Sandwich Ideas for Busy Days',
          loading: true
        },
      ]
    }  
  },
}
</script>

<style scope>
.image-text-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  display: flex;
  align-items: flex-end;
}
</style>