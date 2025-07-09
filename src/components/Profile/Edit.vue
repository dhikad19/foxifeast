<template>
  <v-container>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">Account</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 2" step="2">Profile</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">Photo</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <!-- Step 1 -->
        <v-stepper-content step="1">
          <v-text-field v-model="email" label="Email" />
          <v-text-field v-model="password" label="Password" type="password" />
          <v-btn @click="step++">Next</v-btn>
        </v-stepper-content>

        <!-- Step 2 -->
        <v-stepper-content step="2">
          <v-text-field v-model="fullName" label="Full Name" />
          <v-text-field v-model="username" label="Username" />
          <v-btn @click="step--">Back</v-btn>
          <v-btn @click="step++">Next</v-btn>
        </v-stepper-content>

        <!-- Step 3 -->
        <v-stepper-content step="3">
          <v-file-input
            label="Upload Profile Photo"
            accept="image/*"
            v-model="photo"
          />
          <v-btn @click="step--">Back</v-btn>
          <v-btn @click="handleRegister">Register</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import { register } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import { uploadPhoto } from "@/utils/uploadPhoto";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { updateProfile } from "firebase/auth";

export default {
  name: "EditProfile",
  data() {
    return {
      step: 1,
      email: "",
      password: "",
      fullName: "",
      username: "",
      photo: null,
      authStore: useAuthStore(),
    };
  },
  methods: {
    async handleRegister() {
      try {
        const userCredential = await register(this.email, this.password);
        const user = userCredential.user;

        let photoURL = "";
        if (this.photo) {
          photoURL = await uploadPhoto(user.uid, this.photo);
        }

        await updateProfile(user, {
          displayName: this.fullName,
          photoURL,
        });

        await setDoc(doc(db, "users", user.uid), {
          name: this.fullName,
          username: this.username,
          email: this.email,
          photoURL,
        });

        this.$router.push("/");
      } catch (e) {
        console.error("Register failed:", e);
      }
    },
  },
};
</script>
