<template>
  <v-app>
    <NavbarComponent />
    <v-main>
      <div :class="$vuetify.display.smAndDown ? 'pa-4' : 'pa-4'" style="max-width: 1140px;" class="mx-auto h-100 w-100">
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