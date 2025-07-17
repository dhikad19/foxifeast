<template>
  <div class="register-container">
    <div class="form-register__container">
      <div class="form-container">
        <div class="mb-8 mt-4 d-flex align-center justify-center flex-column">
          <p class="title-form">Register</p>
          <p class="mt-2 desc-form">
            Set up your <span style="color: #ff8417">Feast</span> profile.
          </p>
        </div>
        <v-form @submit.prevent="handleSetProfile">
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
              <!-- <v-avatar size="100" class="my-4" v-if="avatarPreview">
                <v-img :src="avatarPreview" />
              </v-avatar> -->

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
                :rules="rules" />
            </v-col>
            <v-col cols="12">
              <v-btn
                :disabled="loading || !isFormValid"
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
                Save Profile
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </div>
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
  </div>
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
        snackbar: false,
        text: "",
        avatarFile: null,
        loading: false,
        rules: [(v) => !!v || "Full name is required"],
      };
    },
    computed: {
      avatarPreview() {
        return this.avatarFile instanceof File
          ? URL.createObjectURL(this.avatarFile)
          : "";
      },
      isFormValid() {
        return this.displayName.trim() !== "" && this.avatarFile !== null;
      },
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
        formData.append("upload_preset", "unsigned_avatar"); // GANTI dengan preset kamu

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dmrql0yee/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || "Cloudinary upload failed");
        }
        return data.secure_url;
      },

      async handleSetProfile() {
        const user = auth.currentUser;
        if (!user) {
          this.text = "No user logged in"
          this.snackbar = true
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
          this.text = "Profile setup failed"
          this.snackbar = true
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>

<style scoped>
  .title-form {
    font-weight: 500;
    font-size: 30px;
    text-align: center;
    @media screen and (max-width: 960px) {
      font-size: 28px;
    }
  }

  .text-divider {
    display: flex;
    flex-direction: row;
    font-size: 14px;
  }

  .text-divider:before,
  .text-divider:after {
    content: "";
    flex: 1 1;
    border-bottom: 1px solid #4f4f4fe5;
    margin: auto;
  }

  .text-divider:before {
    margin-right: 10px;
  }

  .text-divider:after {
    margin-left: 10px;
  }

  .desc-form {
    max-width: 380px;
    text-align: center;
    line-height: normal;
    font-size: 15px;
  }

  .signin-desc {
    font-size: 15px;
    line-height: normal;
    max-width: 400px;
    text-align: center;
  }

  .register-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: calc(100vh - 170px);
  }
  .form-register__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    width: 100%;
  }

  .form-container {
    max-width: 400px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    @media screen and (max-width: 960px) {
      padding: 8px;
    }
  }
</style>
