<template>
  <div>
    <p
      class="mb-4"
      style="font-weight: bold"
      :style="
        $vuetify.display.smAndDown
          ? 'font-size: 20px'
          : 'font-size: 25px; margin-bottom: -10px'
      ">
      Blog
    </p>
    <div v-if="loading">
      <v-row>
        <v-col :cols="$vuetify.display.smAndDown ? 12 : 4" v-for="item in 6" :key="item">
          <v-skeleton-loader type="card"></v-skeleton-loader>
        </v-col>
      </v-row>
    </div>

    <v-row v-else>
      <v-col
        v-for="(item, i) in posts"
        :key="i"
        :cols="$vuetify.display.smAndDown ? 12 : 4"
      >
        <v-card
          class="hoverable"
          flat
          :style="
            $vuetify.theme.global.name === 'dark'
              ? 'background-color: #4f4f4f; '
              : 'background-color: #fafafa; '
          "
          @click="handleBlogDetails(item.slug)"
        >
          <div class="image-wrapper">
            <v-img
              :src="getImage(item)"
              height="200"
              cover
              class="zoom-img"
              :alt="item.title"
            />
          </div>
          <v-card-text>
            <h3 class="text-subtitle-1 font-weight-bold mb-2" style="line-height: normal" v-html="item.title" />
            <p class="text-body-2 excerpt" v-html="item.excerpt" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "BlogList",
  data() {
    return {
      posts: [],
      loading: false,
      page: 1,
      perPage: 6,
      baseURL:
        "https://public-api.wordpress.com/rest/v1.1/sites/www.foxifeast.wordpress.com/posts",
    };
  },
  created() {
    this.fetchPosts();
  },
  methods: {
    handleBlogDetails(slug) {
      this.$router.push(`/blog/${slug}`);
    },
    getImage(post) {
      if (post.featured_image) return post.featured_image;

      const attachments = Object.values(post.attachments || {});
      if (attachments.length) {
        return attachments[0].URL;
      }

      return "https://via.placeholder.com/600x300?text=No+Image";
    },
    async fetchPosts() {
      this.loading = true;
      try {
        const res = await fetch(
          `${this.baseURL}?page=${this.page}&number=${this.perPage}`
        );
        const data = await res.json();
        this.posts = data.posts;
      } catch (err) {
        console.error("Gagal fetch:", err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.excerpt {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hoverable {
  transition: box-shadow 0.3s ease;
  cursor: pointer;
}

.image-wrapper {
  overflow: hidden;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.zoom-img {
  transition: transform 0.3s ease;
}

.hoverable:hover .zoom-img {
  transform: scale(1.1);
}
</style>
