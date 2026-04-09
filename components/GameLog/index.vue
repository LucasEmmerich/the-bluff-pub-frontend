<template>
    <div class="flex flex-col gap-1 w-44 pointer-events-none">
        <TransitionGroup name="log">
            <div v-for="entry in gameLogs.slice(0, 3)" :key="entry.id"
                class="flex items-center gap-2 py-1 px-2 rounded text-xs"
                style="background: rgba(0,0,0,0.45);">

                <span class="shrink-0">{{ icons[entry.type] }}</span>

                <div class="flex flex-col min-w-0">
                    <span class="font-pub truncate" :style="{ color: colors[entry.type] }">
                        {{ entry.text }}
                    </span>
                    <span v-if="entry.sub" class="text-pub-cream-dim leading-tight truncate">
                        {{ entry.sub }}
                    </span>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import { gameLogs } from '~/composables/useGame';

const icons: Record<string, string> = {
    'play':       '🃏',
    'bluff-win':  '✅',
    'bluff-fail': '❌',
    'timeout':    '⏱',
    'eliminated': '💀',
    'round':      '⚜',
};

const colors: Record<string, string> = {
    'play':       '#c4a882',
    'bluff-win':  '#4ade80',
    'bluff-fail': '#f87171',
    'timeout':    '#fb923c',
    'eliminated': '#e879f9',
    'round':      '#b8860b',
};
</script>

<style scoped>
.log-enter-active { transition: all 0.3s ease; }
.log-enter-from   { opacity: 0; transform: translateX(16px); }
.log-enter-to     { opacity: 1; transform: translateX(0); }
.log-leave-active { transition: all 0.3s ease; }
.log-leave-from   { opacity: 1; }
.log-leave-to     { opacity: 0; }
</style>
