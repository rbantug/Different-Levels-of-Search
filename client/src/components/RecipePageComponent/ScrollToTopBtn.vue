<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  /**
   * The CSS selector string of the top most container that is responsible for scrolling.
   */
  selector: {
    type: String,
    required: true
  },
  scrollThresholdPercent: {
    type: Number,
    default: 0.75
  }
})

const isVisible = ref(false)
let scrollContainer: HTMLElement | null = null

function scrollToTop() {
  scrollContainer?.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

function handleScroll() {
  if (!scrollContainer) return

  const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight

  const threshold = maxScroll * props.scrollThresholdPercent

  isVisible.value = scrollContainer.scrollTop > threshold
}

onMounted(() => {
  scrollContainer = document.querySelector<HTMLElement>(props.selector)

  if (!scrollContainer) return

  handleScroll()
  scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  scrollContainer?.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <Transition name="slide-right">
    <button
    v-show="isVisible"
      class="scroll-to-top"
      type="button"
      aria-label="Scroll to top"
      title="Scroll to top"
      @click="scrollToTop"
    >
      <svg
        class="scroll-to-top__icon"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M13 20h-2V8l-5.5 5.5l-1.42-1.42L12 4.16l7.92 7.92l-1.42 1.42L13 8z"
        />
      </svg>
    </button>
  </Transition>
</template>

<style lang="scss" scoped>
.scroll-to-top {
  @include m-flex-center;

  position: fixed;
  right: 1.25rem;
  bottom: 2.5rem;
  z-index: 10;

  width: 3.75rem;
  height: 3.75rem;

  color: #fff;
  background-color: $color-search-icon;
  border: none;
  border-radius: 50%;
  cursor: pointer;

  transition:
    transform 300ms ease,
    background-color 300ms ease,
    opacity 300ms ease;

  &:hover {
    transform: translateY(-0.5rem);
    background-color: $color-footer-text;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 4px;
  }

  &__icon {
    width: 2rem;
    height: 2rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    scroll-behavior: auto;
  }
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition:
    transform 300ms ease,
    opacity 300ms ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.slide-right-enter-to,
.slide-right-leave-from {
  opacity: 1;
  transform: translateX(0);
}

@media (prefers-reduced-motion: reduce) {
  .scroll-to-top,
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: none;
  }
}
</style>
