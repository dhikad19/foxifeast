import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";
import { createPinia } from "pinia";
import vuetify from "./plugins/vuetify"; // <-- Use the plugin here
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
const pinia = createPinia();

createApp(App).use(pinia).use(router).use(vuetify).mount("#app");
