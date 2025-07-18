<template>
  <div>
    <v-btn class="chat-fab" color="#ff7800" icon @click="dialog = true">
      <v-icon>mdi-robot</v-icon>
    </v-btn>
    <v-dialog
      scrim="true"
      :persistent="false"
      v-model="dialog"
      :fullscreen="$vuetify.display.smAndDown"
      scrollable>
      <v-card
        @click:outside="dialog = false"
        class="pa-0 w-100"
        max-height="90vh"
        :class="$vuetify.display.smAndDown ? '' : 'mx-auto mt-10 rounded-lg'"
        max-width="600">
        <div class="d-flex align-center justify-space-between pb-2 pt-2">
          <v-card-title style="font-size: 18px" class="font-bold">
            Feast Bot
          </v-card-title>
          <v-icon class="pr-4" @click="dialog = false">mdi-close</v-icon>
        </div>
        <v-divider />

        <!-- Chat window -->
        <v-card-text
          v-if="messages.length"
          ref="chatWindow"
          class="chat-window">
          <div v-for="(msg, i) in messages" :key="i" class="mb-4">
            <!-- User Message -->
            <div v-if="msg.from === 'user'" class="text-right">
              <v-chip color="primary" class="ma-1" dark>{{ msg.text }}</v-chip>
            </div>

            <!-- Bot Answer -->
            <div v-else class="text-left">
              <v-chip color="grey-lighten-1">{{ msg.text }}</v-chip>

              <!-- Recipe Results -->
              <v-row v-if="msg.media?.length" class="mt-2" dense>
                <v-col
                  v-for="(recipe, j) in msg.media"
                  :key="j"
                  cols="12"
                  sm="6"
                  md="4">
                  <v-card
                    :to="getRecipeIdFromImg(recipe.image)"
                    class="hoverable"
                    outlined>
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
        <div
          class="d-flex flex-column justify-space-between"
          :class="messages.length ? '' : 'h-100'">
          <div></div>
          <div
            v-if="!messages.length"
            :class="$vuetify.display.smAndDown ? '' : 'mt-8'"
            class="d-flex align-center flex-column mb-8">
            <v-icon class="mb-4" style="font-size: 40px">
              mdi-forum-outline
            </v-icon>
            <p>Say something like "Donut"</p>
          </div>
          <!-- Input area -->
          <div>
            <v-divider />
            <v-card-actions class="pa-4 d-flex flex-column">
              <v-text-field
                v-model="message"
                placeholder="Say something"
                hide-details
                variant="solo"
                density="compact"
                @keyup.enter="sendMessage"
                class="w-100" />
            </v-card-actions>
          </div>
        </div>
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
        message: "",
        dialog: false,
        messages: [],
        loading: false,
      };
    },
    methods: {
      getRecipeIdFromImg(url) {
        return url.match(/\/recipes\/(\d+)-/)?.[1] ?? "";
      },

      async sendMessage() {
        const text = this.message.trim();
        if (!text) return;

        this.messages.push({ from: "user", text });
        this.message = "";
        this.loading = true;

        try {
          const res = await axios.get(
            "https://api.spoonacular.com/food/converse",
            {
              params: {
                text,
                apiKey: process.env.VUE_APP_SPOONACULAR_API_KEY,
              },
            }
          );

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
    max-height: 85%;
    overflow-y: auto;
    padding: 16px;
  }

  .chat-fab {
    position: fixed;
    right: 24px;
    bottom: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    z-index: 2000;
  }
</style>
