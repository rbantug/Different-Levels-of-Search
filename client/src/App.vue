<script setup lang="ts"></script>

<template>
  <div class="main">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<style lang="scss" scoped>
.main {
  font-family: $font-family-base;
  max-width: 360px;
  height: 800px;
  margin: 0 auto;
  border: 1px solid black;
}
</style>
