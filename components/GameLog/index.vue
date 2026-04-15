<template>
    <div class="flex flex-col rounded-xl overflow-hidden"
        style="background: rgba(8,5,3,0.92); border: 1px solid rgba(255,255,255,0.18); backdrop-filter: blur(10px); box-shadow: 0 4px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04); height: 152px;">
        <div class="shrink-0 px-3 py-1.5" style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <span class="font-pub text-[9px] tracking-[0.35em] uppercase" style="color: rgba(255,248,238,0.45);">Game Logs (last 5)</span>
        </div>
        <div class="flex flex-col px-2 py-1.5 overflow-hidden">
            <TransitionGroup name="log">
                <div v-for="entry in gameLogs.slice(0, 5)" :key="entry.id"
                    class="font-pub text-[9px] leading-snug py-1 px-1"
                    :style="{ color: colors[entry.type], borderBottom: '1px solid rgba(255,255,255,0.05)' }">
                    {{ displayText(entry) }}
                </div>
            </TransitionGroup>
        </div>
    </div>
</template>

<script setup lang="ts">
import { gameLogs } from '~/composables/useGame';
import type { GameLogEntry } from '~/composables/useGame';

const displayText = (entry: GameLogEntry): string => {
    switch (entry.type) {
        case 'round':     return entry.sub ? `${entry.text} · ${entry.sub}` : entry.text;
        case 'play':      return `${entry.text} ${entry.sub}`;
        case 'bluff-win':
        case 'bluff-fail': return entry.sub ? `${entry.text} · ${entry.sub}` : entry.text;
        case 'timeout':   return `${entry.text} ${entry.sub}`;
        case 'eliminated': return entry.text;
        default:          return entry.text;
    }
};

const colors: Record<string, string> = {
    'round':      'rgba(255,248,238,0.18)',
    'play':       'rgba(255,248,238,0.42)',
    'bluff-win':  'rgba(248,113,113,0.8)',
    'bluff-fail': 'rgba(248,113,113,0.8)',
    'timeout':    'rgba(251,191,36,0.75)',
    'eliminated': 'rgba(232,121,249,0.85)',
};
</script>

<style scoped>
.log-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.log-enter-from   { opacity: 0; transform: translateX(-8px); }
.log-enter-to     { opacity: 1; transform: translateX(0); }

.log-scroll::-webkit-scrollbar { width: 3px; }
.log-scroll::-webkit-scrollbar-track { background: transparent; }
.log-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
</style>
