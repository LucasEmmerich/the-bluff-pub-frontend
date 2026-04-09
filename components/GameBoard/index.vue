<template>
    <div class="flex-1 relative overflow-hidden"
        style="background: radial-gradient(ellipse at 50% 30%, #1e0e06 0%, #0a0603 65%);">

        <DealingAnimation />

        <Transition name="vignette">
            <div v-if="vignetteActive" class="absolute inset-0 pointer-events-none z-50"
                style="box-shadow: inset 0 0 120px rgba(220,38,38,0.55);"></div>
        </Transition>

        <div v-if="_game.hands.length && !champion()" class="flex flex-col items-center justify-center h-full gap-6">

            <div class="relative" style="width: min(88vw, 920px); height: min(76vh, 620px);">

                <GameToast />


                <div id="felt-table" class="absolute inset-0"
                    style="border-radius: 50%;
                           background: radial-gradient(ellipse at 50% 40%, #1f5c3a 0%, #0f3d22 50%, #082618 100%);
                           border: 3px solid #b8860b;
                           box-shadow: 0 0 80px rgba(0,0,0,0.95),
                                       0 0 40px rgba(184,134,11,0.12),
                                       inset 0 0 100px rgba(0,0,0,0.6);">
                </div>

                <div v-if="_game.cardType"
                    class="absolute inset-x-0 top-[38%] flex justify-center items-center gap-3 pointer-events-none"
                    style="z-index: 2;">
                    <div class="font-pub text-pub-gold text-sm tracking-[0.3em] uppercase px-5 py-1.5 rounded"
                        style="background: rgba(8,20,12,0.85); border: 1px solid rgba(184,134,11,0.4);">
                        {{ _game.cardType }}'s table
                    </div>
                    <div class="font-pub text-sm font-bold w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-500"
                        :style="{
                            background: 'rgba(8,20,12,0.85)',
                            border: `1px solid ${turnTimeLeft <= 5 ? 'rgba(220,38,38,0.7)' : 'rgba(184,134,11,0.4)'}`,
                            color: turnTimeLeft <= 5 ? '#f87171' : '#b8860b',
                            animation: turnTimeLeft <= 5 ? 'pulse 0.8s ease-in-out infinite' : 'none',
                        }">
                        {{ turnTimeLeft }}
                    </div>
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
                        <PlayerHand v-for="(playerCards, i) in _game.hands" :key="i"
                            :playerCards="playerCards"
                            :isMainPlayer="playerCards.player.id === _room.mainPlayer.id"
                            :isCurrentTurn="playerCards.player.username === _game.turn"
                            :hasTableCards="_game.table.cards.length > 0"
                            style="pointer-events: all;" />
                    </div>
                </Transition>
            </div>

        </div>

        <div v-else-if="champion()" class="flex flex-col items-center justify-center h-full gap-6 px-8">

            <div class="text-7xl animate-bounce" style="filter: drop-shadow(0 0 24px rgba(184,134,11,0.6));">🏆</div>

            <div class="flex items-center gap-3 w-full max-w-xs">
                <div class="flex-1 h-px" style="background: linear-gradient(to right, transparent, rgba(184,134,11,0.6));"></div>
                <span class="text-pub-gold/60 text-xs">✦</span>
                <div class="flex-1 h-px" style="background: linear-gradient(to left, transparent, rgba(184,134,11,0.6));"></div>
            </div>

            <div class="text-center">
                <div class="font-pub text-pub-gold text-5xl font-black tracking-widest animate-pulse-gold"
                    style="text-shadow: 0 0 40px rgba(184,134,11,0.7);">
                    {{ champion() }}
                </div>
                <div class="font-pub text-pub-cream/70 text-sm tracking-[0.4em] uppercase mt-2">
                    venceu a partida
                </div>
            </div>

            <div class="flex items-center gap-3 w-full max-w-xs">
                <div class="flex-1 h-px" style="background: linear-gradient(to right, transparent, rgba(184,134,11,0.6));"></div>
                <span class="text-pub-gold/60 text-xs">✦</span>
                <div class="flex-1 h-px" style="background: linear-gradient(to left, transparent, rgba(184,134,11,0.6));"></div>
            </div>

            <CustomButton v-if="_room.mainPlayer.id === _room.roomOwner?.id"
                label="⚔ Jogar Novamente" type="info" @click="startGame" />
            <p v-else class="font-pub text-pub-cream-dim text-xs italic tracking-wide">
                Aguardando o dono reiniciar...
            </p>
        </div>

    </div>
</template>

<script setup lang="ts">
import { champion, startGame, CARD_IMAGES, turnTimeLeft, vignetteActive, dealingActive } from "~/composables/useGame";

const _game = useGame();
const _room = useRoom();
</script>

<style scoped>
.vignette-enter-active { transition: opacity 0.08s ease; }
.vignette-leave-active { transition: opacity 0.85s ease; }
.vignette-enter-from, .vignette-leave-to { opacity: 0; }
.vignette-enter-to, .vignette-leave-from { opacity: 1; }

.hands-reveal-enter-active { transition: opacity 0.6s ease 0.3s; }
.hands-reveal-enter-from { opacity: 0; }
.hands-reveal-enter-to { opacity: 1; }
</style>
