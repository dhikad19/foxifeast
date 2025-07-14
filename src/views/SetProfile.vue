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
        <v-form>
          <v-row>
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
              <v-avatar size="100" class="my-4" v-if="avatarPreview">
                <v-img :src="avatarPreview" />
              </v-avatar>
              <v-file-input
                v-model="avatarFile"
                accept="image/*"
                label="Upload Avatar"
                prepend-icon="mdi-camera"
                show-size
                variant="outlined"
                density="compact"
                counter
                :rules="rules"
              />
            </v-col>
            <v-col>
              <v-btn
                :disabled="loading || !isFormValid"
                :loading="loading"
                color="#FF8417"
                @click="handleSetProfile"
                height="40"
                class="mt-2"
                block
                style="
                  color: white;
                  text-transform: capitalize;
                  letter-spacing: normal;
                "
                flat
              >
                Save Profile
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </div>
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
      avatarFile: null,
      loading: false,
      rules: [
        v => !!v || "Confirm password is required"
      ],
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
