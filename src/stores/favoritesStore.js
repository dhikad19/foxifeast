// stores/favoritesStore.js
import { defineStore } from "pinia";
import { db } from "@/firebase"; // pastikan `firebase.js` sudah inisialisasi firestore
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { useAuthStore } from "./authStore";

export const useFavoritesStore = defineStore("favorites", {
  state: () => ({
    favorites: [],
  }),

  actions: {
    async loadFavorites() {
      const authStore = useAuthStore();
      if (!authStore.user) return;

      const snapshot = await getDocs(
        collection(db, "users", authStore.user.uid, "favorites")
      );
      this.favorites = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    },

    async addFavorite(recipe) {
      const authStore = useAuthStore();
      if (!authStore.user) return;

      const ref = doc(
        db,
        "users",
        authStore.user.uid,
        "favorites",
        recipe.id.toString()
      );
      await setDoc(ref, recipe);
      this.loadFavorites(); // <-- tetap cocokkan dengan rename
    },

    async removeFavorite(recipeId) {
      const authStore = useAuthStore();
      if (!authStore.user) return;

      const ref = doc(
        db,
        "users",
        authStore.user.uid,
        "favorites",
        recipeId.toString()
      );
      await deleteDoc(ref);
      this.loadFavorites();
    },

    isFavorite(recipeId) {
      return this.favorites.some((recipe) => recipe.id == recipeId);
    },
  },
});
