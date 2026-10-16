<script setup lang="ts">
import { type PropType } from 'vue'

type TypeEnum = 'recipeMain' | 'recipeCard'

const props = defineProps({
  type: {
    type: String as PropType<TypeEnum>,
    default: 'recipeMain',
    validator: (val: string) => ['recipeMain', 'recipeCard'].includes(val),
  },
})
</script>

<template>
  <div class="badge-container" :class="{ 'recipe-card': props.type === 'recipeCard' }">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.badge-container {
  @include m-flex-center;
  padding: 0.5rem 1rem;
  background-color: $color-background-badge;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 20px;
}

.recipe-card {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}
</style>
