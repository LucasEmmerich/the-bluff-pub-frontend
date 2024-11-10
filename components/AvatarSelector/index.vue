<template>
    <div class="relative flex items-center justify-center min-w-40">
        <button @click="previousImage"
            :class="['absolute left-0 text-2xl text-blue-500 hover:text-blue-700 bg-slate-100 bg-opacity-75 rounded-full p-2', (onlyView ? 'invisible' : 'visible')]">
            ⬅
        </button>
        <img :src="images[selectedIndex]" :alt="`Avatar ${selectedIndex + 1}`"
            class="w-24 h-24 rounded-full shadow-lg transition-transform duration-300" />
        <button @click="nextImage"
            :class="['absolute right-0 text-2xl text-blue-500 hover:text-blue-700 bg-slate-100 bg-opacity-75 rounded-full p-2', (onlyView ? 'invisible' : 'visible')]">
            ➡
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
    images: string[]
    modelValue?: number,
    onlyView?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
}>()

const selectedIndex = ref(props.modelValue ?? 0)

watch(() => props.modelValue, (newValue) => {
    if (newValue !== undefined) {
        selectedIndex.value = newValue;
    }
});

onMounted(() => {
    emit('update:modelValue', selectedIndex.value)
});

watch(selectedIndex, (newIndex) => {
    emit('update:modelValue', newIndex)
});

const previousImage = () => {
    selectedIndex.value =
        (selectedIndex.value - 1 + props.images.length) % props.images.length
}

const nextImage = () => {
    selectedIndex.value = (selectedIndex.value + 1) % props.images.length
}
</script>
