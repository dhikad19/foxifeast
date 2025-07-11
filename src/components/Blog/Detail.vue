<template>
  <div v-if="post">
    <h1 class="text-2xl font-bold mb-4" v-html="post.title"></h1>
    <div v-html="post.content"></div>
  </div>
</template>

<script>
export default {
  props: ['slug'],
  data() {
    return {
      post: null,
    }
  },
  name: "BlogDetail",
  computed: {
    image() {
      const attachments = this.post?.attachments
      if (!attachments) return null
      const first = Object.values(attachments)[0]
      return first?.thumbnails?.large || first?.URL || null
    },
  },
  async created() {
    const slug = this.$route.params.slug
    try {
      const res = await fetch(
  `https://public-api.wordpress.com/rest/v1.1/sites/www.foxifeast.wordpress.com/posts/slug:${slug}`
)
      const data = await res.json()
      this.post = data
    } catch (err) {
      console.error('Gagal ambil post:', err)
    }
  },
}
</script>

<style scoped>
img {
  max-width: 100%; 
  height: auto;
}
</style>