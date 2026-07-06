<script setup lang="ts"></script>

<template>
  <div class="card">
    <div class="thumbnail-container">
      <div class="recipe-thumbnail skeleton"></div>
    </div>
    <div class="recipe-details">
      <h3 class="recipe-details__name skeleton"></h3>
      <p class="recipe-details__area skeleton"></p>
      <p class="recipe-details__category skeleton"></p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  flex-direction: row;
  height: 100%;
  outline: 1px solid $color-primary;
  border-radius: 5px;
  background-color: $color-surface;

  @include m-flex-center;
}

.thumbnail-container {
  width: 50%;
  @include m-flex-center;
}

.recipe-thumbnail {
  height: 8rem;
  width: 8rem;
}

.recipe-details {
  width: 50%;
  flex-direction: column;
  text-align: center;

  @include m-flex-center;

  #{&}__name {
    height: 1.5rem;
    width: 7rem;
    margin-bottom: 0.5rem;
  }

  #{&}__area,
  #{&}__category {
    height: 1rem;
    width: 5rem;
    margin-bottom: 0.3rem;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.08);
    opacity: 0.85;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.skeleton {
  background-color: #bab9b9;
  border-radius: 6px;
  animation: pulse 1.5s ease-in-out infinite;
  transform-origin: center;
}
</style>
