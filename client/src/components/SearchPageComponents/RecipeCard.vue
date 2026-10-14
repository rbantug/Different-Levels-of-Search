<script setup lang="ts">
import { ref, watch, computed } from 'vue'

import RecipeCardSkeleton from './RecipeCardSkeleton.vue'
import BaseBadge from '../util/BaseBadge.vue'

const props = defineProps({
  recipeName: {
    required: true,
    type: String,
    default: '',
  },
  recipeThumbnail: {
    required: true,
    type: String,
    default: '',
  },
  area: {
    required: true,
    type: String,
    default: '',
  },
  category: {
    required: true,
    type: String,
    default: '',
  },
})

const imageLoaded = ref(false)

const truncatedRecipeName = computed(() => {
  if (props.recipeName.length < 35) {
    return props.recipeName
  }

  return `${props.recipeName.slice(0, 35)}...`
})

function loadImage(src: string) {
  imageLoaded.value = false
  const img = new Image()
  img.onload = () => {
    imageLoaded.value = true
  }

  img.onerror = () => {
    imageLoaded.value = true
  }

  img.src = src
}

watch(
  () => props.recipeThumbnail,
  (newVal) => {
    if (!newVal) return

    loadImage(newVal)
  },
  { immediate: true },
)
</script>

<template>
  <div>
    <div class="card-container">
      <RecipeCardSkeleton v-if="!imageLoaded" />

      <div class="card" :style="{ opacity: imageLoaded ? 1 : 0 }">
        <div class="recipe-thumbnail">
          <img :src="props.recipeThumbnail" :alt="props.recipeName" class="recipe-thumbnail__img" />
        </div>
        <div class="recipe-details">
          <h3 class="recipe-details__name">{{ truncatedRecipeName }}</h3>
          <div class="recipe-badge-container">
            <BaseBadge type="recipeCard">{{ props.area }}</BaseBadge>
            <BaseBadge type="recipeCard">{{ props.category }}</BaseBadge>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-container {
  width: 20rem;
  height: 9rem;
  border-radius: 5px;
  padding-bottom: 0.1rem;
}

.card {
  @include m-flex-center;
  @include m-soft-outline-shadow;

  flex-direction: row;
  height: 100%;
  border-radius: 5px;
  background-color: $background-color;
  transition:
    background-color 250ms ease-out,
    outline 250ms ease-out;

  &:hover {
    background-color: $color-background-hover;
    outline: 1px solid $color-background-hover;
  }
}

.recipe-thumbnail {
  @include m-flex-center;

  width: 40%;

  #{&}__img {
    object-fit: contain;
    height: 7rem;
    width: 7rem;
    overflow: hidden;
    border-radius: 5px;
  }
}

.recipe-details {
  width: 60%;
  text-align: left;
  padding-left: 0.5rem;

  #{&}__name {
    padding-bottom: 0.5rem;
    font-size: 1rem;
    color: $color-text-primary;
  }
}

.recipe-badge-container {
  display: flex;
  justify-content: flex-start;
  column-gap: 1rem;
}
</style>
