<template>
  <!-- FAB -->
  <v-btn class="chat-fab" color="#ff7800" icon @click="dialog = true">
    <v-icon>mdi-robot</v-icon>
  </v-btn>

  <!-- Dialog Chatbot -->
  <ChatbotComponent v-model:dialog="dialog" />
</template>

<script>
  import { ref } from "vue";
  import ChatbotComponent from "../index.vue";

  export default {
    name: "FloatButton",
    components: { ChatbotComponent },
    setup() {
      const dialog = ref(false);
      return { dialog };
    },
  };
</script>

<style scoped>
  .chat-fab {
    position: fixed;
    right: 24px;
    bottom: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    z-index: 2000;
  }
</style>
