<script setup lang="ts">
import { ref, watch } from 'vue'
import { refDebounced } from '@vueuse/core'

import SearchBar from '@/components/SearchPageComponents/SearchBar.vue'
import DropDown from '@/components/SearchPageComponents/DropDown.vue'
import ResultGrid from '@/components/SearchPageComponents/ResultGrid.vue'
import ThePagination from '@/components/SearchPageComponents/ThePagination.vue'
import { hybridSearch, keywordSearch } from '@/api/search'
import { useMainStore } from '@/stores/mainStore'

import type { Recipe } from '@/types/recipe'
import type { AxiosResponse } from '@/api/search'

const mainStore = useMainStore()

const testPage = ref(1)
const searchText = ref('')
const searchOption = ref('keyword')
const recipeResult = ref<Recipe[]>([])
const recipeCount = ref(0)
const loading = ref(false)

const debouncedQuery = refDebounced(searchText, 300)

const keywordData = ref<AxiosResponse>()
const hybridData = ref<AxiosResponse>()

async function runSearch() {
  if (!debouncedQuery.value.trim()) {
    recipeResult.value = []
    recipeCount.value = 0
    return
  }

  loading.value = true
  let res: AxiosResponse

  try {
    if (searchOption.value === 'keyword') {
      res = await keywordSearch(debouncedQuery.value)
      keywordData.value = res
      mainStore.updateKeywordRecipes(res.data)
      mainStore.updateCurrentOption('keyword')
    } else if (searchOption.value === 'hybrid') {
      res = await hybridSearch(debouncedQuery.value)
      hybridData.value = res
      mainStore.updateHybridRecipes(res.data)
      mainStore.updateCurrentOption('hybrid')
    } else {
      throw new Error('Something is wrong with the search option')
    }

    recipeResult.value = res.data
    recipeCount.value = res.count
  } catch (error: unknown) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

function updatePage(val: number) {
  testPage.value = val
}

watch([debouncedQuery, searchOption], runSearch)
</script>

<template>
  <div class="">
    <!-- search bar -->
    <header class="header">
      <h1 class="header__h1">Different Levels of Search</h1>
      <p class="header__paragraph">Compare Keyword-Only vs. Keyword + Semantic Search</p>
      <div class="searchBarContainer">
        <SearchBar v-model:search="searchText" />
      </div>
      <div>
        <DropDown v-model:search-option="searchOption" />
      </div>
      <p>Total Recipes: {{ recipeCount }}</p>
    </header>

    <!-- results -->
    <main>
      <ResultGrid :results="recipeResult" />
    </main>

    <!-- pagination -->
    <div class="pagination">
      <ThePagination :total-pages="10" :current-page="testPage" @update:current-page="updatePage" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
  height: fit-content;
  background-color: $color-background;
  padding: 2rem 0;

  #{&}__h1 {
    font-size: 1.5rem;

    @include m-tablet {
      font-size: 2rem;
    }

    @include m-desktop {
      font-size: 3rem;
    }
  }

  #{&}__paragraph {
    text-align: center;
  }
}

.pagination {
  position: fixed;
  bottom: 0;
  width: 100%;
}

.searchBarContainer {
  height: 4rem;
}
</style>
