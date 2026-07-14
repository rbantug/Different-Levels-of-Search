<script setup lang="ts">
import { watch, type PropType } from 'vue';

const props = defineProps({
    dataList: {
        required: true,
        type: Array as PropType<string[]>
    },
    option: {
        required: true,
        type: Boolean,
        default: false
    }

})
const selectedOption = defineModel<string>('selected-option', { required: true })

watch(() => props.dataList, () => {
    if (!props.option) {
        selectedOption.value = 'All'
    }
    return
}, { immediate: true })
</script>

<template>
    <div>
        <select v-model="selectedOption" :disabled="props.dataList.length === 0" :class="{ disabed: props.dataList.length === 0 }">
            <option v-if="!props.option" value="All">All</option>
            <option v-for="data in props.dataList" :key="data" :value="data">{{ data }}</option>
        </select>
    </div>
</template>

<style lang="scss" scoped>
.disabled {
    cursor: not-allowed;
}
</style>