<script setup lang="ts">
const searchOption = defineModel<string>('search-option', { required: true })
</script>

<template>
    <div>
        <select v-model="searchOption">
            <option value="keyword">Keyword Search only</option>
            <option value="hybrid">Keyword + Semantic Search</option>
        </select>
    </div>
</template>

<style lang="scss" scoped></style>