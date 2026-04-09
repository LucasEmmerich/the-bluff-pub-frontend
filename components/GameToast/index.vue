<template>
    <div class="absolute inset-x-0 top-[14%] flex flex-col items-center gap-2 pointer-events-none" style="z-index: 40;">
        <TransitionGroup name="toast">
            <div v-for="toast in toasts" :key="toast.id"
                class="font-pub text-center px-7 py-3 rounded-lg shadow-2xl"
                :style="toastStyle(toast.type)">
                <div class="text-sm font-bold tracking-wide">
                    {{ icons[toast.type] }} {{ toast.text }}
                </div>
                <div v-if="toast.sub" class="text-xs mt-0.5 opacity-75 font-body">
                    {{ toast.sub }}
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import { toasts } from '~/composables/useGame';
import type { GameLogEntry } from '~/composables/useGame';

const icons: Record<string, string> = {
    'bluff-win':  '✅',
    'bluff-fail': '❌',
    'timeout':    '⏱',
    'eliminated': '💀',
};

const styles: Record<string, string> = {
    'bluff-win':  'background: rgba(10,40,20,0.92); border: 1px solid rgba(74,222,128,0.5); color: #4ade80;',
    'bluff-fail': 'background: rgba(40,10,10,0.92); border: 1px solid rgba(248,113,113,0.5); color: #f87171;',
    'timeout':    'background: rgba(40,20,5,0.92);  border: 1px solid rgba(251,146,60,0.5);  color: #fb923c;',
    'eliminated': 'background: rgba(25,5,30,0.92);  border: 1px solid rgba(232,121,249,0.5); color: #e879f9;',
};

const toastStyle = (type: GameLogEntry['type']) =>
    styles[type] ?? 'background: rgba(8,20,12,0.9); border: 1px solid rgba(184,134,11,0.4); color: #b8860b;';
</script>

<style scoped>
.toast-enter-active { transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.4s ease; }
.toast-enter-from   { opacity: 0; transform: translateY(-18px) scale(0.88); }
.toast-enter-to     { opacity: 1; transform: translateY(0) scale(1); }
.toast-leave-from   { opacity: 1; transform: scale(1); }
.toast-leave-to     { opacity: 0; transform: scale(0.9); }
</style>
