<script setup lang="ts">
import { computed } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import 'iconify-icon'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
})

const emits = defineEmits(['update:currentPage'])

const breakpoints = useBreakpoints({
  tablet: 768,
  desktop: 1024,
})

const visiblePages = computed(() => {
  const pages = []

  if (props.currentPage > 1) {
    pages.push(props.currentPage - 1)
  }

  pages.push(props.currentPage)

  if (props.currentPage < props.totalPages) {
    pages.push(props.currentPage + 1)
  }

  return pages
})

function goToPage(page: number) {
  if (page < 1 || page > props.totalPages) return
  emits('update:currentPage', page)
}
</script>

<template>
  <div class="pagination-container">
    <nav class="pagination">
      <button
        class="pagination-left-arrow"
        :class="{ disabled: currentPage === 1 }"
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        <!-- fe:arrow-left -->
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path fill="currentColor" fill-rule="evenodd" d="m15 4l2 2l-6 6l6 6l-2 2l-8-8z" />
        </svg>
      </button>
      <div class="pagination-text">Page</div>
      <div class="pagination-page-number">
        <button
          class="pagination-page-number__button"
          :class="{ active: n === currentPage }"
          v-for="n in visiblePages"
          :key="n"
        >
          {{ n }}
        </button>
      </div>
      <div v-if="currentPage + 1 < totalPages" class="pagination-text">... {{ totalPages }}</div>
      <button
        class="pagination-right-arrow"
        :class="{ disabled: currentPage === totalPages }"
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        <!-- fe:arrow-right -->
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path fill="currentColor" fill-rule="evenodd" d="m9.005 4l8 8l-8 8L7 18l6.005-6L7 6z" />
        </svg>
      </button>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.pagination-container {
  width: fit;
  height: 7rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination {
  position: relative;
  background-color: $color-primary-light;
  width: 20rem;
  padding: 0 0.5rem;
  height: 4rem;
  border-radius: 5px;
  box-shadow: $shadow-card;

  @include m-flex-center;
}

.pagination-left-arrow,
.pagination-right-arrow {
  all: unset;
  position: absolute;
  font-size: 1.5rem;
  @include m-flex-center;

  &:hover {
    cursor: pointer;
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.pagination-left-arrow {
  left: 1rem;
}

.pagination-right-arrow {
  right: 1rem;
}

.pagination-text {
  font-size: 1.5rem;
}

.pagination-page-number {
  margin: 0 0.5rem;
  display: flex;

  #{&}__button {
    all: unset;
    margin: 0 0.2rem;
    width: 2rem;
    height: 2rem;
    font-size: 1.2rem;
    border-radius: 5px;
    @include m-flex-center;

    &:hover {
      cursor: pointer;
    }

    &.active {
      background-color: $color-primary;
    }
  }

  button:disabled:hover {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
