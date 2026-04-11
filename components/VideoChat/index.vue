<template>
    <div class="absolute bottom-4 right-4 flex items-center gap-1.5" style="z-index: 40;">

        <template v-if="isEnabled">
            <button @click="toggleMute"
                class="w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors shadow-lg"
                :style="isMuted
                    ? 'background: rgba(220,38,38,0.85); border: 1px solid rgba(220,38,38,0.6);'
                    : 'background: rgba(0,0,0,0.75); border: 1px solid rgba(184,134,11,0.35);'">
                {{ isMuted ? '🔇' : '🎙️' }}
            </button>
            <button @click="toggleCam"
                class="w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors shadow-lg"
                :style="isCamOff
                    ? 'background: rgba(220,38,38,0.85); border: 1px solid rgba(220,38,38,0.6);'
                    : 'background: rgba(0,0,0,0.75); border: 1px solid rgba(184,134,11,0.35);'">
                {{ isCamOff ? '📵' : '📷' }}
            </button>
            <button @click="disable"
                class="w-9 h-9 rounded-full flex items-center justify-center text-sm shadow-lg"
                style="background: rgba(220,38,38,0.75); border: 1px solid rgba(220,38,38,0.5);">
                ✖
            </button>
        </template>

        <button v-else @click="enable"
            class="flex items-center gap-1.5 px-3 h-9 rounded-full text-xs font-pub shadow-lg transition-colors"
            style="background: rgba(0,0,0,0.75); border: 1px solid rgba(184,134,11,0.35); color: #c4a882;">
            📷 <span>Câmera</span>
        </button>

    </div>
</template>

<script setup lang="ts">
import { isEnabled, isMuted, isCamOff, enableWebRTC, disableWebRTC, toggleMute, toggleCam } from '~/composables/useWebRTC';

const _room = useRoom();

const enable = () => { if (_room.id) enableWebRTC(_room.id); };
const disable = () => { if (_room.id) disableWebRTC(_room.id); };
</script>
