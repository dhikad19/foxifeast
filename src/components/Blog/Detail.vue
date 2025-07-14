<template>
  <div v-if="post" class="w-100">
    <h1 class="text-2xl font-bold mb-4" style="line-height: normal" v-html="post.title"></h1>
    <div class="rich-html mb-10 mt-6" v-html="post.content"></div>
  </div>
</template>

<script>
  export default {
    props: ["slug"],
    data() {
      return {
        post: null,
      };
    },
    name: "BlogDetail",
    computed: {
      image() {
        const attachments = this.post?.attachments;
        if (!attachments) return null;
        const first = Object.values(attachments)[0];
        return first?.thumbnails?.large || first?.URL || null;
      },
    },
    async created() {
      const slug = this.$route.params.slug;
      try {
        const res = await fetch(
          `https://public-api.wordpress.com/rest/v1.1/sites/www.foxifeast.wordpress.com/posts/slug:${slug}`
        );
        const data = await res.json();
        this.post = data;
      } catch (err) {
        console.error("Gagal ambil post:", err);
      }
    },
  };
</script>

<style scoped>
  ::v-deep(.rich-html img) {
    width: 100%;
    max-width: 100%;
    height: auto;
    display: block;
    border-radius: 4px;
    object-fit: cover;
    margin-top: 30px;
    margin-bottom: 40px;
  }

  ::v-deep(.rich-html h4) {
    font-size: 17px;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  ::v-deep(.rich-html h1) {
    line-height: normal;
  }

  ::v-deep(.rich-html ul) {
    margin-left: 18px;
    margin-top: 10px;
  }

  ::v-deep(.rich-html p) {
    font-size: 15px;
  }

  ::v-deep(.rich-html hr) {
    margin-top: 40px;
    margin-bottom: 40px;
  }
</style>
