import { type Ref, ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

import type { Recipe } from '@/types/recipe'
import type { RecentRecipe } from '@/types/recentRecipe'

export const useMainStore = defineStore('main', () => {
  const keywordRecipes = ref<Recipe[]>([])
  const hybridRecipes = ref<Recipe[]>([])

  const getKeywordRecipes = computed(() => keywordRecipes)
  const getHybridRecipes = computed(() => hybridRecipes)

  function updateKeywordRecipes(val: Recipe[]) {
    keywordRecipes.value = val
  }
  function updateHybridRecipes(val: Recipe[]) {
    hybridRecipes.value = val
  }

  const currentOption = ref<'keyword' | 'hybrid' | null>(null)
  const getCurrentOption = computed(() => currentOption)
  function updateCurrentOption(val: 'keyword' | 'hybrid') {
    currentOption.value = val
  }

  // overlay for drop down list
  const ddOpenId = ref<string | null>(null)

  function toggleDD(id: 'searchOption' | 'category' | 'area' | 'searchbar') {
    ddOpenId.value = ddOpenId.value === id ? null : id
  }

  function closeDD() {
    ddOpenId.value = null
  }

  const getDDOpenId = computed(() => ddOpenId.value)

  // recent recipe queue in local storage

  const recentRecipeQueue: Ref<RecentRecipe[]> = useStorage('recent-recipes', [])
  const currentRecipeId = ref<string|null>(null)

  /**
   * This update the recent recipe queue in the localStorage
   * @param recipe - Some of the properties of the recipe object that will be stored in the local storage
   */
  function addToRecentRecipes(recipe: Recipe) {
    currentRecipeId.value = recipe.id
    const findIndex = recentRecipeQueue.value.findIndex((x) => x.recipeId === recipe.id)

    if (findIndex !== -1) {
      recentRecipeQueue.value.splice(findIndex, 1)
    }

    recentRecipeQueue.value.unshift({
      recipeId: recipe.id,
      recipeName: recipe.recipeName,
      recipeThumbnail: recipe.recipeThumbnail,
      slug: recipe.slug
    })

    if (recentRecipeQueue.value.length > 3) {
      recentRecipeQueue.value.pop()
    }
  }

  function updateCurrentRecipeId(recipeId: string|null) {
    currentRecipeId.value = recipeId
  }

  const getCurrentRecipeId = computed(() => currentRecipeId)
  
  return {
    getKeywordRecipes,
    getHybridRecipes,
    updateKeywordRecipes,
    updateHybridRecipes,
    getCurrentOption,
    updateCurrentOption,
    toggleDD,
    closeDD,
    getDDOpenId,
    addToRecentRecipes,
    getCurrentRecipeId,
    updateCurrentRecipeId
  }
})
