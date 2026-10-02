<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

import SearchBar from '@/components/SearchPageComponents/SearchBar.vue'
import DropDown from '@/components/SearchPageComponents/DropDown.vue'
import ResultGrid from '@/components/SearchPageComponents/ResultGrid.vue'
import ThePagination from '@/components/SearchPageComponents/ThePagination.vue'
import { useMainStore } from '@/stores/mainStore'

import usePagination from '@/composables/usePagination'
import useRecipeFilter from '@/composables/useRecipeFilter'
import useRecipeSearch from '@/composables/useRecipeSearch'

const mainStore = useMainStore()

const searchOptionList = ['keyword', 'hybrid']

const currentCategory = ref<string>('All')
const currentArea = ref<string>('All')

function updateSearchText(keyword: string) {
  searchText.value = keyword
}

// search recipes

/* async function runSearch() {
  // reset variables
  if (!searchText.value.trim()) {
    recipeResult.value = []
    visibleRecipes.value = []
    currentArea.value = ''
    currentCategory.value = ''
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
    recipeResult.value = res.data
    resetPage()
  } catch (error: unknown) {
    console.error(error)
  } finally {
    loading.value = false
  }
} */

const {
  searchText,
  searchOption,
  recipeResult,
  loading,
  runSearch
} = useRecipeSearch()

// recipe filter
const {
  categoryList,
    areaList,
    filteredRecipes,
    recipeCount
} = useRecipeFilter(recipeResult, currentCategory, currentArea )

// Pagination
const resultPerPage = 5

const { currentPage, totalPages, visibleItems, goToPage, resetPage } = usePagination(
  filteredRecipes,
  resultPerPage,
)

const resultText = ref<HTMLElement | null>(null)

// watcher for forcing the browser to scroll back to the top of the page. resultText is located at the top of the results container
watch(currentPage, async () => {
  await nextTick()

  resultText.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
})

watch([searchText, searchOption], runSearch, { immediate: true })

// watcher for setting the current page of the pagination back to 1 if there either the category or area was changed
watch([currentCategory, currentArea], resetPage)
</script>

<template>
  <div class="searchpage-container">
    <div v-if="mainStore.getDDOpenId" @click="mainStore.closeDD" class="dropdown-overlay" />

    <!-- search bar -->
    <header class="header">
      <h1 class="header__h1">Different Levels of Search</h1>
      <p class="header__paragraph">Compare Keyword-Only vs. Keyword + Semantic Search</p>
      <div class="searchbar-container">
        <SearchBar v-model:search="searchText" @emit-keyword="updateSearchText" />
      </div>
      <p>Total Recipes: {{ recipeCount }}</p>

      <!-- Filters -->
      <div class="filter-container">
        <div>
          <p>Search Option:</p>
          <DropDown
            :data-list="searchOptionList"
            :set-to-all="true"
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
            :set-to-all="false"
            id="category"
            @goToggle="mainStore.toggleDD('category')"
            :open="mainStore.getDDOpenId === 'category'"
            v-model="currentCategory"
          />
        </div>
        <div>
          <p>Area:</p>
          <DropDown
            :data-list="areaList"
            :set-to-all="false"
            id="area"
            @goToggle="mainStore.toggleDD('area')"
            :open="mainStore.getDDOpenId === 'area'"
            v-model="currentArea"
          />
        </div>
      </div>
    </header>

    <!-- results -->
    <div class="results-container">
      <p v-if="loading" class="loading">Loading...</p>
      <main v-else>
        <div ref="resultText" class="resultText"></div>
        <ResultGrid :results="visibleItems" />
      </main>
    </div>

    <!-- pagination -->
    <div v-if="totalPages > 0" class="pagination">
      <ThePagination
        :total-pages="totalPages"
        :current-page="currentPage"
        @update:current-page="goToPage"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.searchpage-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

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

main {
  height: 100%;
}

.pagination {
  position: sticky;
  bottom: 0;
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
  padding-top: 9rem;
  font-size: 2rem;
}

.resultText {
  scroll-margin-top: 358px;
}

.results-container {
  height: 100%;
}
</style>
