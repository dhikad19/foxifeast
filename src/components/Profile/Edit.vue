<template>
  <v-container class="py-10" style="max-width: 500px">
    <h2 class="text-h5 mb-6">Edit Your Profile</h2>

    <v-text-field
      v-model="displayName"
      label="Full Name"
      required
    />

    <v-file-input
      v-model="avatarFile"
      label="Change Avatar"
      accept="image/*"
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
      @click="handleUpdateProfile"
    >
      Update Profile
    </v-btn>
  </v-container>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import { auth, db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export default {
  name: "EditProfile",
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
        : this.authStore?.user?.photoURL || "";
    },
    authStore() {
      return useAuthStore();
    },
  },
  async mounted() {
    const user = this.authStore.user;
    if (user) {
      this.displayName = user.displayName || "";
    }
  },
  methods: {
    async uploadToCloudinary(file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "unsigned_avatar"); // Ganti dengan preset kamu
      const response = await fetch("https://api.cloudinary.com/v1_1/dmrql0yee/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Upload failed");
      return data.secure_url;
    },

    async handleUpdateProfile() {
      const user = auth.currentUser;
      if (!user) {
        alert("No user logged in.");
        return;
      }

      this.loading = true;
      try {
        let photoURL = user.photoURL;

        if (this.avatarFile instanceof File) {
          photoURL = await this.uploadToCloudinary(this.avatarFile);
        }

        // Firebase Auth update
        await updateProfile(user, {
          displayName: this.displayName,
          photoURL: photoURL || null,
        });

        // Firestore update
        await updateDoc(doc(db, "users", user.uid), {
          displayName: this.displayName,
          photoURL,
          updatedAt: new Date().toISOString(),
        });

        await user.reload();
        this.authStore.setUser(auth.currentUser); // refresh store

        this.$router.push("/"); // kembali ke home
      } catch (e) {
        console.error(e);
        alert("Profile update failed: " + e.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
