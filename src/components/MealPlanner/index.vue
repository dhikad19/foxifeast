<template>
  <v-container>
    <h2 class="text-h5 mb-4">Weekly Meal Planner</h2>
    <v-alert v-if="!user" type="warning" dense
      >Login required to save meal plan.</v-alert
    >

    <v-row v-for="(day, index) in week" :key="index" class="mb-4">
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-between align-center">
            <span>{{ day.date }} ({{ day.name }})</span>
            <span v-if="getDayNutrition(day)" class="text-caption grey--text">
              {{ getDayNutrition(day) }}
            </span>
          </v-card-title>
          <v-card-text>
            <div v-for="session in sessions" :key="session" class="mb-4">
              <h4 class="text-subtitle-1 mb-2">
                {{ session.charAt(0).toUpperCase() + session.slice(1) }}
              </h4>

              <v-autocomplete
                v-model="search[index][session]"
                :items="suggestions[index][session]"
                :loading="loading[index][session]"
                item-title="title"
                item-value="id"
                label="Search Recipes"
                @update:search="(val) => fetchSuggestions(val, index, session)"
                @update:model-value="(val) => addMeal(val, index, session)"
                clearable
                hide-details
                density="compact"
                variant="solo" />

              <draggable
                v-model="day.sessions[session]"
                item-key="id"
                tag="div">
                <template #item="{ element: meal }">
                  <v-card class="my-2" outlined>
                    <v-list-item>
                      <v-list-item-avatar>
                        <v-img :src="meal.image" />
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>{{ meal.title }}</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ meal.nutrition?.calories || 0 }} kcal
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn
                          icon
                          @click="removeMeal(meal.id, index, session)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-card>
                </template>
              </draggable>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-btn
      color="primary"
      @click="saveMealPlan"
      :loading="saving"
      :disabled="!user">
      Save Meal Plan
    </v-btn>
  </v-container>
</template>

<script>
  import draggable from "vuedraggable";
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
    components: { draggable },
    watch: {
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
          alert("Meal plan has been reset.");
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

          this.search[dayIndex][session] = null;
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
        return `${sum.calories} kcal, P: ${sum.protein}g, F: ${sum.fat}g, C: ${sum.carbs}g`;
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

          alert("Meal plan saved!");
        } catch (e) {
          console.error("Save error:", e);
          alert("Failed to save meal plan.");
        } finally {
          this.saving = false;
        }
      },
    },
  };
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
</style>
