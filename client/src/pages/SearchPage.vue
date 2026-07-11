<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
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

const searchText = ref('')
const searchOption = ref('keyword')
const recipeResult = ref<Recipe[]>([])
const recipeCount = ref(0)
const visibleRecipes = ref<Recipe[]>([])

const debouncedQuery = refDebounced(searchText, 300)

const keywordData = ref<AxiosResponse>()
const hybridData = ref<AxiosResponse>()

async function runSearch() {
  // reset variables
  if (!debouncedQuery.value.trim()) {
    recipeResult.value = []
    recipeCount.value = 0
    visibleRecipes.value = []
    return
  }

  let res: AxiosResponse

  // fetch data based on current option
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

    // show first x number of recipes for pagination
    if (recipeResult.value.length <= resultPerPage.value) {
      visibleRecipes.value = recipeResult.value
    } else {
      visibleRecipes.value = recipeResult.value.slice(0, currentPage.value * resultPerPage.value)
    }

    // update totalPages to update pagination
    totalPages.value = Math.ceil(recipeResult.value.length / resultPerPage.value)

    // go back to the first page when this function runs
    currentPage.value = 1
  } catch (error: unknown) {
    console.error(error)
  }
}

// Pagination

const resultPerPage = ref(5)
const totalPages = ref(Math.ceil(recipeResult.value.length / resultPerPage.value))
const currentPage = ref(1)
const resultText = ref<HTMLElement | null>(null)

async function updatePage(val: number) {
  currentPage.value = val
  visibleRecipes.value = recipeResult.value.slice(
    (currentPage.value - 1) * resultPerPage.value,
    currentPage.value * resultPerPage.value,
  )
  totalPages.value = Math.ceil(recipeResult.value.length / resultPerPage.value)

  nextTick(() => {
    resultText.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  })
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
      <div ref="resultText" class="resultText"></div>
      <ResultGrid :results="visibleRecipes" />
    </main>

    <!-- pagination -->
    <div v-if="totalPages > 0" class="pagination">
      <ThePagination
        :total-pages="totalPages"
        :current-page="currentPage"
        @update:current-page="updatePage"
      />
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
  height: 17rem;
  background-color: $color-background;
  padding: 2rem 0;
  z-index: 1;
  touch-action: none;

  #{&}__h1 {
    font-size: 1.5rem;
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

.resultText {
  scroll-margin-top: 17rem;
}
</style>
