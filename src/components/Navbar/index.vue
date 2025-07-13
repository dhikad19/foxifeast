<template>
  <v-app-bar app elevation="0">
    <div
      class="d-flex align-center justify-space-between mx-auto pl-4 pr-4"
      style="max-width: 1140px; width: 100%">
      <div class="d-flex align-center">
        <v-icon
          class="mr-4"
          v-if="$vuetify.display.smAndDown"
          @click.stop="drawer = !drawer"
          >{{ drawer ? "mdi-close" : "mdi-menu" }}</v-icon
        >
        <v-img
          src="/assets/logo.png"
          style="cursor: pointer"
          @click="handleHome"
          max-height="35"
          min-width="35"></v-img>
        <div
          v-if="!$vuetify.display.smAndDown"
          class="d-flex align-center ml-4"
          :style="$vuetify.display.smAndDown ? 'gap: 10px' : 'gap: 20px'"
          :class="$vuetify.display.smAndDown ? '' : ''">
          <div v-for="(item, i) in items" :key="i" style="font-size: 15px">
            {{ item }}
          </div>
        </div>
      </div>
      <div class="d-flex align-center">
        <v-autocomplete
          v-model="selectedRecipe"
          :items="results"
          :loading="loading"
          item-title="title"
          item-value="id"
          return-object
          no-filter
          class="mx-auto mr-3"
          style="min-width: 350px; margin-bottom: -22px"
          v-if="!$vuetify.display.smAndDown"
          hide-no-data
          :hide-details="false"
          density="compact"
          append-inner-icon="mdi-magnify"
          variant="outlined"
          rounded
          menu-icon=""
          placeholder="Search recipe or ingredient"
          @keydown.enter="searchRecipes"
          @update:search="onSearch"
          @update:model-value="onSelect" />
        <div class="d-flex align-center">
          <div class="d-flex align-center">
            <!-- Jangan akses authStore langsung jika masih null -->
            <div v-if="authStore && authStore.initialized">
              <div
                @click="toProfile"
                v-if="
                  authStore.user &&
                  authStore.user?.photoURL &&
                  authStore.user?.displayName
                "
                class="d-flex align-center button-profile"
                :style="
                  $vuetify.theme.global.name === 'dark'
                    ? 'background-color: #4f4f4f; '
                    : 'background-color: #fafafa; '
                ">
                <v-img
                  v-if="user.photoURL"
                  class="mr-2"
                  referrerpolicy="no-referrer"
                  style="border-radius: 50%; max-height: 20px; width: 20px"
                  :to="'/profile'"
                  :src="user.photoURL"
                  alt="User Photo" />
                <p
                  style="
                    font-size: 14px;
                    font-weight: 500;
                    line-height: normal;
                  ">
                  {{ user.displayName }}
                </p>
              </div>
              <div
                v-else
                text
                @click="handleLogin"
                class="button-profile"
                :style="
                  $vuetify.theme.global.name === 'dark'
                    ? 'background-color: #4f4f4f; '
                    : 'background-color: #fafafa; '
                ">
                <p style="font-size: 15px; line-height: normal">Login</p>
              </div>
            </div>
          </div>

          <div
            @click="toggleTheme"
            class="toggle-mode"
            :class="$vuetify.display.smAndDown ? 'mb-1' : ''"
            :style="
              !isDark
                ? 'background-color: #fafafa'
                : 'background-color: #4f4f4f'
            ">
            <v-icon style="font-size: 18px">
              {{ isDark ? "mdi-white-balance-sunny" : "mdi-weather-night" }}
            </v-icon>
          </div>
        </div>
      </div>
    </div>
  </v-app-bar>
  <v-divider v-if="!$vuetify.display.smAndDown"></v-divider>
  <v-app-bar
    app
    elevation="5"
    :style="$vuetify.display.smAndDown ? 'margin-top: -1px;' : ''"
    scroll-behavior="hide"
    :height="$vuetify.display.smAndDown ? 65 : 45">
    <div style="width: 100%" v-if="!$vuetify.display.smAndDown">
      <v-divider style="margin-top: -14px"></v-divider>
      <div
        :class="$vuetify.display.smAndDown ? 'ml-4' : ''"
        class="d-flex align-center justify-space-between mx-auto mt-2 pl-4 pr-4"
        style="max-width: 1140px; width: 100%">
        <div
          class="d-flex align-center"
          :style="$vuetify.display.smAndDown ? 'gap: 10px' : 'gap: 20px'">
          <div
            v-for="(item, i) in headerAdditional"
            :key="i"
            style="font-size: 15px">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    <div v-else style="width: 100%; margin-bottom: -10px" class="pl-4 pr-4">
      <v-autocomplete
        v-model="selectedRecipe"
        :items="results"
        :loading="loading"
        item-title="title"
        item-value="id"
        return-object
        no-filter
        hide-no-data
        :hide-details="false"
        density="compact"
        variant="outlined"
        menu-icon=""
        placeholder="Search recipe or ingredient"
        @keydown.enter="searchRecipes"
        @update:search="onSearch"
        @update:model-value="onSelect" />
    </div>
  </v-app-bar>
  <v-navigation-drawer style="margin-top: -1px" v-model="drawer" temporary>
    <v-list>
      <v-list-item
        v-for="item in items"
        :key="item"
        link
        :title="item"></v-list-item>
      <v-list-group value="Recipes">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Recipes"> </v-list-item>
        </template>
        <v-list-item
          v-for="(item, i) in headerAdditional"
          :key="i"
          link
          :title="item.name">
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  import { useRecipeStore } from "@/stores/recipeSearch";
  import { useAuthStore } from "@/stores/authStore";
  import axios from "axios";

  export default {
    name: "NavbarComponent",

    data() {
      return {
        selectedRecipe: null,
        query: "",
        results: [],
        loading: false,
        cancelToken: null,
        drawer: false,
        authStore: useAuthStore(),
        search: "",
        headerAdditional: [
          {
            name: "Dinner",
          },
          {
            name: "Quick & Easy",
          },
          {
            name: "Healthy",
          },
          {
            name: "Cheap & Tasty",
          },
        ],
        items: ["Home", "Recipes", "Blog"],
      };
    },

    computed: {
      isDark() {
        return this.$vuetify.theme.global.name === "dark";
      },
      user() {
        return this.authStore.user;
      },
    },

    mounted() {
      this.authStore = useAuthStore();
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        this.$vuetify.theme.global.name = savedTheme;
      } else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        this.$vuetify.theme.global.name = prefersDark ? "dark" : "light";
      }
    },

    methods: {
      commitBlankData() {
        const blank = this.blankData;
        Object.entries(blank).forEach(([key, value]) => {
          this.$store.commit(`customerHolder/${key}`, value);
        });
      },

      toProfile() {
        this.$router.push("/profile");
      },

      handleHome() {
        this.$router.push("/");
      },

      handleLogin() {
        this.$router.push("/login");
      },

      async onSearch(query) {
        this.query = query;

        if (query.length < 4) {
          this.results = [];
          return;
        }

        if (this.cancelToken) {
          this.cancelToken.cancel("Cancel previous request");
        }

        this.cancelToken = axios.CancelToken.source();
        this.loading = true;

        try {
          const res = await axios.get(
            `https://api.spoonacular.com/recipes/autocomplete`,
            {
              params: {
                number: 5,
                query,
                apiKey: process.env.VUE_APP_SPOONACULAR_API_KEY,
              },
              cancelToken: this.cancelToken.token,
            }
          );
          this.results = res.data;
        } catch (err) {
          if (!axios.isCancel(err)) {
            console.error("Autocomplete error:", err);
          }
        } finally {
          this.loading = false;
        }
      },

      logout() {
        const store = useAuthStore();
        store.logout().then(() => {
          this.$router.push("/login");
        });
      },

      onSelect(item) {
        if (item?.id) {
          this.selectedRecipe = null;
          this.$router.push(`/recipe/${item.id}`);
        }
      },

      toggleTheme() {
        const next = this.isDark ? "light" : "dark";
        this.$vuetify.theme.global.name = next;
        localStorage.setItem("theme", next);
      },

      async searchRecipes() {
        const store = useRecipeStore();
        await store.fetchRecipes(this.query);
        this.$router.push(`/recipe-list/${this.query}`);
      },
    },
  };
</script>

<style scoped>
  .button-profile {
    padding: 10px;
    cursor: pointer;
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 2px;
    border-radius: 20px;
  }
  .toggle-mode {
    padding: 10px;
    display: flex;
    align-items: center;
    margin-left: 10px;
    cursor: pointer;
    justify-content: center;
    border-radius: 50%;
  }
  .text-decoration-none {
    text-decoration: none;
  }
  .text-black {
    color: black;
  }
</style>
