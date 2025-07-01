<template>
  <v-app>
    <NavbarComponent />
    <v-main>
      <div :class="$vuetify.display.mobile ? 'pa-4' : ''" style="max-width: 1140px; width: 100%;" class="mx-auto">
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import NavbarComponent from "@/components/Navbar";

export default {
  name: "App",
  components: {
    NavbarComponent,
  },
};
</script>