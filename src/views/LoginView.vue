<template>
  <v-container v-if="isReady">
    <v-text-field v-model="email" label="Email" />
    <v-text-field v-model="password" label="Password" type="password" />
    <v-btn :loading="loading" @click="login">Login</v-btn>
    <v-btn @click="loginWithGoogle" color="red">Login with Google</v-btn>
  </v-container>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";

export default {
  data() {
    return {
      email: "",
      password: "",
      authStore: null,
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
  created() {
    this.authStore = useAuthStore();

    // Jika sudah ready dan user login, langsung redirect
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
    }
  },
};
</script>
