<template>
    <div class="relative shrink-0" :style="{ width: size, height: size }">
        <div v-if="!loaded"
            class="absolute inset-0 animate-pulse"
            :class="rounded"
            style="background: rgba(184,134,11,0.08); border: 1px solid rgba(184,134,11,0.1);" />
        <img
            v-if="src"
            :src="src"
            :alt="alt"
            :class="[rounded, imgClass, loaded ? 'opacity-100' : 'opacity-0']"
            class="w-full h-full object-cover transition-opacity duration-300"
            @load="loaded = true"
        />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    src?: string | number
    alt?: string
    size: string
    rounded?: string
    imgClass?: string
}>();

const loaded = ref(false);

watch(() => props.src, () => { loaded.value = false; });
</script>
