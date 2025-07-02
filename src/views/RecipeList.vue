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

    <v-row justify="center" class="mt-6" v-if="totalPages > 1">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        @input="handlePageChange"
      ></v-pagination>
    </v-row>

    <p v-if="!recipes.length" class="text-gray-500 mt-6">No recipes found.</p>
  </v-container>
</template>

<script>
import { useRecipeStore } from "@/stores/recipeSearch";

export default {
  props: {
    id: String,
    page: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      recipes: [],
      currentPage: 1,
      perPage: 10,
      totalResults: 0,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalResults / this.perPage);
    },
  },
  watch: {
    '$route.query.page': {
      immediate: true,
      handler(newPage) {
        this.currentPage = parseInt(newPage) || 1;
        this.fetchRecipesById(this.id, this.currentPage);
      },
    },
    id(newId) {
      this.$router.push({ name: 'RecipeList', params: { id: newId }, query: { page: 1 } });
    },
    currentPage(newPage) {
      if (parseInt(this.$route.query.page) !== newPage) {
        this.$router.push({ name: 'RecipeList', params: { id: this.id }, query: { page: newPage } });
      }
    }
  },
  methods: {
    async fetchRecipesById(id, page) {
      const store = useRecipeStore();
      await store.fetchRecipes(id, page, this.perPage);
      this.totalResults = store.totalResults;

      this.recipes = store.recipes.map((recipe, index) => ({
        ...recipe,
        uniqueId: recipe.id || `recipe-${index}`,
      }));
    },
  },
};
</script>
