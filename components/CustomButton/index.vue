<template>
    <button v-bind="$attrs" type="button" :class="classes + 'h-min w-full rounded-md focus:shadow-none py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2'">
        <slot />
        {{ label }}
    </button>
</template>
<script setup lang="ts">
type Props = {
    type: 'save' | 'info' | 'cancel',
    label: string
}
const props = defineProps<Props>()
const classes = computed(() => {
    switch (props.type) {
        case 'save':
            return 'bg-green-600 focus:bg-green-700 active:bg-green-700 hover:bg-green-700 '
        case 'cancel':
            return 'bg-red-600 focus:bg-red-700 active:bg-red-700 hover:bg-red-700 '
        default:
            return 'bg-blue-600 focus:bg-blue-700 active:bg-blue-700 hover:bg-blue-700 '
    }
})
</script>