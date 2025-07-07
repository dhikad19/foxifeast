<template>
  <div>
    <v-dialog v-model="dialog" :fullscreen="$vuetify.display.mobile" persistent scrollable>
      <v-card class="pa-0" :class="$vuetify.display.mobile ? '' : 'mx-auto mt-10 rounded-xl'" max-width="700">
        <v-card-title class="px-6 pt-4 text-h6 font-bold">
          Ask the Recipe Bot 🤖
        </v-card-title>
        <v-divider />

        <!-- Chat window -->
        <v-card-text ref="chatWindow" class="chat-window">
          <div v-for="(msg, i) in messages" :key="i" class="mb-4">
            <!-- User Message -->
            <div v-if="msg.from === 'user'" class="text-right">
              <v-chip color="primary" class="ma-1" dark>{{ msg.text }}</v-chip>
            </div>

            <!-- Bot Answer -->
            <div v-else class="text-left">
              <v-chip color="grey-lighten-2" class="ma-1">{{ msg.text }}</v-chip>

              <!-- Recipe Results -->
              <v-row v-if="msg.media?.length" class="mt-2" dense>
                <v-col
                  v-for="(recipe, j) in msg.media"
                  :key="j"
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-card :to="`/recipe/${recipe.id}`" :href="recipe.link" target="_blank" class="hoverable" outlined>
                    <v-img :src="recipe.image" height="140px" cover />
                    <v-card-title class="text-sm font-medium">
                      {{ recipe.title }}
                    </v-card-title>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-card-text>

        <!-- Input area -->
        <v-divider />
        <v-card-actions class="pa-4 d-flex flex-column">
          <v-textarea
            v-model="message"
            label="Ask me anything about food..."
            auto-grow
            rows="2"
            outlined
            class="w-100"
          />
          <v-btn color="primary" class="mt-2 align-self-end" :loading="loading" @click="sendMessage">
            Ask
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ChatbotComponent",
  data() {
    return {
      dialog: true,
      message: "",
      messages: [],
      loading: false,
    };
  },
  methods: {
    async sendMessage() {
      const text = this.message.trim();
      if (!text) return;

      this.messages.push({ from: "user", text });
      this.message = "";
      this.loading = true;

      try {
        const res = await axios.get("https://api.spoonacular.com/food/converse", {
          params: {
            text,
            apiKey: process.env.VUE_APP_SPOONACULAR_API_KEY,
          },
        });

        this.messages.push({
          from: "bot",
          text: res.data.answerText || "Sorry, I couldn't find an answer.",
          media: res.data.media || [],
        });

        this.$nextTick(() => {
          const container = this.$refs.chatWindow;
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        });
      } catch (err) {
        this.messages.push({
          from: "bot",
          text: "Something went wrong. Try again later.",
        });
        console.error("Chatbot error:", err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.chat-window {
  max-height: 95%;
  overflow-y: auto;
  padding: 16px;
  background-color: #fafafa;
}
</style>
