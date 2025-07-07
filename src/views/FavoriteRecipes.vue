<template>
  <v-container>
    <h1 class="text-2xl font-bold mb-4">Resep Favorit Saya</h1>

    <v-alert v-if="!favorites.length" type="info" class="mt-4">
      Belum ada resep favorit.
    </v-alert>

    <v-row>
      <v-col
        v-for="recipe in favorites"
        :key="recipe.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card>
          <v-img :src="recipe.image" height="200px"></v-img>
          <v-card-title>{{ recipe.title }}</v-card-title>
          <v-card-actions>
            <v-btn :to="`/recipe/${recipe.id}`" color="primary" variant="outlined">
              Lihat Detail
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click="removeFromFavorites(recipe.id)">
              <v-icon color="red">mdi-heart</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useFavoritesStore } from "@/stores/favoritesStore";

export default {
  name: "FavoriteRecipes",
  setup() {
    const store = useFavoritesStore();

    store.loadFavorites();

    const removeFromFavorites = (id) => {
      store.removeFavorite(id);
    };

    return {
      favorites: store.favorites,
      removeFromFavorites,
    };
  },
};
</script>

<style scoped>
.v-card {
  transition: box-shadow 0.3s;
}
.v-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
</style>
