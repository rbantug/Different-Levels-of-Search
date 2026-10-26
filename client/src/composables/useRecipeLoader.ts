import { ref, type Ref } from 'vue'

import { getSingleRecipe } from '@/api/recipe'
import type { Recipe } from '@/types/recipe'

export default function useRecipeLoader(
  keywordRecipes: Recipe[],
  hybridRecipes: Recipe[],
  semanticRecipes: Recipe[],
) {
  const recipe = ref<Recipe | null>(null)
  const loading = ref(false)

  async function loadRecipe(slug: string) {
    loading.value = true
    recipe.value = null

    try {
      // 1. Look for the complete recipe in the existing search results.
      const localRecipe =
        keywordRecipes.find((item) => item.slug === slug) ??
        hybridRecipes.find((item) => item.slug === slug) ??
        semanticRecipes.find((item) => item.slug === slug)

      if (localRecipe) {
        recipe.value = localRecipe
        return recipe.value
      }

      // 2. If it isn't in the search results, fetch data from the backend
      const { data } = await getSingleRecipe(slug)

      recipe.value = data
      return recipe.value
    } finally {
      loading.value = false
    }
  }

  return {
    recipe,
    loading,
    loadRecipe,
  }
}