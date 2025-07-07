import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";
import { createPinia } from "pinia";
import vuetify from "./plugins/vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { useAuthStore } from "@/stores/authStore";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
const authStore = useAuthStore();
authStore.init();
app.use(router).use(vuetify).mount("#app");
