<template>
    <button v-bind="$attrs" type="button" :class="[baseClasses, typeClasses]"><slot />{{ label }}</button>
</template>

<script setup lang="ts">
type Props = {
    type: "save" | "info" | "cancel";
    label: string;
};
const props = defineProps<Props>();

const baseClasses =
    "font-pub text-sm font-semibold tracking-widest uppercase px-4 py-2 rounded transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed h-min w-full border";

const typeClasses = computed(() => {
    switch (props.type) {
        case "save":
            return "bg-emerald-900 border-emerald-600 text-emerald-200 hover:bg-emerald-800 hover:border-emerald-400 hover:text-white";
        case "cancel":
            return "bg-red-950 border-red-700 text-red-300 hover:bg-red-900 hover:border-red-500 hover:text-white";
        default:
            return "bg-pub-wood-mid border-pub-gold text-pub-gold hover:bg-pub-wood-light hover:text-pub-gold-bright";
    }
});
</script>
