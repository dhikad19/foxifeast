<template>
  <div class="container mx-auto p-4">
    <!-- <v-btn @click="$router.back()" variant="outlined" class="mb-4">Back</v-btn> -->
    <v-snackbar
      v-model="snackbar"
      :timeout="5000"
    >
      {{ text }}

      <template v-slot:actions>
        <v-btn
          color="#ff7800"
          variant="text"
          @click="snackbar = false"
          style="text-transform: capitalize"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-card variant="text" v-if="recipe">
      <v-row :class="$vuetify.display.smAndDown ? '' : 'mt-6'">
        <v-col :cols="$vuetify.display.smAndDown ? 12 : 6">
          <v-img
            style="border-radius: 4px"
            :src="recipe.image"
            :alt="recipe.title"
            :height="$vuetify.display.smAndDown ? '250px' : '350px'"
            cover
            class="mb-3">
            <v-btn
              icon
              class="ma-2"
              style="position: absolute; top: 0; left: 0; z-index: 1"
              color="white"
              size="small"
              variant="tonal"
              @click="$router.back()">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-img>
          <div class="d-flex align-center mt-4 mb-8">
            <div class="download-btn cursor-pointer" @click="downloadRecipeCard(recipe.id)">
              Download Recipe
            </div>
            <div @click="toggleFavorite" class="save-btn ml-2 cursor-pointer">
              <v-progress-circular v-if="bookmarkLogin" size="20" indeterminate></v-progress-circular>
              <v-icon v-else>{{
                isFav ? "mdi-bookmark-check" : "mdi-bookmark-outline"
              }}</v-icon>
            </div>
          </div>
        </v-col>
        <v-col cols="6" v-if="!$vuetify.display.smAndDown">
          <v-row :dense="true">
            <v-col cols="3">
              <div
                class="d-flex align-center pa-2 justify-center flex-column"
                style="border-radius: 4px; background-color: #ffff002c">
                <v-icon class="mb-2" color="yellow"> mdi-clock-outline </v-icon>
                <p style="font-size: 15px">Time</p>
                <span style="font-size: 15px; font-weight: bold">
                  {{ recipe.readyInMinutes }} min
                </span>
              </div>
            </v-col>
            <v-col cols="3">
              <div
                class="d-flex align-center pa-2 justify-center flex-column"
                style="border-radius: 4px; background-color: #ff000041">
                <v-icon class="mb-2" color="red">mdi-heart-outline</v-icon>
                <p style="font-size: 15px">Health Score</p>
                <span style="font-size: 15px; font-weight: bold">
                  {{ recipe.healthScore }}
                </span>
              </div>
            </v-col>
            <v-col cols="3">
              <div
                class="d-flex align-center pa-2 justify-center flex-column"
                style="border-radius: 4px; background-color: #80008067">
                <v-icon class="mb-2" color="purple">mdi-star-outline</v-icon>
                <p style="font-size: 15px">Score</p>
                <span style="font-size: 15px; font-weight: bold">
                  {{ Math.round(recipe.spoonacularScore) }}%
                </span>
              </div>
            </v-col>
            <v-col cols="3">
              <div
                class="d-flex align-center pa-2 justify-center flex-column"
                style="border-radius: 4px; background-color: #ffa60077">
                <v-icon class="mb-2" color="orange">mdi-currency-usd</v-icon>
                <p style="font-size: 15px">Per Serving</p>
                <span style="font-size: 15px; font-weight: bold">
                  {{ centsToUSD(recipe.pricePerServing) }}
                </span>
              </div>
            </v-col>
            <v-col cols="6">
              <div
                class="d-flex align-center pa-2 justify-center flex-column"
                style="border-radius: 4px; background-color: #00800038">
                <v-icon class="mb-2" color="green"
                  >mdi-room-service-outline
                </v-icon>
                <p style="font-size: 15px; margin-bottom: -1px">Serving</p>
                <div class="d-flex align-center mt-4 mb-2">
                  <v-icon
                    style="font-size: 18px"
                    class="mr-6"
                    @click="currentServings = Math.max(1, currentServings - 1)"
                    >mdi-minus</v-icon
                  >
                  <p style="font-weight: bold; font-size: 16px">
                    {{ currentServings }}
                  </p>
                  <v-icon
                    style="font-size: 18px"
                    class="ml-6"
                    @click="currentServings++"
                    >mdi-plus</v-icon
                  >
                </div>
              </div>
            </v-col>
            <v-col cols="6">
              <div
                class="d-flex align-center pa-2 justify-center flex-column"
                style="border-radius: 4px; background-color: #0000ff4d">
                <v-icon class="mb-2" color="blue"> mdi-scale </v-icon>
                <p class="mb-1" style="font-size: 15px">Scale</p>
                <v-btn-toggle
                  v-model="scale"
                  rounded="2"
                  style="margin-bottom: -5px"
                  group>
                  <v-btn
                    height="35"
                    value="metric"
                    style="
                      font-weight: bold;
                      letter-spacing: normal;
                      text-transform: capitalize;
                    ">
                    Metric
                  </v-btn>

                  <v-btn
                    height="35"
                    value="us"
                    style="font-weight: bold; letter-spacing: normal">
                    US
                  </v-btn>
                </v-btn-toggle>
              </div>
            </v-col>
            <v-col cols="12" v-if="recipe.occasions.length > 0">
              <p class="mb-2 mt-2" style="font-weight: bold">Occasions</p>
              <v-row dense>
                <v-col cols="3" v-for="item in recipe.occasions" :key="item">
                  <div
                    style="border-radius: 4px"
                    class="d-flex align-center justify-center pa-3"
                    :style="
                      $vuetify.theme.global.name === 'dark'
                        ? 'background-color: #4f4f4f; '
                        : 'background-color: #fafafa; '
                    ">
                    <v-icon class="mr-2" style="font-size: 20px">
                      {{ occasionsItems[item] }}
                    </v-icon>
                    <p
                      style="
                        text-transform: capitalize;
                        text-align: center;
                        font-size: 14px;
                        font-weight: bold;
                      ">
                      {{ item }}
                    </p>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <p class="text-h6 font-weight-bold mb-4" style="line-height: normal">
        {{ recipe.title }}
      </p>

      <div class="d-flex flex-wrap gap-2 mb-4">
        <v-chip
          v-if="recipe.glutenFree"
          color="green"
          text-color="white"
          size="small"
          >Gluten Free</v-chip
        >
        <v-chip
          v-if="recipe.dairyFree"
          color="blue"
          text-color="white"
          size="small"
          >Dairy Free</v-chip
        >
        <v-chip
          v-if="recipe.vegan"
          color="deep-purple"
          text-color="white"
          size="small"
          >Vegan</v-chip
        >
        <v-chip
          v-if="recipe.vegetarian"
          color="orange"
          text-color="white"
          size="small"
          >Vegetarian</v-chip
        >
      </div>
      <div>
        <div
          v-if="recipe.summary && $vuetify.display.smAndDown"
          class="summary-container">
          <transition name="expand">
            <div
              v-show="expanded"
              key="expanded"
              v-html="recipe.summary"
              class="mb-4 text-content"
              style="font-size: 15px"></div>
          </transition>

          <transition name="expand">
            <div
              v-show="!expanded"
              key="collapsed"
              v-html="shortSummary"
              class="mb-4 text-content"
              style="font-size: 15px"></div>
          </transition>
          <div style="width: 100%" class="d-flex align-center justify-center">
            <span
              style="text-align: center; font-weight: bold; font-size: 14px"
              @click="toggleExpand"
              v-if="!expanded">
              Show More <v-icon>mdi-chevron-down</v-icon>
            </span>
          </div>
        </div>
        <div
          v-else-if="recipe.summary && !$vuetify.display.smAndDown"
          v-html="recipe.summary"></div>

        <v-row :dense="true" class="mt-4" v-if="$vuetify.display.smAndDown">
          <v-col :cols="$vuetify.display.smAndDown ? 3 : 4">
            <div
              class="d-flex align-center pa-2 justify-center flex-column"
              style="border-radius: 4px; background-color: #ffff002c">
              <v-icon class="mb-2" color="yellow">mdi-clock-outline </v-icon>
              <p style="font-size: 14px">Time</p>
              <span style="font-size: 15px; font-weight: bold">
                {{ recipe.readyInMinutes }} min
              </span>
            </div>
          </v-col>
          <v-col :cols="$vuetify.display.smAndDown ? 3 : 4">
            <div
              class="d-flex align-center pa-2 justify-center flex-column"
              style="border-radius: 4px; background-color: #ff000041">
              <v-icon class="mb-2" color="red"> mdi-heart-outline </v-icon>
              <p
                style="
                  font-size: 14px;
                  max-width: 60px;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  overflow: hidden;
                ">
                Health Score
              </p>
              <span style="font-size: 15px; font-weight: bold">
                {{ recipe.healthScore }}
              </span>
            </div>
          </v-col>
          <v-col :cols="$vuetify.display.smAndDown ? 3 : 4">
            <div
              class="d-flex align-center pa-2 justify-center flex-column"
              style="border-radius: 4px; background-color: #80008067">
              <v-icon class="mb-2" color="purple">mdi-star-outline</v-icon>
              <p style="font-size: 14px">Score</p>
              <span style="font-size: 15px; font-weight: bold">
                {{ Math.round(recipe.spoonacularScore) }}%
              </span>
            </div>
          </v-col>
          <v-col :cols="$vuetify.display.smAndDown ? 3 : 4">
            <div
              class="d-flex align-center pa-2 justify-center flex-column"
              style="border-radius: 4px; background-color: #ffa60077">
              <v-icon class="mb-2" color="orange">mdi-currency-usd</v-icon>
              <p style="font-size: 14px">Per Serving</p>
              <span style="font-size: 15px; font-weight: bold">
                {{ centsToUSD(recipe.pricePerServing) }}
              </span>
            </div>
          </v-col>
          <v-col cols="6">
            <div
              class="d-flex align-center pa-2 justify-center flex-column"
              style="border-radius: 4px; background-color: #00800038">
              <v-icon class="mb-2" color="green"
                >mdi-room-service-outline</v-icon
              >
              <p style="font-size: 14px; margin-bottom: -1px">Serving</p>
              <div class="d-flex align-center mt-4 mb-2">
                <v-icon
                  style="font-size: 18px"
                  class="mr-6"
                  @click="currentServings = Math.max(1, currentServings - 1)"
                  >mdi-minus</v-icon
                >
                <p style="font-weight: bold; font-size: 16px">
                  {{ currentServings }}
                </p>
                <v-icon
                  style="font-size: 18px"
                  class="ml-6"
                  @click="currentServings++"
                  >mdi-plus</v-icon
                >
              </div>
            </div>
          </v-col>
          <v-col cols="6">
            <div
              class="d-flex align-center pa-2 justify-center flex-column"
              style="border-radius: 4px; background-color: #0000ff4d">
              <v-icon class="mb-2" color="blue"> mdi-scale </v-icon>
              <p class="mb-1" style="font-size: 14px">Scale</p>
              <v-btn-toggle
                v-model="scale"
                rounded="2"
                style="margin-bottom: -5px"
                group>
                <v-btn
                  height="35"
                  value="metric"
                  style="text-transform: capitalize">
                  Metric
                </v-btn>

                <v-btn height="35" value="us"> US </v-btn>
              </v-btn-toggle>
            </div>
          </v-col>
          <v-col cols="12" v-if="recipe.occasions.length > 0">
            <p class="mb-2 mt-2" style="font-weight: bold">Occasions</p>
            <v-row dense>
              <v-col cols="3" v-for="item in recipe.occasions" :key="item">
                <div
                  style="border-radius: 4px"
                  class="d-flex align-center justify-center pa-3"
                  :style="
                    $vuetify.theme.global.name === 'dark'
                      ? 'background-color: #4f4f4f; '
                      : 'background-color: #fafafa; '
                  ">
                  <v-icon class="mr-2" style="font-size: 20px">
                    {{ occasionsItems[item] }}
                  </v-icon>
                  <p
                    style="
                      text-transform: capitalize;
                      text-align: center;
                      font-size: 14px;
                      font-weight: bold;
                    ">
                    {{ item }}
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row class="mb-4 mt-4">
          <v-col :cols="$vuetify.display.smAndDown ? 12 : 6">
            <div v-if="recipe.extendedIngredients">
              <p class="mb-2" style="font-weight: bold">Ingredients</p>
              <div
                v-for="ingredient in adjustedIngredients"
                :key="ingredient.id">
                <p style="font-size: 14px">
                  <strong
                    >{{ formatAmountToFraction(ingredient.adjustedAmount) }}
                    {{ ingredient.adjustedUnit }}</strong
                  >
                  {{ ingredient.originalName }}
                </p>
                <div
                  style="
                    width: 100%;
                    border-bottom: 1px dashed #757575;
                    margin-top: 5px;
                    margin-bottom: 5px;
                  "></div>
              </div>
            </div>
          </v-col>
          <v-col :cols="$vuetify.display.smAndDown ? 12 : 6">
            <div v-if="recipe.analyzedInstructions?.length">
              <p class="mb-2" style="font-weight: bold">Step</p>
              <div
                class="pa-3 pt-4"
                style="border-radius: 4px"
                :style="
                  $vuetify.theme.global.name === 'dark'
                    ? 'background-color: #4f4f4f; '
                    : 'background-color: #fafafa; '
                ">
                <div
                  v-for="step in recipe.analyzedInstructions[0].steps"
                  :key="step.number"
                  class="pb-3">
                  <div class="d-flex align-start">
                    <p style="font-size: 14px; margin-top: -3px">
                      {{ step.number }}. {{ step.step }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>

    <p v-else class="text-gray-500">Loading recipe details...</p>
  </div>
</template>

<script>
  import { useFavoritesStore } from "@/stores/favoritesStore";
  import { useAuthStore } from "@/stores/authStore";
  import axios from "axios";
  export default {
    props: ["id"],

    data() {
      return {
        occasionsItems: {
          fall: "mdi-leaf-maple",
          winter: "mdi-snowflake",
          summer: "mdi-weather-sunny",
          spring: "mdi-leaf",
        },
        bookmarkLogin: false,
        currentServings: 1,
        isMetric: true,
        scale: "metric",
        recipe: null,
        expanded: false,
        snackbar: false,
        text: ""
      };
    },

    methods: {
      async downloadRecipeCard(id) {
        this.loading = true;
        const { data } = await axios.get(
          `https://api.spoonacular.com/recipes/${id}/card`,
          { params: { apiKey: process.env.VUE_APP_SPOONACULAR_API_KEY } }
        );
        this.loading = false;
        window.open(data.url, "_blank", "noopener");
      },

      async toggleFavorite() {
        this.bookmarkLogin = true
        const authStore = useAuthStore();
        const favoritesStore = useFavoritesStore();

        if (!authStore.user) {
          this.$router.push("/login");
          return;
        }

        if (favoritesStore.isFavorite(this.recipe.id)) {
          await favoritesStore.removeFavorite(this.recipe.id);
          this.snackbar = true
          this.text = "You have removed the recipe from your bookmarks"
          this.bookmarkLogin = false
        } else {
          await favoritesStore.addFavorite(this.recipe);
          this.snackbar = true
          this.text = "You have bookmarked the recipe"
          this.bookmarkLogin = false
        }
      },

      centsToUSD(cents) {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(cents / 100);
      },

      toggleExpand() {
        this.expanded = !this.expanded;
      },

      formatAmountToFraction(amount) {
        const fractionMap = {
          0.125: "⅛",
          0.25: "¼",
          0.333: "⅓",
          0.375: "⅜",
          0.5: "½",
          0.625: "⅝",
          0.666: "⅔",
          0.75: "¾",
          0.875: "⅞",
        };

        const rounded = Math.round(amount * 1000) / 1000;
        const whole = Math.floor(rounded);
        const decimal = parseFloat((rounded - whole).toFixed(3));
        let bestMatch = "";
        for (const [val, symbol] of Object.entries(fractionMap)) {
          if (Math.abs(decimal - parseFloat(val)) < 0.02) {
            bestMatch = symbol;
            break;
          }
        }

        if (bestMatch && whole > 0) return `${whole}${bestMatch}`;
        if (bestMatch && whole === 0) return bestMatch;
        return rounded.toString();
      },
    },

    async created() {
      const apiKey = process.env.VUE_APP_SPOONACULAR_API_KEY;
      const url = `https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${apiKey}`;
      try {
        const response = await axios.get(url);
        this.recipe = response.data;
        this.currentServings = this.recipe.servings;
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    },

    computed: {
      isFav() {
        const store = useFavoritesStore();
        return store.isFavorite(this.recipe.id);
      },

      shortSummary() {
        const div = document.createElement("div");
        div.innerHTML = this.recipe.summary;
        const textOnly = div.textContent || div.innerText || "";
        return textOnly.length > 100
          ? textOnly.substring(0, 100) + "..."
          : textOnly;
      },

      adjustedIngredients() {
        if (!this.recipe?.extendedIngredients) return [];

        return this.recipe.extendedIngredients.map((ingredient) => {
          const originalServings = this.recipe.servings;
          const ratio = this.currentServings / originalServings;

          const baseMeasure =
            this.scale == "metric"
              ? ingredient.measures.metric
              : ingredient.measures.us;

          const adjustedAmount = baseMeasure.amount * ratio;

          return {
            ...ingredient,
            adjustedAmount,
            adjustedUnit: baseMeasure.unitShort,
          };
        });
      },
    },
  };
</script>

<style scoped>
  .save-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 35px;
    width: 100%;
    border: 2px solid #ff7800;
    border-radius: 4px;
    color: #ff7800;
    max-width: 40px;
  }
  .download-btn {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    justify-content: center;
    height: 35px;
    color: white;
    width: 100%;
    border-radius: 4px;
    background-color: #ff7800;
  }
  .step-number {
    font-size: 12px;
    line-height: normal;
    border-radius: 50%;
    height: 18px;
    min-width: 18px;
    background-color: white;
    color: black;
  }

  .border-dashed {
    width: 100%;
    border-bottom: 1px dashed #757575;
    margin-top: 2px;
    margin-bottom: 2px;
  }

  .gap-2 {
    gap: 0.5rem;
  }

  .text-content {
    overflow: hidden;
    font-size: 14px;
  }

  /* Transisi */
  .expand-enter-active,
  .expand-leave-active {
    transition: all 0.3s ease;
    max-height: 300px;
    opacity: 1;
  }
  .expand-enter-from,
  .expand-leave-to {
    max-height: 0;
    opacity: 0;
  }
</style>
