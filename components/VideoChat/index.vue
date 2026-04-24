<template>
    <div class="absolute bottom-4 right-4 flex items-center gap-1.5" style="z-index: 40">
        <template v-if="isEnabled">
            <button
                @click="onToggleMute"
                class="w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors shadow-lg"
                :style="
                    isMuted
                        ? 'background: rgba(220,38,38,0.85); border: 1px solid rgba(220,38,38,0.6);'
                        : 'background: rgba(0,0,0,0.75); border: 1px solid rgba(184,134,11,0.35);'
                "
            >
                {{ isMuted ? "🔇" : "🎙️" }}
            </button>
            <button
                @click="onToggleCam"
                class="w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors shadow-lg"
                :style="
                    isCamOff
                        ? 'background: rgba(220,38,38,0.85); border: 1px solid rgba(220,38,38,0.6);'
                        : 'background: rgba(0,0,0,0.75); border: 1px solid rgba(184,134,11,0.35);'
                "
            >
                {{ isCamOff ? "📵" : "📷" }}
            </button>
            <button
                @click="disable"
                class="w-9 h-9 rounded-full flex items-center justify-center text-sm shadow-lg"
                style="background: rgba(220, 38, 38, 0.75); border: 1px solid rgba(220, 38, 38, 0.5)"
            >
                ✖
            </button>
        </template>

        <button
            v-else
            @click="enable"
            class="flex items-center gap-1.5 px-3 h-9 rounded-full text-xs font-pub shadow-lg transition-colors"
            style="background: rgba(0, 0, 0, 0.75); border: 1px solid rgba(184, 134, 11, 0.35); color: #c4a882"
        >
            📷 <span>Câmera</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { isAudioEnabled, isCamEnabled, toggleAudio, toggleCam } from "~/composables/useWebRTC";

const _room = useRoom();

const isEnabled = computed(() => isAudioEnabled.value || isCamEnabled.value);
const isMuted = computed(() => !isAudioEnabled.value);
const isCamOff = computed(() => !isCamEnabled.value);

const enable = () => {
    if (_room.id) toggleAudio(_room.id);
};
const disable = async () => {
    if (!_room.id) return;
    if (isAudioEnabled.value) await toggleAudio(_room.id);
    if (isCamEnabled.value) await toggleCam(_room.id);
};
const onToggleMute = () => {
    if (_room.id) toggleAudio(_room.id);
};
const onToggleCam = () => {
    if (_room.id) toggleCam(_room.id);
};
</script>
