<template>
  <div>
    <v-text-field v-model="email" label="Email" />
    <v-text-field v-model="password" label="Password" type="password" />
    <v-btn @click="handleRegister">Register</v-btn>
  </div>
</template>

<script>
import { register } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  created() {
    const authStore = useAuthStore();

    if (authStore.user) {
      this.$router.push("/"); // Redirect ke homepage jika sudah login
    }
  },
  methods: {
    async handleRegister() {
      try {
        await register(this.email, this.password);
        this.$router.push("/"); // Arahkan ke home atau dashboard
      } catch (err) {
        console.error("Register error:", err.message);
      }
    },
  },
};
</script>
