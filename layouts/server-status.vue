<template>
    <div class="fixed bottom-4 right-4 z-50">
        <div class="flex flex-col gap-2 px-4 py-3 rounded-2xl"
            style="background: rgba(10,8,6,0.88); border: 1px solid rgba(184,134,11,0.22); backdrop-filter: blur(14px); min-width: 180px;">

            <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                    <div class="relative flex items-center justify-center w-2 h-2">
                        <span class="absolute inline-flex w-full h-full rounded-full opacity-75"
                            :class="state.connected ? 'animate-ping bg-green-400' : 'bg-red-400'" />
                        <span class="relative inline-flex w-2 h-2 rounded-full"
                            :style="state.connected ? 'background: #22c55e;' : 'background: #ef4444;'" />
                    </div>
                    <span class="font-pub text-xs tracking-widest"
                        :style="state.connected ? 'color: #86efac;' : 'color: #fca5a5;'">
                        {{ state.connected ? 'Online' : 'Offline' }}
                    </span>
                </div>

                <span class="font-body text-xs" style="color: rgba(196,168,130,0.55);">
                    <span v-if="state.ping !== null" :style="pingColor">{{ state.ping }}</span>
                    <span v-else style="color: rgba(196,168,130,0.35);">—</span>
                    <span style="color: rgba(196,168,130,0.35);">ms</span>
                </span>
            </div>

            <div class="h-px w-full" style="background: rgba(184,134,11,0.15);"></div>

            <div class="flex flex-col gap-1.5">
                <div class="flex items-center justify-between">
                    <span class="font-body text-xs" style="color: rgba(196,168,130,0.5);">online</span>
                    <span class="font-pub text-xs" :style="state.online !== null ? 'color: #e2c97e;' : 'color: rgba(196,168,130,0.3);'">
                        {{ state.online !== null ? state.online : '—' }}
                    </span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="font-body text-xs" style="color: rgba(196,168,130,0.5);">playing</span>
                    <span class="font-pub text-xs" :style="state.playing !== null ? 'color: #e2c97e;' : 'color: rgba(196,168,130,0.3);'">
                        {{ state.playing !== null ? state.playing : '—' }}
                    </span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="font-body text-xs" style="color: rgba(196,168,130,0.5);">active rooms</span>
                    <span class="font-pub text-xs" :style="state.rooms !== null ? 'color: #e2c97e;' : 'color: rgba(196,168,130,0.3);'">
                        {{ state.rooms !== null ? state.rooms : '—' }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { state } from '@/socket';

const pingColor = computed(() => {
    if (state.ping === null) return 'color: rgba(196,168,130,0.4);';
    if (state.ping < 80) return 'color: #4ade80;';
    if (state.ping < 200) return 'color: #facc15;';
    return 'color: #f87171;';
});
</script>
