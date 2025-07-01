// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/HomeView.vue";
import RecipeDetails from "@/views/RecipeDetails.vue";
import RecipeList from "@/views/RecipeList.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  {
    path: "/recipe/:id",
    name: "RecipeDetails",
    component: RecipeDetails,
    props: true,
  },
  {
    path: "/recipe-list/:id", // Route dinamis untuk Recipe List
    name: "RecipeList",
    component: RecipeList,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
