<template>
  <v-container class="py-8">
    <v-card v-if="user" class="mx-auto max-w-md pa-6 rounded-xl shadow">
      <v-card-title class="text-h6 font-bold">User Profile</v-card-title>
      <v-divider class="my-4" />

      <v-list>
        <v-list-item>
          <v-list-item-title>Email:</v-list-item-title>
          <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
        </v-list-item>
        {{ user }}
        <v-list-item v-if="user.displayName">
          <v-list-item-title>Name:</v-list-item-title>
          <v-list-item-subtitle>{{ user }}</v-list-item-subtitle>
        </v-list-item>

        <v-list-item v-if="user.photoURL">
          <v-list-item-title>Photo:</v-list-item-title>
          <v-list-item-subtitle>
            <v-avatar size="64">
              <img :src="user.photoURL" alt="User Photo" />
            </v-avatar>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <h2 class="text-h5 mb-4">Your Favorite Recipes</h2>
      <v-alert v-if="favorites.length === 0" type="info">No favorite recipes yet.</v-alert>
      
      <v-row>
        <v-col
          v-for="recipe in favorites"
          :key="recipe.id"
          cols="12"
          md="4"
        >
          <v-card :to="`/recipe/${recipe.id}`" class="hover:scale-105 transition">
            <v-img :src="recipe.image" height="200px" />
            <v-card-title>{{ recipe.title }}</v-card-title>
          </v-card>
        </v-col>
      </v-row>
  
      <v-card-actions class="mt-4">
        <v-btn color="red" @click="logout">Logout</v-btn>
      </v-card-actions>
    </v-card>

    <div v-else class="text-center text-gray-500">You are not logged in.</div>
  </v-container>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import { useFavoritesStore } from "@/stores/favoritesStore";

export default {
  name: "UserProfile",
  computed: {
    user() {
      const store = useAuthStore();
      return store.user;
    },
    favorites() {
      return useFavoritesStore().favorites;
    },

  },
  methods: {
    logout() {
      const store = useAuthStore();
      store.logout().then(() => {
        this.$router.push("/login");
      });
    },
  },
  async mounted() {
    const store = useFavoritesStore();
    await store.loadFavorites();
  }
};
</script>

<style scoped>
.max-w-md {
  max-width: 420px;
}
</style>
