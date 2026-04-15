<template>
    <div class="min-h-full px-8 py-12" style="background: #0a0603;">
        <div class="mx-auto" style="max-width: 680px;">

            <div class="mb-10">
                <span class="font-pub text-[10px] tracking-[0.5em] uppercase" style="color: rgba(184,134,11,0.4);">Changelog</span>
                <h1 class="font-pub font-black tracking-[0.2em] uppercase mt-1" style="font-size: 1.6rem; color: #f0c040;">
                    Patch Notes
                </h1>
            </div>

            <div v-for="release in releases" :key="release.version" class="mb-10">
                <div class="flex items-center gap-3 mb-5">
                    <span class="font-pub font-black tracking-[0.15em]" style="font-size: 1.1rem; color: #f0c040;">
                        v{{ release.version }}
                    </span>
                    <span class="font-pub text-[9px] tracking-[0.3em] uppercase px-2 py-0.5 rounded-full"
                        style="background: rgba(184,134,11,0.12); border: 1px solid rgba(184,134,11,0.3); color: rgba(184,134,11,0.7);">
                        {{ release.label }}
                    </span>
                    <span class="font-pub text-[10px] tracking-[0.25em] ml-auto" style="color: rgba(255,248,238,0.2);">
                        {{ release.date }}
                    </span>
                </div>

                <div class="rounded-xl overflow-hidden" style="border: 1px solid rgba(255,255,255,0.07);">
                    <div v-for="(group, gi) in release.groups" :key="group.title">
                        <div class="px-5 py-2.5 flex items-center gap-2"
                            :style="gi > 0 ? 'border-top: 1px solid rgba(255,255,255,0.05);' : ''"
                            style="background: rgba(255,255,255,0.03);">
                            <span class="text-sm">{{ group.icon }}</span>
                            <span class="font-pub text-[10px] tracking-[0.4em] uppercase" style="color: rgba(255,248,238,0.35);">
                                {{ group.title }}
                            </span>
                        </div>
                        <ul class="px-5 py-3 flex flex-col gap-2.5" style="background: rgba(8,5,3,0.6);">
                            <li v-for="item in group.items" :key="item.text"
                                class="flex items-start gap-2.5">
                                <span class="font-pub text-[8px] tracking-[0.15em] px-1.5 py-px rounded shrink-0 mt-0.5"
                                    :style="tagStyle(item.tag)">
                                    {{ item.tag }}
                                </span>
                                <span class="font-body text-[13px] leading-snug" style="color: rgba(255,248,238,0.6);">
                                    {{ item.text }}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
type Tag = 'NEW' | 'FIX' | 'IMPROVED';

const tagStyle = (tag: Tag) => {
    if (tag === 'NEW')      return 'background: rgba(34,197,94,0.12);  border: 1px solid rgba(34,197,94,0.35);  color: rgba(74,222,128,0.85);';
    if (tag === 'FIX')      return 'background: rgba(239,68,68,0.12);  border: 1px solid rgba(239,68,68,0.35);  color: rgba(248,113,113,0.85);';
    if (tag === 'IMPROVED') return 'background: rgba(184,134,11,0.12); border: 1px solid rgba(184,134,11,0.35); color: rgba(240,192,64,0.85);';
};

const releases = [
    {
        version: '1.0.0',
        date: 'April 14, 2025',
        label: 'Initial Release',
        groups: [
            {
                icon: '🎮',
                title: 'Play',
                items: [
                    { tag: 'NEW', text: 'Real-time multiplayer Bluff card game for 2–4 players with private rooms and shareable codes' },
                    { tag: 'NEW', text: 'Full bluff mechanic — play cards face down, call out liars, lose a life if you\'re wrong' },
                    { tag: 'NEW', text: 'Session leaderboard, room chat, game log panel and turn timer with animated card interactions' },
                    { tag: 'NEW', text: 'Avatar selector and username setup, persisted locally across sessions' },
                    { tag: 'NEW', text: 'WebRTC video and audio support between players at the table' },
                ],
            },
            {
                icon: '🌐',
                title: 'General',
                items: [
                    { tag: 'NEW', text: 'Rules page covering cards, game flow, bluff resolution, lives and strategy tips' },
                    { tag: 'NEW', text: 'About page with tech stack and author details' },
                    { tag: 'NEW', text: 'Versioned changelog to track the evolution of the game over time' },
                ],
            },
        ],
    },
];
</script>
