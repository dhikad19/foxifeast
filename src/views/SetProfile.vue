<template>
  <v-container class="py-10" style="max-width: 500px">
    <h2 class="text-h5 mb-6">Set Your Profile</h2>

    <v-text-field
      v-model="displayName"
      label="Full Name"
      required
    />

    <v-file-input
      v-model="avatarFile"
      accept="image/*"
      label="Upload Avatar"
      prepend-icon="mdi-camera"
      show-size
      counter
    />

    <v-avatar size="100" class="my-4" v-if="avatarPreview">
      <v-img :src="avatarPreview" />
    </v-avatar>

    <v-btn
      :loading="loading"
      color="primary"
      @click="handleSetProfile"
    >
      Save Profile
    </v-btn>
  </v-container>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import { auth, db } from "@/firebase";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default {
  data() {
    return {
      displayName: "",
      avatarFile: null,
      loading: false,
    };
  },
  computed: {
    avatarPreview() {
      return this.avatarFile instanceof File
        ? URL.createObjectURL(this.avatarFile)
        : "";
    },
  },
  methods: {
    async uploadToCloudinary(file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "unsigned_avatar"); // GANTI dengan preset kamu

      const response = await fetch("https://api.cloudinary.com/v1_1/dmrql0yee/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }
      return data.secure_url;
    },

    async handleSetProfile() {
      const user = auth.currentUser;
      if (!user) {
        alert("No user logged in.");
        return;
      }

      this.loading = true;
      try {
        let photoURL = "";

        if (this.avatarFile instanceof File) {
          photoURL = await this.uploadToCloudinary(this.avatarFile);
        }

        // Update Firebase Auth profile
        await updateProfile(user, {
          displayName: this.displayName,
          photoURL: photoURL || null,
        });

        // Simpan ke Firestore
        await setDoc(doc(db, "users", user.uid), {
          displayName: this.displayName,
          photoURL,
          email: user.email,
          createdAt: new Date().toISOString(),
        });

        const authStore = useAuthStore();
        await user.reload();
        const refreshedUser = auth.currentUser;
        authStore.setUser(refreshedUser);
        this.$router.push("/").then(() => {
          window.location.reload();
        });
      } catch (err) {
        console.error(err);
        alert("Profile setup failed: " + err.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
