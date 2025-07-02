<template>
  <div class="container mx-auto p-4">
    <v-btn @click="$router.back()" variant="outlined" class="mb-4">Back</v-btn>

    <v-card variant="text" v-if="recipe">
      <v-img :src="recipe.image" :alt="recipe.title" height="300px" cover />

      <p class="text-h5 font-weight-bold">{{ recipe.title }}</p>

      <div class="d-flex flex-wrap gap-2">
        <v-chip v-if="recipe.glutenFree" color="green" text-color="white" size="small">Gluten Free</v-chip>
        <v-chip v-if="recipe.dairyFree" color="blue" text-color="white" size="small">Dairy Free</v-chip>
        <v-chip v-if="recipe.vegan" color="deep-purple" text-color="white" size="small">Vegan</v-chip>
        <v-chip v-if="recipe.vegetarian" color="orange" text-color="white" size="small">Vegetarian</v-chip>
      </div>

      <div>
        <div v-if="recipe.summary" v-html="recipe.summary" class="mb-4" />

        <v-row>
          <v-col cols="12" md="6">
            <strong>Details:</strong>
            <v-list density="compact">
              <v-list-item>🍽️ Servings: {{ recipe.servings }}</v-list-item>
              <v-list-item>⏱️ Ready in: {{ recipe.readyInMinutes }} min</v-list-item>
              <v-list-item>💪 Health Score: {{ recipe.healthScore }}</v-list-item>
              <v-list-item>💰 Price/Serving: ${{ (recipe.pricePerServing / 100).toFixed(2) }}</v-list-item>
              <v-list-item>🔥 Weight Watcher Points: {{ recipe.weightWatcherSmartPoints }}</v-list-item>
              <v-list-item v-if="recipe.aggregateLikes">❤️ Likes: {{ recipe.aggregateLikes }}</v-list-item>
            </v-list>
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <div v-if="recipe.extendedIngredients">
          <strong>Ingredients</strong>
          <div 
            v-for="ingredient in recipe.extendedIngredients"
            :key="ingredient.id"
          >
            <p>
              {{ ingredient.original }}
            </p>
          </div>
        </div>

        <v-divider class="my-4" />

        <div v-if="recipe.analyzedInstructions?.length">
          <strong>Step</strong>
          <div 
            v-for="step in recipe.analyzedInstructions[0].steps"
            :key="step.number"
            class="pb-2"
          >
            <div class="d-flex">
              <div style="">
                {{ step.number }}
              </div>
              <p>{{ step.step }}</p>
            </div>
          </div>
        </div>
      </div>
    </v-card>

    <p v-else class="text-gray-500">Loading recipe details...</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['id'],
  data() {
    return {
      recipe: null,
    };
  },
  async created() {
    const apiKey = process.env.VUE_APP_SPOONACULAR_API_KEY;
    const url = `https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${apiKey}`;
    try {
      const response = await axios.get(url);
      this.recipe = response.data;
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  },
};
</script>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}
</style>
