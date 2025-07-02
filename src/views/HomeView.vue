<template>
  <div class="container mx-auto">
    <v-form @submit.prevent="searchRecipes" class="mb-6">
      <v-text-field
        v-model="query"
        label="Enter ingredients (e.g., chicken, tomato)"
        class="mb-4"
        outlined
      ></v-text-field>
      <v-btn color="blue" type="submit">Search</v-btn>
    </v-form>
    <v-container v-if="recipes.length" class="mt-6">
      <v-row>
        <v-col v-for="recipe in recipes" :key="recipe.id" cols="12" md="6" lg="4">
          <v-card>
            <v-img :src="recipe.image" :alt="recipe.title" height="200px"></v-img>
            <v-card-title>{{ recipe.title }}</v-card-title>
            <v-card-actions>
              <v-btn :to="`/recipe/${recipe.id}`" color="blue" outlined>View Details</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <p v-else class="text-gray-500">No recipes found. Try another search.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      query: 'meat',
      recipes: [],
    };
  },
  methods: {
    async searchRecipes() {
      const apiKey = process.env.VUE_APP_SPOONACULAR_API_KEY;
      const url = `https://api.spoonacular.com/recipes/complexSearch?query=${this.query}&number=10&apiKey=${apiKey}`;
      try {
        const response = await axios.get(url);
        this.recipes = response.data.results;
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    },
  },
};
</script>