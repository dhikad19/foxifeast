<template>
  <div class="container mx-auto p-4">
    <!-- <v-btn @click="$router.back()" variant="outlined" class="mb-4">Back</v-btn> -->

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
          <v-btn
            variant="tonal"
            color="#ff7800"
            class="mt-4 mb-4"
            style="letter-spacing: normal; text-transform: capitalize"
            :loading="loading"
            block
            elevation="0"
            @click="downloadRecipeCard(recipe.id)">
            Download Recipe
          </v-btn>
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
      <v-btn
        :icon="true"
        :color="isFav ? 'red' : 'grey'"
        @click="toggleFavorite">
        <v-icon>{{ isFav ? "mdi-heart" : "mdi-heart-outline" }}</v-icon>
      </v-btn>
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
        currentServings: 1,
        isMetric: true,
        scale: "metric",
        recipe: {
          id: 1096226,
          image: "https://img.spoonacular.com/recipes/1096226-556x370.jpg",
          imageType: "jpg",
          title: "Chicken Tortilla Soup with Bone Broth",
          readyInMinutes: 35,
          servings: 3,
          sourceUrl:
            "https://www.foodista.com/recipe/H5NJNDP7/chicken-tortilla-soup-with-bone-broth",
          vegetarian: false,
          vegan: false,
          glutenFree: true,
          dairyFree: true,
          veryHealthy: false,
          cheap: false,
          veryPopular: false,
          sustainable: false,
          lowFodmap: false,
          weightWatcherSmartPoints: 9,
          gaps: "no",
          preparationMinutes: null,
          cookingMinutes: null,
          aggregateLikes: 1,
          healthScore: 28,
          creditsText:
            "Foodista.com – The Cooking Encyclopedia Everyone Can Edit",
          license: "CC BY 3.0",
          sourceName: "Foodista",
          pricePerServing: 539.57,
          extendedIngredients: [
            {
              id: 4053,
              aisle: "Oil, Vinegar, Salad Dressing",
              image: "olive-oil.jpg",
              consistency: "LIQUID",
              name: "olive oil",
              nameClean: "olive oil",
              original: "1 tablespoon olive oil",
              originalName: "olive oil",
              amount: 1,
              unit: "tablespoon",
              meta: [],
              measures: {
                us: {
                  amount: 1,
                  unitShort: "Tbsp",
                  unitLong: "Tbsp",
                },
                metric: {
                  amount: 1,
                  unitShort: "Tbsp",
                  unitLong: "Tbsp",
                },
              },
            },
            {
              id: 11282,
              aisle: "Produce",
              image: "brown-onion.png",
              consistency: "SOLID",
              name: "onion",
              nameClean: "onion",
              original: "1 small onion chopped",
              originalName: "onion chopped",
              amount: 1,
              unit: "small",
              meta: ["chopped"],
              measures: {
                us: {
                  amount: 1,
                  unitShort: "small",
                  unitLong: "small",
                },
                metric: {
                  amount: 1,
                  unitShort: "small",
                  unitLong: "small",
                },
              },
            },
            {
              id: 10211215,
              aisle: "Produce",
              image: "garlic.jpg",
              consistency: "SOLID",
              name: "garlic clove",
              nameClean: "garlic clove",
              original: "1 garlic clove minced",
              originalName: "garlic clove minced",
              amount: 1,
              unit: "",
              meta: ["minced"],
              measures: {
                us: {
                  amount: 1,
                  unitShort: "",
                  unitLong: "",
                },
                metric: {
                  amount: 1,
                  unitShort: "",
                  unitLong: "",
                },
              },
            },
            {
              id: 11979,
              aisle: "Ethnic Foods",
              image: "jalapeno-pepper.png",
              consistency: "SOLID",
              name: "jalapeno pepper",
              nameClean: "jalapeno pepper",
              original: "½ jalapeno pepper chopped",
              originalName: "jalapeno pepper chopped",
              amount: 0.5,
              unit: "",
              meta: ["chopped"],
              measures: {
                us: {
                  amount: 0.5,
                  unitShort: "",
                  unitLong: "",
                },
                metric: {
                  amount: 0.5,
                  unitShort: "",
                  unitLong: "",
                },
              },
            },
            {
              id: 11167,
              aisle: "Produce",
              image: "corn-on-the-cob.jpg",
              consistency: "SOLID",
              name: "corn",
              nameClean: "corn",
              original: "1 cup fresh corn",
              originalName: "fresh corn",
              amount: 1,
              unit: "cup",
              meta: ["fresh"],
              measures: {
                us: {
                  amount: 1,
                  unitShort: "cup",
                  unitLong: "cup",
                },
                metric: {
                  amount: 145,
                  unitShort: "g",
                  unitLong: "grams",
                },
              },
            },
            {
              id: 1002014,
              aisle: "Spices and Seasonings",
              image: "ground-cumin.jpg",
              consistency: "SOLID",
              name: "cumin",
              nameClean: "cumin",
              original: "½ teaspoon cumin",
              originalName: "cumin",
              amount: 0.5,
              unit: "teaspoon",
              meta: [],
              measures: {
                us: {
                  amount: 0.5,
                  unitShort: "tsps",
                  unitLong: "teaspoons",
                },
                metric: {
                  amount: 0.5,
                  unitShort: "tsps",
                  unitLong: "teaspoons",
                },
              },
            },
            {
              id: 2009,
              aisle: "Spices and Seasonings",
              image: "chili-powder.jpg",
              consistency: "SOLID",
              name: "chili powder",
              nameClean: "chili powder",
              original: "½ teaspoon chili powder",
              originalName: "chili powder",
              amount: 0.5,
              unit: "teaspoon",
              meta: [],
              measures: {
                us: {
                  amount: 0.5,
                  unitShort: "tsps",
                  unitLong: "teaspoons",
                },
                metric: {
                  amount: 0.5,
                  unitShort: "tsps",
                  unitLong: "teaspoons",
                },
              },
            },
            {
              id: 2031,
              aisle: "Spices and Seasonings",
              image: "chili-powder.jpg",
              consistency: "SOLID",
              name: "cayenne powder",
              nameClean: "cayenne powder",
              original: "½ teaspoon cayenne powder",
              originalName: "cayenne powder",
              amount: 0.5,
              unit: "teaspoon",
              meta: [],
              measures: {
                us: {
                  amount: 0.5,
                  unitShort: "tsps",
                  unitLong: "teaspoons",
                },
                metric: {
                  amount: 0.5,
                  unitShort: "tsps",
                  unitLong: "teaspoons",
                },
              },
            },
            {
              id: 98904,
              aisle: "Health Foods",
              image: "chicken-broth.png",
              consistency: "LIQUID",
              name: "kettle & fire chicken bone broth",
              nameClean: "kettle & fire chicken bone broth",
              original: "5 cups Kettle & Fire Chicken Bone Broth",
              originalName: "Kettle & Fire Chicken Bone Broth",
              amount: 5,
              unit: "cups",
              meta: [],
              measures: {
                us: {
                  amount: 5,
                  unitShort: "cups",
                  unitLong: "cups",
                },
                metric: {
                  amount: 1.175,
                  unitShort: "l",
                  unitLong: "liters",
                },
              },
            },
            {
              id: 11529,
              aisle: "Produce",
              image: "tomato.png",
              consistency: "SOLID",
              name: "tomato",
              nameClean: "tomato",
              original: "1 medium tomato chopped",
              originalName: "tomato chopped",
              amount: 1,
              unit: "medium",
              meta: ["chopped"],
              measures: {
                us: {
                  amount: 1,
                  unitShort: "medium",
                  unitLong: "medium",
                },
                metric: {
                  amount: 1,
                  unitShort: "medium",
                  unitLong: "medium",
                },
              },
            },
            {
              id: 11549,
              aisle: "Canned and Jarred",
              image: "tomato-sauce-or-pasta-sauce.jpg",
              consistency: "SOLID",
              name: "tomato sauce",
              nameClean: "tomato sauce",
              original: "¾ cup organic canned tomato sauce",
              originalName: "organic canned tomato sauce",
              amount: 0.75,
              unit: "cup",
              meta: ["organic", "canned"],
              measures: {
                us: {
                  amount: 0.75,
                  unitShort: "cups",
                  unitLong: "cups",
                },
                metric: {
                  amount: 183.75,
                  unitShort: "ml",
                  unitLong: "milliliters",
                },
              },
            },
            {
              id: 1005114,
              aisle: "Meat",
              image: "rotisserie-chicken.png",
              consistency: "SOLID",
              name: "chicken breast",
              nameClean: "chicken breast",
              original: "1 cup cooked chicken breast shredded",
              originalName: "cooked chicken breast shredded",
              amount: 1,
              unit: "cup",
              meta: ["shredded", "cooked"],
              measures: {
                us: {
                  amount: 1,
                  unitShort: "cup",
                  unitLong: "cup",
                },
                metric: {
                  amount: 140,
                  unitShort: "g",
                  unitLong: "grams",
                },
              },
            },
            {
              id: 9037,
              aisle: "Produce",
              image: "avocado.jpg",
              consistency: "SOLID",
              name: "avocado",
              nameClean: "avocado",
              original: "1 avocado",
              originalName: "avocado",
              amount: 1,
              unit: "",
              meta: [],
              measures: {
                us: {
                  amount: 1,
                  unitShort: "",
                  unitLong: "",
                },
                metric: {
                  amount: 1,
                  unitShort: "",
                  unitLong: "",
                },
              },
            },
            {
              id: 18363,
              aisle: "Ethnic Foods",
              image: "flour-tortilla.jpg",
              consistency: "SOLID",
              name: "corn tortilla",
              nameClean: "corn tortilla",
              original: "1 corn tortilla sliced into thin strips",
              originalName: "corn tortilla sliced into thin strips",
              amount: 1,
              unit: "",
              meta: ["sliced into thin strips"],
              measures: {
                us: {
                  amount: 1,
                  unitShort: "",
                  unitLong: "",
                },
                metric: {
                  amount: 1,
                  unitShort: "",
                  unitLong: "",
                },
              },
            },
            {
              id: 11165,
              aisle: "Produce",
              image: "cilantro.png",
              consistency: "SOLID",
              name: "cilantro",
              nameClean: "cilantro",
              original: "½ tablespoon cilantro roughly chopped",
              originalName: "cilantro roughly chopped",
              amount: 0.5,
              unit: "tablespoon",
              meta: ["roughly chopped"],
              measures: {
                us: {
                  amount: 0.5,
                  unitShort: "Tbsps",
                  unitLong: "Tbsps",
                },
                metric: {
                  amount: 0.5,
                  unitShort: "Tbsps",
                  unitLong: "Tbsps",
                },
              },
            },
          ],
          summary:
            'Chicken Tortilla Soup with Bone Broth takes roughly <b>35 minutes</b> from beginning to end. One serving contains <b>379 calories</b>, <b>31g of protein</b>, and <b>19g of fat</b>. For <b>$5.4 per serving</b>, this recipe <b>covers 19%</b> of your daily requirements of vitamins and minerals. This recipe serves 3. <b>Autumn</b> will be even more special with this recipe. It works well as a main course. 1 person were glad they tried this recipe. If you have chicken breast, tomato sauce, cilantro, and a few other ingredients on hand, you can make it. It is brought to you by Foodista. It is a good option if you\'re following a <b>gluten free and dairy free</b> diet. Taking all factors into account, this recipe <b>earns a spoonacular score of 70%</b>, which is solid. <a href="https://spoonacular.com/recipes/clean-eating-bone-broth-mushroom-soup-718479">Clean Eating Bone Broth Mushroom Soup</a>, <a href="https://spoonacular.com/recipes/perpetual-soup-the-easiest-bone-broth-youll-make-251165">Perpetual Soup: The Easiest Bone Broth You’ll Make</a>, and <a href="https://spoonacular.com/recipes/perpetual-soup-the-easiest-bone-broth-youll-make-1763165">Perpetual Soup: The Easiest Bone Broth You’ll Make</a> are very similar to this recipe.',
          cuisines: [],
          dishTypes: ["lunch", "soup", "main course", "main dish", "dinner"],
          diets: ["gluten free", "dairy free"],
          occasions: ["fall", "winter"],
          instructions:
            "<ol><li>In a large stock pot over medium heat, warm the olive oil. Add the onion, garlic and jalapeno, and cook until onions are translucent, about 5 minutes.</li><li>Add the remaining ingredients, minus the avocado, tortilla and cilantro. Turn the heat down to a simmer and cook, stirring occasionally, for 20 minutes.</li><li>While the soup cooks, crisp the tortilla. On a medium non-stick pan over high heat, add the tortilla strips and cook, stirring, until golden brown on both sides.</li><li>Pour the soup into large bowls and garnish with avocado, tortilla strips and cilantro.</li></ol>",
          analyzedInstructions: [
            {
              name: "",
              steps: [
                {
                  number: 1,
                  step: "In a large stock pot over medium heat, warm the olive oil.",
                  ingredients: [
                    {
                      id: 4053,
                      name: "olive oil",
                      localizedName: "olive oil",
                      image: "olive-oil.jpg",
                    },
                    {
                      id: 1006615,
                      name: "stock",
                      localizedName: "stock",
                      image: "chicken-broth.png",
                    },
                  ],
                  equipment: [
                    {
                      id: 404752,
                      name: "pot",
                      localizedName: "pot",
                      image:
                        "https://spoonacular.com/cdn/equipment_100x100/stock-pot.jpg",
                    },
                  ],
                },
                {
                  number: 2,
                  step: "Add the onion, garlic and jalapeno, and cook until onions are translucent, about 5 minutes.",
                  ingredients: [
                    {
                      id: 11979,
                      name: "jalapeno pepper",
                      localizedName: "jalapeno pepper",
                      image: "jalapeno-pepper.png",
                    },
                    {
                      id: 11215,
                      name: "garlic",
                      localizedName: "garlic",
                      image: "garlic.png",
                    },
                    {
                      id: 11282,
                      name: "onion",
                      localizedName: "onion",
                      image: "brown-onion.png",
                    },
                  ],
                  equipment: [],
                  length: {
                    number: 5,
                    unit: "minutes",
                  },
                },
                {
                  number: 3,
                  step: "Add the remaining ingredients, minus the avocado, tortilla and cilantro. Turn the heat down to a simmer and cook, stirring occasionally, for 20 minutes.While the soup cooks, crisp the tortilla. On a medium non-stick pan over high heat, add the tortilla strips and cook, stirring, until golden brown on both sides.",
                  ingredients: [
                    {
                      id: 98977,
                      name: "tortilla strips",
                      localizedName: "tortilla strips",
                      image: "tortilla-strips.jpg",
                    },
                    {
                      id: 11165,
                      name: "cilantro",
                      localizedName: "cilantro",
                      image: "cilantro.png",
                    },
                    {
                      id: 18364,
                      name: "tortilla",
                      localizedName: "tortilla",
                      image: "flour-tortilla.jpg",
                    },
                    {
                      id: 9037,
                      name: "avocado",
                      localizedName: "avocado",
                      image: "avocado.jpg",
                    },
                    {
                      id: 0,
                      name: "soup",
                      localizedName: "soup",
                      image: "",
                    },
                  ],
                  equipment: [
                    {
                      id: 404645,
                      name: "frying pan",
                      localizedName: "frying pan",
                      image:
                        "https://spoonacular.com/cdn/equipment_100x100/pan.png",
                    },
                  ],
                  length: {
                    number: 20,
                    unit: "minutes",
                  },
                },
                {
                  number: 4,
                  step: "Pour the soup into large bowls and garnish with avocado, tortilla strips and cilantro.",
                  ingredients: [
                    {
                      id: 98977,
                      name: "tortilla strips",
                      localizedName: "tortilla strips",
                      image: "tortilla-strips.jpg",
                    },
                    {
                      id: 11165,
                      name: "cilantro",
                      localizedName: "cilantro",
                      image: "cilantro.png",
                    },
                    {
                      id: 9037,
                      name: "avocado",
                      localizedName: "avocado",
                      image: "avocado.jpg",
                    },
                    {
                      id: 0,
                      name: "soup",
                      localizedName: "soup",
                      image: "",
                    },
                  ],
                  equipment: [
                    {
                      id: 404783,
                      name: "bowl",
                      localizedName: "bowl",
                      image:
                        "https://spoonacular.com/cdn/equipment_100x100/bowl.jpg",
                    },
                  ],
                },
              ],
            },
          ],
          spoonacularScore: 73.35271453857422,
          spoonacularSourceUrl:
            "https://spoonacular.com/chicken-tortilla-soup-with-bone-broth-1096226",
        },
        expanded: false,
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
        const authStore = useAuthStore();
        const favoritesStore = useFavoritesStore();

        if (!authStore.user) {
          this.$router.push("/login");
          return;
        }

        if (favoritesStore.isFavorite(this.recipe.id)) {
          await favoritesStore.removeFavorite(this.recipe.id);
        } else {
          await favoritesStore.addFavorite(this.recipe);
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

      // async created() {
      //   const apiKey = process.env.VUE_APP_SPOONACULAR_API_KEY;
      //   const url = `https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${apiKey}`;
      //   try {
      //     const response = await axios.get(url);
      //     this.recipe = response.data;
      //     this.currentServings = this.recipe.servings;
      //   } catch (error) {
      //     console.error("Error fetching recipe details:", error);
      //   }
      // },
    },
  };
</script>

<style scoped>
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
