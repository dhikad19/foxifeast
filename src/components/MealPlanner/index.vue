<template>
  <div fluid>
    <v-alert v-show="!user" type="warning" dense class="mb-4">
      Login required to save meal plan.
    </v-alert>

    <div
      v-for="(day, index) in week"
      :key="index"
      class="mb-6"
    >
      <div 
      class="pa-4"
      :style="
      $vuetify.theme.global.name === 'dark'
        ? 'background-color: #4f4f4f; '
        : 'background-color: #fafafa; '
    ">
        <div class="d-flex justify-space-between align-center mb-4">
          <h3 class="text-h6 mb-0">{{ day.name }}</h3>
          <span class="text-caption text-grey">{{ day.date }}</span>
        </div>

        <v-row dense>
          <v-col
            v-for="session in sessions"
            :key="session"
            cols="12"
            md="4"
            class="mb-4"
          >
            <div style="border-radius: 4px" class="pa-2" :style="
            $vuetify.theme.global.name === 'dark'
              ? 'background-color: #777777; '
              : 'background-color: #dddddd; '
          ">
              <h4 class="text-subtitle-2 font-weight-medium mb-2">
                {{ session.charAt(0).toUpperCase() + session.slice(1) }}
              </h4>

              <div class="d-flex align-center justify-center w-100">
                <v-btn
                  icon
                  flat
                  @click="openSearchDialog(index, session, day.name)"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>

              <v-card flat class="mt-4 pa-2">
                <v-row dense v-if="day.sessions[session].length > 0" >
                  <v-col :key="meal.id" :cols="$vuetify.display.smAndDown ? 6 : 4" v-for="meal in day.sessions[session]">
                    <v-card class="card-hover" flat>
                      <div class="card-overlay-container">
                        <!-- Overlay full background with centered delete button -->
                        <div class="delete-overlay">
                          <v-btn
                            icon
                            size="small"
                            flat
                            @click="removeMeal(meal.id, index, session)"
                          >
                            <v-icon size="20">mdi-delete</v-icon>
                          </v-btn>
                        </div>
                    
                        <!-- Content -->
                        <v-list-item class="pa-0">
                          <v-img :src="meal.image" cover class="mb-2" style="border-radius: 4px" />
                          <v-list-item-content>
                            <v-list-item-title class="text-body-2 font-weight-medium">
                              {{ meal.title }}
                            </v-list-item-title>
                            <v-list-item-subtitle class="text-caption">
                              {{ meal.nutrition?.calories || 0 }} kcal
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
                <div v-else class="d-flex align-center justify-center pa-4 flex-column">
                  <v-icon class="mb-1">
                    mdi-food-drumstick-outline
                  </v-icon>
                  <p style="font-weight: 500;">Meals empty</p>
                </div>
              </v-card>
              
            </div>
          </v-col>
        </v-row>

        <div
          v-if="getDayNutrition(day)"
          class="text-caption text-grey-darken-1 mt-2"
        >
          {{ getDayNutrition(day) }}
        </div>
      </div>
    </div>

    <v-dialog 
      :fullscreen="$vuetify.display.smAndDown" 
      v-model="dialog.visible" 
      max-width="500px"
    >
      <v-card class="pa-0 w-100">
        <!-- Header -->
        <div class="d-flex align-center justify-space-between pt-3 px-4">
          <v-card-title style="font-size: 18px" class="font-bold pa-0">
            Add Recipe ({{ dialog.dayName }} - {{ dialog.sessionLabel }})
          </v-card-title>
          <v-btn icon @click="dialog.visible = false" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-divider class="my-1" />

        <!-- Body -->
        <v-card-text class="pt-2">
          <!-- Search Field -->
          <v-text-field
            v-model="dialog.search"
            label="Search Recipes"
            variant="outlined"
            density="compact"
            clearable
            class="mb-2"
          />

          <!-- Scrollable Result List -->
          <div :style="$vuetify.display.smAndDown ? 'max-height: 80vh;' : 'max-height: 500px;'" style="overflow-x: hidden; height: 100%; overflow-y: auto;">
            <v-row :dense="true" v-if="dialog.search">
              <v-col cols="6" v-for="item in dialog.results"
              :key="item.id"
              @click="selectRecipeFromDialog(item)">
                <v-img style="border-radius: 4px" :src="item.image" cover height="150" />
                <p style="font-weight: 500">{{ item.title }}</p>
              </v-col>
            </v-row>
            <div v-else class="d-flex h-100 align-center text-center justify-center">
              <p>Say something like "donut"</p>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>


    <v-btn
      color="#ff7800"
      flat
      class="mt-4"
      @click="saveMealPlan"
      :loading="saving"
      :disabled="!user"
      style="
        text-transform: capitalize;
        font-weight: 500;
        width: 150px;
        letter-spacing: normal;
        "
      block
      height="45"
    >
      Save Meal Plan
    </v-btn>

    <v-snackbar
      v-model="snackbar"
      :timeout="5000"
    >
      {{ text }}

      <template v-slot:actions>
        <v-btn
          color="#ff7800"
          variant="text"
          @click="snackbar = false"
          style="text-transform: capitalize"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
  import axios from "axios";
  import { db } from "@/firebase";
  import { useAuthStore } from "@/stores/authStore";
  import {
    collection,
    doc,
    setDoc,
    getDoc,
    deleteDoc,
  } from "firebase/firestore";

  export default {
    name: "MealPlanner",
    sessions: ["morning", "noon", "evening"],
    
    watch: {
      'dialog.search': function (val) {
          this.onSearchDialogInput(val);
        },
      "auth.user": {
        handler(user) {
          if (user) {
            this.user = user;
            this.loadMealPlan();
          }
        },
        immediate: true,
      },
    },

    data() {
      const today = new Date();
      const sessions = ["morning", "noon", "evening"];
      const week = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
    return {
      date: date.toISOString().split("T")[0],
      name: date.toLocaleDateString("en-US", { weekday: "long" }),
      snackbar: false,
      text: "",
      sessions: {
        morning: [],
        noon: [],
        evening: [],
      },
    };
  });

  const buildSessionObj = (defaultVal) =>
    Object.fromEntries(
      Array.from({ length: 7 }, (_, i) => [
        i,
        { morning: defaultVal, noon: defaultVal, evening: defaultVal },
      ])
    );

  return {
    week,
    sessions,
    search: buildSessionObj(null),
    suggestions: buildSessionObj([]),
    loading: buildSessionObj(false),
    saving: false,
    user: useAuthStore().user,

    // ⬇️ Pindahkan ke sini
    dialog: {
      visible: false,
      dayIndex: null,
      session: '',
      sessionLabel: '',
      dayName: '',
      search: '',
      results: [],
      loading: false,
    },
  };
},


    mounted() {
      if (this.user) {
        this.loadMealPlan();
      } else {
        this.generateEmptyWeek();
      }
    },

    methods: {
      openSearchDialog(dayIndex, session, dayName) {
  this.dialog = {
    visible: true,
    dayIndex,
    session,
    sessionLabel: session.charAt(0).toUpperCase() + session.slice(1),
    dayName,
    search: '',
    results: [],
    loading: false,
  };
},

async onSearchDialogInput(query) {
  if (!query || typeof query !== 'string') return;

  this.dialog.loading = true;
  try {
    const res = await axios.get(
      'https://api.spoonacular.com/recipes/autocomplete',
      {
        params: {
          apiKey: process.env.VUE_APP_SPOONACULAR_API_KEY,
          number: 5,
          query,
        },
      }
    );

    this.dialog.results = res.data.map((item) => ({
      id: item.id,
      title: item.title,
      image: `https://spoonacular.com/recipeImages/${item.id}-312x231.${item.imageType}`,
    }));

  } catch (e) {
    console.error('Suggestion error:', e);
  } finally {
    this.dialog.loading = false;
  }
},


async selectRecipeFromDialog(item) {
  try {
    const res = await axios.get(
      `https://api.spoonacular.com/recipes/${item.id}/information`,
      {
        params: {
          apiKey: process.env.VUE_APP_SPOONACULAR_API_KEY,
          includeNutrition: true,
        },
      }
    );

    const recipe = res.data;
    const nutrition = recipe.nutrition?.nutrients || [];
    const get = (name) =>
      Math.round(nutrition.find((n) => n.name === name)?.amount || 0);

    this.week[this.dialog.dayIndex].sessions[this.dialog.session].push({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      nutrition: {
        calories: get("Calories"),
        protein: get("Protein"),
        fat: get("Fat"),
        carbs: get("Carbohydrates"),
      },
    });

    this.dialog.visible = false;
  } catch (e) {
    console.error("Add meal from dialog error:", e);
  }
},



      generateEmptyWeek() {
        const today = new Date();

        this.week = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          return {
            date: date.toISOString().split("T")[0],
            name: date.toLocaleDateString("en-US", { weekday: "long" }),
            sessions: {
              morning: [],
              noon: [],
              evening: [],
            },
          };
        });

        this.search = Object.fromEntries(
          Array.from({ length: 7 }, (_, i) => [
            i,
            { morning: null, noon: null, evening: null },
          ])
        );

        this.suggestions = Object.fromEntries(
          Array.from({ length: 7 }, (_, i) => [
            i,
            { morning: [], noon: [], evening: [] },
          ])
        );

        this.loading = Object.fromEntries(
          Array.from({ length: 7 }, (_, i) => [
            i,
            { morning: false, noon: false, evening: false },
          ])
        );
      },

      async loadMealPlan() {
        try {
          const ref = doc(db, "mealPlans", this.user.uid);
          const snap = await getDoc(ref);

          if (snap.exists()) {
            const saved = snap.data().week;
            const firstDate = new Date(saved[0].date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Tambahkan batas waktu 7 hari
            const lastAllowedDate = new Date(firstDate);
            lastAllowedDate.setDate(firstDate.getDate() + 6); // minggu = 7 hari

            if (lastAllowedDate < today) {
              await deleteDoc(ref);
              console.log("Old meal plan deleted");
              return;
            }

            this.week = saved;
          }
        } catch (e) {
          console.error("Load error:", e);
        }
      },

      async resetMealPlan() {
        if (!this.user) return;
        try {
          await deleteDoc(doc(db, "mealPlans", this.user.uid));
          this.generateEmptyWeek(); // bikin ulang week
          this.text = "Meal plan has been reset"
          this.snackbar = true
        } catch (e) {
          console.error("Reset error:", e);
        }
      },

      async fetchSuggestions(query, dayIndex, session) {
        if (!query) return;
        this.loading[dayIndex][session] = true;
        try {
          const res = await axios.get(
            "https://api.spoonacular.com/recipes/autocomplete",
            {
              params: {
                apiKey: process.env.VUE_APP_SPOONACULAR_API_KEY,
                number: 5,
                query,
              },
            }
          );
          this.suggestions[dayIndex][session] = res.data.map((item) => ({
            id: item.id,
            title: item.title,
          }));
        } catch (e) {
          console.error("Suggestion error:", e);
          this.suggestions[dayIndex][session] = [];
        } finally {
          this.loading[dayIndex][session] = false;
        }
      },

      async addMeal(recipeId, dayIndex, session) {
        if (!recipeId) return;
        try {
          const res = await axios.get(
            `https://api.spoonacular.com/recipes/${recipeId}/information`,
            {
              params: {
                apiKey: process.env.VUE_APP_SPOONACULAR_API_KEY,
                includeNutrition: true,
              },
            }
          );

          const recipe = res.data;
          const nutrition = recipe.nutrition?.nutrients || [];
          const get = (name) =>
            Math.round(nutrition.find((n) => n.name === name)?.amount || 0);

          this.week[dayIndex].sessions[session].push({
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            nutrition: {
              calories: get("Calories"),
              protein: get("Protein"),
              fat: get("Fat"),
              carbs: get("Carbohydrates"),
            },
          });
          setTimeout(() => {
            this.search[dayIndex][session] = null;
          }, 0);
        } catch (e) {
          console.error("Add meal error:", e);
        }
      },

      removeMeal(id, dayIndex, session) {
        this.week[dayIndex].sessions[session] = this.week[dayIndex].sessions[
          session
        ].filter((meal) => meal.id !== id);
      },

      getDayNutrition(day) {
        const sum = { calories: 0, protein: 0, fat: 0, carbs: 0 };
        ["morning", "noon", "evening"].forEach((session) => {
          day.sessions[session].forEach((meal) => {
            sum.calories += meal.nutrition.calories;
            sum.protein += meal.nutrition.protein;
            sum.fat += meal.nutrition.fat;
            sum.carbs += meal.nutrition.carbs;
          });
        });
        return `Calories: ${sum.calories} kcal, Protein: ${sum.protein}g, Fat: ${sum.fat}g, Carbs: ${sum.carbs}g`;
      },

      async saveMealPlan() {
        if (!this.user) return;
        this.saving = true;
        try {
          const ref = doc(collection(db, "mealPlans"), this.user.uid);
          await setDoc(ref, {
            week: this.week,
            createdAt: new Date().toISOString(),
          });
          this.text = "Meal plan saved!"
          this.snackbar = true
        } catch (e) {
          console.error("Save error:", e);
          this.text = "Failed to save meal plan"
          this.snackbar = true
        } finally {
          this.saving = false;
        }
      },
    },
  };
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease-in-out;
}

.card-overlay-container {
  position: relative;
}

.delete-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4); /* full dark overlay */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.25s ease-in-out;
  z-index: 2;
}

.card-hover:hover .delete-overlay {
  opacity: 1;
}

@media (max-width: 600px) {
  .v-list-item-title {
    font-size: 14px;
  }
  .v-list-item-subtitle {
    font-size: 12px;
  }
}
</style>

