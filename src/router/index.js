import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/HomeView.vue";
import RecipeDetails from "@/views/RecipeDetails.vue";
import RecipeList from "@/views/RecipeList.vue";
import PofileUser from "@/views/UserProfile.vue";
import LoginPage from "@/views/LoginView.vue";
import SetUserProfile from "@/views/SetProfile.vue";
import RegisterPage from "@/views/RegisterView.vue";
import BlogList from "@/views/BlogList.vue";
import BlogDetail from "@/views/BlogDetail.vue";
import RecipeCategory from "@/views/RecipeCategory.vue";
import { useAuthStore } from "@/stores/authStore";
import { auth } from "@/firebase";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { title: "Foxi Feast | Find Your Best Meals" },
  },
  {
    path: "/recipe/:id",
    name: "RecipeDetails",
    component: RecipeDetails,
    props: true,
    meta: { title: "Foxi Feast | Recipe Details" },
  },
  {
    path: "/recipe-category/:category",
    name: "RecipeCategory",
    component: RecipeCategory,
    props: true,
    meta: { title: "Foxi Feast | Recipe Category" },
  },
  {
    path: "/recipe-list/:id",
    name: "RecipeList",
    component: RecipeList,
    props: (route) => ({
      id: route.params.id,
      page: parseInt(route.query.page) || 1,
    }),
    meta: { title: "Foxi Feast | Recipe List" },
  },
  {
    path: "/profile",
    name: "Profile",
    component: PofileUser,
    meta: { title: "Foxi Feast | Profile", authOnly: true },
  },
  {
    path: "/blog",
    name: "blog",
    component: BlogList,
    meta: { title: "Foxi Feast | Blog" },
  },
  {
    path: "/blog/:slug",
    name: "BlogDetail",
    component: BlogDetail,
    props: true,
    meta: { title: "Foxi Feast | Blog Detail" },
  },
  {
    path: "/setprofile",
    name: "SetProfile",
    component: SetUserProfile,
    meta: { title: "Foxi Feast | Set Profile", onlyAfterRegister: true },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: { title: "Foxi Feast | Login" },
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      if (authStore.user) {
        next("/");
      } else {
        next();
      }
    },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
    meta: { title: "Foxi Feast | Register" },
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      if (authStore.user) {
        next("/");
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

// Auth Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

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

  const user = auth.currentUser;

  if (to.meta.authOnly && !authStore.user) {
    return next("/login");
  }

  if (to.meta.guestOnly && authStore.user) {
    return next("/");
  }

  if (to.meta.onlyAfterRegister) {
    if (!user || (user.displayName && user.photoURL)) {
      return next("/");
    }
  }

  if (
    user &&
    (!user.displayName || !user.photoURL) &&
    to.name !== "SetProfile"
  ) {
    return next({ name: "SetProfile" });
  }

  next();
});

// Title Handler
router.afterEach((to) => {
  const defaultTitle = "Resepku App";
  document.title = to.meta.title || defaultTitle;
});

export default router;
