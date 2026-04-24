<template>
    <div
        class="absolute"
        :class="isMainPlayer ? 'flex flex-col items-center' : 'flex items-center gap-1'"
        :style="{
            ...positionStyle,
            filter: isCurrentTurn
                ? 'drop-shadow(0 0 18px rgba(212,168,32,0.9)) drop-shadow(0 0 6px rgba(212,168,32,0.6))'
                : undefined,
        }"
    >
        <div class="flex flex-col gap-1" :style="flip && !isMainPlayer ? 'order: 1' : ''">
            <div v-if="isMainPlayer" class="flex justify-center gap-2" style="margin-bottom: 4px">
                <img
                    v-for="(card, i) in playerCards.cards"
                    :key="card.id"
                    :id="`card-${card.id}`"
                    :src="card.img"
                    @click="() => selectCard(card)"
                    class="card-item rounded-md shadow-xl cursor-pointer ring-1 ring-black/40"
                    :class="card.selected ? 'card-selected ring-2 ring-pub-gold shadow-xl' : ''"
                    style="width: 68px; height: 97px; transform-origin: bottom center"
                    :style="`transform: translateY(${card.selected ? '-16px' : '0px'}); z-index: ${card.selected ? 10 : i};`"
                />
            </div>

            <div class="relative flex flex-col items-center">
                <div class="flex items-center gap-2 w-full">
                    <div v-if="showCircle" class="relative" :style="`width: ${avatarPx}px; height: ${avatarPx}px;`">
                        <div
                            class="w-full h-full rounded-full overflow-hidden shadow-2xl"
                            :class="
                                isCurrentTurn
                                    ? 'ring-[3px] ring-pub-gold animate-pulse-gold'
                                    : 'ring-2 ring-pub-gold/40'
                            "
                            :style="isCurrentTurn ? 'box-shadow: 0 0 20px rgba(212,168,32,0.8)' : ''"
                        >
                            <VideoTile
                                v-if="activeStream && (!isMainPlayer || isCamEnabled)"
                                :stream="activeStream"
                                :mirror="isMainPlayer"
                            />
                            <img
                                v-else
                                :src="avatars[Number(playerCards.player.avatar)]"
                                class="w-full h-full object-cover"
                            />
                        </div>

                        <div
                            v-if="!isMainPlayer && enabledPeers.has(playerCards.player.id ?? '') && !activeStream"
                            class="absolute inset-0 rounded-full flex items-center justify-center"
                            style="background: rgba(0, 0, 0, 0.5)"
                        >
                            <span class="text-pub-gold/70 text-xs font-pub animate-pulse">connecting...</span>
                        </div>
                    </div>

                    <div
                        v-if="isMainPlayer"
                        class="flex flex-col items-center justify-between"
                        style="flex: 1; min-width: 0; gap: 6px"
                    >
                        <div class="flex gap-0.5 justify-center">
                            <span
                                v-for="i in 3"
                                :key="i"
                                :class="i <= playerCards.life ? 'opacity-100' : 'opacity-20'"
                                class="text-base transition-opacity duration-500"
                            >
                                ❤️
                            </span>
                        </div>
                        <div
                            class="font-pub text-xs tracking-widest px-2 py-0.5 rounded text-center w-full truncate"
                            :style="
                                isCurrentTurn
                                    ? 'background: rgba(20,10,0,0.8); border: 1px solid rgba(184,134,11,0.6); color: #f0c040;'
                                    : 'background: rgba(0,0,0,0.75); border: 1px solid rgba(184,134,11,0.2); color: #c4a882;'
                            "
                        >
                            {{ playerCards.player.username }}
                        </div>
                    </div>

                    <div v-if="isMainPlayer" class="flex flex-col gap-1">
                        <button
                            class="action-btn flex items-center gap-2 px-3.5 rounded-lg font-pub"
                            style="background: rgba(20, 110, 20, 0.85); border: 1px solid rgba(100, 200, 100, 0.35)"
                            :disabled="!isMainPlayerTurn || mustCallBluff || !mainPlayerSelectedCards"
                            @click="dropCards(false)"
                        >
                            <span style="font-size: 1.1rem">🃏</span>
                            <span class="tracking-wider" style="font-size: 9px; color: #86efac; font-weight: 700"
                                >PLAY</span
                            >
                        </button>
                        <button
                            class="action-btn flex items-center gap-2 px-3.5 rounded-lg font-pub"
                            style="background: rgba(180, 20, 20, 0.85); border: 1px solid rgba(255, 100, 100, 0.35)"
                            :disabled="!isMainPlayerTurn || !hasTableCards"
                            @click="dropCards(true)"
                        >
                            <span style="font-size: 1.1rem">🫵</span>
                            <span class="tracking-wider" style="font-size: 9px; color: #fca5a5; font-weight: 700"
                                >LIAR!</span
                            >
                        </button>
                        <button
                            class="action-btn flex items-center gap-2 px-3.5 rounded-lg font-pub"
                            style="background: rgba(160, 10, 10, 0.7); border: 1px solid rgba(220, 50, 50, 0.35)"
                            @click="confirmGiveUp = true"
                        >
                            <span style="font-size: 1.1rem">🏳️</span>
                            <span
                                class="tracking-wider"
                                style="font-size: 9px; color: rgba(255, 160, 160, 0.85); font-weight: 700"
                                >GIVE UP</span
                            >
                        </button>
                    </div>
                </div>

                <div
                    v-if="activeLifeEvent"
                    class="pointer-events-none select-none"
                    style="position: absolute; left: 50%; top: 0; z-index: 100"
                >
                    <div
                        class="life-float-text font-pub font-black text-sm"
                        :style="{
                            color: activeLifeEvent.isMainPlayer ? '#f87171' : '#fb923c',
                            textShadow: activeLifeEvent.isMainPlayer
                                ? '0 0 10px rgba(220,38,38,0.9)'
                                : '0 0 10px rgba(251,146,60,0.9)',
                        }"
                    >
                        -1 💔
                    </div>
                </div>
            </div>

            <div
                v-if="!isMainPlayer"
                class="font-pub text-xs tracking-widest px-2 py-0.5 rounded text-center"
                :style="
                    isCurrentTurn
                        ? 'background: rgba(20,10,0,0.8); border: 1px solid rgba(184,134,11,0.6); color: #f0c040;'
                        : 'background: rgba(0,0,0,0.75); border: 1px solid rgba(184,134,11,0.2); color: #c4a882;'
                "
            >
                {{ playerCards.player.username }}
            </div>

            <div v-if="!isMainPlayer" class="flex gap-0.5 justify-center" style="margin-top: 2px">
                <span
                    v-for="i in 3"
                    :key="i"
                    :class="i <= playerCards.life ? 'opacity-100' : 'opacity-20'"
                    class="text-xs transition-opacity duration-500"
                >
                    ❤️
                </span>
            </div>

            <Teleport to="body">
                <div
                    v-if="confirmGiveUp && isMainPlayer"
                    class="fixed inset-0 flex items-center justify-center"
                    style="z-index: 200; background: rgba(0, 0, 0, 0.6)"
                >
                    <div
                        class="flex flex-col items-center gap-4 px-8 py-6 rounded-2xl font-pub"
                        style="
                            background: rgba(120, 10, 10, 0.97);
                            border: 1px solid rgba(220, 50, 50, 0.4);
                            box-shadow: 0 0 60px rgba(180, 0, 0, 0.5);
                        "
                    >
                        <span class="text-base tracking-widest" style="color: #f0c040">Give up?</span>
                        <span class="text-xs text-center" style="color: rgba(196, 168, 130, 0.6); max-width: 180px"
                            >You'll be eliminated from this match but stay in the room.</span
                        >
                        <div class="flex gap-3">
                            <button
                                class="action-btn px-4 py-1.5 rounded-xl text-xs tracking-wider"
                                style="
                                    background: rgba(180, 20, 20, 0.85);
                                    border: 1px solid rgba(255, 100, 100, 0.35);
                                    color: #fca5a5;
                                "
                                @click="[giveUp(), (confirmGiveUp = false)]"
                            >
                                🏳️ Yes, give up
                            </button>
                            <button
                                class="action-btn px-4 py-1.5 rounded-xl text-xs tracking-wider"
                                style="
                                    background: rgba(0, 0, 0, 0.6);
                                    border: 1px solid rgba(184, 134, 11, 0.3);
                                    color: rgba(196, 168, 130, 0.8);
                                "
                                @click="confirmGiveUp = false"
                            >
                                Keep playing
                            </button>
                        </div>
                    </div>
                </div>
            </Teleport>
        </div>

        <div
            v-if="!isMainPlayer"
            class="flex mx-5"
            style="min-width: 80px; min-height: 60px"
            :style="flip ? 'order: 0; justify-content: flex-end;' : ''"
        >
            <img
                v-for="(card, i) in playerCards.cards"
                :key="card.id"
                :src="gamePhase === 'revealing' ? card.img : CARD_IMAGES.no_card"
                class="rounded shadow-lg ring-1 ring-black/50 transition-all duration-500"
                style="width: 58px; height: 83px; opacity: 0.9; transform-origin: bottom center"
                :style="`
                    transform: rotate(${[-32, -16, 0, 16, 32][i]}deg);
                    margin-left: ${i === 0 ? '0' : '-47px'};
                    z-index: ${i};
                `"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
    CARD_IMAGES,
    selectCard,
    handPosition,
    handFlip,
    lifeEvents,
    gamePhase,
    dropCards,
    giveUp,
    _game,
} from "~/composables/useGame";
import { localStream, peers, enabledPeers, isCamEnabled } from "~/composables/useWebRTC";
import { avatars } from "~/assets/avatars";
import type { Hand } from "~/types";

const props = defineProps<{
    playerCards: Hand;
    isMainPlayer: boolean;
    isCurrentTurn: boolean;
    hasTableCards: boolean;
}>();

const avatarPx = computed(() => {
    const n = _game.hands.length;
    if (n <= 2) return 120;
    if (n <= 4) return 100;
    if (n <= 6) return 86;
    return 72;
});

const flip = computed(() => handFlip(props.playerCards));

const positionStyle = computed(() => {
    const pos = handPosition(props.playerCards);
    if (props.isMainPlayer) return { ...pos, transform: "translate(-50%, -100%)" };
    return pos;
});

const showCircle = computed(() => true);

const activeStream = computed<MediaStream | null>(() => {
    if (props.isMainPlayer) return localStream.value;
    const peerId = props.playerCards.player.id;
    return peers[peerId as any]?.stream ?? null;
});

const activeLifeEvent = computed(() => lifeEvents.find((e) => e.playerId === props.playerCards.player.id));

const confirmGiveUp = ref(false);

const _room = useRoom();

const isMainPlayerTurn = computed(() => {
    const hand = _game.hands.find((h) => h.player.id === _room.mainPlayer.id);
    return hand?.player.username === _game.turn;
});

const mustCallBluff = computed(() => {
    if (!isMainPlayerTurn.value || !props.hasTableCards) return false;
    if (_game.hands.length !== 2) return false;
    const lastMove = _game.table.moves[_game.table.moves.length - 1];
    if (!lastMove) return false;
    const lastMoverHand = _game.hands.find((h) => h.player.id === lastMove.player.id);
    return (lastMoverHand?.cards.length ?? 1) === 0;
});

const mainPlayerSelectedCards = computed(
    () => _game.hands.find((h) => h.player.id === _room.mainPlayer.id)?.cards.some((c) => c.selected) ?? false
);
</script>

<style scoped>
.muted-slash {
    position: absolute;
    inset: -2px;
    pointer-events: none;
}

.muted-slash::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 140%;
    height: 2px;
    background: #fff;
    transform: translate(-50%, -50%) rotate(-45deg);
    border-radius: 1px;
}

.action-btn {
    transition:
        opacity 0.15s ease,
        transform 0.15s ease;
    cursor: pointer;
}

.action-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.action-btn:not(:disabled):hover {
    transform: scale(1.08);
}

.action-btn:not(:disabled):active {
    transform: scale(0.95);
}

.card-item {
    transition:
        transform 0.18s ease,
        box-shadow 0.18s ease;
}

.card-item:not(.card-selected):hover {
    transform: translateY(-14px) scale(1.07) !important;
    box-shadow:
        0 12px 32px rgba(184, 134, 11, 0.4),
        0 0 0 2px rgba(184, 134, 11, 0.55);
    z-index: 20 !important;
}

.card-selected {
    box-shadow:
        0 0 24px rgba(184, 134, 11, 0.5),
        0 0 0 2px rgba(184, 134, 11, 0.8);
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
    0% {
        opacity: 1;
        transform: translateX(-50%) scale(1.2);
    }

    20% {
        opacity: 1;
        transform: translateX(-50%) translateY(-22px) scale(1.25);
    }

    65% {
        opacity: 0.9;
        transform: translateX(-50%) translateY(-55px) scale(1);
    }

    100% {
        opacity: 0;
        transform: translateX(-50%) translateY(-80px) scale(0.85);
    }
}
</style>
