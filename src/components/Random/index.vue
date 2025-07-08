<template>
  <div>
    <p
      class="mt-6 mb-3"
      :style="
        $vuetify.display.smAndDown ? 'font-size: 20px' : 'font-size: 25px'
      "
      style="font-weight: bold">
      Let Fate Choose Your Meal!
    </p>
    <v-row :dense="$vuetify.display.smAndDown">
      <v-col :cols="$vuetify.display.smAndDown ? 12 : 8">
        <v-sheet
          :class="$vuetify.display.smAndDown ? 'pa-4' : 'pa-6'"
          height="100%"
          style="border-radius: 4px"
          elevation="0"
          :style="
            $vuetify.theme.global.name === 'dark'
              ? 'background: linear-gradient(135deg, #ff7800, #ffb300);'
              : 'background: linear-gradient(135deg, #ff9800, #ffb300);'
          ">
          <!-- overlay gelap tipis -->
          <!-- <div
            :style="
              $vuetify.theme.global.name === 'dark'
                ? 'background-color: rgba(0, 0, 0, 0.400)'
                : 'background-color: rgba(255, 255, 255, 0.400)'
            "
            style="position: absolute; inset: 0; border-radius: inherit"></div> -->
          <v-row dense>
            <v-col cols="12">
              <div>
                <p
                  class="mb-2"
                  style="
                    line-height: normal;
                    font-size: 15px;
                    max-width: 600px;
                    color: white;
                  ">
                  Can’t decide what to cook? Spin the wheel of flavor and get a
                  surprise recipe! Perfect for adventurous foodies or anyone
                  tired of overthinking dinner
                </p>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="selectedType"
                :items="types"
                label="Type"
                hide-details
                item-title="text"
                item-value="value"
                density="compact"
                clearable></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="selectedDiet"
                :items="diets"
                label="Diet"
                item-title="text"
                item-value="value"
                hide-details
                density="compact"
                clearable></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="selectedCuisine"
                :items="cuisines"
                item-title="text"
                item-value="value"
                label="Cuisine"
                hide-details
                density="compact"
                clearable></v-select>
            </v-col>
          </v-row>

          <v-btn
            class="mt-4 mb-2"
            elevation="0"
            color="white"
            style="letter-spacing: normal; text-transform: capitalize"
            :loading="loading"
            block
            @click="generateRandomRecipe">
            <p
              :style="
                $vuetify.theme.global.name === 'dark'
                  ? 'color: #ff7800;'
                  : 'color: #ff7800'
              ">
              Generate Random Recipe
            </p>
          </v-btn>
        </v-sheet>
      </v-col>
      <v-col :cols="$vuetify.display.smAndDown ? 12 : 4" class="fade-area">
        <transition name="fade">
          <v-card
            elevation="0"
            v-if="recipe"
            :to="`/recipe/${recipe.id}`"
            style="border-radius: 4px; height: 200px"
            class="fade-in"
            :style="
              $vuetify.theme.global.name === 'dark'
                ? 'background-color: #4f4f4f; '
                : 'background-color: #fafafa; '
            ">
            <v-img
              cover
              position="center"
              style="border-radius: 4px"
              :src="recipe.image"
              height="160">
            </v-img>
            <div class="pa-2">
              <p style="text-transform: capitalize">
                {{ recipe.title }}
              </p>
            </div>
          </v-card>
        </transition>

        <!-- Static content saat belum ada hasil -->
        <div
          v-if="!recipe && !$vuetify.display.smAndDown"
          style="height: 210px; border-radius: 4px"
          class="text-center pa-4 d-flex flex-column align-center justify-center"
          :style="
            $vuetify.theme.global.name === 'dark'
              ? 'background-color: #4f4f4f; '
              : 'background-color: #fafafa; '
          ">
          <v-icon size="40" class="mb-2" color="grey"
            >mdi-help-circle-outline</v-icon
          >
          <p class="text-subtitle-1 font-weight-medium">No recipe yet</p>
          <p class="text-caption text-grey">
            Select filters and click "Generate Random Recipe"
          </p>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "RandomRecipe",
    data() {
      return {
        recipe: null,
        loading: false,
        selectedType: null,
        selectedDiet: null,
        selectedCuisine: null,
        types: [
          { text: "Main course", value: "main course" },
          { text: "Side dish", value: "side dish" },
          { text: "Dessert", value: "dessert" },
          { text: "Appetizer", value: "appetizer" },
          { text: "Salad", value: "salad" },
          { text: "Bread", value: "bread" },
          { text: "Breakfast", value: "breakfast" },
          { text: "Soup", value: "soup" },
          { text: "Beverage", value: "beverage" },
          { text: "Sauce", value: "sauce" },
          { text: "Marinade", value: "marinade" },
          { text: "Fingerfood", value: "fingerfood" },
          { text: "Snack", value: "snack" },
          { text: "Drink", value: "drink" },
        ],
        diets: [
          { text: "Gluten free", value: "gluten free" },
          { text: "Ketogenic", value: "ketogenic" },
          { text: "Vegetarian", value: "vegetarian" },
          { text: "Lacto‑vegetarian", value: "lacto-vegetarian" },
          { text: "Ovo‑vegetarian", value: "ovo-vegetarian" },
          { text: "Vegan", value: "vegan" },
          { text: "Pescetarian", value: "pescetarian" },
          { text: "Paleo", value: "paleo" },
          { text: "Primal", value: "primal" },
          { text: "Low FODMAP", value: "low FODMAP" },
          { text: "Whole30", value: "whole30" },
        ],
        cuisines: [
          { text: "American", value: "American" },
          { text: "Asian", value: "Asian" },
          { text: "British", value: "British" },
          { text: "Cajun", value: "Cajun" },
          { text: "Caribbean", value: "Caribbean" },
          { text: "Chinese", value: "Chinese" },
          { text: "Eastern European", value: "Eastern European" },
          { text: "European", value: "European" },
          { text: "French", value: "French" },
          { text: "German", value: "German" },
          { text: "Greek", value: "Greek" },
          { text: "Indian", value: "Indian" },
          { text: "Irish", value: "Irish" },
          { text: "Italian", value: "Italian" },
          { text: "Japanese", value: "Japanese" },
          { text: "Jewish", value: "Jewish" },
          { text: "Korean", value: "Korean" },
          { text: "Latin American", value: "Latin American" },
          { text: "Mediterranean", value: "Mediterranean" },
          { text: "Mexican", value: "Mexican" },
          { text: "Middle Eastern", value: "Middle Eastern" },
          { text: "Nordic", value: "Nordic" },
          { text: "Southern", value: "Southern" },
          { text: "Spanish", value: "Spanish" },
          { text: "Thai", value: "Thai" },
          { text: "Vietnamese", value: "Vietnamese" },
        ],
      };
    },
    methods: {
      async generateRandomRecipe() {
        this.loading = true;

        try {
          const params = {
            number: 1,
            apiKey: process.env.VUE_APP_SPOONACULAR_API_KEY,
          };

          if (this.selectedType) params.type = this.selectedType;
          if (this.selectedDiet) params.diet = this.selectedDiet;
          if (this.selectedCuisine) params.cuisine = this.selectedCuisine;

          const res = await axios.get(
            "https://api.spoonacular.com/recipes/complexSearch",
            {
              params,
            }
          );

          if (res.data.results.length) {
            this.recipe = res.data.results[0];
          } else {
            this.recipe = null;
          }
        } catch (error) {
          console.error("Failed to fetch random recipe:", error);
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>

<style scope>
  .no-shadow.v-input {
    --v-shadow: none !important;
    box-shadow: none !important;
  }
</style>
