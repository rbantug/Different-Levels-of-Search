<script setup lang="ts">
import { ref, watch } from 'vue'
import { refDebounced } from '@vueuse/core'

import { useMainStore } from '@/stores/mainStore.ts'
import DropDownList from '../util/DropDownList.vue'
import { suggestion } from '@/api/search.ts'

const mainStore = useMainStore()

const emits = defineEmits(['inputClicked', 'emitKeyword'])

function runEmit() {
  emits('inputClicked')
}

const searchText = ref('')
const debouncedQuery = refDebounced(searchText, 300)
const suggestions = ref<string[]>([])
const isLoading = ref(false)
let keypress = 0
const noResult = ref(false)

/////////////////////////////
// fetch keyword suggestions
/////////////////////////////

/**
 * This will do the following:
 * - show the loading icon
 * - fetch a list of keyword recommendations
 * - store the fetched result in a variable that will be passed to the DropDownList.vue component
 * - tell the DropDownList.vue to show the drop down list
 * - hide the loading icon
 */
async function runSuggestion() {
  isLoading.value = true

  try {
    const { data } = await suggestion(debouncedQuery.value)

    if (data.length === 0) {
      noResult.value = true
      suggestions.value = []
    } else {
      noResult.value = false
      suggestions.value = data.map((s) => s.keyword)
    }
    mainStore.toggleDD('searchbar')
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

/**
 * This function will emit the keyword to the this component's parent component (SearchPage.vue)
 * @param keyword - The keyword emitted from the DropDownList.vue
 */
function emitKeyword(keyword: string) {
  //dropdownIsOpen.value = false
  mainStore.closeDD()
  searchText.value = keyword
  keypress = 0
  emits('emitKeyword', keyword)
}

/**
 * A function made for a click event. This will run a search using whatever text is in the search bar
 */
function submitKeyword() {
  mainStore.closeDD()
  keypress = 0
  emits('emitKeyword', searchText.value)
}

watch(
  debouncedQuery,
  (newVal) => {
    // the code below will force the parent component (SearchPage.vue) to discard all the fetched recipes if the search bar has no text.
    if (!newVal) {
      suggestions.value = []
      noResult.value = false
      emitKeyword('')
      return
    }

    // the code below prevents runSuggestion() from running after selecting a keyword from the dropdown list
    keypress++

    if (keypress > 1) {
      keypress = 0
      runSuggestion()
    }
  },
  { immediate: true },
)
</script>

<template>
  <div>
    <div class="searchbar-container">
      <input type="text" v-model="searchText" placeholder="Search recipes..." @click="runEmit" />
      <!-- loading icon -->
      <div class="loading-container">
        <div v-show="isLoading" class="loading-container-svg">
          <!-- line-md:loading-loop -->
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3c4.97 0 9 4.03 9 9"
            >
              <animateTransform
                attributeName="transform"
                dur="1.5s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;360 12 12"
              />
            </path>
          </svg>
        </div>
      </div>
      <!-- search button -->
      <div v-show="!isLoading" class="search-container" @click="submitKeyword">
        <!-- material-symbols:search -->
        <div class="search-container-svg">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              fill="currentColor"
              d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
            />
          </svg>
        </div>
      </div>
      <div class="dropdown-container">
        <DropDownList
          :data-list="suggestions"
          :option="true"
          id="searchbar"
          :open="mainStore.getDDOpenId === 'searchbar'"
          :no-results-option="noResult"
          @close-list="emitKeyword"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:math';

$searchbar-height: 4rem;
@function loadingIconInsetTop($height) {
  @return math.div($height, 2);
}
@function searchBtnInsetTop($height) {
  @return math.div($height, 3);
}

@mixin load-search-container {
  position: absolute;
  right: 20px;
}

input {
  width: 20rem;
  height: $searchbar-height;
  padding: 1rem 4rem 1rem 1rem;
  border: none;
  outline: none;
  border-radius: 10px;
  box-shadow: $shadow-search;
  font-size: 1.5rem;

  &:focus {
    outline: 2px solid $color-primary;
  }
}

.searchbar-container {
  position: relative;
}

.loading-container {
  @include load-search-container;
  top: loadingIconInsetTop($search-height);

  #{&}-svg {
    scale: 200%;
  }
}

.search-container {
  @include load-search-container;
  @include m-flex-center;
  top: searchBtnInsetTop($search-height);

  background-color: $color-primary;
  height: 2rem;
  width: 2rem;
  border-radius: 5px;

  #{&}-svg {
    padding-top: 3px;
    color: white;
    scale: 175%;
  }

  &:hover {
    cursor: pointer
  }
}

.dropdown-container {
  position: absolute;
  top: 0;
  margin-top: 1rem;
  width: 100%;
}
</style>
