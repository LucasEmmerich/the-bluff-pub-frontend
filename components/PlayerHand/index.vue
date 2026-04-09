<template>
    <div class="absolute flex flex-col items-center gap-1"
        :style="{ ...handPosition(playerCards), filter: isCurrentTurn ? 'drop-shadow(0 0 12px rgba(212,168,32,0.6))' : undefined }">

        <div class="flex items-center gap-2">
            <div class="font-pub text-xs tracking-widest px-2 py-0.5 rounded"
                :style="isCurrentTurn
                    ? 'background: rgba(184,134,11,0.25); border: 1px solid rgba(184,134,11,0.6); color: #f0c040;'
                    : 'background: rgba(0,0,0,0.5); border: 1px solid rgba(184,134,11,0.15); color: #c4a882;'">
                {{ playerCards.player.username }}
            </div>
            <img :src="avatars[Number(playerCards.player.avatar)]"
                class="w-8 h-8 rounded-full ring-2 ring-pub-gold/40 shadow-lg shrink-0"
                :style="isCurrentTurn ? 'box-shadow: 0 0 10px rgba(212,168,32,0.5)' : ''" />
            <div class="pointer-events-none select-none shrink-0" style="width: 5rem; height: 2.5rem; position: relative;">
                <template v-if="activeLifeEvent">
                    <div class="gun-shoot" style="position: absolute; inset: 0;">
                        <img :src="gunImg" style="width: 5rem; height: 2.5rem; object-fit: contain; display: block;" />
                        <span class="muzzle-flash" style="position: absolute; top: 50%; right: 100%; font-size: 1.3rem;">💥</span>
                    </div>
                    <div class="life-float-text font-pub font-black text-sm"
                        :style="{ color: activeLifeEvent.isMainPlayer ? '#f87171' : '#fb923c',
                                  textShadow: activeLifeEvent.isMainPlayer ? '0 0 10px rgba(220,38,38,0.9)' : '0 0 10px rgba(251,146,60,0.9)' }">
                        -1 💔
                    </div>
                </template>
            </div>
        </div>

        <div class="flex gap-0.5">
            <span v-for="i in 3" :key="i"
                :class="i <= playerCards.life ? 'opacity-100' : 'opacity-20'"
                class="text-xs transition-opacity duration-500">
                ❤️
            </span>
        </div>

        <div v-if="isMainPlayer" class="flex justify-center items-end" style="gap: -40px; margin-left: -20px;">
            <img v-for="(card, i) in playerCards.cards" :key="card.id"
                :id="`card-${card.id}`"
                :src="card.img"
                @click="() => selectCard(card)"
                class="w-16 h-24 rounded-md shadow-xl transition-all duration-200 cursor-pointer ring-1 ring-black/40"
                :class="card.selected ? 'ring-2 ring-blue-400 shadow-blue-500/40 shadow-xl' : 'hover:ring-pub-gold/30'"
                :style="`
                    transform: rotate(${[-15, -7.5, 0, 7.5, 15][i]}deg)
                               translateY(${card.selected ? '-12px' : '0px'});
                    margin-left: ${i === 0 ? '0' : '-28px'};
                    z-index: ${card.selected ? 10 : i};
                `" />
        </div>

        <div v-else :style="`transform: rotate(${handRotation(playerCards)}deg)`"
            class="flex justify-center items-end">
            <img v-for="(card, i) in playerCards.cards" :key="card.id"
                :id="`card-${card.id}`"
                :src="CARD_IMAGES.no_card"
                class="w-14 h-20 rounded-md shadow-lg ring-1 ring-black/50"
                :style="`
                    transform: rotate(${[-15, -7.5, 0, 7.5, 15][i]}deg);
                    margin-left: ${i === 0 ? '0' : '-24px'};
                    z-index: ${i};
                    opacity: 0.85;
                `" />
        </div>

        <div v-if="isCurrentTurn && isMainPlayer" class="flex gap-1 mt-1">
            <CustomButton v-if="hasTableCards" label="Mentira!" type="cancel"
                @click="() => dropCards(true)" />
            <CustomButton label="Jogar" type="save"
                :disabled="!playerCards.cards.some(c => c.selected)"
                @click="() => dropCards(false)" />
        </div>

        <div v-if="isCurrentTurn && !isMainPlayer"
            class="w-2 h-2 rounded-full bg-pub-gold mt-1 animate-pulse-gold">
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CARD_IMAGES, selectCard, dropCards, handPosition, handRotation, lifeEvents } from "~/composables/useGame";
import { avatars } from "~/assets/avatars";
import gunImg from "~/assets/gun.svg";
import type { Hand } from "~/types";

const props = defineProps<{
    playerCards: Hand
    isMainPlayer: boolean
    isCurrentTurn: boolean
    hasTableCards: boolean
}>()

const activeLifeEvent = computed(() => lifeEvents.find(e => e.playerId === props.playerCards.player.id));
</script>

<style scoped>
.gun-shoot {
    transform-origin: right center;
    animation: gun-shoot 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes gun-shoot {
    0%   { opacity: 0; transform: scale(0.5) rotate(-8deg); }
    10%  { opacity: 1; transform: scale(1) rotate(0deg); }
    22%  { opacity: 1; transform: rotate(0deg); }
    36%  { opacity: 1; transform: rotate(45deg); }
    55%  { opacity: 1; transform: rotate(28deg); }
    72%  { opacity: 1; transform: rotate(14deg); }
    88%  { opacity: 0.7; transform: rotate(4deg); }
    100% { opacity: 0;  transform: rotate(0deg) scale(0.9); }
}

.muzzle-flash {
    transform: translateY(-50%);
    animation: muzzle-flash 0.5s ease-out 0.62s forwards;
    opacity: 0;
}

@keyframes muzzle-flash {
    0%   { opacity: 0; transform: translateY(-50%) scale(0.3); }
    25%  { opacity: 1; transform: translateY(-50%) scale(1.6); }
    100% { opacity: 0; transform: translateY(-50%) scale(0.8); }
}

.life-float-text {
    position: absolute;
    left: 50%;
    top: 0;
    white-space: nowrap;
    opacity: 0;
    animation: life-float 2.5s ease-out 1s forwards;
}

@keyframes life-float {
    0%   { opacity: 1; transform: translateX(-50%) scale(1.2); }
    20%  { opacity: 1; transform: translateX(-50%) translateY(-22px) scale(1.25); }
    65%  { opacity: 0.9; transform: translateX(-50%) translateY(-55px) scale(1); }
    100% { opacity: 0;   transform: translateX(-50%) translateY(-80px) scale(0.85); }
}
</style>
