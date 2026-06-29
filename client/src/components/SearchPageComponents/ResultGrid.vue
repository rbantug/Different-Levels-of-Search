<script setup lang="ts">
import type { PropType } from 'vue'

import type { Recipe } from '@/types/recipe'
import RecipeCard from './RecipeCard.vue'

const props = defineProps({
  results: {
    type: Array as PropType<Array<Recipe>>,
    required: true,
    default: () => [],
  },
})
</script>

<template>
  <div class="grid-container">
    <div class="grid">
      <div v-for="recipe in props.results" :key="recipe.id">
        <router-link :to="`/${recipe.id}`">
          <RecipeCard 
            :recipe-name="recipe.recipeName"
            :recipe-thumbnail="recipe.recipeThumbnail"
            :area="recipe.area"
            :category="recipe.category"
          />
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grid-container {
    display: flex;
    justify-content: center;
    overflow-y: auto;
    padding-top: 1rem;
    padding-bottom: 5rem;
}

.grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
