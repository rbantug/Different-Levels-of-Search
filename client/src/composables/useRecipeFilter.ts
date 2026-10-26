import { computed, type Ref } from 'vue'

import type { Recipe } from '@/types/recipe'

export default function useRecipeFilter(
  recipes: Ref<Recipe[]>,
  currentCategory: Ref<string>,
  currentArea: Ref<string>,
) {
  const categoryList = computed(() => {
    const categories = new Set<string>()

    recipes.value.forEach((recipe) => {
      categories.add(recipe.category)
    })

    return [...categories]
  })

  const areaList = computed(() => {
    const areas = new Set<string>()

    recipes.value.forEach((recipe) => {
      areas.add(recipe.area)
    })

    return [...areas]
  })

  const filteredRecipes = computed(() => {
    return recipes.value.filter((recipe) => {
      const categoryMatches =
        currentCategory.value === 'All Categories' || recipe.category === currentCategory.value

      const areaMatches = currentArea.value === 'All Areas' || recipe.area === currentArea.value

      return categoryMatches && areaMatches
    })
  })

  const recipeCount = computed(() => filteredRecipes.value.length)

  return {
    categoryList,
    areaList,
    filteredRecipes,
    recipeCount,
  }
}
