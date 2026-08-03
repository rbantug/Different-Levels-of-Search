<script setup lang="ts">
import { nextTick, ref, watch, type Ref } from 'vue'

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

const keywordData = ref<AxiosResponse<Recipe>>()
const hybridData = ref<AxiosResponse<Recipe>>()

const loading = ref(false)

function updateSearchText(keyword:string) {
  searchText.value = keyword;
}

async function runSearch() {
  // reset variables
  if (!searchText.value.trim()) {
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

  let res: AxiosResponse<Recipe>

  loading.value = true

  // fetch data based on current option
  try {
    if (searchOption.value === 'keyword') {
      res = await keywordSearch(searchText.value)
      keywordData.value = res
      mainStore.updateKeywordRecipes(res.data)
      mainStore.updateCurrentOption('keyword')
    } else if (searchOption.value === 'hybrid') {
      res = await hybridSearch(searchText.value)
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
    categoryList.value = filterCategory(recipeResult)
    areaList.value = filterArea(recipeResult)

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
  } finally {
    loading.value = false
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
  currentPage.value = 1
  visibleRecipes.value = filteredRecipe.value.slice(0, currentPage.value * resultPerPage.value)
  totalPages.value = Math.ceil(filteredRecipe.value.length / resultPerPage.value)
}

function filterCategory(data: Ref) {
  const res: string[] = []
  const setCategory = new Set()
  data.value.forEach((r: Recipe) => {
    if (!setCategory.has(r.category)) {
      setCategory.add(r.category)
      res.push(r.category)
    }
  })
  return res
}

function filterArea(data: Ref) {
  const res: string[] = []
  const setArea = new Set()
  data.value.forEach((r: Recipe) => {
    if (!setArea.has(r.area)) {
      setArea.add(r.area)
      res.push(r.area)
    }
  })
  return res
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

watch([searchText, searchOption], runSearch, { immediate: true })
watch([currentArea, currentCategory], updateFilteredRecipe, { immediate: true })
</script>

<template>
  <div>
    <div v-if="mainStore.getDDOpenId" @click="mainStore.closeDD" class="dropdown-overlay" />
    <!-- search bar -->
    <header class="header">
      <h1 class="header__h1">Different Levels of Search</h1>
      <p class="header__paragraph">Compare Keyword-Only vs. Keyword + Semantic Search</p>
      <div class="searchbar-container">
        <SearchBar v-model:search="searchText" @input-clicked="mainStore.closeDD" @emit-keyword="updateSearchText" />
      </div>
      <p>Total Recipes: {{ recipeCount }}</p>
      <div class="filter-container">
        <div>
          <p>Search Option:</p>
          <DropDown
            :data-list="searchOptionList"
            :option="true"
            id="searchOption"
            @goToggle="mainStore.toggleDD('searchOption')"
            :open="mainStore.getDDOpenId === 'searchOption'"
            v-model="searchOption"
          />
        </div>
        <div>
          <p>Category:</p>
          <DropDown
            :data-list="categoryList"
            :option="false"
            id="category"
            @goToggle="mainStore.toggleDD('category')"
            :open="mainStore.getDDOpenId === 'category'"
            v-model="currentCategory"
          />
        </div>
        <div>
          <p>Area:</p>
          <DropDown
            v-model:selected-option="currentArea"
            :data-list="areaList"
            :option="false"
            id="area"
            @goToggle="mainStore.toggleDD('area')"
            :open="mainStore.getDDOpenId === 'area'"
            v-model="currentArea"
          />
        </div>
      </div>
    </header>

    <!-- results -->
     <p v-if="loading" class="loading">Loading...</p>
    <main v-else>
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
  height: fit-content;
  background-color: $color-background;
  padding: 0.5rem 0;
  z-index: 1;
  touch-action: none;

  #{&}__h1 {
    font-size: 1.5rem;
  }

  #{&}__paragraph {
    text-align: center;
  }
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  width: 360px;
  height: 100dvh;
  z-index: 1;
}

.pagination {
  position: sticky;
  bottom: 10px;
  width: 100%;
}

.searchbar-container {
  @include m-flex-center;
  height: 5rem;
  width: 100%;
}

.filter-container {
  display: flex;
  align-items: center;
  height: 6rem;
  width: 100%;
  justify-content: space-between;

  div {
    @include m-flex-center;
    flex-direction: column;
    flex: 1;
  }
}

.loading {
  @include m-flex-center;
  padding-top: 2rem;
  font-size: 2rem;
}

.resultText {
  scroll-margin-top: 358px;
}
</style>
