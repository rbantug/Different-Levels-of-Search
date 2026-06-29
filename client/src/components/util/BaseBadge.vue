<script setup lang="ts">
</script>

<template>
    <div class="badge-container">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
.badge-container {
    @include m-flex-center;
    padding: 0.5rem 1rem;
    background-color: $color-background-badge;
    color: white;
    font-weight: 600;
    border: none;
    border-radius: 20px;
}
</style>