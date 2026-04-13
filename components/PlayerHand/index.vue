<template>
    <div class="absolute flex flex-col items-center"
        :style="{ ...handPosition(playerCards), filter: isCurrentTurn ? 'drop-shadow(0 0 18px rgba(212,168,32,0.9)) drop-shadow(0 0 6px rgba(212,168,32,0.6))' : undefined, gap: '2px' }">

        <div class="relative flex flex-col items-center">

            <div v-if="showCircle" class="relative w-36 h-36">

                <div class="w-full h-full rounded-full overflow-hidden shadow-2xl"
                    :class="isCurrentTurn ? 'ring-[3px] ring-pub-gold animate-pulse-gold' : 'ring-2 ring-pub-gold/40'"
                    :style="isCurrentTurn ? 'box-shadow: 0 0 20px rgba(212,168,32,0.8)' : ''">
                    <VideoTile v-if="activeStream" :stream="activeStream" :mirror="isMainPlayer" />
                    <img v-else :src="avatars[Number(playerCards.player.avatar)]"
                        class="w-full h-full object-cover" />
                </div>

                <div v-if="!isMainPlayer && enabledPeers.has(playerCards.player.id) && !activeStream"
                    class="absolute inset-0 rounded-full flex items-center justify-center"
                    style="background: rgba(0,0,0,0.5);">
                    <span class="text-pub-gold/70 text-xs font-pub animate-pulse">connecting...</span>
                </div>

                <div class="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
                    <div class="font-pub text-xs tracking-widest px-2 py-0.5 rounded"
                        :style="isCurrentTurn
                            ? 'background: rgba(20,10,0,0.8); border: 1px solid rgba(184,134,11,0.6); color: #f0c040;'
                            : 'background: rgba(0,0,0,0.75); border: 1px solid rgba(184,134,11,0.2); color: #c4a882;'">
                        {{ playerCards.player.username }}
                    </div>
                </div>

                <div v-if="isMainPlayer" class="absolute top-1 right-1 flex gap-1">
                    <template v-if="isEnabled">
                        <button @click="toggleMute"
                            class="w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-lg"
                            :style="isMuted
                                ? 'background: rgba(220,38,38,0.9); border: 1px solid rgba(220,38,38,0.6);'
                                : 'background: rgba(0,0,0,0.85); border: 1px solid rgba(184,134,11,0.4);'">
                            <span class="relative inline-flex">
                                🎙️
                                <span v-if="isMuted" class="muted-slash" />
                            </span>
                        </button>
                        <button @click="toggleCam"
                            class="w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-lg"
                            :style="isCamOff
                                ? 'background: rgba(220,38,38,0.9); border: 1px solid rgba(220,38,38,0.6);'
                                : 'background: rgba(0,0,0,0.85); border: 1px solid rgba(184,134,11,0.4);'">
                            {{ isCamOff ? '📵' : '📷' }}
                        </button>
                        <button @click="disable"
                            class="w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-lg"
                            style="background: rgba(220,38,38,0.85); border: 1px solid rgba(220,38,38,0.5);">
                            ✖
                        </button>
                    </template>
                    <button v-else @click="enable"
                        class="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg"
                        style="background: rgba(0,0,0,0.85); border: 1px solid rgba(184,134,11,0.4);">
                        📷
                    </button>
                </div>

            </div>

            <div v-else class="flex items-center gap-2">
                <div class="font-pub text-xs tracking-widest px-2 py-0.5 rounded"
                    :style="isCurrentTurn
                        ? 'background: rgba(184,134,11,0.25); border: 1px solid rgba(184,134,11,0.6); color: #f0c040;'
                        : 'background: rgba(0,0,0,0.5); border: 1px solid rgba(184,134,11,0.15); color: #c4a882;'">
                    {{ playerCards.player.username }}
                </div>
                <img :src="avatars[Number(playerCards.player.avatar)]"
                    class="w-8 h-8 rounded-full shadow-lg shrink-0"
                    :class="isCurrentTurn ? 'ring-2 ring-pub-gold animate-pulse-gold' : 'ring-2 ring-pub-gold/40'"
                    :style="isCurrentTurn ? 'box-shadow: 0 0 14px rgba(212,168,32,0.8)' : ''" />
            </div>

            <div v-if="activeLifeEvent" class="pointer-events-none select-none"
                style="position: absolute; left: 100%; top: 50%; transform: translateY(-50%); z-index: 100;">
                <div class="gun-shoot" style="position: relative; display: inline-block;">
                    <img :src="gunImg" style="width: 5rem; height: 2.5rem; object-fit: contain; display: block;" />
                    <span class="muzzle-flash" style="position: absolute; top: 50%; right: 100%; font-size: 1.3rem;">💥</span>
                </div>
                <div class="life-float-text font-pub font-black text-sm"
                    :style="{ color: activeLifeEvent.isMainPlayer ? '#f87171' : '#fb923c',
                              textShadow: activeLifeEvent.isMainPlayer ? '0 0 10px rgba(220,38,38,0.9)' : '0 0 10px rgba(251,146,60,0.9)' }">
                    -1 💔
                </div>
            </div>
        </div>

        <div class="flex gap-0.5">
            <span v-for="i in 3" :key="i"
                :class="i <= playerCards.life ? 'opacity-100' : 'opacity-20'"
                class="text-xs transition-opacity duration-500">
                ❤️
            </span>
        </div>

        <div v-if="isMainPlayer" class="flex justify-center items-end" style="margin-left: -20px; margin-top: 12px;">
            <img v-for="(card, i) in playerCards.cards" :key="card.id"
                :id="`card-${card.id}`"
                :src="card.img"
                @click="() => selectCard(card)"
                class="card-item w-16 h-24 rounded-md shadow-xl cursor-pointer ring-1 ring-black/40"
                :class="card.selected ? 'card-selected ring-2 ring-pub-gold shadow-xl' : ''"
                :style="`
                    --rot: ${[-22, -11, 0, 11, 22][i]}deg;
                    transform: rotate(${[-22, -11, 0, 11, 22][i]}deg)
                               translateY(${card.selected ? '-18px' : '0px'});
                    margin-left: ${i === 0 ? '0' : '-30px'};
                    z-index: ${card.selected ? 10 : i};
                `" />
        </div>

        <div v-else class="flex justify-center items-end"
            :style="`transform: rotate(${handRotation(playerCards)}deg); margin-top: ${cardMarginTop};`">
            <img v-for="(card, i) in playerCards.cards" :key="card.id"
                :id="`card-${card.id}`"
                :src="CARD_IMAGES.no_card"
                class="w-14 h-20 rounded-md shadow-lg ring-1 ring-black/50"
                :style="`
                    transform: rotate(${[-22, -11, 0, 11, 22][i]}deg);
                    margin-left: ${i === 0 ? '0' : '-38px'};
                    z-index: ${i};
                    opacity: 0.85;
                `" />
        </div>

        <div v-if="isCurrentTurn && isMainPlayer" class="flex gap-1 mt-1">
            <CustomButton v-if="hasTableCards" label="Bluff!" type="cancel"
                @click="() => dropCards(true)" />
            <CustomButton v-if="!mustCallBluff" label="Play" type="save"
                :disabled="!playerCards.cards.some(c => c.selected)"
                @click="() => dropCards(false)" />
        </div>

    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CARD_IMAGES, selectCard, dropCards, handPosition, handRotation, lifeEvents, _game } from "~/composables/useGame";
import { localStream, peers, enabledPeers, isEnabled, isMuted, isCamOff, enableWebRTC, disableWebRTC, toggleMute, toggleCam } from "~/composables/useWebRTC";
import { avatars } from "~/assets/avatars";
import gunImg from "~/assets/gun.svg";
import type { Hand } from "~/types";

const props = defineProps<{
    playerCards: Hand
    isMainPlayer: boolean
    isCurrentTurn: boolean
    hasTableCards: boolean
}>()

const _room = useRoom();

const showCircle = computed(() =>
    props.isMainPlayer || enabledPeers.has(props.playerCards.player.id)
);

const activeStream = computed<MediaStream | null>(() => {
    if (props.isMainPlayer) return localStream.value;
    return peers[props.playerCards.player.id]?.stream ?? null;
});

const enable = () => { if (_room.id) enableWebRTC(_room.id); };
const disable = () => { if (_room.id) disableWebRTC(_room.id); };

const activeLifeEvent = computed(() => lifeEvents.find(e => e.playerId === props.playerCards.player.id));

const mustCallBluff = computed(() => {
    if (!props.isCurrentTurn || !props.isMainPlayer || !props.hasTableCards) return false;
    if (_game.hands.length !== 2) return false;
    const lastMove = _game.table.moves[_game.table.moves.length - 1];
    if (!lastMove) return false;
    const lastMoverHand = _game.hands.find(h => h.player.id === lastMove.player.id);
    return (lastMoverHand?.cards.length ?? 1) === 0;
});

const cardMarginTop = computed(() => {
    if (props.isMainPlayer) return '0px';
    const rot = handRotation(props.playerCards);
    const rad = (rot * Math.PI) / 180;
    return `${8 + 44 * Math.abs(Math.sin(rad))}px`;
});
</script>

<style scoped>
.muted-slash {
    position: absolute;
    inset: -2px;
    pointer-events: none;
}
.muted-slash::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 140%;
    height: 2px;
    background: #fff;
    transform: translate(-50%, -50%) rotate(-45deg);
    border-radius: 1px;
}

.card-item {
    transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.card-item:not(.card-selected):hover {
    transform: rotate(var(--rot)) translateY(-14px) scale(1.07) !important;
    box-shadow: 0 12px 32px rgba(184,134,11,0.4), 0 0 0 2px rgba(184,134,11,0.55);
    z-index: 20 !important;
}

.card-selected {
    box-shadow: 0 0 24px rgba(184,134,11,0.5), 0 0 0 2px rgba(184,134,11,0.8);
}

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
