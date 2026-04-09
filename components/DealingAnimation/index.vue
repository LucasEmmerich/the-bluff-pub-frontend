<template>
    <Transition name="dealing-overlay">
        <div v-if="dealingActive" class="absolute inset-0 pointer-events-none" style="z-index: 30;">

            <div ref="containerRef" class="absolute inset-0">
                <img
                    v-for="card in flyingCards" :key="card.id"
                    :ref="el => { if (el) cardEls[card.id] = el as HTMLElement }"
                    :src="CARD_IMAGES.no_card"
                    class="rounded-md shadow-2xl ring-1 ring-pub-gold/30"
                    style="position: absolute; width: 3.2rem; height: 4.8rem; object-fit: cover; opacity: 0;"
                />
            </div>

        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { CARD_IMAGES, dealingActive } from '~/composables/useGame';

const _game = useGame();
const _room = useRoom();

const containerRef = ref<HTMLElement | null>(null);
const cardEls = ref<Record<number, HTMLElement>>({});

const CARDS_PER_PLAYER = 5;

const OTHER_ANGLES: Record<number, number[]> = {
    2: [270],
    3: [215, 325],
    4: [180, 270, 360],
    5: [180, 225, 315, 360],
};

const flyingCards = computed(() => {
    const cards: { id: number; playerIndex: number }[] = [];
    for (let round = 0; round < CARDS_PER_PLAYER; round++) {
        _game.hands.forEach((_, i) => {
            cards.push({ id: round * _game.hands.length + i, playerIndex: i });
        });
    }
    return cards;
});

const getPlayerCenter = (index: number, W: number, H: number) => {
    const hand = _game.hands[index];
    if (!hand) return { x: W / 2, y: H / 2 };

    const isMain = hand.player.id === _room.mainPlayer.id;
    const total = _game.hands.length;

    if (isMain) return { x: W * 0.5, y: H * 0.88 };

    const others = _game.hands.filter(h => h.player.id !== _room.mainPlayer.id);
    const otherIndex = others.findIndex(h => h.player.id === hand.player.id);
    const angles = OTHER_ANGLES[total] ?? OTHER_ANGLES[5];
    const deg = angles[otherIndex] ?? 270;
    const rad = (deg * Math.PI) / 180;
    return {
        x: W * (0.5 + 0.40 * Math.cos(rad)),
        y: H * (0.5 + 0.40 * Math.sin(rad)) + 48,
    };
};

watch(dealingActive, async (active) => {
    if (!active) return;
    await nextTick();

    const container = containerRef.value;
    if (!container) return;

    const W = container.offsetWidth;
    const H = container.offsetHeight;

    const originX = W / 2 - 25;
    const originY = H / 2 - 38;

    flyingCards.value.forEach((card, i) => {
        const el = cardEls.value[card.id];
        if (!el) return;

        const dest = getPlayerCenter(card.playerIndex, W, H);
        const destX = dest.x - 25;
        const destY = dest.y - 38;

        const dx = destX - originX;
        const dy = destY - originY;

        el.style.left = `${originX}px`;
        el.style.top = `${originY}px`;

        const delay = 200 + i * 180;

        el.animate([
            { opacity: 0,   transform: 'translate(0, 0) scale(0.75) rotate(-8deg)' },
            { opacity: 1,   transform: 'translate(0, 0) scale(1.05) rotate(0deg)', offset: 0.08 },
            { opacity: 1,   transform: `translate(${dx}px, ${dy}px) scale(0.9) rotate(${(Math.random() - 0.5) * 16}deg)` },
        ], {
            duration: 750,
            delay,
            easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
            fill: 'forwards',
        });
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
