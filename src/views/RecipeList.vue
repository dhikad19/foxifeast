<template>
  <v-container>
    <h1 class="mb-4">Recipe List for ID: {{ id }}</h1>
    <v-row>
      <v-col
        v-for="recipe in recipes"
        :key="recipe.uniqueId"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card>
          <v-img :src="recipe.image" :alt="recipe.title" height="200px"></v-img>
          <v-card-title>{{ recipe.title }}</v-card-title>
          <v-card-actions>
            <v-btn :to="`/recipe/${recipe.id}`" color="blue" outlined>View Details</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <p v-if="!recipes.length" class="text-gray-500 mt-6">No recipes found for this category.</p>
  </v-container>
</template>

<script>
import { useRecipeStore } from "@/stores/recipeSearch"; // Replace with your store path

export default {
  props: ["id"],
  data() {
    return {
      recipes: [],
    };
  },
  async created() {
    const store = useRecipeStore();
    await store.fetchRecipes(`category=${this.id}`);
    // Tambahkan properti uniqueId untuk menghindari duplicate keys
    this.recipes = store.recipes.map((recipe, index) => ({
      ...recipe,
      uniqueId: recipe.id || `recipe-${index}`,
    }));
  },
};
</script>
