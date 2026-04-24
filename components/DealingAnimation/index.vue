<template>
    <Transition name="dealing-overlay">
        <div v-if="dealingActive" class="absolute inset-0 pointer-events-none" style="z-index: 30">
            <div ref="containerRef" class="absolute inset-0">
                <img
                    v-for="card in flyingCards"
                    :key="card.id"
                    :ref="
                        (el) => {
                            if (el) cardEls[card.id] = el as HTMLElement;
                        }
                    "
                    :src="CARD_IMAGES.no_card"
                    class="rounded-md shadow-2xl ring-1 ring-pub-gold/30"
                    style="position: absolute; width: 4.5rem; height: 6.4rem; object-fit: cover; opacity: 0"
                />
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { CARD_IMAGES, dealingActive, TABLE_RX, TABLE_RY, getOpponentAngles } from "~/composables/useGame";

const _game = useGame();
const _room = useRoom();

const containerRef = ref<HTMLElement | null>(null);
const cardEls = ref<Record<number, HTMLElement>>({});

const CARDS_PER_PLAYER = 5;

const flyingCards = computed(() => {
    const cards: { id: number; playerIndex: number }[] = [];
    for (let round = 0; round < CARDS_PER_PLAYER; round++) {
        _game.hands.forEach((_, i) => {
            cards.push({ id: round * _game.hands.length + i, playerIndex: i });
        });
    }
    return cards;
});

const getPlayerCenter = (index: number, containerRect: DOMRect) => {
    const tableEl = document.getElementById("felt-table");
    const tableRect = tableEl?.getBoundingClientRect();
    const fallback = { x: containerRect.width / 2, y: containerRect.height / 2 };

    const hand = _game.hands[index];
    if (!hand || !tableRect) return fallback;

    const tL = tableRect.left - containerRect.left;
    const tT = tableRect.top - containerRect.top;
    const tW = tableRect.width;
    const tH = tableRect.height;

    const isMain = hand.player.id === _room.mainPlayer.id;
    if (isMain) return { x: tL + tW * 0.5, y: tT + tH * (0.5 + TABLE_RY / 100) };

    const others = _game.hands.filter((h) => h.player.id !== _room.mainPlayer.id);
    const otherIndex = others.findIndex((h) => h.player.id === hand.player.id);
    const angles = getOpponentAngles(others.length);
    const deg = angles[otherIndex] ?? 270;
    const rad = (deg * Math.PI) / 180;
    return {
        x: tL + tW * (0.5 + (TABLE_RX / 100) * Math.cos(rad)),
        y: tT + tH * (0.5 + (TABLE_RY / 100) * Math.sin(rad)),
    };
};

watch(dealingActive, async (active) => {
    if (!active) return;
    await nextTick();

    const container = containerRef.value;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    const originX = containerRect.width / 2 - 25;
    const originY = containerRect.height / 2 - 38;

    flyingCards.value.forEach((card, i) => {
        const el = cardEls.value[card.id];
        if (!el) return;

        const dest = getPlayerCenter(card.playerIndex, containerRect);
        const destX = dest.x - 25;
        const destY = dest.y - 38;

        const dx = destX - originX;
        const dy = destY - originY;

        el.style.left = `${originX}px`;
        el.style.top = `${originY}px`;

        const delay = 200 + i * 180;

        el.animate(
            [
                { opacity: 0, transform: "translate(0, 0) scale(0.75) rotate(-8deg)" },
                { opacity: 1, transform: "translate(0, 0) scale(1.05) rotate(0deg)", offset: 0.08 },
                {
                    opacity: 1,
                    transform: `translate(${dx}px, ${dy}px) scale(0.9) rotate(${(Math.random() - 0.5) * 16}deg)`,
                },
            ],
            {
                duration: 750,
                delay,
                easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
                fill: "forwards",
            }
        );
    });
});
</script>

<style scoped>
.dealing-overlay-leave-active {
    transition: opacity 0.8s ease;
}
.dealing-overlay-leave-to {
    opacity: 0;
}
</style>
