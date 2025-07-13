<template>
  <div>
    <p class="mb-4 title-list">Recipe list for {{ id }}</p>

    <v-row>
      <v-col
        v-for="(recipe, i) in recipes"
        :key="i"
        :cols="$vuetify.display.smAndDown ? 12 : 3">
        <div
          @click="handleToDetails(recipe.id)"
          class="cursor-pointer pa-4"
          style="border-radius: 4px"
          :style="
            $vuetify.theme.global.name === 'dark'
              ? 'background-color: #4f4f4f; '
              : 'background-color: #fafafa; '
          ">
          <v-img
            cover
            style="border-radius: 4px"
            :src="recipe.image"
            :alt="recipe.title"
            height="160px"></v-img>
          <p class="pt-4 title-text">{{ recipe.title }}</p>
        </div>
      </v-col>
    </v-row>

    <v-pagination
      v-if="totalPages > 1"
      class="mt-8 mb-6"
      v-model="currentPage"
      :length="totalPages"
      @input="handlePageChange"></v-pagination>

    <p v-if="!recipes.length" class="text-gray-500 mt-6">No recipes found.</p>
  </div>
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
        perPage: 12,
        totalResults: 0,
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.totalResults / this.perPage);
      },
    },
    watch: {
      "$route.query.page": {
        immediate: true,
        handler(newPage) {
          this.currentPage = parseInt(newPage) || 1;
          this.fetchRecipesById(this.id, this.currentPage);
        },
      },
      id(newId) {
        this.$router.push({
          name: "RecipeList",
          params: { id: newId },
          query: { page: 1 },
        });
      },
      currentPage(newPage) {
        if (parseInt(this.$route.query.page) !== newPage) {
          this.$router.push({
            name: "RecipeList",
            params: { id: this.id },
            query: { page: newPage },
          });
        }
      },
    },
    methods: {
      handleToDetails(id) {
        this.$router.push(`/recipe/${id}`);
      },
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

<style scope>
  .title-list {
    font-weight: 500;
    font-size: 19px;
  }
  .title-text {
    font-size: 14px;
    line-height: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
</style>
