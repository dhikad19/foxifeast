<template>
  <div class="register-container">
    <v-form ref="form" @submit.prevent="handleRegister" fast-fail>
      <v-text-field
        v-model="email"
        label="Email"
        type="email"
        :rules="emailRules"
        required
      />
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        :rules="passwordRules"
        required
      />
      <v-btn
        :loading="loading"
        :disabled="!email || !password || loading"
        type="submit"
        color="primary"
        class="mt-2"
        block
      >
        Register
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";

export default {
  name: "RegisterPage",
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      emailRules: [
        v => !!v || "Email is required",
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "Email must be valid",
      ],
      passwordRules: [
        v => !!v || "Password is required",
        v => (v && v.length >= 6) || "Minimum 6 characters",
      ],
    };
  },
  methods: {
    async handleRegister() {
      const isValid = await this.$refs.form.validate();
      if (!isValid) return;

      this.loading = true;
      try {
        await createUserWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push("/setprofile");
      } catch (error) {
        alert("Registration failed: " + error.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 24px;
}
</style>
