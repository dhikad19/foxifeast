<template>
  <div v-if="isReady" class="signin-container">
    <div class="form-login__container">
      <div class="form-container">
        <div class="mb-8 mt-4 d-flex align-center justify-center flex-column">
          <p class="title-form">Hello</p>
          <p class="mt-2 desc-form">
            Please log in to access <span style="color: #ff8417">Feast</span>.
          </p>
        </div>
        <v-form fast-fail @submit.prevent>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="email"
                label="Email"
                :rules="emailRules"
                append-inner-icon="mdi-at"
                variant="outlined"
                density="compact"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="password"
                label="Password"
                :rules="passwordRules"
                @click:append-innner="show = !show"
                :type="show ? 'text' : 'password'"
                variant="outlined"
                density="compact">
                <template v-slot:append-inner>
                  <v-icon
                    class="password-toggle-icon"
                    @click="show = !show">
                    {{ show ? "mdi-eye-off" : "mdi-eye" }}
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col
              cols="12"
              style="margin-top: -5px;"
              class="d-flex align-center justify-space-between mb-4"
            >
              <div class="d-flex align-center" @click="handleRemember()" style="cursor: pointer">
                <v-icon
                  style="margin-left: -3px"
                  class="mr-2"
                  size="20"
                  v-if="!checkbox"
                >
                  mdi-checkbox-blank-outline
                </v-icon>
                <v-icon 
                  v-else 
                  style="margin-left: -3px"
                  class="mr-2"
                  size="20"
                  color="#ff8417"
                >
                  mdi-checkbox-marked
                </v-icon>
                <p style="user-select: none; font-size: 14px">
                  Remember Me
                </p>
              </div>
              <div>
                <p
                  style="
                    color: #ff8417;
                    font-size: 14px;
                    font-weight: 500;
                  ">
                  Forgot Password
                </p>
              </div>
            </v-col>
          </v-row>
          <v-btn
            :loading="loading" 
            @click="login"
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
            >Sign in</v-btn>
          <p class="text-divider mt-4">or</p>
          <v-btn
            variant="outlined"
            class="mt-4"
            @click="loginWithGoogle"
            style="letter-spacing: normal"
            block>
            <template v-slot:default>
              <v-img
                src="/assets/icon/google.png"
                alt="Button Image"
                contain
                height="20"
                max-width="20"
                class="button-image mr-3" />
              <span
                style="
                  text-transform: capitalize;
                  font-weight: 500;
                "
                >Sign in with google</span
              >
              <!-- Optional text next to the image -->
            </template>
          </v-btn>
        </v-form>
      </div>
      <div>
        <p class="mb-8" style="color: #4f4f4fe5; font-size: 16px">
          Don't have an account yet?
          <b style="color: #ff8417; cursor: pointer" @click="toSignUp()">Sign Up</b>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import { useAuthStore } from "@/stores/authStore";
  export default {
    name: "SignInComponent",

    data() {
      return {
        checkbox: false,
        show: false,
        items: [
          {
            img: "/banner/banner-1.png",
            title: "Streamline Project Workflow",
            description:
              "Visualize project progress and manage tasks efficiently with intuitive tools.",
          },
          {
            img: "/banner/banner-2.png",
            title: "Unlock Insights with Real-Time Data",
            description:
              "Monitor metrics with live updates and detailed analytics to make informed decisions.",
          },
        ],
        colors: [
          "indigo",
          "warning",
          "pink darken-2",
          "red lighten-1",
          "deep-purple accent-4",
        ],
        slides: ["First", "Second", "Third", "Fourth", "Fifth"],
        email: "",
        password: "",
        authStore: null,
        emailRules: [
          v => !!v || 'Email is required',
          v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email must be valid'
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => (v && v.length >= 8) || 'Must be at least 8 characters long',
        ],
      };
    },

    computed: {
      loading() {
        return this.authStore?.loading;
      },
      isReady() {
        return this.authStore?.initialized;
      },
      isLoggedIn() {
        return this.authStore?.user !== null;
      },
    },

    mounted() {
      this.authStore = useAuthStore();

      if (this.authStore.initialized && this.authStore.user) {
        this.$router.replace("/");  
      }
    },

    watch: {
      isReady(newVal) {
        if (newVal && this.isLoggedIn) {
          this.$router.replace("/");
        }
      },
    },

    methods: {
      async login() {
        try {
          await this.authStore.login(this.email, this.password);
          this.$router.push("/");
        } catch (e) {
          alert("Login failed!");
        }
      },
      async loginWithGoogle() {
        try {
          await this.authStore.loginWithGoogle();
          this.$router.push("/");
        } catch (e) {
          alert("Google login failed!");
        }
      },
      toSignUp() {
        this.$router.push({ path: '/signup' })
      },
      toHome() {
        this.$router.push({ path: '/' })
      },
      handleRemember() {
        this.checkbox = !this.checkbox
      },
    },
  };
</script>

<style scoped>
.title-content {
  font-weight: 500;
}

.signin-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: calc(100vh - 170px);
}

.signin-title {
  font-weight: 500;
  font-size: 22px;
  line-height: normal;
  text-align: center;
}

.signin-desc {
  font-size: 15px;
  line-height: normal;
  max-width: 400px;
  text-align: center;
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

.title-form {
  font-weight: 500;
  font-size: 30px;
  text-align: center;
  @media screen and (max-width: 960px) {
    font-size: 28px;
  }
}

.desc-form {
  max-width: 380px;
  text-align: center;
  line-height: normal;
  font-size: 15px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

.container img {
  padding: 15px;
  border-top-left-radius: 60px;
  border-bottom-right-radius: 60px;
  height: 100%;
  width: 100%;
  object-fit: cover;
  position: absolute;
  left: 0;
  top: 0;
}

.header-bar {
  display: none;
  display: flex;
  align-items: start;
  justify-content: start;
  width: 100%;
  filter: grayscale(100%) brightness(0%);
  @media screen and (max-width: 960px) {
    display: unset;
  }
}

.form-container {
  margin: 0 auto;
  max-width: 400px;
  @media screen and (max-width: 960px) {
    padding: 8px;
  }
}

.password-toggle-icon {
  cursor: pointer;
  font-size: 23px;
  position: relative;
}

.desktop-bg {
  @media screen and (max-width: 960px) {
    display: none;
  }
}

.form-login__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}
</style>
