<template>
  <v-app-bar app color="white" elevation="0">
    <div class="d-flex align-center justify-space-between mx-auto" style="max-width: 1140px; width: 100%;">
      <div class="d-flex align-center" style="width: 100%">
        <v-app-bar-nav-icon v-if="$vuetify.display.mobile" @click.stop="drawer = !drawer" variant="text"></v-app-bar-nav-icon>
        <v-img src="/assets/logo.png" max-height="35" max-width="35"></v-img>
      </div>
      <div class="d-flex align-center" :style="$vuetify.display.mobile ? 'gap: 10px' : 'gap: 20px'" :class="$vuetify.display.mobile ? 'mr-4' : ''" >
        <div v-for="(item, i) in items" :key="i" style="font-size: 15px">
          {{ item }}
        </div>
      </div>
    </div>
  </v-app-bar>
  <v-divider></v-divider>
  <v-app-bar scroll-behavior="hide" :height="$vuetify.display.mobile ? 65 : 45">
    <div style="width: 100%" v-if="!$vuetify.display.mobile">
      <v-divider style="margin-top: -14px;"></v-divider>
      <div :class="$vuetify.display.mobile ? 'ml-4' : ''" class="d-flex align-center justify-space-between mx-auto mt-2" style="max-width: 1140px; width: 100%;">
        <div class="d-flex align-center" :style="$vuetify.display.mobile ? 'gap: 10px' : 'gap: 20px'">
          <div v-for="(item, i) in headerAdditional" :key="i" style="font-size: 15px">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    <div v-else style="width: 100%; margin-bottom: -10px" class="pl-4 pr-4">
      <v-text-field @keyup.enter="searchRecipes" v-model="query" density="compact" variant="outlined" placeholder="Search recipe or ingredient"></v-text-field>
    </div>
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    temporary
  >
    <v-list :items="items"></v-list>
  </v-navigation-drawer>
</template>

<script>
import { useRecipeStore } from "@/stores/recipeSearch";
export default {
  name: "NavbarComponent",
  data() {
    return {
      query: '',
      drawer: false,
      headerAdditional: [
        {
          name: 'Dinner'
        },
        {
          name: 'Quick & Easy'
        },
        {
          name: 'Healthy'
        },
        {
          name: 'Cheap & Tasty'
        },
      ],
      items: ["Home", "Recipes", "Blog"],
    };
  },
  methods: {
    async searchRecipes() {
      const store = useRecipeStore(); // Gunakan store
      await store.fetchRecipes(this.query); // Panggil metode di store
      this.$router.push(`/recipe-list/${this.query}`);
    },
  },
};
</script>
