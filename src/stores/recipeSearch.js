import { defineStore } from "pinia";
import axios from "axios";

export const useRecipeStore = defineStore("recipeStore", {
  state: () => ({
    recipes: [], // Menyimpan hasil pencarian
  }),
  actions: {
    async fetchRecipes(query) {
      const apiKey = process.env.VUE_APP_SPOONACULAR_API_KEY; // Replace with your Spoonacular API key
      const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=${apiKey}`;
      try {
        const response = await axios.get(url);
        this.recipes = response.data.results;
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    },
  },
});
