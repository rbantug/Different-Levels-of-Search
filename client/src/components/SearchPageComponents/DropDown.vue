<script setup lang="ts">
import { type PropType, watch } from 'vue'
import DropDownList from '../util/DropDownList.vue'

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
  id: {
    required: true,
    type: String,
  },
})

const emits = defineEmits(['goToggle', 'selectedOption'])

const selectedOption = defineModel()

function toggleListVisbility() {
  emits('goToggle')
}

function updateSelectedOption(val:string) {
  selectedOption.value = val
  emits('goToggle')
}

watch(
  () => props.dataList,
  () => {
    if (!props.option) {
      selectedOption.value = 'All'
    }
    return
  },
  { immediate: true },
)
</script>

<template>
  <div class="dropdown-container">
    <div>
      <button @click="toggleListVisbility">
        <span>{{ selectedOption }}</span>
        <span class="arrow"
          ><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="currentColor" fill-rule="evenodd" d="m4 15l8-8l8 8l-2 2l-6-6l-6 6z" />
          </svg>
        </span>
      </button>
    </div>
    <DropDownList
      :data-list="props.dataList"
      :option="props.option"
      :open="props.open"
      @close-list="updateSelectedOption"
    />
  </div>
</template>

<style lang="scss" scoped>
@mixin reset {
  margin: 0;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  background: none;
  font: inherit;
  color: inherit;
}

.dropdown-container {
  position: relative;
}

.disabled {
  cursor: not-allowed;
}

button {
  @include reset;
  @include m-flex-center;
  position: relative;
  width: 7rem;
  height: 2.5rem;
  border: 1px solid black;
  margin-top: 0.5rem;
  padding-right: 1.5rem;

  &:hover {
    cursor: pointer;
  }
}

.arrow {
  @include m-flex-center;
  position: absolute;
  right: 0;
  padding-right: 0.5rem;
}
</style>
