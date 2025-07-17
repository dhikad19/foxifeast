<template>
  <div class="register-container">
    <div class="form-register__container">
      <div class="form-container">
        <div class="mb-8 mt-4 d-flex align-center justify-center flex-column">
          <p class="title-form">Hello</p>
          <p class="mt-2 desc-form">
            Register to access <span style="color: #ff8417">Feast</span>.
          </p>
        </div>
        <v-form ref="form" @submit.prevent="handleRegister" fast-fail fluid>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
              v-model="email"
              label="Email"
              type="email"
              :rules="emailRules"
              required
              variant="outlined"
                density="compact"
            />
            </v-col>
            <v-col cols="12">
              <v-text-field
              v-model="password"
              label="Password"
              type="password"
              :rules="passwordRules"
              required
              variant="outlined"
                density="compact"
            />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="confirmPassword"
                label="Re-enter Password"
                type="password"
                :rules="confirmPasswordRules"
                required
                variant="outlined"
                density="compact"
              />
            </v-col>
            
          </v-row>
          <v-btn
            :loading="loading"
            :disabled="!isFormValid || loading"
            color="#FF8417"
            height="40"
            class="mt-2"
            style="
              color: white;
              text-transform: capitalize;
              letter-spacing: normal;
            "
            flat
            type="submit"
            block
            >Register</v-btn>
          <p class="text-divider mt-4">or</p>
          <v-btn
            variant="outlined"
            class="mt-4"
            @click="loginWithGoogle"
            style="letter-spacing: normal; text-transform: capitalize;"
            block>
            <template #prepend>
              <img
                src="/assets/icon/google.png"
                alt="icon"
                height="20"
                style="margin-right: 8px"
              />
            </template>
            Sign up with google
          </v-btn>
        </v-form>
      </div>
      <div>
        <p class="mb-8" style="color: #4f4f4fe5; font-size: 16px">
          Already have an account?
          <b style="color: #ff8417; cursor: pointer" @click="toLogin()">Login</b>
        </p>
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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useAuthStore } from "@/stores/authStore";

export default {
  name: "RegisterPage",
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      snackbar: false,
        text: "",
      passwordRules: [
        v => !!v || "Password is required",
        v => v.length >= 6 || "Minimum 6 characters",
        v => /[A-Z]/.test(v) || "At least 1 uppercase letter",
        v => /[a-z]/.test(v) || "At least 1 lowercase letter",
        v => /\d/.test(v) || "At least 1 number",
        v => /[!@#$%^&*]/.test(v) || "At least 1 special character (!@#$%^&*)"
      ],
      confirmPasswordRules: [
        v => !!v || "Confirm password is required",
        v => v === this.password || "Passwords do not match"
      ],

      loading: false,
      emailRules: [
        v => !!v || "Email is required",
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "Email must be valid",
      ],
    };
  },
  computed: {
    isReady() {
        return this.authStore?.initialized;
      },
      isFormValid() {
        return (
          this.email &&
          this.password &&
          this.confirmPassword &&
          this.password === this.confirmPassword
        );
      },
  },
  watch: {
      isReady(newVal) {
        if (newVal && this.isLoggedIn) {
          this.$router.replace("/");
        }
      },
    },
    mounted() {
      this.authStore = useAuthStore();

      if (this.authStore.initialized && this.authStore.user) {
        this.$router.replace("/");  
      }
    },
  methods: {
    async loginWithGoogle() {
        try {
          await this.authStore.loginWithGoogle();
          this.$router.push("/");
        } catch (e) {
          this.text = "Google login failed"
          this.snackbar = true
        }
      },

    toLogin() {
      this.$router.push('/login')
    },

    async handleRegister() {
      const isValid = await this.$refs.form.validate();
      if (!isValid) return;

      this.loading = true;
      try {
        await createUserWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push("/setprofile");
      } catch (error) {
        this.text = "Registration failed"
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
