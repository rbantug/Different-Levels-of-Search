<script setup lang="ts">
const model = defineModel<string>('search' ,{
  required: true,
})

const emits = defineEmits(['inputClicked'])

function runEmit() {
  emits('inputClicked')
}
</script>

<template>
  <div>
    <input type="text" v-model="model" placeholder="Search recipes..." @click="runEmit" />
  </div>
</template>

<style lang="scss" scoped>
input {
  width: 20rem;
  height: 4rem;
  padding: 1rem;
  border: none;
  outline: none;
  border-radius: 10px;
  box-shadow: $shadow-search;
  font-size: 1.5rem;

  &:focus {
    outline: 2px solid $color-primary;
  }
}
</style>
