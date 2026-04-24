<template>
    <div class="flex flex-col h-screen">
        <AppNav />
        <div
            class="h-px shrink-0"
            style="background: linear-gradient(to right, transparent, #b8860b, transparent)"
        ></div>
        <div class="flex-1 min-h-0" :class="route.path === '/' ? 'overflow-hidden' : 'overflow-y-auto'">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
</script>
