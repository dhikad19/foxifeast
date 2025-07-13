<template>
  <div>
    <h2>Artikel Terbaru dari FoxiFeast</h2>

    <div v-if="loading">Memuat...</div>

    <ul v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <li v-for="post in posts" :key="post.ID" class="border p-4 rounded-xl">
        <router-link :to="`/blog/${post.slug}`">
          <img
            v-if="getImage(post)"
            :src="getImage(post)"
            :alt="post.title"
            class="w-full h-48 object-cover rounded mb-2" />

          <p style="line-height: normal; font-size: 15px">
            {{ post.featured_image }}, image
          </p>
          <h3 class="font-bold" v-html="post.title"></h3>
          <p class="text-sm">{{ stripTags(post.excerpt).slice(0, 100) }}...</p>
          <a
            :href="post.URL"
            target="_blank"
            class="inline-block mt-2 text-blue-600 underline">
            Baca selengkapnya →
          </a>
        </router-link>
        <p v-html="post.excerpt"></p>
      </li>
    </ul>
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
