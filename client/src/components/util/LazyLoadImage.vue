<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
} from 'vue'

interface Props {
  src: string
  placeholder: string
  alt?: string
  width?: number | string
  height?: number | string
  aspectRatio?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  eager?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  aspectRatio: '16 / 9',
  objectFit: 'cover',
  eager: false,
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

const container = ref<HTMLDivElement | null>(null)
const isInView = ref(props.eager)
const isLoaded = ref(false)

let observer: IntersectionObserver | undefined

const containerStyle = computed(() => ({
  aspectRatio: props.aspectRatio,
  '--object-fit': props.objectFit,
}))

function onLoad(event: Event) {
  isLoaded.value = true
  emit('load', event)
}

function onError(event: Event) {
  emit('error', event)
}

onMounted(() => {
  if (props.eager) return

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry && entry.isIntersecting) {
        isInView.value = true
        observer?.disconnect()
      }
    },
    {
      rootMargin: '200px',
      threshold: 0,
    },
  )

  if (container.value) {
    observer.observe(container.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div
    ref="container"
    class="lazy-image"
    :style="containerStyle"
  >
    <!-- Blurred placeholder -->
    <img
      :src="placeholder"
      alt=""
      aria-hidden="true"
      class="lazy-image__placeholder"
      :class="{ 'is-hidden': isLoaded }"
    />

    <!-- Full-resolution image -->
    <img
      v-if="isInView"
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : 'auto'"
      class="lazy-image__original"
      :class="{ 'is-loaded': isLoaded }"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>

<style lang="scss" scoped>
.lazy-image {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: $background-color;
}

.lazy-image__placeholder,
.lazy-image__original {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lazy-image__placeholder {
  filter: blur(20px);
  transform: scale(1.05);
  transition: opacity 400ms ease;
}

.lazy-image__placeholder.is-hidden {
  opacity: 0;
}

.lazy-image__original {
  opacity: 0;
  transition: opacity 400ms ease;
}

.lazy-image__original.is-loaded {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .lazy-image__placeholder,
  .lazy-image__original {
    transition: none;
  }
}
</style>