import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

import type { Recipe } from '@/types/recipe'
import type { RecentRecipe } from '@/types/recentRecipe'

export const useMainStore = defineStore('main', () => {
  const keywordRecipes = ref<Recipe[]>([])
  const hybridRecipes = ref<Recipe[]>([])

  function updateKeywordRecipes(val: Recipe[]) {
    keywordRecipes.value = val
  }
  function updateHybridRecipes(val: Recipe[]) {
    hybridRecipes.value = val
  }

  // overlay for drop down list
  const ddOpenId = ref<string | null>(null)

  function toggleDD(id: 'searchOption' | 'category' | 'area' | 'searchbar') {
    ddOpenId.value = ddOpenId.value === id ? null : id
  }

  function closeDD() {
    ddOpenId.value = null
  }

  // recent recipe queue in local storage

  const recentRecipeQueue = useStorage<RecentRecipe[]>('recent-recipes', [])

  /**
   * This update the recent recipe queue in the localStorage
   * @param recipe - Some of the properties of the recipe object that will be stored in the local storage
   */
  function addToRecentRecipes({ recipeId, recipeName, recipeThumbnail, slug, createdAt }: RecentRecipe
  ) {
    const findIndex = recentRecipeQueue.value.findIndex((x) => x.recipeId === recipeId)

    if (findIndex !== -1) {
      recentRecipeQueue.value.splice(findIndex, 1)
    }

    recentRecipeQueue.value.unshift({
      recipeId,
      recipeName,
      recipeThumbnail,
      slug,
      createdAt: createdAt || new Date(),
    })

    if (recentRecipeQueue.value.length > 3) {
      recentRecipeQueue.value.pop()
    }
  }
  
  return {
    keywordRecipes,
    hybridRecipes,
    updateKeywordRecipes,
    updateHybridRecipes,
    toggleDD,
    closeDD,
    ddOpenId,
    addToRecentRecipes,
    recentRecipeQueue,
  }
})
