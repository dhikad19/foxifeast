<template>
  <v-row class="mb-6">
    <v-col cols="12">
      <div v-if="categoryContent">
        <p class="title-page">{{ categoryContent.title }}</p>
        <p style="line-height: normal">
          {{ categoryContent.description }}
        </p>
      </div>
    </v-col>

    <v-col
      v-for="(item, index) in displayedData"
      :key="item.id"
      :cols="$vuetify.display.smAndDown ? 12 : (index < 2 ? 6 : 3)"
    >
      <div @click="handleRecipe(item.id)" class="cursor-pointer pa-4" style="line-height: normal;border-radius: 4px" :style="
      $vuetify.theme.global.name === 'dark'
        ? 'background-color: #4f4f4f; '
        : 'background-color: #fafafa; '
    ">
        <v-img
          max-height="200"
          cover
          style="border-radius: 4px"
          :src="item.image"
        />
        <p class="title">{{ item.title }}</p>
        <p class="description">{{ item.description }}</p>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "RecipeCategory",
  data() {
    return {
      soupData: [
          {
            id: 1095889,
            title: "Creamy Homemade Tomato Soup",
            image: "https://img.spoonacular.com/recipes/1095889-636x393.jpg",
            imageType: "jpg",
            description:
              "Creamy Homemade Tomato Soup might be a good recipe to expand your hor d'oeuvre repertoire. Watching your figure? This gluten free recipe has 304 calories, 5g of protein, and 24g of fat per serving. For $1.19 per serving, this recipe covers 16% of your daily requirements of vitamins and minerals. This recipe serves 4. It will be a hit at your Autumn event. 1 person were glad they tried this recipe. From preparation to the plate, this recipe takes approximately 30 minutes. Head to the store and pick up chicken stock cube, tomato puree, cream, and a few other things to make it today. It is brought to you by Foodista. All things considered, we decided this recipe deserves a spoonacular score of 39%. This score is rather bad.",
          },
          {
            id: 648155,
            title: "Italian Kale and Potato Soup",
            image: "https://img.spoonacular.com/recipes/648155-636x393.jpg",
            imageType: "jpg",
            description:
              "Italian Kale and Potato Soup is a gluten free and whole 30 recipe with 6 servings. This main course has 480 calories, 22g of protein, and 33g of fat per serving. For $2.06 per serving, this recipe covers 26% of your daily requirements of vitamins and minerals. 2 people have made this recipe and would make it again. If you have oregano, ground turkey sausage, chicken broth, and a few other ingredients on hand, you can make it. It can be enjoyed any time, but it is especially good for Autumn. Not a lot of people really liked this Mediterranean dish. It is brought to you by Foodista. From preparation to the plate, this recipe takes roughly 45 minutes. All things considered, we decided this recipe deserves a spoonacular score of 80%. This score is great.",
          },
          {
            id: 655726,
            title: "Perfect Chicken Soup",
            image: "https://img.spoonacular.com/recipes/655726-636x393.jpg",
            imageType: "jpg",
            description:
              "Perfect Chicken Soup is a gluten free, dairy free, and whole 30 main course. This recipe serves 8. For 99 cents per serving, this recipe covers 21% of your daily requirements of vitamins and minerals. One portion of this dish contains around 31g of protein, 23g of fat, and a total of 430 calories. 1 person found this recipe to be yummy and satisfying. It is brought to you by Foodista. A mixture of a lemon, ginger, celery, and a handful of other ingredients are all it takes to make this recipe so scrumptious. It will be a hit at your Autumn event. From preparation to the plate, this recipe takes roughly 45 minutes. All things considered, we decided this recipe deserves a spoonacular score of 65%. This score is solid. ",
          },
          {
            id: 643492,
            title: "Fresh Fruit Soup",
            image: "https://img.spoonacular.com/recipes/643492-636x393.jpg",
            imageType: "jpg",
            description:
              "If you want to add more dairy free recipes to your repertoire, Fresh Fruit Soup might be a recipe you should try. One serving contains 328 calories, 9g of protein, and 16g of fat. This recipe serves 6. For $1.56 per serving, this recipe covers 19% of your daily requirements of vitamins and minerals. A mixture of garlic cloves, plums, peaches, and a handful of other ingredients are all it takes to make this recipe so scrumptious. Autumn will be even more special with this recipe. This recipe from Foodista has 1 fans. From preparation to the plate, this recipe takes roughly 45 minutes. It works well as a hor d'oeuvre. All things considered, we decided this recipe deserves a spoonacular score of 87%. This score is excellent.",
          },
          {
            id: 646561,
            title: "Hearty Chicken & Grilled Corn Soup",
            image: "https://img.spoonacular.com/recipes/646561-636x393.jpg",
            imageType: "jpg",
            description:
              "Hearty Chicken & Grilled Corn Soup is a main course that serves 4. One portion of this dish contains around 30g of protein, 37g of fat, and a total of 520 calories. For $2.02 per serving, this recipe covers 23% of your daily requirements of vitamins and minerals. This recipe from Foodista requires water, celery stalks, cayenne pepper, and chicken thighs. 1 person found this recipe to be scrumptious and satisfying. From preparation to the plate, this recipe takes around 45 minutes. It can be enjoyed any time, but it is especially good for The Fourth Of July. It is a good option if you're following a gluten free and dairy free diet. All things considered, we decided this recipe deserves a spoonacular score of 57%. This score is pretty good.",
          },
          {
            id: 636177,
            title: "Broccoli Cheddar Soup",
            image: "https://img.spoonacular.com/recipes/636177-636x393.jpg",
            imageType: "jpg",
            description:
              "You can never have too many main course recipes, so give Broccoli Cheddar Soup a try. One portion of this dish contains around 17g of protein, 19g of fat, and a total of 331 calories. For $1.39 per serving, this recipe covers 20% of your daily requirements of vitamins and minerals. This recipe serves 8. It is perfect for Autumn. From preparation to the plate, this recipe takes approximately 45 minutes. Head to the store and pick up shallot, onion, salt and pepper, and a few other things to make it today. It is brought to you by Foodista. 1 person were impressed by this recipe. It is a good option if you're following a gluten free and lacto ovo vegetarian diet. Overall, this recipe earns a good spoonacular score of 54%.",
          },
          {
            id: 1096211,
            title: "The Easiest Beef Pho",
            image: "https://img.spoonacular.com/recipes/1096211-636x393.jpg",
            imageType: "jpg",
            description:
              "The Easiest Beef Pho takes roughly 35 minutes from beginning to end. One serving contains 656 calories, 40g of protein, and 22g of fat. This recipe serves 2. For $9.11 per serving, this recipe covers 21% of your daily requirements of vitamins and minerals. This recipe from Foodista has 1 fans. It is a good option if you're following a dairy free diet. It works well as a main course. If you have star anise pods, ginger, cinnamon sticks, and a few other ingredients on hand, you can make it. It is a pricey recipe for fans of Vietnamese food. Taking all factors into account, this recipe earns a spoonacular score of 58%, which is solid.",
          },
          {
            id: 639569,
            title: "Classic Beef Stew",
            image: "https://img.spoonacular.com/recipes/639569-636x393.jpg",
            imageType: "jpg",
            description:
              "The recipe Classic Beef Stew can be made in about 45 minutes. This recipe serves 6 and costs $1.71 per serving. Watching your figure? This gluten free and dairy free recipe has 285 calories, 34g of protein, and 9g of fat per serving. Not a lot of people really liked this main course. Head to the store and pick up stew beef, onion powder, carrots, and a few other things to make it today. 1 person were glad they tried this recipe. Autumn will be even more special with this recipe. It is brought to you by Foodista. All things considered, we decided this recipe deserves a spoonacular score of 80%. This score is good.",
          },
          {
            id: 645002,
            title:
              "Golden Cream Of Mushroom Soup With Crispy Shallots & Creme Fraiche",
            image: "https://img.spoonacular.com/recipes/645002-636x393.jpg",
            imageType: "jpg",
            description:
              "If you want to add more lacto ovo vegetarian recipes to your recipe box, Golden Cream Of Mushroom Soup With Crispy Shallots & Creme Fraiche might be a recipe you should try. This recipe serves 6 and costs $1.08 per serving. One portion of this dish contains about 2g of protein, 4g of fat, and a total of 75 calories. Not a lot of people made this recipe, and 2 would say it hit the spot. Head to the store and pick up shallots, flour, thyme, and a few other things to make it today. It works well as a budget friendly hor d'oeuvre. Autumn will be even more special with this recipe. From preparation to the plate, this recipe takes roughly 45 minutes. It is brought to you by Foodista. With a spoonacular score of 48%, this dish is pretty good.",
          },
          {
            id: 638026,
            title: "Chicken Chili With Black Eyed Peas",
            image: "https://img.spoonacular.com/recipes/638026-636x393.jpg",
            imageType: "jpg",
            description:
              "The recipe Chicken Chili With Black Eyed Peas can be made in roughly 45 minutes. This recipe makes 8 servings with 208 calories, 13g of protein, and 12g of fat each. For 74 cents per serving, this recipe covers 10% of your daily requirements of vitamins and minerals. It is perfect for The Super Bowl. This recipe from Foodista requires oil, chicken, garlic paste, and water. It works well as an American main course. 1 person were impressed by this recipe. It is a good option if you're following a gluten free diet. Taking all factors into account, this recipe earns a spoonacular score of 31%, which is rather bad.",
          },
        ],
      riceData: [
        {
            "id": 643786,
            "title": "Fried Rice - Chinese comfort food",
            "image": "https://img.spoonacular.com/recipes/643786-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 656777,
            "title": "Pork Fried Rice",
            "image": "https://img.spoonacular.com/recipes/656777-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 716311,
            "title": "Mango Fried Rice",
            "image": "https://img.spoonacular.com/recipes/716311-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 682619,
            "title": "Shrimp Fried Rice",
            "image": "https://img.spoonacular.com/recipes/682619-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 633093,
            "title": "Autumn Fried Rice with Buffalo Nuts®",
            "image": "https://img.spoonacular.com/recipes/633093-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 638729,
            "title": "Chinese Veg Fried rice",
            "image": "https://img.spoonacular.com/recipes/638729-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 660231,
            "title": "Skinny Veggie Fried Rice",
            "image": "https://img.spoonacular.com/recipes/660231-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 642138,
            "title": "Easy Vegetable Fried Rice",
            "image": "https://img.spoonacular.com/recipes/642138-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 646425,
            "title": "Healthier Pork Fried Rice",
            "image": "https://img.spoonacular.com/recipes/646425-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 984198,
            "title": "BBQ Gochujang Cauliflower Fried Rice",
            "image": "https://img.spoonacular.com/recipes/984198-636x393.png",
            "imageType": "png"
        },
        {
            "id": 716426,
            "title": "Cauliflower, Brown Rice, and Vegetable Fried Rice",
            "image": "https://img.spoonacular.com/recipes/716426-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 643674,
            "title": "Fried Brown Rice",
            "image": "https://img.spoonacular.com/recipes/643674-636x393.jpg",
            "imageType": "jpg"
        }
        ],
      saladData: [
        {
            "id": 656817,
            "title": "Pork Schnitzel And Apple Salad",
            "image": "https://img.spoonacular.com/recipes/656817-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 639910,
            "title": "Cold Fennel and Zucchini Noodle Side Salad",
            "image": "https://img.spoonacular.com/recipes/639910-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 641631,
            "title": "Dragon Salad - Couscous Summer Salad",
            "image": "https://img.spoonacular.com/recipes/641631-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 659021,
            "title": "Salade Grecque",
            "image": "https://img.spoonacular.com/recipes/659021-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 660108,
            "title": "Simple Kale Salad",
            "image": "https://img.spoonacular.com/recipes/660108-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 662632,
            "title": "Sweet Summer Salad",
            "image": "https://img.spoonacular.com/recipes/662632-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 645516,
            "title": "Green Side Salad With Sweet and Spicy Basil Vinaigrette",
            "image": "https://img.spoonacular.com/recipes/645516-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 658579,
            "title": "Roasted Endive Salad With Prosciutto, Figs and Pistachios",
            "image": "https://img.spoonacular.com/recipes/658579-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 632631,
            "title": "Apple-Spinach Salad",
            "image": "https://img.spoonacular.com/recipes/632631-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 641005,
            "title": "Cucumber and Cannellini Bean Side Salad",
            "image": "https://img.spoonacular.com/recipes/641005-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 642809,
            "title": "Fig, Goat Cheese and Walnut Salad",
            "image": "https://img.spoonacular.com/recipes/642809-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 645776,
            "title": "Grilled Mushrooms Salad",
            "image": "https://img.spoonacular.com/recipes/645776-636x393.jpg",
            "imageType": "jpg"
        }
        ],
      sandwichData: [
        {
            "id": 1697751,
            "title": "Ridiculously Easy Gourmet Tuna Sandwich",
            "image": "https://img.spoonacular.com/recipes/1697751-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 655822,
            "title": "Pesto Fresh Caprese Sandwich",
            "image": "https://img.spoonacular.com/recipes/655822-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 635217,
            "title": "Blackberry Grilled Cheese Sandwich",
            "image": "https://img.spoonacular.com/recipes/635217-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 646191,
            "title": "Ham and Swiss Panini With Mushrooms and Kale",
            "image": "https://img.spoonacular.com/recipes/646191-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 655890,
            "title": "Philly Cheesesteak Grilled Wraps",
            "image": "https://img.spoonacular.com/recipes/655890-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 632071,
            "title": "All American Sloppy Joes",
            "image": "https://img.spoonacular.com/recipes/632071-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 634320,
            "title": "Barbecued Pulled Beef Sandwiches",
            "image": "https://img.spoonacular.com/recipes/634320-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 663931,
            "title": "Tuna Mexi Melts",
            "image": "https://img.spoonacular.com/recipes/663931-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 635342,
            "title": "BLT Sandwich",
            "image": "https://img.spoonacular.com/recipes/635342-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 647148,
            "title": "Homestyle Sloppy Joes",
            "image": "https://img.spoonacular.com/recipes/647148-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 643861,
            "title": "Frittata \"Brinner\" Sandwiches - Southwest Style",
            "image": "https://img.spoonacular.com/recipes/643861-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 1095945,
            "title": "Tuna Sandwich Savory Cake (Swedish Smörgåstårta)",
            "image": "https://img.spoonacular.com/recipes/1095945-636x393.jpg",
            "imageType": "jpg"
        }
        ],
      spaghettiData: [
        {
            "id": 1506695,
            "title": "Easy Baked Spaghetti",
            "image": "https://img.spoonacular.com/recipes/1506695-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 1096014,
            "title": "Spaghetti Squash Boats",
            "image": "https://img.spoonacular.com/recipes/1096014-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 661094,
            "title": "Spicy Eggplant Spaghetti",
            "image": "https://img.spoonacular.com/recipes/661094-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 654292,
            "title": "Oyster or Clam Spaghetti",
            "image": "https://img.spoonacular.com/recipes/654292-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 634929,
            "title": "Best Spaghetti Sauce Ever",
            "image": "https://img.spoonacular.com/recipes/634929-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 655853,
            "title": "Pesto Zucchini \"Spaghetti",
            "image": "https://img.spoonacular.com/recipes/655853-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 32579,
            "title": "Tuna Spaghetti With Fava Beans",
            "image": "https://img.spoonacular.com/recipes/32579-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 652591,
            "title": "Mummy Meatballs with Spaghetti",
            "image": "https://img.spoonacular.com/recipes/652591-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 660822,
            "title": "Spaghetti With Cape Hake Sauce",
            "image": "https://img.spoonacular.com/recipes/660822-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 660820,
            "title": "Spaghetti With Bolognese Sauce",
            "image": "https://img.spoonacular.com/recipes/660820-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 660835,
            "title": "Spaghetti With Pesto Trapanese",
            "image": "https://img.spoonacular.com/recipes/660835-636x393.jpg",
            "imageType": "jpg"
        },
        {
            "id": 1096215,
            "title": "Beef Ragu with Spaghetti Squash",
            "image": "https://img.spoonacular.com/recipes/1096215-636x393.jpg",
            "imageType": "jpg"
        }
        ],
      category: this.$route.params.category,
    };
  },
  computed: {
    displayedData() {
      const dataMap = {
        rice: this.riceData,
        soup: this.soupData,
        salad: this.saladData,
        sandwich: this.sandwichData,
        spaghetti: this.spaghettiData,
      };

      return dataMap[this.category]?.slice(0, 10) || [];
    },
    categoryContent() {
      const contentMap = {
        rice: {
          title: "Rice",
          description: "From fluffy jasmine to savory fried rice, these recipes showcase the incredible versatility of rice. Explore dishes inspired by global cuisines — whether it’s a simple side or the star of the meal, rice is always satisfying and filling."
        },
        soup: {
          title: "Soup",
          description: "A comforting and versatile dish, soup brings together rich broths, tender vegetables, and flavorful spices. Whether it’s a hearty chicken soup or a light vegetable broth, these recipes are perfect for warming up on chilly days or starting a meal with something soothing."
        },
        salad: {
          title: "Salad",
          description: "Fresh, vibrant, and nutritious, salads can be as simple or as elaborate as you like. These recipes range from crisp garden greens to protein-packed bowls, offering refreshing options for every season and occasion."
        },
        sandwich: {
          title: "Sandwich",
          description: "Quick, easy, and endlessly customizable, sandwiches are perfect for breakfast, lunch, or a snack on the go. Discover combinations of fresh bread, savory fillings, and delicious spreads that make every bite satisfying."
        },
        spaghetti: {
          title: "Spaghetti",
          description: "Classic and comforting, spaghetti dishes bring together rich sauces, tender pasta, and bold flavors. Whether it’s a traditional Bolognese or a creamy garlic parmesan, these recipes are perfect for both weeknight meals and special occasions."
        }
      };
      return contentMap[this.category] || null;
    }
  },
  watch: {
    "$route.params.category"(val) {
      this.category = val;
    },
  },
  methods: {
    handleRecipe(id) {
      this.$router.push(`/recipe/${id}`);
    },
  },
};
</script>

<style scoped>
.title-page {
  font-weight: 500;
  font-size: 20px;
}
.title {
  font-size: 18px;
  font-weight: 500;
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
