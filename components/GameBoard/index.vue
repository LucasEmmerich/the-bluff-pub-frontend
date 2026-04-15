<template>
    <div class="h-full relative overflow-hidden" style="background: #0a0603;">

        <DealingAnimation />

        <div v-if="_room.id" class="absolute" style="left: 16px; bottom: 16px; z-index: 20;">
            <RoomChat :roomId="_room.id" :mainPlayerId="_room.mainPlayer.id" />
        </div>

        <Transition name="vignette">
            <div v-if="vignetteActive" class="absolute inset-0 pointer-events-none z-50"
                style="box-shadow: inset 0 0 120px rgba(220,38,38,0.55);"></div>
        </Transition>

        <div v-if="!_game.hands.length" class="flex items-center justify-center h-full">

            <div v-if="!_room.id" class="flex flex-col items-center gap-6" style="width: 300px;">

                <div class="flex flex-col items-center gap-3 w-full px-6 py-5 rounded-xl"
                    style="background: rgba(255,255,255,0.03); border: 1px solid rgba(184,134,11,0.12);">
                    <AppImage :src="avatars[_room.mainPlayer.avatar as number]"
                        size="64px" rounded="rounded-full" img-class="ring-2 ring-pub-gold/25" />
                    <div class="flex items-center gap-2">
                        <span class="font-pub text-pub-cream/70 text-sm tracking-wide">{{ _room.mainPlayer.username }}</span>
                        <button @click="showEditModal = true"
                            class="w-6 h-6 rounded-full flex items-center justify-center transition-all hover:opacity-70"
                            style="background: rgba(184,134,11,0.08); border: 1px solid rgba(184,134,11,0.3);">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(184,134,11,0.8)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="flex flex-col gap-3 w-full">
                    <CustomButton label="Open Table" type="info"
                        @click="[createRoom(), $toast.success('Table opened!')]" />

                    <div class="flex items-center gap-3">
                        <div class="flex-1 h-px" style="background: rgba(255,255,255,0.08);"></div>
                        <span class="font-pub text-pub-cream-dim/50 text-xs tracking-widest">OR</span>
                        <div class="flex-1 h-px" style="background: rgba(255,255,255,0.08);"></div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <TextInput v-model="_room.enterRoomId" placeholder="Table code" label="Join a table:" />
                        <CustomButton label="Join" type="save" @click="joinRoom" />
                    </div>
                </div>

            </div>

            <div v-else class="flex flex-col items-center gap-6" style="width: 300px;">

                <div class="flex flex-col items-center gap-3 w-full px-4 py-4 rounded-xl"
                    style="background: rgba(184,134,11,0.06); border: 1px solid rgba(184,134,11,0.18);">
                    <span class="font-pub text-[10px] tracking-[0.5em] uppercase" style="color: rgba(184,134,11,0.45);">Table Code</span>
                    <span class="font-pub font-black tracking-[0.3em] text-base" style="color: #f0c040; text-shadow: 0 0 16px rgba(184,134,11,0.35);">{{ _room.id }}</span>
                    <button class="font-pub text-[9px] tracking-[0.2em] uppercase px-3 py-1 rounded-full transition-all duration-200 hover:opacity-80"
                        style="border: 1px solid rgba(184,134,11,0.25); color: rgba(184,134,11,0.6);"
                        @click="[copyRoomCodeToClipboard(), $toast.success('Code copied!')]">
                        Copy Code
                    </button>
                </div>

                <div class="w-full">
                    <div class="font-pub text-pub-cream-dim/40 text-[10px] tracking-[0.5em] uppercase mb-3">Players</div>
                    <div class="flex flex-col gap-2.5" style="height: 158px;">
                        <div v-for="p in _room.players" :key="p.username" class="flex items-center gap-3">
                            <AppImage :src="avatars[p.avatar as number]" size="32px" rounded="rounded-full" img-class="opacity-90" />
                            <span class="font-pub text-pub-cream/80 text-sm flex-1 truncate">{{ p.username }}</span>
                            <span v-if="p.id === _room.roomOwner?.id" class="text-sm opacity-70">👑</span>
                        </div>
                    </div>
                </div>

                <div class="w-full flex flex-col gap-2">
                    <CustomButton v-if="_room.mainPlayer.id === _room.roomOwner?.id"
                        label="⚔ Start Game" type="save" @click="startGame" />
                    <p v-else class="font-pub text-pub-cream-dim/50 text-xs italic tracking-wide text-center w-full flex items-center justify-center rounded border px-2 whitespace-nowrap"
                        style="border-color: rgba(255,255,255,0.06); height: 38px;">
                        Waiting for the table owner...
                    </p>
                    <CustomButton label="Leave Room" type="cancel" @click="leaveRoom" />
                </div>


            </div>

        </div>

        <div v-if="_game.hands.length" class="flex flex-col items-center justify-center h-full">

            <div class="absolute" style="left: 16px; top: 16px; z-index: 10; width: 220px;">
                <GameLog />
            </div>

            <div v-if="_room.leaderboard.length" class="absolute" style="left: 16px; top: 50%; transform: translateY(-50%); z-index: 10;">
                <RoomLeaderboard :entries="_room.leaderboard" />
            </div>

            <div v-if="_game.cardType && !champion()"
                class="absolute pointer-events-none"
                style="right: 24px; top: 24px; z-index: 10;">
                <div class="flex flex-col gap-5 p-5 rounded-2xl"
                    style="background: rgba(8,5,3,0.85); border: 1px solid rgba(255,255,255,0.08); width: 270px; backdrop-filter: blur(10px);">
                    <div class="flex flex-col gap-2">
                        <span class="font-pub text-[11px] tracking-[0.4em] uppercase"
                            style="color: rgba(255,248,238,0.35);">Round Card</span>
                        <div class="flex items-center gap-4">
                            <img :src="CARD_IMAGES[_game.cardType.toLowerCase() as keyof typeof CARD_IMAGES]"
                                class="rounded-lg shadow-lg flex-shrink-0" style="width: 78px; height: 110px; object-fit: cover;" />
                            <div class="flex flex-col gap-1.5">
                                <span class="font-pub font-black tracking-[0.2em] uppercase leading-tight"
                                    style="color: #fff8ee; font-size: 1.3rem;">
                                    {{ _game.cardType }}
                                </span>
                                <span class="font-body text-[13px] leading-snug"
                                    style="color: rgba(255,248,238,0.4);">
                                    Play only {{ _game.cardType }}s this round
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <div class="rounded-full overflow-hidden" style="height: 14px; background: rgba(255,255,255,0.07);">
                            <div class="h-full rounded-full"
                                :style="{
                                    width: gamePhase === 'playing' ? `${(turnTimeLeft / turnDurationS) * 100}%` : '100%',
                                    transition: gamePhase === 'playing' ? 'width 950ms linear, background 0.5s ease' : 'none',
                                    background: gamePhase !== 'playing'
                                        ? 'rgba(255,248,238,0.12)'
                                        : turnTimeLeft <= 5
                                            ? '#ef4444'
                                            : turnTimeLeft <= 10
                                                ? '#f59e0b'
                                                : 'rgba(255,248,238,0.5)'
                                }" />
                        </div>
                        <span class="font-pub text-[11px] tracking-[0.3em] uppercase text-center transition-colors duration-300"
                            :style="{ color: gamePhase === 'playing' && turnTimeLeft <= 5 ? '#f87171' : 'rgba(255,248,238,0.35)' }">
                            {{ gamePhase === 'playing'
                                ? `${turnTimeLeft} second${turnTimeLeft !== 1 ? 's' : ''} left`
                                : gamePhase === 'dealing' ? 'Dealing cards...'
                                : gamePhase === 'revealing' ? 'Revealing...'
                                : 'Next turn...' }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="relative" style="width: min(96vw, 1140px); height: min(82vh, 760px);">

                <GameToast />

                <div id="felt-table" class="absolute inset-0"
                    style="border-radius: 50%;
                           background: radial-gradient(ellipse at 42% 36%, #3a7a3a 0%, #2a5e2a 25%, #1a4020 55%, #0d2412 80%, #060e08 100%);
                           border: 1.5px solid rgba(184,134,11,0.4);
                           box-shadow: inset 0 0 180px rgba(0,0,0,0.45);">
                </div>

                <div v-if="_game.table.cards.length > 0" id="table-cards"
                    class="absolute inset-x-0 top-[46%] flex justify-center gap-2"
                    style="z-index: 3;">
                    <img v-for="(card, i) in _game.table.cards" :key="card.id"
                        :src="_game.revealing ? card.img : CARD_IMAGES.no_card"
                        :id="'table-card-' + card.id"
                        class="w-14 h-20 rounded-md shadow-2xl ring-1 ring-pub-gold/30 animate-card-land"
                        :style="`--rot: ${(i - (_game.table.cards.length - 1) / 2) * 6}deg; animation-delay: ${i * 80}ms`" />
                </div>

                <Transition name="hands-reveal">
                    <div v-show="!dealingActive" class="absolute inset-0 pointer-events-none">
                        <PlayerHand v-for="playerCards in _game.hands" :key="playerCards.player.id"
                            :playerCards="playerCards"
                            :isMainPlayer="playerCards.player.id === _room.mainPlayer.id"
                            :isCurrentTurn="playerCards.player.username === _game.turn"
                            :hasTableCards="_game.table.cards.length > 0"
                            style="pointer-events: all;" />
                    </div>
                </Transition>

            </div>

        </div>

        <Transition name="champion-modal">
            <div v-if="champion()"
                class="absolute inset-0 flex items-center justify-center"
                style="z-index: 30; background: rgba(0,0,0,0.6);">
                <div class="flex flex-col items-center gap-6 px-10 py-8 rounded-2xl"
                    style="background: rgba(10,7,4,0.97); border: 1px solid rgba(184,134,11,0.4); box-shadow: 0 0 60px rgba(0,0,0,0.9); width: 400px; height: 260px; text-align: center;">

                    <div class="flex flex-col items-center gap-1.5">
                        <span class="font-pub tracking-[0.35em] uppercase"
                            style="font-size: 0.65rem; color: rgba(255,248,238,0.35);">
                            Congratulations
                        </span>
                        <span class="font-pub font-black tracking-widest"
                            style="font-size: 1.6rem; color: #f0c040; text-shadow: 0 0 28px rgba(184,134,11,0.6);">
                            {{ champion() }}
                        </span>
                        <span class="font-pub tracking-[0.35em] uppercase"
                            style="font-size: 0.7rem; color: rgba(255,248,238,0.35);">
                            won the match
                        </span>
                    </div>

                    <div class="flex flex-col items-center gap-2 w-full">
                        <CustomButton v-if="_room.mainPlayer.id === _room.roomOwner?.id"
                            label="Play Again" type="info" @click="startGame" />
                        <p v-else class="font-pub text-pub-cream-dim text-xs italic tracking-wide">
                            Waiting for the owner to restart...
                        </p>
                        <CustomButton label="Leave Room" type="cancel" @click="leaveRoom" />
                    </div>
                </div>
            </div>
        </Transition>

        <PlayerSetupModal
            :visible="showEditModal"
            :initialUsername="_room.mainPlayer.username || ''"
            :initialAvatar="_room.mainPlayer.avatar ?? 0"
            @confirm="onEditConfirm"
        />

    </div>
</template>

<script setup lang="ts">
import { champion, startGame, CARD_IMAGES, turnTimeLeft, turnDurationS, vignetteActive, dealingActive, gamePhase } from "~/composables/useGame";
import { createRoom, joinRoom, copyRoomCodeToClipboard } from "~/composables/useRoom";
import { avatars } from "~/assets/avatars";
import { socket } from "~/socket";

const { $toast }: any = useNuxtApp();
const _game = useGame();
const _room = useRoom();
const router = useRouter();

const showEditModal = ref(false);

const onEditConfirm = (username: string, avatar: number) => {
    localStorage.setItem('bluffpub_username', username);
    localStorage.setItem('bluffpub_avatar', String(avatar));
    _room.mainPlayer.username = username;
    _room.mainPlayer.avatar = avatar;
    showEditModal.value = false;
};

const leaveRoom = () => {
    socket.emit('left-room', _room);
    _room.id = undefined;
    _room.enterRoomId = undefined;
    _room.players = [];
    _room.roomOwner = undefined;
    _room.leaderboard = [];
};
</script>

<style scoped>
.vignette-enter-active { transition: opacity 0.08s ease; }
.vignette-leave-active { transition: opacity 0.85s ease; }
.vignette-enter-from, .vignette-leave-to { opacity: 0; }
.vignette-enter-to, .vignette-leave-from { opacity: 1; }

.hands-reveal-enter-active { transition: opacity 0.6s ease 0.3s; }
.hands-reveal-enter-from { opacity: 0; }
.hands-reveal-enter-to { opacity: 1; }

.phase-label-enter-active { transition: opacity 0.3s ease; }
.phase-label-leave-active { transition: opacity 0.2s ease; }
.phase-label-enter-from, .phase-label-leave-to { opacity: 0; }
.phase-label-enter-to, .phase-label-leave-from { opacity: 1; }

.champion-modal-enter-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.champion-modal-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.champion-modal-enter-from { opacity: 0; transform: scale(0.92); }
.champion-modal-enter-to { opacity: 1; transform: scale(1); }
.champion-modal-leave-from { opacity: 1; transform: scale(1); }
.champion-modal-leave-to { opacity: 0; transform: scale(0.92); }
</style>
