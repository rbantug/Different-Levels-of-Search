<script setup lang="ts">
import { ref, watch } from 'vue'
import { refDebounced } from '@vueuse/core'

import { useMainStore } from '@/stores/mainStore.ts'
import DropDownList from '../util/DropDownList.vue'
import { suggestion } from '@/api/search.ts'

const mainStore = useMainStore()

const emits = defineEmits(['emitKeyword', 'clearKeyword'])

const searchText = defineModel<string>('search', {
  default: '',
})
const debouncedQuery = refDebounced(searchText, 300)
const suggestions = ref<string[]>([])
const isLoading = ref(false)
const noResult = ref(true)
const justFetched = ref(false)

const searchBarRoot = ref<HTMLElement | null>(null)

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
async function runSuggestion(keyword:string) {
  isLoading.value = true

  try {
    const { data } = await suggestion(keyword)

    suggestions.value = data.map((s) => s.keyword)
    noResult.value = data.length === 0

    if (mainStore.ddOpenId !== 'searchbar') {
      mainStore.toggleDD('searchbar')
    }
  } catch (error) {
    console.error(error)
    suggestions.value = []
    noResult.value = true
  } finally {
    isLoading.value = false
    justFetched.value = true
  }
}

/**
 * This function will emit the keyword to the this component's parent component (SearchPage.vue)
 * @param keyword - The keyword emitted from the DropDownList.vue
 */
function emitKeyword(keyword: string) {
  mainStore.closeDD()
  searchText.value = keyword
  emits('emitKeyword', keyword)
}

function deleteKeyword() {
  searchText.value = ''
  mainStore.closeDD()
  emits('clearKeyword')
}

function startFetch() {
  justFetched.value = false
}

function openDropdown() {
  if (mainStore.ddOpenId !== 'searchbar') {
    mainStore.toggleDD('searchbar')
  }
}

function sanitizeSearchInput(val: string) {
  return val.normalize('NFC').trim().replace(/\s+/g, ' ')
}

watch(
  debouncedQuery,
  (newVal) => {
    // sanitize user input
    const query = sanitizeSearchInput(newVal)

    // the code below will force the parent component (SearchPage.vue) to discard all the fetched recipes if the search bar has no text.
    if (query === '') {
      suggestions.value = []
      emitKeyword('')
      return
    }

    // this will prevent another search after selecting an option in the drop down list
    if (!justFetched.value) {
      runSuggestion(query)
    }
  },
  { immediate: true },
)

watch(
  () => mainStore.ddOpenId === 'searchbar',
  (isOpen, _previousValue, onCleanup) => {
    if (!isOpen) return

    function handleOutsidePointerDown(event: PointerEvent) {
      const target = event.target

      if (target instanceof Node && searchBarRoot.value && !searchBarRoot.value.contains(target)) {
        mainStore.closeDD()
      }
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown)

    onCleanup(() => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown)
    })
  },
)
</script>

<template>
  <div ref="searchBarRoot" class="searchbar-container">
    <input
      type="text"
      v-model="searchText"
      placeholder="Search recipes..."
      @click="openDropdown"
      @keypress="startFetch"
    />
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
    <div class="search-icon-left">
      <!-- material-symbols:search -->
      <div class="search-icon-left-svg">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
          />
        </svg>
      </div>
    </div>

    <!-- delete input field text -->
    <div
      v-if="!isLoading && searchText.length > 0"
      class="delete-icon-right"
      @click="deleteKeyword"
    >
      <!-- basil:cross-solid -->
      <div class="delete-icon-right-svg">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="M16.066 8.995a.75.75 0 1 0-1.06-1.061L12 10.939L8.995 7.934a.75.75 0 1 0-1.06 1.06L10.938 12l-3.005 3.005a.75.75 0 0 0 1.06 1.06L12 13.06l3.005 3.006a.75.75 0 0 0 1.06-1.06L13.062 12z"
          />
        </svg>
      </div>
    </div>
    <div class="dropdown-container">
      <DropDownList
        :data-list="suggestions"
        :option="true"
        id="searchbar"
        :open="mainStore.ddOpenId === 'searchbar'"
        :no-results-option="noResult"
        :show-recent-recipes="true"
        @close-list="emitKeyword"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:math';

$searchbar-height: 4rem;
@function loading-icon-inset-top($height) {
  @return math.div($height, 2);
}
@function search-icons-inset-top($height) {
  @return math.div($height, 1.8);
}

@mixin ml-icons-position-right {
  position: absolute;
  right: 20px;
}

input {
  width: 20rem;
  height: $searchbar-height;
  padding: 1rem 1rem 1rem 3rem;
  border: none;
  outline: none;
  border-radius: 10px;
  font-size: 1.5rem;

  &:focus {
    outline: 2px solid $color-primary;
  }
}

.searchbar-container {
  position: relative;
}

.loading-container {
  @include ml-icons-position-right;
  top: loading-icon-inset-top($search-height);

  #{&}-svg {
    scale: 200%;
  }
}

.search-icon-left {
  top: search-icons-inset-top($search-height);
  position: absolute;
  left: 20px;

  @include m-flex-center;

  #{&}-svg {
    color: $color-search-icon;
    scale: 150%;
  }

  &:hover {
    cursor: pointer;
  }
}

.delete-icon-right {
  @include ml-icons-position-right;
  @include m-flex-center;
  top: search-icons-inset-top($search-height);

  /* background-color: $color-primary;
  height: 2rem;
  width: 2rem;
  border-radius: 5px; */

  #{&}-svg {
    color: $color-search-icon;
    scale: 250%;
  }

  &:hover {
    cursor: pointer;
  }
}

.dropdown-container {
  position: absolute;
  top: 0;
  margin-top: 1rem;
  width: 100%;
}
</style>
