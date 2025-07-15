<template>
  <div>
    <v-form @submit.prevent="handleUpdateProfile">
      <v-row>
        <v-col cols="12" class="w-100 d-flex align-center flex-column">
          <v-img
                v-if="avatarPreview"
                :src="avatarPreview"
                style="border-radius: 4px"
                height="150"
                width="150"
                cover>
              </v-img>
              <div
                v-else
                class="d-flex align-center justify-center"
                style="width: 150px; height: 150px; border-radius: 4px"
                :style="
                  $vuetify.theme.global.name === 'dark'
                    ? 'background-color: #4f4f4f; '
                    : 'background-color: #fafafa; '
                ">
                <v-icon size="80">mdi-account</v-icon>
              </div>
              <v-btn
                @click="$refs.avatarInput.click()"
                style="
                  text-transform: capitalize;
                  font-weight: 500;
                  width: 150px;
                  letter-spacing: normal;
                "
                color="grey lighten-1"
                variant="outlined"
                class="mt-4">
                Upload Avatar
              </v-btn>
              <input
                ref="avatarInput"
                type="file"
                accept="image/*"
                @change="onAvatarSelected"
                style="display: none" />
        </v-col>
        <v-col cols="12">
          <v-text-field
          v-model="displayName"
          label="Full Name"
          required
          variant="outlined"
          density="compact"
          :rules="rules"
        />
        </v-col>
        <v-col cols="12">
          <v-btn
            :disabled="loading || !displayName"
            :loading="loading"
            color="#FF8417"
            type="submit"
            height="40"
            class="mt-2"
            block
            style="
              color: white;
              text-transform: capitalize;
              letter-spacing: normal;
            "
            flat>
            Update Profile
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    
    <!-- <v-file-input
      v-model="avatarFile"
      label="Change Avatar"
      accept="image/*"
      prepend-icon="mdi-camera"
      show-size
      counter
    />
    <v-avatar size="100" class="my-4" v-if="avatarPreview">
      <v-img :src="avatarPreview" />
    </v-avatar> -->

    
  </div>
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
      rules: [(v) => !!v || "Full name is required"],
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
    onAvatarSelected(event) {
        const file = event.target.files[0];
        if (file) {
          this.avatarFile = file;
        }
      },
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
