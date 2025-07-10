<template>
  <v-row :dense="$vuetify.display.smAndDown">
    <v-col :cols="$vuetify.display.smAndDown ? 12 : 8">
      <v-carousel
        height="100%"
        show-arrows
        cycle
        hide-delimiter-background
        hide-delimiters
      >
        <v-carousel-item v-for="(slide, i) in carouselData" :key="i">
          <v-sheet class="position-relative">
            <v-img
              :src="slide.img"
              class="carousel-img"
              cover
              @load="slide.loading = false"
            >
              <!-- Skeleton loader saat loading -->
              <template v-if="slide.loading">
                <div
                  class="skeleton"
                ></div>
              </template>

              <!-- Tampilkan text overlay saat gambar sudah loaded -->
              <template v-else>
                <div class="image-text-overlay">
                  <p class="text-white font-weight-bold"
                    style="overflow: hidden; text-overflow: ellipsis; max-width: 90%; white-space: nowrap">
                    {{ slide.name }}
                  </p>
                  <p style="line-height: normal; font-size: 15px; color: white">{{slide.description}}</p>
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
          <v-img class="carousel-img-right" cover src="/assets/banner/soup.png">
            <div class="image-text-overlay">
              <span class="text-white font-weight-bold"
                style="overflow: hidden; text-overflow: ellipsis; max-width: 90%; white-space: nowrap">
                Easy and Delicious Homemade Soups
              </span>
            </div>
          </v-img>
        </v-col>

        <v-col :cols="$vuetify.display.smAndDown ? 6 : 12">
          <v-img class="carousel-img-right" cover src="/assets/banner/fried-rice.png">
            <div class="image-text-overlay">
              <span class="text-white font-weight-bold"
                style="overflow: hidden; text-overflow: ellipsis; max-width: 90%; white-space: nowrap">
                Easy Homemade Fried Rice You’ll Love
              </span>
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
          description: 'Discover easy-to-make salads that are both refreshing and packed with flavor—perfect for any meal or snack.',
          loading: true
        },
        {
          img: '/assets/banner/spagethi.png',
          name: 'The Ultimate 10 Spaghetti Recipe You Need to Try',
          description: 'From creamy to classic, explore our top 10 spaghetti recipes that will satisfy your cravings and impress your guests.',
          loading: true
        },
        {
          img: '/assets/banner/sandwich.png',
          name: 'Quick Sandwich Ideas for Busy Days',
          description: 'Need a fast and tasty bite? These sandwich ideas are perfect for hectic mornings, work lunches, or on-the-go meals.',
          loading: true
        }
      ]
    }  
  },
}
</script>

<style scoped>
.carousel-img {
  aspect-ratio: 16 / 9;
  border-radius: 4px;
  width: 100%;
}

.carousel-img-right {
  aspect-ratio: 16 / 8.77;
  border-radius: 4px;
  width: 100%;
}

.skeleton {
  background-color: #4f4f4f;
  width: 100%;
  aspect-ratio: 16 / 9;
}

.image-text-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  display: flex;
  flex-direction: column;
}
</style>

