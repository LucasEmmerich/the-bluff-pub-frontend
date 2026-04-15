<template>
    <nav class="shrink-0 flex items-stretch h-12 relative"
        style="background: #0a0603; border-bottom: 1px solid rgba(184,134,11,0.12);">

        <div class="flex items-center gap-2.5 px-8">
            <NuxtLink to="/" class="font-pub font-black tracking-[0.25em] text-xs"
                style="color: rgba(184,134,11,0.5);">
                BLUFF PUB
            </NuxtLink>
            <NuxtLink to="/patch-notes"
                class="font-pub text-[8px] tracking-[0.2em] px-1.5 py-px rounded-full transition-all duration-200 hover:opacity-80"
                :style="route.path === '/patch-notes'
                    ? 'background: rgba(184,134,11,0.18); border: 1px solid rgba(184,134,11,0.5); color: #f0c040;'
                    : 'background: rgba(184,134,11,0.06); border: 1px solid rgba(184,134,11,0.2); color: rgba(184,134,11,0.45);'">
                v1.0.0
            </NuxtLink>
        </div>


        <div class="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-stretch">

            <NuxtLink to="/rules"
                class="font-pub text-[10px] tracking-[0.25em] uppercase flex items-center px-6 transition-all duration-200"
                :class="route.path === '/rules' ? 'link-active' : 'link-inactive'">
                Rules
            </NuxtLink>

            <div class="w-px" style="background: rgba(184,134,11,0.12); margin: 8px 0;"></div>

            <NuxtLink to="/"
                class="font-pub text-sm font-black tracking-[0.25em] uppercase flex items-center px-8 transition-all duration-200"
                :class="route.path === '/' ? 'link-active' : 'link-inactive'">
                Play
            </NuxtLink>

            <div class="w-px" style="background: rgba(184,134,11,0.12); margin: 8px 0;"></div>

            <NuxtLink to="/about"
                class="font-pub text-[10px] tracking-[0.25em] uppercase flex items-center px-6 transition-all duration-200"
                :class="route.path === '/about' ? 'link-active' : 'link-inactive'">
                About
            </NuxtLink>

        </div>

        <div class="ml-auto flex items-center gap-4 px-8">

            <div class="flex items-center gap-1.5">
                <div class="relative flex items-center justify-center w-1.5 h-1.5 shrink-0">
                    <span v-if="state.connected" class="absolute inline-flex w-full h-full rounded-full animate-ping bg-green-400 opacity-60" />
                    <span class="relative inline-flex w-1.5 h-1.5 rounded-full"
                        :style="state.connected ? 'background: #4ade80;' : 'background: #ef4444;'" />
                </div>
                <span class="font-body text-[11px] tabular-nums" style="width: 40px;" :style="pingColor">
                    {{ state.ping !== null ? `${state.ping}ms` : '—' }}
                </span>
            </div>

            <div class="h-3 w-px" style="background: rgba(184,134,11,0.15);"></div>

            <div class="flex items-center gap-4">
                <div v-for="stat in stats" :key="stat.label" class="flex flex-col items-center" style="width: 36px;">
                    <span class="font-pub text-[11px] tabular-nums leading-tight" style="color: rgba(240,192,64,0.7);">
                        {{ stat.value !== null ? stat.value : '—' }}
                    </span>
                    <span class="font-body text-[9px] tracking-wide leading-tight" style="color: rgba(196,168,130,0.3);">
                        {{ stat.label }}
                    </span>
                </div>
            </div>

        </div>

    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { state } from '@/socket';

const route = useRoute();

const stats = computed(() => [
    { label: 'online',  value: state.online  },
    { label: 'playing', value: state.playing },
    { label: 'rooms',   value: state.rooms   },
]);

const pingColor = computed(() => {
    if (state.ping === null) return 'color: rgba(196,168,130,0.35);';
    if (state.ping < 80)  return 'color: #4ade80;';
    if (state.ping < 200) return 'color: #facc15;';
    return 'color: #f87171;';
});
</script>

<style scoped>
.link-active {
    color: #f0c040;
    background: rgba(184,134,11,0.1);
    border-left: 1px solid rgba(184,134,11,0.2);
    border-right: 1px solid rgba(184,134,11,0.2);
}
.link-inactive {
    color: rgba(255,248,238,0.25);
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
}
.link-inactive:hover {
    color: rgba(255,248,238,0.6);
    background: rgba(255,255,255,0.03);
}
</style>
