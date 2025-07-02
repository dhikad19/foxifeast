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
    path: "/recipe-list/:id",
    name: "RecipeList",
    component: RecipeList,
    props: (route) => ({
      id: route.params.id,
      page: parseInt(route.query.page) || 1,
    }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
