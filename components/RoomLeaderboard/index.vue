<template>
    <div class="flex flex-col rounded-xl overflow-hidden"
        style="background: rgba(8,5,3,0.92); border: 1px solid rgba(255,255,255,0.18); backdrop-filter: blur(10px); box-shadow: 0 4px 32px rgba(0,0,0,0.7); width: 220px; height: 158px;">
        <div class="shrink-0 px-3 py-1.5" style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <span class="font-pub text-[9px] tracking-[0.35em] uppercase" style="color: rgba(255,248,238,0.45);">Leaderboard</span>
        </div>
        <div class="flex flex-col px-2 py-1.5">
            <div v-for="(entry, index) in sorted" :key="entry.player.id"
                class="flex items-center gap-2 px-1 py-1.5"
                :style="{ borderBottom: index < sorted.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }">
                <span class="text-sm shrink-0 leading-none">{{ rankIcon(index) }}</span>
                <span class="font-pub text-[10px] flex-1 truncate" style="color: rgba(255,248,238,0.7);">{{ entry.player.username }}</span>
                <span class="font-pub font-black text-[9px]" style="color: rgba(184,134,11,0.75);">{{ entry.wins }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { LeaderboardEntry } from '~/types';

const props = defineProps<{ entries: Array<LeaderboardEntry> }>();

const sorted = computed(() =>
    [...props.entries].sort((a, b) => b.wins - a.wins)
);

const rankIcon = (index: number): string => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '🫏';
};
</script>
