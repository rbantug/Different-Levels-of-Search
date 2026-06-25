<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  imgPath: string | undefined
  blurryImgPath?: string | undefined
  altName?: string
  notLazy?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  notLazy: false,
  class: '',
  imgPath: '',
  blurryImgPath: '',
})

const loaded = ref(false)
const error = ref(false)

onMounted(() => {
  const img = new Image()
  img.src = props.imgPath

  img.onload = () => {
    loaded.value = true
  }

  img.onerror = () => {
    error.value = true
  }
})
</script>

<template>
  <div class="lazyloadimg-container" :class="props.class">
    <!-- Skeleton -->
    <div v-if="!loaded && !error" class="skeleton"></div>

    <!-- Placeholder (blurred) -->
    <img
      v-if="props.blurryImgPath && !loaded"
      :src="props.blurryImgPath"
      :alt="props.altName"
      class="placeholder"
      :loading="notLazy ? 'eager' : 'lazy'"
    />

    <!-- Main Image -->
    <img
      v-if="!error"
      :src="props.imgPath"
      :alt="props.altName"
      :class="['main-img', loaded ? 'main-img__loaded' : 'main-img__not-loaded', props.class]"
      :loading="notLazy ? 'eager' : 'lazy'"
    />

    <!-- Error Fallback -->
    <div v-if="error" class="error">Image failed to load</div>
  </div>
</template>

<style lang="scss" scoped>
.lazyloadimg-container {
  position: relative;
  overflow: hidden;
}

.skeleton {
  position: absolute;
  inset: 0;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  background-color: rgba(209, 213, 219, 0.2); // gray-300 at 20% opacity
}

@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}

.placeholder {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(12px);
  scale: 105% 105%;
}

.main-img {
  object-fit: cover;
  transition: all 700ms ease-in;

  #{&}__loaded {
    opacity: 1;
    filter: blur(0);
    scale: 100% 100%;
  }

  #{&}__not-loaded {
    opacity: 0;
    filter: blur(12px);
    scale: 105% 105%;
  }
}

.error {
  @include m-flex-center;
  width: 100%;
  height: 100%;
  background-color: $color-search-icon;
  color: $color-text-secondary;
  font-size: 0.875rem;
  list-style: calc(1.25 / 0.875);
}
</style>
