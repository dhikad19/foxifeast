<template>
  <v-container fluid class="pa-0">
    <div v-if="user">
      <!-- Cover Background -->
      <div class="cover-background mb-5">
        <!-- Avatar -->
        <div class="w-100 d-flex align-center justify-space-between">
          <v-avatar class="profile-avatar" :size="$vuetify.display.smAndDown ? 100 : 120">
            <v-img v-if="user.photoURL" :src="user.photoURL" />
            <v-icon v-else size="80">mdi-account</v-icon>
          </v-avatar>
        </div>
      </div>

      <!-- Info -->
      <v-container class="mt-10 text-center">
        <h2 class="text-h6 mt-2 font-weight-medium" style="line-height: normal">
          {{ user.displayName || "No name set" }}
        </h2>
        <p class="text-subtitle-2 text-grey">{{ user.email }}</p>

        <!-- Actions -->
        <div
          style="max-width: 300px; margin: 0 auto; width: 100%"
          class="mt-4">
          <v-row dense>
            <v-col cols="6">
              <v-btn
                color="#FF8417"
                variant="elevated"
                block
                flat
                style="letter-spacing: normal; text-transform: capitalize;"
                @click="editDialog = true"
              >
                Edit Profile
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                color="red"
                variant="outlined"
                block
                style="letter-spacing: normal; text-transform: capitalize;"
                @click="logout"
              >
                Logout
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <!-- Favorite Recipes -->
      </v-container>
      <p style="font-weight: 500" class="mt-6 mb-2">Your Favorite Recipes</p>
        <div 
          class="d-flex align-center jusity-center w-100" 
          v-if="favorites.length === 0" 
          style="height: 250px; text-align: center; border-radius: 8px" 
          :style=" $vuetify.theme.global.name === 'dark'
            ? 'background-color: #4f4f4f; '
            : 'background-color: #fafafa; '
        ">
          <div class="w-100">
            <v-icon size="60" class="mb-2">mdi-file-document-remove-outline</v-icon>
            <p class="text-center">No favorite recipes yet.</p>
          </div>
        </div>

        <v-row v-else>
          <v-col
            v-for="recipe in favorites"
            :key="recipe.id"
            cols="12"
            sm="6"
            md="4">
            <v-card
              :to="`/recipe/${recipe.id}`"
              class="hover:scale-105 transition rounded-lg">
              <v-img :src="recipe.image" height="160px" class="rounded-t" />
              <v-card-title>{{ recipe.title }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>

        <v-dialog v-model="editDialog" max-width="500" :fullscreen="$vuetify.display.smAndDown">
          <v-card >
            <div class="d-flex align-center justify-space-between pb-1 pt-1">
              <v-card-title style="font-size: 18px" class="font-bold">
                Edit Profile
              </v-card-title>
              <v-icon class="pr-4" @click="editDialog = false">mdi-close</v-icon>
            </div>
            <v-divider />
        
            <div class="d-flex flex-column align-center justify-center " :style="$vuetify.display.smAndDown ? 'margin-top: -100px' : 'margin-top: 30px; margin-bottom: 30px'" style="height: 100%;">
              <v-form @submit.prevent="handleUpdateProfile" class="w-100" style="max-width: 350px">
                <!-- Avatar -->
                <div class="d-flex align-center flex-column">
                  <div>
                    <v-img
                      v-if="avatarPreview"
                      :src="avatarPreview"
                      style="border-radius: 8px"
                      height="150"
                      width="150"
                      cover
                    />
                    <div
                      v-else
                      class="d-flex align-center justify-center"
                      style="width: 150px; height: 150px; border-radius: 8px"
                      :style="{
                        backgroundColor:
                          $vuetify.theme.global.name === 'dark' ? '#4f4f4f' : '#fafafa'
                      }"
                    >
                      <v-icon size="80">mdi-account</v-icon>
                    </div>
                  </div>
            
                  <!-- Upload Button -->
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
                </div>
          
                <!-- Text Field -->
                <v-text-field
                  v-model="displayName"
                  class="mt-4"
                  label="Full Name"
                  required
                  variant="outlined"
                  density="compact"
                  :rules="rules"
                />
          
                <!-- Save Button -->
                <v-btn
                  :disabled="loading || !displayName"
                  :loading="loading"
                  type="submit"
                  color="#FF8417"
                  class="mt-2 text-white"
                  block
                  flat
                  style="text-transform: capitalize; letter-spacing: normal;"
                >
                  Update Profile
                </v-btn>
              </v-form>
            </div>
          </v-card>
        </v-dialog>
      <!-- Edit Dialog -->
    </div>

    <div v-else class="text-center text-grey mt-10">
      <v-icon size="40" class="mb-2">mdi-alert-circle-outline</v-icon>
      <div>You are not logged in.</div>
    </div>
    <v-snackbar
      v-model="snackbar"
      :timeout="5000"
    >
      {{ text }}

      <template v-slot:actions>
        <v-btn
          color="#ff7800"
          variant="text"
          @click="snackbar = false"
          style="text-transform: capitalize"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
  import { useAuthStore } from "@/stores/authStore";
  import { useFavoritesStore } from "@/stores/favoritesStore";
  // import ProfileEdit from "@/components/Profile/Edit.vue";
  import { auth, db } from "@/firebase";
  import { doc, updateDoc } from "firebase/firestore";
  import { updateProfile } from "firebase/auth";

  export default {
    name: "UserProfile",
    // components: { ProfileEdit },
    data() {
      return {
        snackbar: false,
        text: '',
        editDialog: false,
        displayName: "",
        avatarFile: null,
        loading: false,
        rules: [(v) => !!v || "Full name is required"],
      };
    },
    computed: {
      user() {
        return useAuthStore().user;
      },
      favorites() {
        return useFavoritesStore().favorites;
      },
      avatarPreview() {
      return this.avatarFile instanceof File
        ? URL.createObjectURL(this.avatarFile)
        : this.authStore?.user?.photoURL || "";
      },
      authStore() {
        return useAuthStore();
      },
    },
    methods: {
      async logout() {
        await useAuthStore().logout();
        this.$router.push("/login");
      },

      handleProfileUpdated() {
        this.editDialog = false;
      },

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
          // this.snackbar = true
          // this.text = e.message
        } finally {
          this.editDialog = false
          this.loading = false
          this.snackbar = true
          this.text = "Update profile success"
          window.location.reload();
        }
      },
    },
    async mounted() {
      await useFavoritesStore().loadFavorites();
      const user = this.authStore.user;
      if (user) {
        this.displayName = user.displayName || "";
      }
    },
  };
</script>

<style scoped>
  .cover-background {
    background-image: url("/public/assets/background-blend.png");
    background-size: cover;
    background-position: center;
    position: relative;
    border-radius: 8px;
    height: 200px;
    @media screen and (max-width: 960px) {
      height: 120px;
    }
  }

  .profile-avatar {
    position: absolute;
    bottom: -60px;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid white;
    background-color: white;
  }

  .text-grey {
    color: #666;
  }
</style>
