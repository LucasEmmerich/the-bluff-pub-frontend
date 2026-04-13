<template>
    <div class="flex-1 relative overflow-hidden" style="background: #09080c;">

        <DealingAnimation />

        <Transition name="vignette">
            <div v-if="vignetteActive" class="absolute inset-0 pointer-events-none z-50"
                style="box-shadow: inset 0 0 120px rgba(220,38,38,0.55);"></div>
        </Transition>

        <div v-if="_game.hands.length" class="flex flex-col items-center justify-center h-full">

            <Transition name="card-type-bar">
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
                        <div class="rounded-full overflow-hidden" style="height: 14px; background: rgba(255,255,255,0.07);">
                            <div class="h-full rounded-full transition-all duration-[950ms] ease-linear"
                                :style="{
                                    width: `${(turnTimeLeft / 20) * 100}%`,
                                    background: turnTimeLeft <= 5
                                        ? '#ef4444'
                                        : turnTimeLeft <= 10
                                            ? '#f59e0b'
                                            : 'rgba(255,248,238,0.5)'
                                }" />
                        </div>
                    </div>
                </div>
            </Transition>

            <div class="relative" style="width: min(96vw, 1140px); height: min(82vh, 760px);">

                <GameToast />

                <div id="felt-table" class="absolute inset-0"
                    style="border-radius: 50%;
                           background: radial-gradient(ellipse at 42% 36%, #f0d090 0%, #ddb060 25%, #c08030 55%, #7a4a18 80%, #3a2008 100%);
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
                <div class="flex flex-col items-center gap-6 px-14 py-10 rounded-2xl"
                    style="background: rgba(10,7,4,0.98); border: 1px solid rgba(184,134,11,0.5); box-shadow: 0 0 80px rgba(0,0,0,0.95), 0 0 40px rgba(184,134,11,0.12); min-width: 320px;">

                    <div class="text-7xl" style="filter: drop-shadow(0 0 24px rgba(184,134,11,0.7));">🏆</div>

                    <div class="flex items-center gap-3 w-64">
                        <div class="flex-1 h-px" style="background: linear-gradient(to right, transparent, rgba(184,134,11,0.55));"></div>
                        <span class="text-pub-gold/50 text-xs">✦</span>
                        <div class="flex-1 h-px" style="background: linear-gradient(to left, transparent, rgba(184,134,11,0.55));"></div>
                    </div>

                    <div class="text-center">
                        <div class="font-pub text-pub-gold text-5xl font-black tracking-widest animate-pulse-gold"
                            style="text-shadow: 0 0 30px rgba(184,134,11,0.7);">
                            {{ champion() }}
                        </div>
                        <div class="font-pub text-pub-cream/60 text-sm tracking-[0.4em] uppercase mt-2">
                            won the match
                        </div>
                    </div>

                    <div class="flex items-center gap-3 w-64">
                        <div class="flex-1 h-px" style="background: linear-gradient(to right, transparent, rgba(184,134,11,0.55));"></div>
                        <span class="text-pub-gold/50 text-xs">✦</span>
                        <div class="flex-1 h-px" style="background: linear-gradient(to left, transparent, rgba(184,134,11,0.55));"></div>
                    </div>

                    <div class="flex flex-col items-center gap-3 w-full">
                        <CustomButton v-if="_room.mainPlayer.id === _room.roomOwner?.id"
                            label="⚔ Play Again" type="info" @click="startGame" />
                        <p v-else class="font-pub text-pub-cream-dim text-xs italic tracking-wide">
                            Waiting for the owner to restart...
                        </p>
                        <CustomButton label="Leave Room" type="cancel" @click="leaveRoom" />
                    </div>
                </div>
            </div>
        </Transition>

    </div>
</template>

<script setup lang="ts">
import { champion, startGame, CARD_IMAGES, turnTimeLeft, vignetteActive, dealingActive } from "~/composables/useGame";
import { socket } from "~/socket";

const _game = useGame();
const _room = useRoom();
const router = useRouter();

const leaveRoom = () => {
    socket.emit('left-room', _room);
    router.push('/');
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

.card-type-bar-enter-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.card-type-bar-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.card-type-bar-enter-from { opacity: 0; transform: translateX(10px); }
.card-type-bar-enter-to { opacity: 1; transform: translateX(0); }
.card-type-bar-leave-from { opacity: 1; transform: translateX(0); }
.card-type-bar-leave-to { opacity: 0; transform: translateX(10px); }

.champion-modal-enter-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.champion-modal-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.champion-modal-enter-from { opacity: 0; transform: scale(0.92); }
.champion-modal-enter-to { opacity: 1; transform: scale(1); }
.champion-modal-leave-from { opacity: 1; transform: scale(1); }
.champion-modal-leave-to { opacity: 0; transform: scale(0.92); }
</style>
