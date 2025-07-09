<template>
  <v-stepper v-model="step">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item :complete="step > 0" value="0" title="Account" />
        <v-divider></v-divider>
        <v-stepper-item :complete="step > 1" value="1" title="Profile" />
        <v-divider></v-divider>
        <v-stepper-item value="2" title="Finish" />
      </v-stepper-header>

      <v-stepper-window>
        <!-- STEP 1 -->
        <v-stepper-window-item :value="0">
          <v-text-field
            v-model="form.email"
            label="Email"
            type="email"
            required
          />
          <v-text-field
            v-model="form.password"
            label="Password"
            type="password"
            required
          />
          <v-btn class="mt-3" color="primary" @click="nextStep">Next</v-btn>
        </v-stepper-window-item>

        <!-- STEP 2 -->
        <v-stepper-window-item :value="1">
          <v-text-field
            v-model="form.displayName"
            label="Full Name"
            required
          />
          <v-file-input
            v-model="form.avatarFile"
            accept="image/*"
            label="Upload Photo"
            prepend-icon="mdi-camera"
          />
          <v-btn class="mt-3" variant="text" @click="step--">Back</v-btn>
          <v-btn class="mt-3" color="primary" @click="nextStep">Next</v-btn>
        </v-stepper-window-item>

        <!-- STEP 3 -->
        <v-stepper-window-item :value="2">
          <p><strong>Email:</strong> {{ form.email }}</p>
          <p><strong>Name:</strong> {{ form.displayName }}</p>

          <v-avatar size="100" class="mt-3" v-if="form.avatarFile">
            <v-img :src="avatarPreview" />
          </v-avatar>

          <v-btn class="mt-4" variant="text" @click="step--">Back</v-btn>
          <v-btn
            class="mt-4"
            color="success"
            :loading="loading"
            @click="handleRegister"
          >
            Register
          </v-btn>
        </v-stepper-window-item>
      </v-stepper-window>

      <!-- Optional: Stepper Actions (not needed if you use your own buttons) -->
      <v-stepper-actions @click:prev="prev" @click:next="next" />
    </template>
  </v-stepper>
</template>

<script>
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/firebase";

export default {
  data() {
    return {
      step: 0,
      loading: false,
      form: {
        email: "",
        password: "",
        displayName: "",
        avatarFile: null,
      },
    };
  },
  computed: {
    avatarPreview() {
      return this.form.avatarFile
        ? URL.createObjectURL(this.form.avatarFile)
        : "";
    },
  },
  methods: {
    nextStep() {
      if (this.step < 2) this.step++;
    },
    async handleRegister() {
      this.loading = true;
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.form.email,
          this.form.password
        );
        const user = userCredential.user;

        let photoURL = "";
        if (this.form.avatarFile) {
          const fileRef = storageRef(storage, `avatars/${user.uid}`);
          await uploadBytes(fileRef, this.form.avatarFile);
          photoURL = await getDownloadURL(fileRef);
        }

        await updateProfile(user, {
          displayName: this.form.displayName,
          photoURL,
        });

        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: this.form.displayName,
          photoURL,
          createdAt: new Date().toISOString(),
        });

        this.$router.push("/");
      } catch (e) {
        alert("Registration failed: " + e.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
