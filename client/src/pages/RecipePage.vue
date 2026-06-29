<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'

import { useMainStore } from '@/stores/mainStore'

import type { Recipe } from '@/types/recipe'
import BaseBadge from '@/components/util/BaseBadge.vue'

const { params } = useRoute()
const mainStore = useMainStore()

const recipe = ref<Recipe>()
const badgeText = ref<string[]>([])

function loadRecipe(id: any) {
  const option = mainStore.getCurrentOption

  if (option.value === 'keyword') {
    recipe.value = mainStore.getKeywordRecipes.value.find((r: Recipe) => r.id === id)
  } else if (option.value === 'hybrid') {
    recipe.value = mainStore.getHybridRecipes.value.find((r: Recipe) => r.id === id)
  }

  //if (!recipe.value) throw new Error('No recipe was loaded')

  // merge category and area into an array
  //badgeText.value.push(recipe.value.area, recipe.value.category)
}

loadRecipe(params.id)

onBeforeRouteUpdate((to) => {
  loadRecipe(to.params.id)
})

/* test content */

const testIngredients = ref([
  '2 tbsp Extra Virgin Olive Oil',
  '1 Onion',
  '1 Chorizo',
  '1 Red Pepper',
])

const testInstruction = ref([
  'Soak the potatoes in just-boiled water for 30 minutes. Drain, and then leave them to air-dry for 5 minutes. Heat the air fryer to 200C. Tip the potatoes into a bowl, drizzle over 1 tbsp of the oil, and add 1/2 tsp each of salt and freshly ground black pepper. Mix to coat the potatoes all over, then tip into the air fryer basket and cook for 20–30 minutes until crisp and golden.',
  'Meanwhile, heat the remaining oil in a small pan over medium-low heat and fry the onion for 8–10 minutes until softened but not golden. Stir in the garlic and cook for 1 minute. Add the paprika and cook for 30 seconds more. Stir in the tomato purée and cook for 1 minute, then tip in the chopped tomatoes. Cook for 5–10 minutes over medium heat until slightly thickened.',
  'Once the potatoes are cooked, tip them out onto a platter and pour over the tomato sauce. Sprinkle with the basil leaves, then serve.',
])
</script>

<template>
  <div>
    <header>
      <router-link :to="'/'" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path fill="currentColor" fill-rule="evenodd" d="m15 4l2 2l-6 6l6 6l-2 2l-8-8z" />
        </svg>
        <p>Back</p>
      </router-link>
    </header>
    <!-- top image, recipe name, area and category -->
    <div class="top-container">
      <img
        :src="recipe?.recipeThumbnail"
        :alt="recipe?.recipeName"
        class="img"
      />
      <h1 :class="['recipe-name']">{{ recipe?.recipeName }}</h1>
      <div :class="{'badge-container--flex': badgeText.length < 3, 'badge-container--grid': badgeText.length >= 3}">
        <BaseBadge v-for="badge in badgeText" :key="badge">{{ badge }}</BaseBadge>
      </div>
    </div>
    <!-- Ingredients -->
    <div class="ingredient-container">
      <h1 class="heading-content">Ingredients</h1>
      <div class="ingredient-list">
        <div v-for="ing in recipe?.ingredients" :key="ing" class="ingredient">
          <div>•</div>
          <div>{{ ing }}</div>
        </div>
      </div>
    </div>
    <!-- instructions -->
    <div class="instruction-container">
      <h1 class="heading-content">Instructions</h1>
      <div v-for="(ins, index) in recipe?.instructions" :key="ins">
        <span>{{ index + 1 }}. </span>
        <p>{{ ins }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
header {
  height: 3rem;
  background-color: white;
  display: flex;
  position: sticky;
  top: 0;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
  margin-left: 1rem;
  font-size: large;
  text-decoration: none;
}

.top-container {
  @include m-flex-center;
  flex-direction: column;
  height: fit-content;
  width: 100%;
}

.img {
  max-height: 15rem;
  width: 100%;
  object-fit: cover;
}

.recipe-name {
  text-transform: uppercase;
  text-align: center;
  font-size: $font-size-2xl;
  margin: 0.5rem 0.7rem;
}

/* .badge-container {
  width: 80%;
  max-width: 10rem;
  margin: 0 auto;

  #{&}--flex {
    
  }

  #{&}--grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
} */

.badge-container--flex {
  width: 80%;
  @include m-flex-center;
  column-gap: 1rem;
  max-width: 10rem;
  margin: 0 auto;
}

.badge-container--grid {
  width: 80%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  //max-width: 10rem;
  margin: 0 auto;
}

.ingredient-container {
  margin: 1rem;
}

.heading-content {
  font-size: $font-size-xl;
}

.ingredient-list {
  margin: 0.5rem 0;
}

.ingredient {
  display: flex;
  column-gap: 0.5rem;
  line-height: 1.5rem;
}

.instruction-container {
  margin: 1rem;
}
</style>
