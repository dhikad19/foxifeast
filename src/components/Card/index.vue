<template>
  <div class="border rounded-lg p-4 shadow-lg">
    <h2 class="text-lg font-bold">{{ title }}</h2>
    <p class="text-gray-600">{{ description }}</p>
    <button class="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600">
      Learn More
    </button>
  </div>
</template>

<script>
export default {
  name: 'CardComponent',
  props: {
    title: String,
    description: String,
  },
};
</script>
