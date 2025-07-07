import { defineStore } from "pinia";
import { auth } from "@/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useFavoritesStore } from "./favoritesStore"; // Pastikan path sesuai

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    initialized: false,
    loading: false,
    error: null,
  }),

  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        this.user = result.user;

        const favStore = useFavoritesStore();
        await favStore.loadFavorites();
      } catch (error) {
        console.error("Login error:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        this.user = result.user;

        const favStore = useFavoritesStore();
        await favStore.loadFavorites();
      } catch (error) {
        console.error("Register error:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async loginWithGoogle() {
      const provider = new GoogleAuthProvider();
      this.error = null;
      try {
        const result = await signInWithPopup(auth, provider);
        this.user = result.user;

        const favStore = useFavoritesStore();
        await favStore.loadFavorites();
      } catch (error) {
        console.error("Google login error:", error);
        this.error = error.message;
        throw error;
      }
    },

    async logout() {
      try {
        await signOut(auth);
        this.user = null;

        const favStore = useFavoritesStore();
        favStore.favorites = [];
      } catch (error) {
        console.error("Logout error:", error);
      }
    },

    init() {
      onAuthStateChanged(auth, async (user) => {
        this.user = user || null;
        this.initialized = true;
        if (user && user.uid) {
          const favStore = useFavoritesStore();
          await favStore.loadFavorites();
        }
      });
    },
  },
});
