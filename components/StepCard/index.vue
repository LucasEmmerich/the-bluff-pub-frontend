<template>
    <div class="flex gap-5 p-6 rounded-xl"
        style="background: rgba(255,255,255,0.025); border: 1px solid rgba(184,134,11,0.15);">
        <div class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-pub font-black text-sm"
            style="background: rgba(184,134,11,0.15); border: 1px solid rgba(184,134,11,0.5); color: #f0c040;">
            {{ step }}
        </div>
        <div>
            <h3 class="font-pub text-pub-cream tracking-wide mb-2">{{ title }}</h3>
            <p class="font-body text-pub-cream/55 text-sm leading-relaxed">
                <slot />
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    step: number
    title: string
}>()
</script>
