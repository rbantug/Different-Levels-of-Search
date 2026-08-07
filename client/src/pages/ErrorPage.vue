<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute()

const errorMsg = computed(() => {
    if (route.params.anything === '404') {
        return 'Recipe not found'
    } else {
        return 'Unexpected Error'
    }
})
</script>

<template>
    <div>{{ errorMsg }}</div>
    <router-link to="/">Back to home</router-link>
</template>

<style lang="scss" scoped></style>