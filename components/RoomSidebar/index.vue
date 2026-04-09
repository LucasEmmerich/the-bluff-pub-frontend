<template>
    <div class="relative flex flex-col h-screen border-r border-pub-gold/20 shrink-0"
        style="width: 300px; background: linear-gradient(180deg, #1a0a04 0%, #2a1208 40%, #1e0f08 70%, #150804 100%);">

        <div class="py-5 px-5 border-b border-pub-gold/30 flex justify-center">
            <div class="w-full text-center px-4 py-3 rounded"
                style="
                    background: linear-gradient(180deg, #2e1505 0%, #1c0d03 100%);
                    border: 1px solid rgba(184,134,11,0.5);
                    box-shadow: 0 0 18px rgba(184,134,11,0.08), inset 0 1px 0 rgba(184,134,11,0.15), inset 0 -1px 0 rgba(0,0,0,0.4);
                ">
                <div class="flex items-center justify-center gap-2 mb-1">
                    <div class="h-px flex-1" style="background: linear-gradient(to right, transparent, rgba(184,134,11,0.6));"></div>
                    <span class="text-pub-gold/70 text-[10px]">✦</span>
                    <div class="h-px flex-1" style="background: linear-gradient(to left, transparent, rgba(184,134,11,0.6));"></div>
                </div>

                <div class="font-pub text-pub-gold font-bold tracking-[0.3em] leading-tight animate-flicker"
                    style="font-size: 17px; text-shadow: 0 0 12px rgba(184,134,11,0.4);">
                    THE BLUFF PUB
                </div>

                <div class="flex items-center justify-center gap-2 mt-1 mb-1.5">
                    <div class="h-px flex-1" style="background: linear-gradient(to right, transparent, rgba(184,134,11,0.6));"></div>
                    <span class="text-pub-gold/70 text-[10px]">✦</span>
                    <div class="h-px flex-1" style="background: linear-gradient(to left, transparent, rgba(184,134,11,0.6));"></div>
                </div>

                <div class="font-pub text-pub-cream-dim/60 text-[9px] tracking-[0.6em]">EST. MMXXIV</div>
            </div>
        </div>

        <div class="px-4 py-4 border-b border-pub-gold/20 flex flex-col items-center gap-3">
            <AvatarSelector :onlyView="!!_room.id" :images="avatars" v-model="_room.mainPlayer.avatar"
                :disabled="_game.matchStarted" />
            <TextInput :disabled="_room.id" v-model="_room.mainPlayer.username"
                placeholder="Seu apelido..." label="Jogador:" />
        </div>

        <div class="flex flex-col gap-4 px-4 py-5" v-if="!_room.id">
            <CustomButton label="Abrir Mesa" type="info"
                @click="[createRoom(), $toast.success('Mesa aberta!')]" />

            <div class="flex items-center gap-2">
                <div class="flex-1 h-px bg-pub-gold/25"></div>
                <span class="font-pub text-pub-cream-dim text-xs tracking-widest">OU</span>
                <div class="flex-1 h-px bg-pub-gold/25"></div>
            </div>

            <div class="flex flex-col gap-2">
                <TextInput v-model="_room.enterRoomId" placeholder="Código da mesa"
                    label="Entrar em mesa:" sublabel="" />
                <CustomButton label="Entrar" type="save" @click="joinRoom" />
            </div>
        </div>

        <div class="flex flex-col flex-1 px-4 py-4 gap-4 overflow-y-auto" v-if="_room.id">

            <div class="text-center py-2 rounded"
                style="background: rgba(184,134,11,0.08); border: 1px solid rgba(184,134,11,0.2)">
                <div class="font-pub text-pub-cream-dim text-[10px] tracking-[0.5em] mb-1">CÓDIGO DA MESA</div>
                <div class="font-pub text-pub-gold text-2xl font-bold tracking-[0.4em]">{{ _room.id }}</div>
                <button class="font-pub text-pub-cream-dim/60 text-[10px] tracking-widest hover:text-pub-gold transition-colors mt-1"
                    @click="[copyRoomCodeToClipboard(), $toast.success('Código copiado!')]">
                    copiar ↗
                </button>
            </div>

            <div class="flex items-center gap-2">
                <div class="flex-1 h-px bg-pub-gold/25"></div>
                <span class="font-pub text-pub-gold/60 text-[10px] tracking-[0.4em]">JOGADORES</span>
                <div class="flex-1 h-px bg-pub-gold/25"></div>
            </div>

            <div class="flex flex-col gap-2">
                <div v-for="p in _room.players" :key="p.username"
                    class="flex items-center gap-3 rounded px-3 py-2 transition-colors"
                    style="background: rgba(255,255,255,0.04); border: 1px solid rgba(184,134,11,0.12)">
                    <img :src="avatars[p.avatar as number]" class="w-9 h-9 rounded-full ring-1 ring-pub-gold/30" />
                    <span class="font-pub text-pub-cream text-sm flex-1 truncate">{{ p.username }}</span>
                    <span v-if="p.id === _room.roomOwner?.id" class="text-base">👑</span>
                </div>
            </div>

            <div class="mt-auto pt-4 border-t border-pub-gold/20">
                <CustomButton v-if="_room.mainPlayer.id === _room.roomOwner?.id"
                    label="⚔ Iniciar Partida" type="save" @click="startGame" />
                <p v-else class="text-center font-pub text-pub-cream-dim text-xs italic tracking-wide">
                    Aguardando o dono da mesa...
                </p>
            </div>
        </div>

        <div class="py-3 px-4 border-t border-pub-gold/20 text-center">
            <span class="font-pub text-pub-cream-dim/40 text-[10px] tracking-widest">🃏 BLUFF OR BE BLUFFED 🃏</span>
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

socket.on('player-left', (_room: any, leftPlayer: any) => {
    $toast.info(`${leftPlayer.username} saiu da mesa.`);
});

socket.on('send-notification', ({ type, message }: { type: 'error' | 'info' | 'success', message: string }) => {
    $toast[type](message);
});
</script>
