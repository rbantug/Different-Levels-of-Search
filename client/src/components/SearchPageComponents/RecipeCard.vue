<script setup lang="ts">
import { ref, watch } from 'vue'

import RecipeCardSkeleton from './RecipeCardSkeleton.vue'

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

watch(
  () => props.recipeThumbnail,
  (newVal) => {
    if (!newVal) return

    imageLoaded.value = false
    const img = new Image()
    img.onload = () => {
      imageLoaded.value = true
    }

    img.onerror = () => {
      imageLoaded.value = true
    }

    img.src = newVal
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
          <h3 class="recipe-details__name">{{ props.recipeName }}</h3>
          <p class="recipe-details__area">Cuisine: {{ props.area }}</p>
          <p class="recipe-details__category">Category: {{ props.category }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-container {
  width: 20rem;
  height: 10rem;
  border-radius: 5px;
}

.card {
  flex-direction: row;
  height: 100%;
  outline: 1px solid $color-primary;
  border-radius: 5px;
  background-color: $color-surface;
  transition:
    background-color 250ms ease-out,
    outline 250ms ease-out;

  @include m-flex-center;

  &:hover {
    background-color: $color-background-hover;
    outline: 1px solid $color-background-hover;
  }
}

.recipe-thumbnail {
  width: 50%;

  @include m-flex-center;

  #{&}__img {
    object-fit: contain;
    height: 9rem;
    width: 9rem;
    overflow: hidden;
    border-radius: 5px;
  }
}

.recipe-details {
  width: 50%;
  flex-direction: column;
  text-align: center;

  @include m-flex-center;

  #{&}__name {
    padding-bottom: 0.5rem;
  }
}
</style>
