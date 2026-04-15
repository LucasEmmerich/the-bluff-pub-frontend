<template>
    <div class="flex flex-col gap-3 p-5 rounded-xl"
        style="background: rgba(255,255,255,0.02); border: 1px solid rgba(184,134,11,0.12);">
        <div v-if="icon" class="text-3xl">{{ icon }}</div>
<h3 class="font-pub text-pub-gold-light text-sm tracking-wide">{{ title }}</h3>
        <p class="font-body text-pub-cream/50 text-sm leading-relaxed">
            <slot />
        </p>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    icon: string
    title: string
}>()
</script>
