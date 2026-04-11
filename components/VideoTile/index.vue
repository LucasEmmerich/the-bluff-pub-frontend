<template>
    <video ref="videoEl" autoplay playsinline :muted="mirror"
        class="w-full h-full object-cover rounded-lg bg-black" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const props = defineProps<{ stream: MediaStream | null; mirror?: boolean }>();
const videoEl = ref<HTMLVideoElement | null>(null);

const apply = (s: MediaStream | null) => {
    if (videoEl.value) videoEl.value.srcObject = s;
};

onMounted(() => apply(props.stream));
watch(() => props.stream, apply);
</script>
