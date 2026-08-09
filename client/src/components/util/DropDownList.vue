<script setup lang="ts">
import { type PropType, type Ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'

import type { RecentRecipe } from '@/types/recentRecipe'
import { useMainStore } from '@/stores/mainStore'
import { useRelativeDate } from '@/composables/useRelativeDate'

const props = defineProps({
  /**
   * It contains the list of options you can select from the drop down list
   */
  dataList: {
    required: true,
    type: Array as PropType<string[]>,
  },
  /**
   * This is for drop down lists that needs to have a "All" option at the start of the list. Setting it to "false" will add the "All" option.
   */
  option: {
    required: true,
    type: Boolean,
    default: false,
  },
  /**
   * Will determine if the drop down list is open or hidden. It uses v-show to enable visibility.
   */
  open: {
    required: true,
    type: Boolean,
  },
  /**
   * Specifically made for the Searchbar. If the search yielded no results, setting this to "true" will render a "No Results" text
   */
  noResultsOption: {
    required: false,
    type: Boolean,
  },
  /**
   * Setting this to "true" will add recent recipes accessed by the user at the bottom of the drop down list
   */
  showRecentRecipes: {
    required: false,
    type: Boolean,
  },
})

const emits = defineEmits<{
  (e: 'closeList', val: string): void
}>()

function updateSelectedOption(val: string) {
  emits('closeList', val)
}

const mainStore = useMainStore()
const router = useRouter()
const { formatRelativeDate } = useRelativeDate()

// drop down animation

const beforeEnter = (el: Element) => {
  const element = el as HTMLElement

  element.style.height = '0'
  element.style.opacity = '0'
  element.style.overflow = 'hidden'
}

const enter = (el: Element) => {
  const element = el as HTMLElement

  // Force the browser to apply the initial state
  void element.offsetHeight

  element.style.height = `${element.scrollHeight}px`
  element.style.opacity = '1'
}

const afterEnter = (el: Element) => {
  const element = el as HTMLElement

  // Allow the content to grow/shrink naturally afterwards
  element.style.height = 'auto'
  element.style.overflow = ''
}

const beforeLeave = (el: Element) => {
  const element = el as HTMLElement

  // Start from the current natural height
  element.style.height = `${element.scrollHeight}px`
  element.style.opacity = '1'
  element.style.overflow = 'hidden'
}

const leave = (el: Element) => {
  const element = el as HTMLElement

  // Force a reflow so the browser recognizes the starting height
  void element.offsetHeight

  element.style.height = '0'
  element.style.opacity = '0'
}

// recent recipe related code

const recentRecipeQueue: Ref<RecentRecipe[]> = useStorage('recent-recipes', [])

function recentRecipeToRecipePage(recentRecipe: RecentRecipe) {
  mainStore.addToRecentRecipes({
    recipeId: recentRecipe.recipeId,
    recipeName: recentRecipe.recipeName,
    recipeThumbnail: recentRecipe.recipeThumbnail,
    slug: recentRecipe.slug,
    createdAt: recentRecipe.createdAt,
  })
  emits('closeList', '')

  router.push({
    name: 'recipePage',
    params: {
      slug: recentRecipe.slug,
    },
  })
}

function cutRecipeName(recipeName: string) {
  if (recipeName && recipeName.length > 16) {
    const editedRecipeName = recipeName.substring(0, 16)
    return `${editedRecipeName}...`
  }
  return recipeName
}
</script>

<template>
  <div class="listContainer" :class="{ visible: props.open, hidden: !props.open }">
    <Transition
      name="dropdown"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <ul v-show="props.open">
        <li v-if="!props.option" @click="updateSelectedOption('All')">All</li>
        <li v-if="props.noResultsOption" class="no-results" @click.prevent>No Results</li>
        <li v-for="data in props.dataList" :key="data" @click="updateSelectedOption(data)">
          {{ data }}
        </li>

        <!-- recent recipe list -->
        <div v-if="showRecentRecipes">
          <hr />
          <div class="recent-recipe-container">
            <div v-if="!recentRecipeQueue.length" class="no-recent-recipe-text">
              No recent recipes
            </div>
            <div v-else>
              <h1 class="recent-recipe-header">Recently Viewed Recipes:</h1>
              <ul>
                <li
                  v-for="recentRecipe in recentRecipeQueue"
                  :key="recentRecipe.recipeId"
                  @click="recentRecipeToRecipePage(recentRecipe)"
                  class="recent-recipe"
                >
                  <div class="img-container">
                    <img :src="recentRecipe.recipeThumbnail" :alt="recentRecipe.recipeName" />
                  </div>
                  <div class="recent-recipe-details">
                    <span>{{ cutRecipeName(recentRecipe.recipeName) }}</span>
                    <span>Opened {{ formatRelativeDate(new Date(recentRecipe.createdAt)) }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </ul>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.listContainer {
  @include custom-scrollbar(size, thumb, track);

  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  max-height: 20rem;
  width: 100%;
  margin-top: 3.5rem;
  overflow-y: auto;
  border-radius: 5px;
  z-index: 2;

  &.visible {
    border: 1px gray solid;
  }

  &.hidden {
    border: none;
  }
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  padding: 0.5rem 0.3rem;

  &:hover {
    cursor: pointer;
    background-color: $color-primary-hover;
  }
}

li.no-results {
  padding: 2rem 0;
  text-align: center;

  &:hover {
    cursor: not-allowed;
    background-color: transparent;
  }
}

// drop down animation

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    height 200ms ease,
    opacity 200ms ease;

  overflow: hidden;
}

// recent recipe

.recent-recipe-container {
  margin: 1rem;
}

.no-recent-recipe-text {
  text-align: center;
  padding: 1rem 0;
}

.recent-recipe-header {
  font-size: 1.3rem;
  text-align: left;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.recent-recipe {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  border-top: 1px solid $card-url-color;

  &:hover {
    background-color: transparent;
  }
}

.recent-recipe-details {
  display: flex;
  flex-direction: column;
  text-align: left;
  flex: auto;

  span:first-of-type {
    font-size: 1.1rem;
    font-weight: 600;
  }

  span:last-of-type {
    font-size: 0.9rem;
  }
}

.img-container {
  height: 4rem;
  width: 4rem;
}

img {
  height: 4rem;
  border-radius: 5px;
}
</style>
