<template>
  <div class="container mx-auto p-4">
    <v-btn @click="$router.back()" outlined class="mb-4">Back</v-btn>
    <v-card v-if="recipe" class="p-4">
      <v-img :src="recipe.image" :alt="recipe.title" height="300px"></v-img>
      <v-card-title class="text-2xl font-bold">{{ recipe.title }}</v-card-title>
      <v-card-text>
        <p v-if="recipe.summary" v-html="recipe.summary"></p>
        <v-list v-if="recipe.extendedIngredients">
          <v-subheader>Ingredients:</v-subheader>
          <v-list-item v-for="ingredient in recipe.extendedIngredients" :key="ingredient.id">
            {{ ingredient.original }}
          </v-list-item>
        </v-list>
      </v-card-text>
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
    const apiKey = process.env.VUE_APP_SPOONACULAR_API_KEY; // Replace with your Spoonacular API key
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