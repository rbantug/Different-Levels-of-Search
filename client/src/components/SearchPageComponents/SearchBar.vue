<script setup lang="ts">
const model = defineModel<string>('search' ,{
  required: true,
})
</script>

<template>
  <div>
    <input type="text" v-model="model" placeholder="Search recipes..." />
  </div>
</template>

<style lang="scss" scoped>
input {
  width: 100%;
  padding: 1rem;
  border: none;
  outline: none;
  border-radius: 10px;
  box-shadow: $shadow-search;

  &:focus {
    outline: 2px solid $color-primary;
  }

  @include m-tablet {
    font-size: 2rem;
  }

  @include m-desktop {
    font-size: 3rem;
  }
}
</style>
