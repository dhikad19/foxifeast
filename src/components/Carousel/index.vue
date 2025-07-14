<template>
  <v-row :dense="$vuetify.display.smAndDown">
    
    <v-col :cols="$vuetify.display.smAndDown ? 12 : 8">
      <Carousel autoplay="4000" :wrapAround="true">
        <Slide v-for="(slide, i) in carouselData" :key="i">
          <v-img
          @click="handleList(slide.type)"
              :src="slide.img"
              class="carousel-img cursor-pointer"
              cover
              @load="slide.loading = false"
            >
              <template v-if="slide.loading">
                <div
                  class="skeleton"
                ></div>
              </template>

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
        </Slide>
        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </v-col>
    <v-col :cols="$vuetify.display.smAndDown ? 12 : 4">
      <v-row :dense="$vuetify.display.smAndDown">
        <v-col :cols="$vuetify.display.smAndDown ? 6 : 12">
          <v-img @click="handleList('soup')" class="carousel-img-right cursor-pointer" cover src="https://img.spoonacular.com/recipes/646561-636x393.jpg">
            <div class="image-text-overlay">
              <span class="text-white font-weight-bold"
                style="overflow: hidden; text-overflow: ellipsis; max-width: 90%; white-space: nowrap">
                Easy and Delicious Homemade Soups
              </span>
            </div>
          </v-img>
        </v-col>

        <v-col :cols="$vuetify.display.smAndDown ? 6 : 12">
          <v-img @click="handleList('rice')" class="carousel-img-right cursor-pointer" cover src="https://img.spoonacular.com/recipes/638729-636x393.jpg">
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
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
export default {
  name: "CarouselComponent",
  data () {
    return {
      carouselData: [
        {
          img: 'https://img.spoonacular.com/recipes/659021-636x393.jpg',
          name: 'Simple Salads That Taste Amazing',
          description: 'Discover easy-to-make salads that are both refreshing and packed with flavor—perfect for any meal or snack.',
          loading: true,
          type: 'salad'
        },
        {
          img: 'https://img.spoonacular.com/recipes/660820-636x393.jpg',
          name: 'The Ultimate 10 Spaghetti Recipe You Need to Try',
          description: 'From creamy to classic, explore our top 10 spaghetti recipes that will satisfy your cravings and impress your guests.',
          loading: true,
          type: 'spaghetti'
        },
        {
          img: 'https://img.spoonacular.com/recipes/646191-636x393.jpg',
          name: 'Quick Sandwich Ideas for Busy Days',
          description: 'Need a fast and tasty bite? These sandwich ideas are perfect for hectic mornings, work lunches, or on-the-go meals.',
          loading: true,
          type: 'sandwich'
        }
      ]
    }  
  },
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation
  },
  methods: {
    handleList(id) {
      this.$router.push(`/recipe-category/${id}`)
    }
  }
}
</script>

<style>
.carousel__pagination {
  margin-bottom: 5px !important;
}

.carousel__pagination-button.carousel__pagination-button--active {
  background-color: white !important;
}

.carousel__pagination-button {
  background-color: rgba(255, 255, 255, 0.226) !important;
  height: 10px;
  width: 10px;
  border-radius: 50%;
}

.carousel__icon {
  fill: white !important;
}
</style>

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

