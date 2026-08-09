<script setup lang="ts">
import type { PropType } from 'vue'

import { useMainStore } from '@/stores/mainStore.ts'
import type { Recipe } from '@/types/recipe'
import RecipeCard from './RecipeCard.vue'

const props = defineProps({
  results: {
    type: Array as PropType<Array<Recipe>>,
    required: true,
    default: () => [],
  },
})

const mainStore = useMainStore()

function addToRecentRecipe(recipe: Recipe) {
  mainStore.addToRecentRecipes({
    recipeId: recipe.id,
    recipeName: recipe.recipeName,
    recipeThumbnail: recipe.recipeThumbnail,
    slug: recipe.slug,
    createdAt: new Date(),
  })
}
</script>

<template>
  <div class="grid-container">
    <div class="grid">
      <div v-for="recipe in props.results" :key="recipe.id" @click="addToRecentRecipe(recipe)">
        <router-link :to="`/${recipe.slug}`">
          <RecipeCard
            :recipe-name="recipe.recipeName"
            :recipe-thumbnail="recipe.recipeThumbnail"
            :area="recipe.area"
            :category="recipe.category"
          />
        </router-link>
      </div>
      <p v-if="!props.results.length" class="no-result-text">No Results</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grid-container {
  display: flex;
  justify-content: center;
  overflow-y: auto;
  padding-top: 1rem;
  height: 100%;
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.no-result-text {
  @include m-flex-center;
  font-size: 2rem;
  padding-top: 2rem;
}
</style>
