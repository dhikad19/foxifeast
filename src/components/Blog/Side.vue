<template>
  <div>
    <p
      class="mt-10 mb-3"
      :style="
        $vuetify.display.smAndDown ? 'font-size: 20px' : 'font-size: 25px'
      "
      style="font-weight: bold">
      Blog
    </p>
    <div v-if="loading">Memuat...</div>
    <v-row>
      <v-col cols="12">
        <Carousel snapAlign="center" :gap="15" autoplay="4000" :wrapAround="true" :itemsToShow="$vuetify.display.smAndDown ? 1 : 4" :pauseAutoplayOnHover="true">
          <Slide v-for="(post, i) in posts" :key="i">
            <div>
              <router-link
          :to="`/blog/${post.slug}`"
          :style="
            $vuetify.theme.global.name === 'dark'
              ? 'color: #ffffff'
              : 'color: #000000'
          "
          class="text-title">
          <v-img
            v-if="getImage(post)"
            :src="getImage(post)"
            :alt="post.title"
            height="180"
            style="border-radius: 4px"
            cover 
            />

          <h3 class="font-bold mt-2 title-blog" v-html="post.title"></h3>
          <p class="text-description" v-html="post.excerpt"></p>
        </router-link>
        
            </div>
          </Slide>
          <template #addons>
            <Navigation />
            <Pagination />
          </template>
        </Carousel>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
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
    components: {
    Carousel,
    Slide,
    Pagination,
    Navigation
  },
    methods: {
      getImage(post) {
        // Gunakan featured_image jika ada
        if (post.featured_image) return post.featured_image;

        // Jika tidak, ambil dari attachments (ambil attachment pertama)
        const attachments = Object.values(post.attachments || {});
        if (attachments.length) {
          return attachments[0].URL; // atau pakai thumbnails.medium, dsb
        }

        // Jika tidak ada juga, fallback
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
      stripTags(html) {
        return html.replace(/<[^>]+>/g, "");
      },
    },
  };
</script>

<style scoped>
  .title-blog {
    line-height: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .text-title {
    text-decoration: none;
    line-height: normal;
  }

  .text-description {
    margin-top: 5px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: normal;
    font-size: 15px;
  }
</style>
