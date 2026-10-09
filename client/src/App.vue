<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseModal from './components/util/BaseModal.vue'
import apiHealthCheck from './api/general.ts'

const apiStatus = ref<'checking' | 'successful' | 'failed'>('checking')
const modalIsVisibile = ref(true)

onMounted(async () => {
  try {
    const apiCheck = await apiHealthCheck()
    if (apiCheck.status === 'ok') {
      apiStatus.value = 'successful'
    }

    setTimeout(() => {
      modalIsVisibile.value = false
    }, 5000)
  } catch {
    apiStatus.value = 'failed'
  }
})
</script>

<template>
  <BaseModal :open="modalIsVisibile" :status="apiStatus" />
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
  @include custom-scrollbar(size, thumb, track, thumb-hover, radius, none);
  font-family: $font-family-base;
  max-width: 360px;
  height: 800px;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0 auto;
  border: 1px solid black;
  position: relative;
}
</style>
