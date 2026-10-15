<script setup lang="ts">
import { type PropType, watch, ref } from 'vue'
import DropDownList from '../util/DropDownList.vue'
import { useMainStore } from '@/stores/mainStore.ts'

const props = defineProps({
  dataList: {
    required: true,
    type: Array as PropType<string[]>,
  },
  /**
   * If set to false, "All" should be included in the list options.
   */
  setToAll: {
    required: true,
    type: Boolean,
    default: false,
  },
  open: {
    required: true,
    type: Boolean,
  },
  defaultOption: {
    required: true,
    type: String,
  },
})

const emits = defineEmits(['goToggle'])

const mainStore = useMainStore()
const dropdownRoot = ref<HTMLElement | null>(null)

const selectedOption = defineModel<string>()

function toggleListVisbility() {
  emits('goToggle')
}

function updateSelectedOption(val: string) {
  selectedOption.value = val
  emits('goToggle')
}

watch(
  () => props.open,
  (isOpen, _oldVal, onCleanup) => {
    if (!isOpen) return

    function handleOutsidePointerDown(event: PointerEvent) {
      const target = event.target

      if (target instanceof Node && dropdownRoot.value && !dropdownRoot.value.contains(target)) {
        mainStore.closeDD()
      }
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown)

    onCleanup(() => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown)
    })
  },
)

watch(
  () => props.dataList,
  () => {
    if (!props.setToAll) {
      selectedOption.value = props.defaultOption
    }
    return
  },
  { immediate: true },
)
</script>

<template>
  <div ref="dropdownRoot" class="dropdown-container">
    <div>
      <button @click="toggleListVisbility">
        <span>{{ selectedOption }}</span>
        <span class="arrow"
          ><svg
            :class="{ active: props.open }"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="currentColor" fill-rule="evenodd" d="m4 15l8-8l8 8l-2 2l-6-6l-6 6z" />
          </svg>
        </span>
      </button>
    </div>
    <DropDownList
      :data-list="props.dataList"
      :option="props.setToAll"
      :open="props.open"
      :all-option="props.defaultOption"
      @close-list="updateSelectedOption"
    />
  </div>
</template>

<style lang="scss" scoped>
.dropdown-container {
  position: relative;
}

.disabled {
  cursor: not-allowed;
}

button {
  display: flex;
  align-items: center;
  position: relative;
  width: 9rem;
  height: 2.5rem;
  border-radius: 20px;
  margin-top: 0.5rem;
  background-color: $color-surface;

  @include m-reset;
  @include m-soft-outline-shadow;

  &:hover {
    cursor: pointer;
  }

  :first-child {
    padding-left: 0.1rem;
  }
}

.arrow {
  @include m-flex-center;
  position: absolute;
  right: 0;
  padding-right: 0.5rem;

  svg {
    transform-origin: center;
    transform-box: fill-box;
    transition: all 0.3s ease;

    &.active {
      transform: rotate(180deg);
    }
  }
}
</style>
