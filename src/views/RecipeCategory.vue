<template>
  <v-row class="mb-6">
    <v-col cols="12">
      <p>Soup</p>
    </v-col>
    <v-col :cols="$vuetify.display.smAndDown ? 12 : 6">
      <div @click="handleRecipe(soupData[0].id)">
        <v-img
          max-height="200"
          cover
          style="border-radius: 4px"
          :src="soupData[0].image"></v-img>
        <p class="title">
          {{ soupData[0].title }}
        </p>
        <p class="description">
          {{ soupData[0].description }}
        </p>
      </div>
    </v-col>
    <v-col :cols="$vuetify.display.smAndDown ? 12 : 6">
      <div @click="handleRecipe(soupData[1].id)">
        <v-img
          max-height="200"
          cover
          style="border-radius: 4px"
          :src="soupData[1].image"></v-img>
        <p class="title">
          {{ soupData[1].title }}
        </p>
        <p class="description">
          {{ soupData[1].description }}
        </p>
      </div>
    </v-col>
    <v-col
      :cols="$vuetify.display.smAndDown ? 12 : 3"
      v-for="(item, i) in soupData.slice(2, 10)"
      :key="i">
      <div @click="handleRecipe(soupData[i + 2].id)">
        <v-img
          max-height="200"
          cover
          style="border-radius: 4px"
          :src="item.image"></v-img>
        <p class="title">
          {{ item.title }}
        </p>
        <p class="description">
          {{ item.description }}
        </p>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  // import RecipeList from "@/components/RecipeList.vue";

  export default {
    name: "RecipeCategory",
    // components: { RecipeList },
    data() {
      return {
        soupData: [
          {
            id: 1095889,
            title: "Creamy Homemade Tomato Soup",
            image: "https://img.spoonacular.com/recipes/1095889-312x231.jpg",
            imageType: "jpg",
            description:
              "Creamy Homemade Tomato Soup might be a good recipe to expand your hor d'oeuvre repertoire. Watching your figure? This gluten free recipe has 304 calories, 5g of protein, and 24g of fat per serving. For $1.19 per serving, this recipe covers 16% of your daily requirements of vitamins and minerals. This recipe serves 4. It will be a hit at your Autumn event. 1 person were glad they tried this recipe. From preparation to the plate, this recipe takes approximately 30 minutes. Head to the store and pick up chicken stock cube, tomato puree, cream, and a few other things to make it today. It is brought to you by Foodista. All things considered, we decided this recipe deserves a spoonacular score of 39%. This score is rather bad.",
          },
          {
            id: 648155,
            title: "Italian Kale and Potato Soup",
            image: "https://img.spoonacular.com/recipes/648155-312x231.jpg",
            imageType: "jpg",
            description:
              "Italian Kale and Potato Soup is a gluten free and whole 30 recipe with 6 servings. This main course has 480 calories, 22g of protein, and 33g of fat per serving. For $2.06 per serving, this recipe covers 26% of your daily requirements of vitamins and minerals. 2 people have made this recipe and would make it again. If you have oregano, ground turkey sausage, chicken broth, and a few other ingredients on hand, you can make it. It can be enjoyed any time, but it is especially good for Autumn. Not a lot of people really liked this Mediterranean dish. It is brought to you by Foodista. From preparation to the plate, this recipe takes roughly 45 minutes. All things considered, we decided this recipe deserves a spoonacular score of 80%. This score is great.",
          },
          {
            id: 655726,
            title: "Perfect Chicken Soup",
            image: "https://img.spoonacular.com/recipes/655726-312x231.jpg",
            imageType: "jpg",
            description:
              "Perfect Chicken Soup is a gluten free, dairy free, and whole 30 main course. This recipe serves 8. For 99 cents per serving, this recipe covers 21% of your daily requirements of vitamins and minerals. One portion of this dish contains around 31g of protein, 23g of fat, and a total of 430 calories. 1 person found this recipe to be yummy and satisfying. It is brought to you by Foodista. A mixture of a lemon, ginger, celery, and a handful of other ingredients are all it takes to make this recipe so scrumptious. It will be a hit at your Autumn event. From preparation to the plate, this recipe takes roughly 45 minutes. All things considered, we decided this recipe deserves a spoonacular score of 65%. This score is solid. ",
          },
          {
            id: 643492,
            title: "Fresh Fruit Soup",
            image: "https://img.spoonacular.com/recipes/643492-312x231.jpg",
            imageType: "jpg",
            description:
              "If you want to add more dairy free recipes to your repertoire, Fresh Fruit Soup might be a recipe you should try. One serving contains 328 calories, 9g of protein, and 16g of fat. This recipe serves 6. For $1.56 per serving, this recipe covers 19% of your daily requirements of vitamins and minerals. A mixture of garlic cloves, plums, peaches, and a handful of other ingredients are all it takes to make this recipe so scrumptious. Autumn will be even more special with this recipe. This recipe from Foodista has 1 fans. From preparation to the plate, this recipe takes roughly 45 minutes. It works well as a hor d'oeuvre. All things considered, we decided this recipe deserves a spoonacular score of 87%. This score is excellent.",
          },
          {
            id: 646561,
            title: "Hearty Chicken & Grilled Corn Soup",
            image: "https://img.spoonacular.com/recipes/646561-312x231.jpg",
            imageType: "jpg",
            description:
              "Hearty Chicken & Grilled Corn Soup is a main course that serves 4. One portion of this dish contains around 30g of protein, 37g of fat, and a total of 520 calories. For $2.02 per serving, this recipe covers 23% of your daily requirements of vitamins and minerals. This recipe from Foodista requires water, celery stalks, cayenne pepper, and chicken thighs. 1 person found this recipe to be scrumptious and satisfying. From preparation to the plate, this recipe takes around 45 minutes. It can be enjoyed any time, but it is especially good for The Fourth Of July. It is a good option if you're following a gluten free and dairy free diet. All things considered, we decided this recipe deserves a spoonacular score of 57%. This score is pretty good.",
          },
          {
            id: 636177,
            title: "Broccoli Cheddar Soup",
            image: "https://img.spoonacular.com/recipes/636177-312x231.jpg",
            imageType: "jpg",
            description:
              "You can never have too many main course recipes, so give Broccoli Cheddar Soup a try. One portion of this dish contains around 17g of protein, 19g of fat, and a total of 331 calories. For $1.39 per serving, this recipe covers 20% of your daily requirements of vitamins and minerals. This recipe serves 8. It is perfect for Autumn. From preparation to the plate, this recipe takes approximately 45 minutes. Head to the store and pick up shallot, onion, salt and pepper, and a few other things to make it today. It is brought to you by Foodista. 1 person were impressed by this recipe. It is a good option if you're following a gluten free and lacto ovo vegetarian diet. Overall, this recipe earns a good spoonacular score of 54%.",
          },
          {
            id: 1096211,
            title: "The Easiest Beef Pho",
            image: "https://img.spoonacular.com/recipes/1096211-312x231.jpg",
            imageType: "jpg",
            description:
              "The Easiest Beef Pho takes roughly 35 minutes from beginning to end. One serving contains 656 calories, 40g of protein, and 22g of fat. This recipe serves 2. For $9.11 per serving, this recipe covers 21% of your daily requirements of vitamins and minerals. This recipe from Foodista has 1 fans. It is a good option if you're following a dairy free diet. It works well as a main course. If you have star anise pods, ginger, cinnamon sticks, and a few other ingredients on hand, you can make it. It is a pricey recipe for fans of Vietnamese food. Taking all factors into account, this recipe earns a spoonacular score of 58%, which is solid.",
          },
          {
            id: 639569,
            title: "Classic Beef Stew",
            image: "https://img.spoonacular.com/recipes/639569-312x231.jpg",
            imageType: "jpg",
            description:
              "The recipe Classic Beef Stew can be made in about 45 minutes. This recipe serves 6 and costs $1.71 per serving. Watching your figure? This gluten free and dairy free recipe has 285 calories, 34g of protein, and 9g of fat per serving. Not a lot of people really liked this main course. Head to the store and pick up stew beef, onion powder, carrots, and a few other things to make it today. 1 person were glad they tried this recipe. Autumn will be even more special with this recipe. It is brought to you by Foodista. All things considered, we decided this recipe deserves a spoonacular score of 80%. This score is good.",
          },
          {
            id: 645002,
            title:
              "Golden Cream Of Mushroom Soup With Crispy Shallots & Creme Fraiche",
            image: "https://img.spoonacular.com/recipes/645002-312x231.jpg",
            imageType: "jpg",
            description:
              "If you want to add more lacto ovo vegetarian recipes to your recipe box, Golden Cream Of Mushroom Soup With Crispy Shallots & Creme Fraiche might be a recipe you should try. This recipe serves 6 and costs $1.08 per serving. One portion of this dish contains about 2g of protein, 4g of fat, and a total of 75 calories. Not a lot of people made this recipe, and 2 would say it hit the spot. Head to the store and pick up shallots, flour, thyme, and a few other things to make it today. It works well as a budget friendly hor d'oeuvre. Autumn will be even more special with this recipe. From preparation to the plate, this recipe takes roughly 45 minutes. It is brought to you by Foodista. With a spoonacular score of 48%, this dish is pretty good.",
          },
          {
            id: 638026,
            title: "Chicken Chili With Black Eyed Peas",
            image: "https://img.spoonacular.com/recipes/638026-312x231.jpg",
            imageType: "jpg",
            description:
              "The recipe Chicken Chili With Black Eyed Peas can be made in roughly 45 minutes. This recipe makes 8 servings with 208 calories, 13g of protein, and 12g of fat each. For 74 cents per serving, this recipe covers 10% of your daily requirements of vitamins and minerals. It is perfect for The Super Bowl. This recipe from Foodista requires oil, chicken, garlic paste, and water. It works well as an American main course. 1 person were impressed by this recipe. It is a good option if you're following a gluten free diet. Taking all factors into account, this recipe earns a spoonacular score of 31%, which is rather bad.",
          },
        ],
        category: this.$route.params.category,
      };
    },
    methods: {
      handleRecipe(id) {
        this.$router.push(`/recipe/${id}`);
      },
    },
    watch: {
      "$route.params.category"(val) {
        this.category = val;
      },
    },
  };
</script>

<style scoped>
  .title {
    font-size: 18px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    margin-top: 15px;
    margin-bottom: 10px;
    -webkit-line-clamp: 1;
    line-height: normal;
    -webkit-box-orient: vertical;
  }
  .description {
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-height: normal;
    -webkit-box-orient: vertical;
  }
</style>
