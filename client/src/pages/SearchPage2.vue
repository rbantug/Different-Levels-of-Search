<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'

import SearchBar from '@/components/SearchPageComponents/SearchBar.vue'
import DropDown from '@/components/SearchPageComponents/DropDown.vue'
import ResultGrid from '@/components/SearchPageComponents/ResultGrid.vue'
import ThePagination from '@/components/SearchPageComponents/ThePagination.vue'
import LazyLoadImage from '@/components/util/LazyLoadImage.vue'

import useRecipeSearch from '@/composables/useRecipeSearch'
import useRecipeFilter from '@/composables/useRecipeFilter'
import usePagination from '@/composables/usePagination'

import { useMainStore } from '@/stores/mainStore'

// state

const currentCategory = ref<string>('All')
const currentArea = ref<string>('All')

// Composables and Stores
const { searchText, searchOption, recipeResult, loading, runSearch } = useRecipeSearch()

const { categoryList, areaList, filteredRecipes, recipeCount } = useRecipeFilter(
  recipeResult,
  currentCategory,
  currentArea,
)

const resultPerPage = 3

const { currentPage, totalPages, visibleItems, goToPage, resetPage } = usePagination(
  filteredRecipes,
  resultPerPage,
)

const mainStore = useMainStore()

const searchFocused = ref(false)

// Show the welcome area only before the user starts searching.
const showWelcome = computed(() => {
  return !searchFocused.value && !searchText.value.trim() && visibleItems.value.length === 0
})

function handleSearchFocus() {
  searchFocused.value = true
}

function handleKeywordSelected(keyword: string) {
  searchText.value = keyword
  searchFocused.value = false
  resetPage()
  runSearch()
}

function clearSearchText() {
  searchText.value = ''
  searchFocused.value = false
}

// search option related code
function updateSearchOption(option: 'keyword' | 'hybrid' | 'semantic') {
  searchOption.value = option
  resetPage()
}

const resultText = ref<HTMLElement | null>(null)

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
  <main class="search-page" :class="{ 'search-page--active': !showWelcome }">
    <!-- Illustration, header and misc text -->
    <Transition name="welcome">
      <section v-show="showWelcome" class="welcome-section">
        <div class="welcome-section__illustration">
          <LazyLoadImage
            src="https://dl.dropboxusercontent.com/scl/fi/f4uyr13htg9emjb8paeda/home-image.webp?rlkey=o1sl43cg1f0cymlehf55n37f1"
            placeholder="https://dl.dropboxusercontent.com/scl/fi/s0cmsig8ne7g7kbgi0d4t/home-image-blurry.webp?rlkey=ih9sg7ffwpx2isj90st415r1w"
            alt="welcome illustration"
          />
        </div>

        <h1>What shall we cook today?</h1>

        <p>Find something delicious to make. Your next favorite recipe might be one search away!</p>
      </section>
    </Transition>

    <!-- Search Bar -->
    <section class="search-section">
      <SearchBar
        v-model:search="searchText"
        @input-clicked="handleSearchFocus"
        @emit-keyword="handleKeywordSelected"
        @clear-keyword="clearSearchText"
      />
    </section>

    <!-- Search Option -->
    <section class="search-type-container">
      <!-- Keyword Button -->
      <button
        :class="{ active: searchOption === 'keyword' }"
        @click="updateSearchOption('keyword')"
      >
        <span class="search-type-icons" :class="{ active: searchOption === 'keyword' }"
          ><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              fill="currentColor"
              d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
            /></svg
        ></span>
        <span class="search-type-text" :class="{ active: searchOption === 'keyword' }"
          >Keyword</span
        >
      </button>

      <!-- Hybrid Button -->
      <button :class="{ active: searchOption === 'hybrid' }" @click="updateSearchOption('hybrid')">
        <span class="search-type-icons" :class="{ active: searchOption === 'hybrid' }"
          ><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
              <path
                d="M8.504 15.7c-1.172 1.09-2.594 1.873-4.513 1.85a.75.75 0 0 1 .018-1.5c1.435.018 2.502-.545 3.473-1.449c.778-.724 1.451-1.62 2.187-2.6q.33-.442.684-.903c.994-1.288 2.139-2.62 3.69-3.514c1.577-.909 3.515-1.333 6.037-.924a.75.75 0 1 1-.24 1.48c-2.21-.357-3.794.021-5.049.744c-1.28.738-2.276 1.867-3.25 3.13q-.307.4-.62.818c-.75 1-1.531 2.043-2.417 2.867"
              />
              <path
                d="M16.04 3.469a.75.75 0 0 1 1.06.001l3.431 3.44a.75.75 0 0 1 0 1.06l-3.432 3.44a.75.75 0 0 1-1.062-1.06l2.904-2.91l-2.903-2.91a.75.75 0 0 1 .001-1.061m.016 9.185a.75.75 0 0 1 1.06.032l3.39 3.6a.75.75 0 0 1-.03 1.06l-3.391 3.2a.75.75 0 0 1-1.03-1.091l2.846-2.686l-2.877-3.055a.75.75 0 0 1 .032-1.06"
              />
              <path
                d="M7.53 9.396C6.574 8.49 5.496 7.923 4.014 7.95a.75.75 0 0 1-.026-1.5c1.962-.035 3.403.748 4.575 1.856c.921.872 1.71 1.983 2.46 3.04q.255.36.506.709c.936 1.29 1.876 2.441 3.094 3.2c1.187.74 2.692 1.14 4.822.804a.75.75 0 0 1 .233 1.482c-2.459.387-4.333-.068-5.848-1.013c-1.485-.925-2.569-2.287-3.515-3.593q-.285-.393-.553-.773c-.745-1.048-1.426-2.006-2.23-2.766"
              />
            </g>
          </svg>
        </span>
        <span class="search-type-text" :class="{ active: searchOption === 'hybrid' }">Hybrid</span>
      </button>

      <!-- Semantic Search -->
      <button :class="{ active: searchOption === 'semantic' }" @click="updateSearchOption('semantic')">
        <span class="search-type-icons" :class="{ active: searchOption === 'semantic' }"
          ><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
            <path d="M0 0h16v16H0z" fill="none" />
            <path
              fill="currentColor"
              d="M5.465 9.83a.92.92 0 0 0 1.07 0a1 1 0 0 0 .341-.46l.347-1.067a1.7 1.7 0 0 1 1.078-1.078l1.086-.354a.923.923 0 0 0-.037-1.75l-1.069-.346a1.7 1.7 0 0 1-1.08-1.078l-.353-1.084a.92.92 0 0 0-.869-.61a.92.92 0 0 0-.875.624l-.356 1.09A1.71 1.71 0 0 1 3.7 4.775l-1.084.351a.923.923 0 0 0 .013 1.745l1.067.347a1.71 1.71 0 0 1 1.081 1.083l.352 1.08a.92.92 0 0 0 .337.449M4.007 6.264L3.152 6l.864-.28a2.7 2.7 0 0 0 1.045-.66a2.76 2.76 0 0 0 .644-1.056l.265-.859l.28.862a2.7 2.7 0 0 0 1.718 1.715l.88.27l-.86.28A2.7 2.7 0 0 0 6.27 7.986l-.265.857l-.279-.859a2.7 2.7 0 0 0-1.719-1.72m6.527 7.587A.8.8 0 0 0 11 14a.81.81 0 0 0 .759-.55l.248-.761a1.09 1.09 0 0 1 .68-.681l.772-.252a.8.8 0 0 0-.023-1.52l-.764-.25a1.08 1.08 0 0 1-.68-.678l-.252-.774a.8.8 0 0 0-1.518.011l-.247.762a1.07 1.07 0 0 1-.664.679l-.776.253a.8.8 0 0 0-.388 1.222c.099.14.239.244.4.3l.763.247a1.06 1.06 0 0 1 .68.683l.253.774a.8.8 0 0 0 .292.387m-.914-2.793L9.442 11l.184-.064a2.09 2.09 0 0 0 1.3-1.317l.058-.178l.06.181a2.08 2.08 0 0 0 1.316 1.316l.195.064l-.18.059a2.08 2.08 0 0 0-1.317 1.32l-.059.181l-.058-.18a2.07 2.07 0 0 0-1.32-1.322"
            />
          </svg>
        </span>
        <span class="search-type-text" :class="{ active: searchOption === 'semantic' }">AI</span>
      </button>
    </section>

    <!-- Category and Area filters -->
    <section v-if="searchText" class="filters-container">
      <DropDown
        :data-list="categoryList"
        :set-to-all="false"
        id="category"
        @goToggle="mainStore.toggleDD('category')"
        :open="mainStore.ddOpenId === 'category'"
        default-option="All Categories"
        v-model="currentCategory"
      />
      <DropDown
        :data-list="areaList"
        :set-to-all="false"
        id="area"
        @goToggle="mainStore.toggleDD('area')"
        :open="mainStore.ddOpenId === 'area'"
        default-option="All Areas"
        v-model="currentArea"
      />
    </section>

    <!-- recipe count and other filters that you might want to add in the future -->
    <section v-if="recipeCount > 0">
      <p class="recipe-count">{{ recipeCount }} recipes found</p>
    </section>

    <!-- Result list -->
    <section class="results-section">
      <div v-if="loading" class="loading-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <circle cx="18" cy="12" r="0" fill="currentColor">
            <animate
              attributeName="r"
              begin=".67"
              calcMode="spline"
              dur="1.5s"
              keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
              repeatCount="indefinite"
              values="0;2;0;0"
            />
          </circle>
          <circle cx="12" cy="12" r="0" fill="currentColor">
            <animate
              attributeName="r"
              begin=".33"
              calcMode="spline"
              dur="1.5s"
              keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
              repeatCount="indefinite"
              values="0;2;0;0"
            />
          </circle>
          <circle cx="6" cy="12" r="0" fill="currentColor">
            <animate
              attributeName="r"
              begin="0"
              calcMode="spline"
              dur="1.5s"
              keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
              repeatCount="indefinite"
              values="0;2;0;0"
            />
          </circle>
        </svg>
      </div>
      <div v-else class="result-grid">
        <ResultGrid :results="visibleItems" />
      </div>
    </section>

    <!-- Pagination -->
    <section v-if="totalPages > 0" class="pagination">
      <ThePagination
        :total-pages="totalPages"
        :current-page="currentPage"
        @update:current-page="goToPage"
      />
    </section>
  </main>
</template>

<style lang="scss" scoped>
.search-page {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 0 1rem;
  background: $background-color;
  color: #283449;
}

.welcome-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem 2rem;
  text-align: center;

  &__illustration {
    width: 100%;
    max-width: 240px;
    margin-bottom: 16px;

    img {
      display: block;
      width: 100%;
      height: auto;
      object-fit: contain;
    }
  }

  h1 {
    max-width: 300px;
    margin: 0;
    font-size: 26px;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.8px;
  }

  p {
    max-width: 290px;
    margin: 12px 0 0;
    color: #788399;
    font-size: 14px;
    line-height: 1.7;
  }
}

.search-section {
  @include m-flex-center;
  position: relative;
  z-index: 2;
  transition: padding 280ms ease;
}

.search-page--active {
  .search-section {
    padding-top: 1rem;
  }
}

.search-type-container {
  width: 100%;
  column-gap: 1rem;
  margin-top: 1rem;

  @include m-flex-center;

  button {
    width: 10rem;
    height: 2.5rem;
    border: none;
    border-radius: 10px;
    background-color: $color-button-disabled;

    transition: all 0.3s ease;

    @include m-flex-center;

    &.active {
      background-color: $color-primary-hover;
    }
  }

  button:hover {
    cursor: pointer;
  }
}

.search-type-icons {
  height: 2rem;
  width: 2rem;
  color: $color-text-secondary;

  transition: all 0.3s ease;

  @include m-flex-center;

  svg {
    scale: 200%;
  }

  &.active {
    color: white;
  }
}

.search-type-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: $color-text-secondary;

  transition: all 0.3s ease;

  &.active {
    color: white;
  }
}

.filters-container {
  width: 100%;
  column-gap: 1rem;
  margin-top: 0.5rem;

  @include m-flex-center;
}

.recipe-count {
  position: relative;
  z-index: 1;
  color: $color-text-secondary;
  font-weight: 600;
  padding-top: 1rem;
}

.loading-container {
  height: 30rem;
  @include m-flex-center;

  svg {
    scale: 400%;
  }
}

.results-section {
  flex: 1 0 auto;
  min-height: 0;
}

.result-grid {
  height: 100%;
}

.pagination {
  bottom: 0;
  width: 100%;
}

.welcome-enter-active,
.welcome-leave-active {
  transition:
    opacity 220ms ease,
    transform 280ms ease,
    max-height 280ms ease,
    padding 280ms ease,
    margin 280ms ease;
  overflow: hidden;
}

.welcome-enter-from,
.welcome-leave-to {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin: 0;
  opacity: 0;
  transform: translateY(-18px);
}

.welcome-enter-to,
.welcome-leave-from {
  max-height: 420px;
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .welcome-enter-active,
  .welcome-leave-active,
  .search-section {
    transition: none;
  }
}
</style>
