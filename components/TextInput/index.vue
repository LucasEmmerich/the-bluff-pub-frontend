<template>
    <div class="w-full">
        <span v-if="label" class="block font-pub text-pub-cream-dim text-xs tracking-widest mb-1 px-1">{{
            label
        }}</span>
        <div class="relative">
            <input
                v-bind="$attrs"
                v-model="model"
                class="w-full px-3 py-2 rounded text-sm font-body text-pub-cream placeholder:text-pub-cream-dim/50 transition duration-200 focus:outline-none"
                style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(184, 134, 11, 0.25)"
                @focus="(e) => ((e.target as HTMLInputElement).style.borderColor = 'rgba(184,134,11,0.6)')"
                @blur="(e) => ((e.target as HTMLInputElement).style.borderColor = 'rgba(184,134,11,0.25)')"
            />
            <p v-if="sublabel" class="mt-1 text-xs text-pub-cream-dim/50 px-1">{{ sublabel }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
type Props = {
    label?: string;
    sublabel?: string;
};
defineProps<Props>();
const model = defineModel<string>();
</script>
