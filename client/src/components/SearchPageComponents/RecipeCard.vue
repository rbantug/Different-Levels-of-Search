<script setup lang="ts">

const props = defineProps({
  recipeName: {
    required: true,
    type: String,
    default: ''
  },
  recipeThumbnail: {
    required: true,
    type: String,
    default: ''
  },
  area: {
    required: true,
    type: String,
    default: ''
  },
  category: {
    required: true,
    type: String,
    default: ''
  },
})
</script>

<template>
  <div class="card-container">
    <div class="card">
      <div class="recipe-thumbnail">
        <img
          :src="props.recipeThumbnail"
          :alt="props.recipeName"
          class="recipe-thumbnail__img"
        />
      </div>
      <div class="recipe-details">
        <h3 class="recipe-details__name">{{ props.recipeName }}</h3>
        <p class="recipe-details__area">Cuisine: {{ props.area }}</p>
        <p class="recipe-details__category">Category: {{ props.category }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-container {
  width: 20rem;
  height: 10rem;
  border-radius: 5px;

  @include m-tablet {
  }
  @include m-desktop {
  }
}

.card {
  flex-direction: row;
  height: 100%;
  outline: 1px solid $color-primary;
  border-radius: 5px;
  background-color: $color-surface;
  transition: background-color 250ms ease-out, outline 250ms ease-out;

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
    height: 10rem;
    width: fit-content;
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
