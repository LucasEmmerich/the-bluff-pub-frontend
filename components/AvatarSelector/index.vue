<template>
    <div class="relative flex items-center justify-center" style="width: 96px; height: 96px;">
        <button @click="previousImage"
            :class="['absolute left-0 text-lg text-pub-gold hover:text-pub-gold-bright transition-colors z-10 rounded-full p-1',
                onlyView ? 'invisible' : 'visible']"
            style="background: rgba(10,6,3,0.7); border: 1px solid rgba(184,134,11,0.3);">
            ◀
        </button>
        <img :src="images[selectedIndex]" :alt="`Avatar ${selectedIndex + 1}`"
            class="w-20 h-20 rounded-full shadow-lg ring-2 ring-pub-gold/30 transition-transform duration-300" />
        <button @click="nextImage"
            :class="['absolute right-0 text-lg text-pub-gold hover:text-pub-gold-bright transition-colors z-10 rounded-full p-1',
                onlyView ? 'invisible' : 'visible']"
            style="background: rgba(10,6,3,0.7); border: 1px solid rgba(184,134,11,0.3);">
            ▶
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
    images: string[]
    modelValue?: number
    onlyView?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
}>()

const selectedIndex = ref(props.modelValue ?? 0)

watch(() => props.modelValue, (newValue) => {
    if (newValue !== undefined) selectedIndex.value = newValue
})

onMounted(() => {
    emit('update:modelValue', selectedIndex.value)
})

watch(selectedIndex, (newIndex) => {
    emit('update:modelValue', newIndex)
})

const previousImage = () => {
    selectedIndex.value = (selectedIndex.value - 1 + props.images.length) % props.images.length
}

const nextImage = () => {
    selectedIndex.value = (selectedIndex.value + 1) % props.images.length
}
</script>
