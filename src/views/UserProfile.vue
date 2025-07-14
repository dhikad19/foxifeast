<template>
  <v-container fluid class="pa-0">
    <div v-if="user">
      <!-- Cover Background -->
      <div class="cover-background mb-5">
        <!-- Avatar -->
        <v-avatar class="profile-avatar" size="120">
          <v-img v-if="user.photoURL" :src="user.photoURL" />
          <v-icon v-else size="80">mdi-account</v-icon>
        </v-avatar>
      </div>

      <!-- Info -->
      <v-container class="mt-10 text-center">
        <h2 class="text-h5 font-weight-medium">
          {{ user.displayName || "No name set" }}
        </h2>
        <p class="text-subtitle-2 text-grey">{{ user.email }}</p>

        <!-- Actions -->
        <div
          style="max-width: 300px; margin: 0 auto; width: 100%"
          class="d-flex align-center justify-space-between">
          <v-btn
            color="#FF8417"
            variant="elevated"
            @click="editDialog = true"
            prepend-icon="mdi-pencil">
            Edit Profile
          </v-btn>

          <v-btn
            color="red"
            variant="outlined"
            @click="logout"
            prepend-icon="mdi-logout">
            Logout
          </v-btn>
        </div>

        <!-- Favorite Recipes -->
        <h3 class="text-h6 mt-10 mb-4 text-left">Your Favorite Recipes</h3>
        <v-alert v-if="favorites.length === 0" type="info" class="text-left">
          No favorite recipes yet.
        </v-alert>

        <v-row v-else>
          <v-col
            v-for="recipe in favorites"
            :key="recipe.id"
            cols="12"
            sm="6"
            md="4">
            <v-card
              :to="`/recipe/${recipe.id}`"
              class="hover:scale-105 transition rounded-lg">
              <v-img :src="recipe.image" height="160px" class="rounded-t" />
              <v-card-title>{{ recipe.title }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Edit Dialog -->
      <v-dialog v-model="editDialog" max-width="500">
        <v-card>
          <v-card-title>Edit Profile</v-card-title>
          <v-card-text>
            <ProfileEdit @updated="handleProfileUpdated" />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="editDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <div v-else class="text-center text-grey mt-10">
      <v-icon size="40" class="mb-2">mdi-alert-circle-outline</v-icon>
      <div>You are not logged in.</div>
    </div>
  </v-container>
</template>

<script>
  import { useAuthStore } from "@/stores/authStore";
  import { useFavoritesStore } from "@/stores/favoritesStore";
  import ProfileEdit from "@/components/Profile/Edit.vue";

  export default {
    name: "UserProfile",
    components: { ProfileEdit },
    data() {
      return {
        editDialog: false,
      };
    },
    computed: {
      user() {
        return useAuthStore().user;
      },
      favorites() {
        return useFavoritesStore().favorites;
      },
    },
    methods: {
      async logout() {
        await useAuthStore().logout();
        this.$router.push("/login");
      },
      handleProfileUpdated() {
        this.editDialog = false;
      },
    },
    async mounted() {
      await useFavoritesStore().loadFavorites();
    },
  };
</script>

<style scoped>
  .cover-background {
    background-image: url("/public/assets/background-blend.png");
    background-size: cover;
    background-position: center;
    height: 200px;
    position: relative;
    border-radius: 8px;
  }

  .profile-avatar {
    position: absolute;
    bottom: -60px;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid white;
    background-color: white;
  }
  .text-grey {
    color: #666;
  }
</style>
