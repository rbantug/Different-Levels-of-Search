<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

import { useMainStore } from '@/stores/mainStore'

import type { Recipe } from '@/types/recipe'
import type { RecentRecipe } from '@/types/recentRecipe'
import BaseBadge from '@/components/util/BaseBadge.vue'
import { getSingleRecipe } from '@/api/recipe'
import { useStorage } from '@vueuse/core'

const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()
const recentRecipeQueue: Ref<RecentRecipe[]> = useStorage('recent-recipes', [])

const recipe = ref<Recipe | null>()
const badgeText = ref<string[]>([])

/**
 * This will search for the recipe details that will be used in this component. Regarding the 2 arguments, you can only provide a slug or a recipeId. Not both.
 * @param slug
 * @param recipeId
 */
async function loadRecipe(slug: string | string[] | undefined) {
  const option = mainStore.getCurrentOption

  if (option.value === 'keyword') {
    recipe.value = mainStore.getKeywordRecipes.value.find((r: Recipe) => r.slug === slug)
  } else if (option.value === 'hybrid') {
    recipe.value = mainStore.getHybridRecipes.value.find((r: Recipe) => r.slug === slug)
  }

  if (!recipe.value) {
    // we need to check if the provided slug is in the recipes found in the local storage
    const checkRecipeInQueue = recentRecipeQueue.value.findIndex(
      (recipe: RecentRecipe) => recipe.slug === slug,
    )

    // if it does not exist in the local storage, we will route to the error page
    if (checkRecipeInQueue === -1) {
      router.push({
        name: 'error',
        params: {
          anything: '404',
        },
      })
      return
    }

    // recipe date will be fetched from the backend using the recipeId
    const recipeId = recentRecipeQueue.value[checkRecipeInQueue]?.recipeId

    try {
      const { data } = await getSingleRecipe(recipeId!)
      recipe.value = data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.status === 404) {
          router.push({
            name: 'error',
            params: {
              anything: '404',
            },
          })
        }
        return
      } else {
        router.push({
          name: 'error',
          params: {
            anything: '500',
          },
        })
      }
    }
  }

  if (!recipe.value) {
    throw new Error('Something went wrong with fetching the recipe')
  }

  // merge category and area into an array
  badgeText.value.push(recipe.value.area, recipe.value.category)
}

function goBackToSearchPage() {
  recipe.value = null
  badgeText.value = []
  mainStore.updateCurrentRecipeId(null)
  router.go(-1)
}

watch(
  () => route.params.slug,
  async (newVal) => {
    if (!newVal) return

    await loadRecipe(route.params.slug)
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div>
    <header>
      <div class="back-btn" @click="goBackToSearchPage">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path fill="currentColor" fill-rule="evenodd" d="m15 4l2 2l-6 6l6 6l-2 2l-8-8z" />
        </svg>
        <p>Back</p>
      </div>
    </header>
    <!-- loading state -->
    <div v-if="!recipe">
      <div class="recipe-is-loading">
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
    <div v-else>
      <!-- top image, recipe name, area and category -->
      <div class="top-container">
        <img :src="recipe?.recipeThumbnail" :alt="recipe?.recipeName" class="img" />
        <h1 :class="['recipe-name']">{{ recipe?.recipeName }}</h1>
        <div
          :class="{
            'badge-container--flex': badgeText.length < 3,
            'badge-container--grid': badgeText.length >= 3,
          }"
        >
          <BaseBadge v-for="badge in badgeText" :key="badge">{{ badge }}</BaseBadge>
        </div>
      </div>
      <!-- Ingredients -->
      <div class="ingredient-container">
        <h1 class="heading-content">Ingredients</h1>
        <div class="ingredient-list">
          <div v-for="ing in recipe?.ingredients" :key="ing" class="ingredient">
            <div>•</div>
            <div>{{ ing }}</div>
          </div>
        </div>
      </div>
      <!-- instructions -->
      <div class="instruction-container">
        <h1 class="heading-content">Instructions</h1>
        <div v-for="(ins, index) in recipe?.instructions" :key="ins" class="single-instruction">
          <div>{{ index + 1 }}.</div>
          <div>{{ ins }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
header {
  height: 3rem;
  background-color: white;
  display: flex;
  position: sticky;
  top: 0;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
  margin-left: 1rem;
  font-size: large;
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }
}

.top-container {
  @include m-flex-center;
  flex-direction: column;
  height: fit-content;
  width: 100%;
}

.img {
  max-height: 15rem;
  width: 100%;
  object-fit: cover;
}

.recipe-name {
  text-transform: uppercase;
  text-align: center;
  font-size: $font-size-2xl;
  margin: 0.5rem 0.7rem;
}

.badge-container--flex {
  width: 80%;
  @include m-flex-center;
  column-gap: 1rem;
  max-width: 10rem;
  margin: 0 auto;
}

.badge-container--grid {
  width: 80%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  //max-width: 10rem;
  margin: 0 auto;
}

.ingredient-container {
  margin: 1rem;
}

.heading-content {
  font-size: $font-size-xl;
}

.ingredient-list {
  margin: 0.5rem 0;
}

.ingredient {
  display: flex;
  column-gap: 0.5rem;
  line-height: 1.5rem;
}

.instruction-container {
  margin: 1rem;
}

.single-instruction {
  display: flex;
  height: fit;
  gap: 0.5rem;
  padding: 0.5rem 0;

  > :first-child {
    width: 5%;
    font-weight: bold;
    text-align: right;
  }

  > :last-child {
    width: 95%;
  }
}

.recipe-is-loading {
  @include m-flex-center;
  scale: 500%;
  margin: 20rem 0 auto;
}
</style>
