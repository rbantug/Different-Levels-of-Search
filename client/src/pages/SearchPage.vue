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

const searchOptionList = ['keyword', 'hybrid']

const searchText = ref('')
const searchOption = ref<'keyword' | 'hybrid'>('keyword')
const recipeResult = ref<Recipe[]>([])
const filteredRecipe = ref<Recipe[]>([])
const visibleRecipes = ref<Recipe[]>([])
const recipeCount = ref(0)

const currentCategory = ref<string>('All')
const currentArea = ref<string>('All')
const categoryList = ref<string[]>([])
const areaList = ref<string[]>([])

const debouncedQuery = refDebounced(searchText, 300)

const keywordData = ref<AxiosResponse>()
const hybridData = ref<AxiosResponse>()

async function runSearch() {
  // reset variables
  if (!debouncedQuery.value.trim()) {
    recipeResult.value = []
    recipeCount.value = 0
    visibleRecipes.value = []
    filteredRecipe.value = []
    currentArea.value = ''
    currentCategory.value = ''
    areaList.value = []
    categoryList.value = []
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

    /* 
    recipeResult -> filteredRecipe -> visibleRecipe
    */
    recipeResult.value = res.data

    // update area and category list and store them in a variable
    const setCategory = new Set()
    recipeResult.value.forEach((r: Recipe) => {
      if (!setCategory.has(r.category)) {
        setCategory.add(r.category)
        categoryList.value.push(r.category)
      }
    })

    const setArea = new Set()
    recipeResult.value.forEach((r: Recipe) => {
      if (!setArea.has(r.area)) {
        setArea.add(r.area)
        areaList.value.push(r.area)
      }
    })

    // show first x number of recipes for pagination
    if (recipeResult.value.length <= resultPerPage.value) {
      recipeCount.value = recipeResult.value.length
      totalPages.value = Math.ceil(recipeResult.value.length / resultPerPage.value)
      visibleRecipes.value = recipeResult.value
    } else {
      updateFilteredRecipe()
    }

    // go back to the first page when this function runs
    currentPage.value = 1
  } catch (error: unknown) {
    console.error(error)
  }
}

function updateFilteredRecipe() {
  if (currentCategory.value === 'All' && currentArea.value === 'All') {
    filteredRecipe.value = recipeResult.value
  } else if (currentCategory.value === 'All') {
    filteredRecipe.value = recipeResult.value.filter((r: Recipe) => r.area === currentArea.value)
  } else if (currentArea.value === 'All') {
    filteredRecipe.value = recipeResult.value.filter(
      (r: Recipe) => r.category === currentCategory.value,
    )
  } else {
    filteredRecipe.value = recipeResult.value.filter(
      (r: Recipe) => r.category === currentCategory.value && r.area === currentArea.value,
    )
  }

  recipeCount.value = filteredRecipe.value.length
  visibleRecipes.value = filteredRecipe.value.slice(0, currentPage.value * resultPerPage.value)
  totalPages.value = Math.ceil(filteredRecipe.value.length / resultPerPage.value)
}

// Pagination

const resultPerPage = ref(5)
const totalPages = ref(Math.ceil(filteredRecipe.value.length / resultPerPage.value))
const currentPage = ref(1)
const resultText = ref<HTMLElement | null>(null)

async function updatePage(val: number) {
  currentPage.value = val
  visibleRecipes.value = filteredRecipe.value.slice(
    (currentPage.value - 1) * resultPerPage.value,
    currentPage.value * resultPerPage.value,
  )
  totalPages.value = Math.ceil(filteredRecipe.value.length / resultPerPage.value)

  nextTick(() => {
    resultText.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  })
}

watch([debouncedQuery, searchOption], runSearch, { immediate: true })
watch([currentArea, currentCategory], updateFilteredRecipe, { immediate: true })
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
        <p>Search Option:</p>
        <DropDown
          v-model:selected-option="searchOption"
          :data-list="searchOptionList"
          :option="true"
        />
        <p>Category:</p>
        <DropDown
          v-model:selected-option="currentCategory"
          :data-list="categoryList"
          :option="false"
        />
        <p>Area:</p>
        <DropDown v-model:selected-option="currentArea" :data-list="areaList" :option="false" />
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
  bottom: 10px;
  width: 100%;
}

.searchBarContainer {
  height: 4rem;
}

.resultText {
  scroll-margin-top: 17rem;
}
</style>
