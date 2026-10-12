import { ref } from 'vue'

import { hybridSearch, keywordSearch } from '@/api/search'
import { useMainStore } from '@/stores/mainStore'

import type { Recipe } from '@/types/recipe'
import type { AxiosResponse } from '@/api/search'

export default function useRecipeSearch() {
  const mainStore = useMainStore()

  const searchText = ref('')
  const searchOption = ref<'keyword' | 'hybrid'>('keyword')
  const recipeResult = ref<Recipe[]>([])
  const loading = ref(false)

  async function runSearch() {
    if (!searchText.value.trim()) {
      recipeResult.value = []
      return
    }

    loading.value = true

    try {
      let res: AxiosResponse<Recipe>

      if (searchOption.value === 'keyword') {
        res = await keywordSearch(searchText.value)

        mainStore.updateKeywordRecipes(res.data)
      } else {
        res = await hybridSearch(searchText.value)

        mainStore.updateHybridRecipes(res.data)
      }

      recipeResult.value = res.data
    } catch (error: unknown) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  return {
    searchText,
    searchOption,
    recipeResult,
    loading,
    runSearch,
  }
}
