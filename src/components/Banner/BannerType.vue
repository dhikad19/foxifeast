<template>
  <v-row class="mt-8" :dense="$vuetify.display.smAndDown">
    <v-col cols="12">
      <p style="font-weight: bold;" :style="$vuetify.display.smAndDown ? 'font-size: 20px' : 'font-size: 25px'">Meal Time</p>
    </v-col>
    <v-col cols="12" class="mt-2">
      <div
      style="border-radius: 4px"
        class="d-flex align-center"
        :class="$vuetify.display.smAndDown ? 'flex-column' : ''"
        :style="
          $vuetify.theme.global.name === 'dark'
            ? 'background-color: #4f4f4f; '
            : 'background-color: #fafafa; '
        ">
        <v-img
          width="100%"
          :max-width="$vuetify.display.smAndDown ? '100%' : '50%'"
          style="border-radius: 4px"
          src="/assets/grid/breakfast.png"></v-img>
        <div class="pa-4">
          <span class="title">Hearty Dinner Recipes to End Your Day Right</span>
          <p class="mt-4" :class="$vuetify.display.smAndDown ? 'description' : ' '">
            End your day with comforting, satisfying meals made from simple
            ingredients. These dinner recipes are perfect for winding down,
            whether you’re cooking for family or enjoying a solo night in. From
            cozy stews to flavorful stir-fries, discover dishes that bring
            warmth to your evenings.
          </p>
        </div>
      </div>
    </v-col>
    <v-col cols="12" class="mt-2">
      <div
      style="border-radius: 4px"
        class="d-flex align-center"
        :class="$vuetify.display.smAndDown ? 'flex-column-reverse' : ''"
        :style="
          $vuetify.theme.global.name === 'dark'
            ? 'background-color: #4f4f4f; '
            : 'background-color: #fafafa; '
        ">
        <div class="pa-4">
          <span class="title"
            >Quick and Tasty Lunch Ideas for Midday Energy</span
          >
          <p class="mt-4" :class="$vuetify.display.smAndDown ? 'description' : ' '">
            Fuel your afternoon with these easy and delicious lunch recipes.
            Designed for busy schedules and hungry appetites, these meals offer
            a balance of nutrition and flavor — perfect for workdays, school, or
            weekend relaxation. Think wraps, bowls, salads, and everything in
            between!
          </p>
        </div>
        <v-img
          width="100%"
          :max-width="$vuetify.display.smAndDown ? '100%' : '50%'"
          style="border-radius: 4px"
          src="/assets/grid/lunch.png"></v-img>
      </div>
    </v-col>
    <v-col cols="12" class="mt-2">
      <div
      style="border-radius: 4px"
        class="d-flex align-center"
        :class="$vuetify.display.smAndDown ? 'flex-column' : ''"
        :style="
          $vuetify.theme.global.name === 'dark'
            ? 'background-color: #4f4f4f; '
            : 'background-color: #fafafa; '
        ">
        <v-img
          :max-width="$vuetify.display.smAndDown ? '100%' : '50%'"
          style="border-radius: 4px"
          width="100%"
          src="/assets/grid/dinner.png"></v-img>
        <div class="pa-4">
          <span class="title"
            >Bright Mornings: Breakfast Recipes to Start Fresh</span
          >
          <p class="mt-4" :class="$vuetify.display.smAndDown ? 'description' : ' '">
            Jumpstart your day with energizing and wholesome breakfast dishes.
            Whether you prefer something sweet, savory, light, or hearty — these
            recipes are made to brighten your mornings and keep you full until
            lunch. Pancakes, eggs, smoothies, and more await!Jumpstart your day
            with energizing and wholesome breakfast dishes. Whether you prefer
            something sweet, savory, light, or hearty — these recipes are made
            to brighten your mornings and keep you full until lunch. Pancakes,
            eggs, smoothies, and more await!
          </p>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<style scope>
  .title {
    margin-top: 10px;
    font-size: 18px;
    font-weight: bold;
    line-height: normal;
  }
  .description {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-height: normal;
    -webkit-box-orient: vertical;
  }
</style>
