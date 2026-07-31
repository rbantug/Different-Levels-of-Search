<script setup lang="ts">
import { type PropType } from 'vue'

const props = defineProps({
  dataList: {
    required: true,
    type: Array as PropType<string[]>,
  },
  option: {
    required: true,
    type: Boolean,
    default: false,
  },
  open: {
    required: true,
    type: Boolean,
  },
})

const emits = defineEmits<{
    (e: 'closeList', val: string): void
}>()

function updateSelectedOption(val: string) {
  emits('closeList', val)
}

// drop down animation

const beforeEnter = (el: Element) => {
  const element = el as HTMLElement

  element.style.height = '0'
  element.style.opacity = '0'
  element.style.overflow = 'hidden'
}

const enter = (el: Element) => {
  const element = el as HTMLElement

  // Force the browser to apply the initial state
  void element.offsetHeight

  element.style.height = `${element.scrollHeight}px`
  element.style.opacity = '1'
}

const afterEnter = (el: Element) => {
  const element = el as HTMLElement

  // Allow the content to grow/shrink naturally afterwards
  element.style.height = 'auto'
  element.style.overflow = ''
}

const beforeLeave = (el: Element) => {
  const element = el as HTMLElement

  // Start from the current natural height
  element.style.height = `${element.scrollHeight}px`
  element.style.opacity = '1'
  element.style.overflow = 'hidden'
}

const leave = (el: Element) => {
  const element = el as HTMLElement

  // Force a reflow so the browser recognizes the starting height
  void element.offsetHeight

  element.style.height = '0'
  element.style.opacity = '0'
}
</script>

<template>
  <div class="listContainer" :class="{ visible: props.open, hidden: !props.open }">
    <Transition
      name="dropdown"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <ul v-show="props.open">
        <li v-if="!props.option" @click="updateSelectedOption('All')">All</li>
        <li v-for="data in props.dataList" :key="data" @click="updateSelectedOption(data)">
          {{ data }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.listContainer {
  @include custom-scrollbar(size, thumb, track);

  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  max-height: 20rem;
  width: 100%;
  margin-top: 3.5rem;
  overflow-y: auto;
  border-radius: 5px;
  z-index: 1;

  &.visible {
    border: 1px gray solid;
  }

  &.hidden {
    border: none;
  }
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  padding: 0.5rem 0.3rem;

  &:hover {
    cursor: pointer;
    background-color: $color-primary-hover;
  }
}

// drop down animation

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    height 200ms ease,
    opacity 200ms ease;

  overflow: hidden;
}
</style>
