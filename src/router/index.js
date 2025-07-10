import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/HomeView.vue";
import RecipeDetails from "@/views/RecipeDetails.vue";
import RecipeList from "@/views/RecipeList.vue";
import PofileUser from "@/views/UserProfile.vue";
import LoginPage from "@/views/LoginView.vue";
import SetUserProfile from "@/views/SetProfile.vue";
import RegisterPage from "@/views/RegisterView.vue";
import { useAuthStore } from "@/stores/authStore";
import { auth } from "@/firebase";

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
    path: "/setprofile",
    name: "SetProfile",
    component: SetUserProfile,
    meta: { onlyAfterRegister: true }, // <- tambahan ini
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

  // Tunggu authStore siap (misalnya sedang loading user dari Firebase)
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

  // Auth-only route: harus login
  if (to.meta.authOnly && !authStore.user) {
    return next("/login");
  }

  // Guest-only route: harus logout
  if (to.meta.guestOnly && authStore.user) {
    return next("/");
  }

  // ✅ Route hanya boleh diakses setelah register dan belum punya nama/foto
  if (to.meta.onlyAfterRegister) {
    if (!user || (user.displayName && user.photoURL)) {
      return next("/"); // blokir akses langsung
    }
  }

  // ⛔ Jika user login tapi belum isi profil, paksa ke /setprofile
  if (
    user &&
    (!user.displayName || !user.photoURL) &&
    to.name !== "SetProfile"
  ) {
    return next({ name: "SetProfile" });
  }

  next();
});

export default router;
