// stores/recipeSearch.js
import { defineStore } from "pinia";
import axios from "axios";

export const useRecipeStore = defineStore("recipeStore", {
  state: () => ({
    recipes: [],
    totalResults: 0,
  }),
  actions: {
    async fetchRecipes(query, page = 1, number = 10) {
      const apiKey = process.env.VUE_APP_SPOONACULAR_API_KEY;
      const offset = (page - 1) * number;
      const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=${number}&offset=${offset}&apiKey=${apiKey}`;

      try {
        const response = await axios.get(url);
        this.recipes = response.data.results;
        this.totalResults = response.data.totalResults;
      } catch (error) {
        console.error(
          "Error fetching recipes:",
          error.response?.data || error.message
        );
      }
    },
  },
});
