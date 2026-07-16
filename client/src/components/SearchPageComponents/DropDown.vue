<script setup lang="ts">
import { ref, watch, type PropType } from 'vue'

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
    type: Boolean
  },
  id: {
    required: true,
    type: String
  },
  currentOption: {
    required: true,
    type: String
  }
})

const emits = defineEmits(['goToggle', 'selectedOption'])

const selectedOption = ref(props.currentOption)

function toggleListVisbility() {
  emits('goToggle')
}

function updateSelectedOption(val: string) {
  selectedOption.value = val;
  emits('goToggle');
  emits('selectedOption', val);
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

    <!-- TODO: create your own drop down that can be animated -->

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
    <div class="listContainer" :class="{ visible: props.open, hidden: !props.open }">
      <ul v-show="props.open">
        <li v-if="!props.option" @click="updateSelectedOption('All')">All</li>
        <li v-for="data in props.dataList" :key="data" @click="updateSelectedOption(data)">{{ data }}</li>
      </ul>
    </div>
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

.dropdown-overlay {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: $card-url-color;
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

.listContainer {
  @include custom-scrollbar(size, thumb, track);

  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  max-height: 20rem;
  width: 100%;
  margin-top: 3rem;
  overflow-y: auto;
  border-radius: 5px;
  z-index: 1;

  &.visible {
    border: 1px gray solid;
  }

  &.hidden {
    border: none
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
</style>
