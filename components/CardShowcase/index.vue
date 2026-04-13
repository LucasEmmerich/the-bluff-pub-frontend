<template>
    <div class="flex flex-col items-center gap-4 p-5 rounded-xl transition-transform duration-300 hover:-translate-y-1"
        :style="special
            ? 'background: rgba(184,134,11,0.1); border: 1px solid rgba(184,134,11,0.5);'
            : 'background: rgba(255,255,255,0.03); border: 1px solid rgba(184,134,11,0.15);'">
        <img :src="src" class="w-16 h-24 rounded-md shadow-xl ring-1"
            :class="special ? 'ring-pub-gold/60' : 'ring-pub-gold/20'" />
        <div class="text-center">
            <div class="font-pub tracking-widest text-sm mb-1"
                :style="special ? 'color: #f0c040;' : 'color: #c4a882;'">
                {{ name }}
                <span v-if="special" class="text-pub-gold text-xs ml-1">★</span>
            </div>
            <p class="font-body text-pub-cream/50 text-xs leading-relaxed italic">{{ description }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    src: string
    name: string
    description: string
    special?: boolean
}>()
</script>
