// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/HomeView.vue";
import RecipeDetails from "@/views/RecipeDetails.vue";
import RecipeList from "@/views/RecipeList.vue";
import PofileUser from "@/views/UserProfile.vue";
import LoginPage from "@/views/LoginView.vue";
import RegisterPage from "@/views/RegisterView.vue";
import { useAuthStore } from "@/stores/authStore";

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
  {
    path: "/profile",
    name: "Profile",
    component: PofileUser,
    meta: { authOnly: true },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      if (authStore.user) {
        next("/"); // redirect kalau sudah login
      } else {
        next();
      }
    },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      if (authStore.user) {
        next("/"); // redirect kalau sudah login
      } else {
        next();
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Tunggu hingga authStore sudah inisialisasi (mencegah flicker)
  if (!authStore.initialized) {
    await new Promise((resolve) => {
      const unwatch = authStore.$subscribe((_, state) => {
        if (state.initialized) {
          unwatch();
          resolve();
        }
      });
    });
  }

  // Jika route butuh login, tapi user belum login, redirect ke /login
  if (to.meta.authOnly && !authStore.user) {
    return next("/login");
  }

  // Jika route hanya untuk guest (belum login), tapi user sudah login, redirect ke /
  if (to.meta.guestOnly && authStore.user) {
    return next("/");
  }

  next();
});

export default router;
