<template>
    <div class="relative flex flex-col h-screen shrink-0"
        style="width: 260px; background: #0c0a10; border-right: 1px solid rgba(255,255,255,0.06);">

        <div class="px-6 py-6 border-b" style="border-color: rgba(255,255,255,0.06);">
            <span class="font-pub text-pub-gold font-black tracking-[0.3em] text-sm">BLUFF PUB</span>
        </div>

        <div class="px-5 py-5 border-b flex flex-col items-center gap-4" style="border-color: rgba(255,255,255,0.06);">
            <AvatarSelector :onlyView="!!_room.id" :images="avatars" v-model="_room.mainPlayer.avatar"
                :disabled="_game.matchStarted" />
            <TextInput :disabled="_room.id" v-model="_room.mainPlayer.username"
                placeholder="Your nickname..." label="Player:" />
        </div>

        <div class="flex flex-col gap-3 px-5 py-5" v-if="!_room.id">
            <CustomButton label="Open Table" type="info"
                @click="[createRoom(), $toast.success('Table opened!')]" />

            <div class="flex items-center gap-3">
                <div class="flex-1 h-px" style="background: rgba(255,255,255,0.08);"></div>
                <span class="font-pub text-pub-cream-dim/50 text-xs tracking-widest">OR</span>
                <div class="flex-1 h-px" style="background: rgba(255,255,255,0.08);"></div>
            </div>

            <div class="flex flex-col gap-2">
                <TextInput v-model="_room.enterRoomId" placeholder="Table code"
                    label="Join a table:" sublabel="" />
                <CustomButton label="Join" type="save" @click="joinRoom" />
            </div>
        </div>

        <div class="flex flex-col flex-1 px-5 py-5 gap-5 overflow-y-auto" v-if="_room.id">

            <div>
                <div class="font-pub text-pub-cream-dim/40 text-[10px] tracking-[0.5em] uppercase mb-1.5">Table Code</div>
                <div class="flex items-baseline gap-3">
                    <span class="font-pub text-pub-gold text-xl font-bold tracking-[0.3em]">{{ _room.id }}</span>
                    <button class="font-pub text-pub-cream-dim/40 text-[10px] tracking-widest hover:text-pub-gold/70 transition-colors"
                        @click="[copyRoomCodeToClipboard(), $toast.success('Code copied!')]">
                        copy
                    </button>
                </div>
            </div>

            <div>
                <div class="font-pub text-pub-cream-dim/40 text-[10px] tracking-[0.5em] uppercase mb-3">Players</div>
                <div class="flex flex-col gap-2.5">
                    <div v-for="p in _room.players" :key="p.username"
                        class="flex items-center gap-3">
                        <img :src="avatars[p.avatar as number]" class="w-8 h-8 rounded-full" style="opacity: 0.9;" />
                        <span class="font-pub text-pub-cream/80 text-sm flex-1 truncate">{{ p.username }}</span>
                        <span v-if="p.id === _room.roomOwner?.id" class="text-sm opacity-70">👑</span>
                    </div>
                </div>
            </div>

            <div class="mt-auto">
                <CustomButton v-if="_room.mainPlayer.id === _room.roomOwner?.id"
                    label="⚔ Start Game" type="save" @click="startGame" />
                <p v-else class="font-pub text-pub-cream-dim/50 text-xs italic tracking-wide">
                    Waiting for the table owner...
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { avatars } from "~/assets/avatars";
import { createRoom, joinRoom, copyRoomCodeToClipboard } from "~/composables/useRoom";
import { startGame } from "~/composables/useGame";
import { socket } from "~/socket";

const { $toast }: any = useNuxtApp();
const _room = useRoom();
const _game = useGame();

onMounted(() => {
    socket.on('player-left', (_room: any, leftPlayer: any) => {
        $toast.info(`${leftPlayer.username} left the table.`);
    });

    socket.on('send-notification', ({ type, message }: { type: 'error' | 'info' | 'success', message: string }) => {
        $toast[type](message);
    });
});
</script>
