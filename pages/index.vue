<template>
    <div class="min-h-screen overflow-x-hidden" style="background: #0a0603; color: #f0e0c0;">

        <nav class="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 h-14"
            style="background: rgba(10,6,3,0.82); border-bottom: 1px solid rgba(184,134,11,0.2); backdrop-filter: blur(16px);">
            <span class="font-pub font-black tracking-widest text-sm" style="color: #b8860b;">BLUFF PUB</span>
            <NuxtLink to="/play"
                class="font-pub text-xs tracking-[0.3em] uppercase px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
                style="background: rgba(184,134,11,0.9); color: #0a0603; font-weight: 900; box-shadow: 0 0 18px rgba(184,134,11,0.4);">
                Play
            </NuxtLink>
        </nav>

        <section class="relative flex flex-col items-center justify-center min-h-screen overflow-hidden px-6">

            <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
                <img v-for="c in floatingCards" :key="c.id"
                    :src="c.src"
                    class="absolute rounded-lg opacity-0"
                    :style="c.style" />
            </div>

            <div class="absolute inset-0 pointer-events-none"
                style="background: radial-gradient(ellipse at 50% 55%, rgba(184,134,11,0.08) 0%, transparent 65%);"></div>

            <div class="absolute top-0 left-0 right-0 h-1"
                style="background: linear-gradient(to right, transparent, #b8860b, transparent);"></div>

            <div class="relative flex flex-col items-center gap-6 text-center z-10">
                <h1 class="font-pub font-black text-7xl md:text-9xl tracking-widest hero-title"
                    style="text-shadow: 0 0 60px rgba(184,134,11,0.5), 0 0 20px rgba(184,134,11,0.3);">
                    BLUFF<br>
                    <span style="color: #b8860b;">PUB</span>
                </h1>

                <p class="font-body italic text-pub-cream/70 text-lg md:text-xl max-w-sm tracking-wide">
                    Cards on the table. Lies in the air.
                </p>

                <div class="flex items-center gap-4 mt-2">
                    <div class="h-px w-16" style="background: linear-gradient(to right, transparent, #b8860b55);"></div>
                    <span class="text-pub-gold/50 text-xs">✦</span>
                    <div class="h-px w-16" style="background: linear-gradient(to left, transparent, #b8860b55);"></div>
                </div>

                <div class="mt-6 animate-bounce text-pub-gold/30 text-2xl">↓</div>
            </div>
        </section>

        <section class="relative py-24 px-6">
            <div class="max-w-4xl mx-auto">

                <SectionTitle>The Cards</SectionTitle>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                    <CardShowcase v-for="card in deckCards" :key="card.name"
                        :src="card.src" :name="card.name" :description="card.description"
                        :special="card.special" />
                </div>

                <p class="font-body text-pub-cream/50 text-sm text-center italic mt-8">
                    The deck has 6 Kings, 6 Queens, 6 Jacks and 2 Jokers — 20 cards total.
                </p>
            </div>
        </section>

        <section class="relative py-24 px-6" style="background: rgba(255,255,255,0.015);">
            <div class="max-w-3xl mx-auto">

                <SectionTitle>How to Play</SectionTitle>

                <div class="mt-12 flex flex-col gap-8">
                    <StepCard :step="1" title="The Table Sets the Card">
                        At the start of each round, the table card is revealed: <strong class="text-pub-gold">King</strong>,
                        <strong class="text-pub-gold">Queen</strong> or <strong class="text-pub-gold">Jack</strong>.
                        Every player receives <strong class="text-pub-cream">5 cards</strong> in hand.
                    </StepCard>

                    <StepCard :step="2" title="Play Cards... or Lie">
                        On your turn, choose <strong class="text-pub-cream">1 or more cards</strong> and play them
                        <strong class="text-pub-gold">face down</strong> on the table, claiming they are all
                        the round's card type. The truth? Only you know.
                    </StepCard>

                    <StepCard :step="3" title="The Joker is Wild">
                        The <strong class="text-pub-gold">Joker</strong> counts as any card — King, Queen or Jack.
                        Use it to save a weak hand or bluff with extra confidence.
                    </StepCard>

                    <StepCard :step="4" title="Accuse or Trust">
                        After each play, any player — on <strong class="text-pub-cream">their turn</strong>
                        — can shout <strong class="text-pub-gold">"Bluff!"</strong> and reveal the table cards.
                        Or they can play their own cards and continue the round.
                    </StepCard>
                </div>
            </div>
        </section>

        <section class="relative py-24 px-6">
            <div class="max-w-3xl mx-auto">

                <SectionTitle>Calling the Bluff</SectionTitle>

                <p class="font-body text-pub-cream/60 text-center mt-4 mb-12">
                    When someone shouts <span class="text-pub-gold italic">"Bluff!"</span>, the table cards are revealed.
                </p>

                <div class="grid md:grid-cols-2 gap-6">
                    <div class="p-6 rounded-xl flex flex-col gap-4"
                        style="background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.3);">
                        <div class="text-4xl text-center">💀</div>
                        <h3 class="font-pub text-red-400 text-center text-lg tracking-wide">It Was a Lie</h3>
                        <p class="font-body text-pub-cream/60 text-sm text-center leading-relaxed">
                            The revealed cards <strong class="text-red-400">were not</strong> the right type.
                            The player who played them loses <strong class="text-pub-cream">1 life</strong>. The accuser was right.
                        </p>
                    </div>

                    <div class="p-6 rounded-xl flex flex-col gap-4"
                        style="background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.25);">
                        <div class="text-4xl text-center">😤</div>
                        <h3 class="font-pub text-green-400 text-center text-lg tracking-wide">It Was True</h3>
                        <p class="font-body text-pub-cream/60 text-sm text-center leading-relaxed">
                            The revealed cards <strong class="text-green-400">were</strong> all the right type.
                            The accuser loses <strong class="text-pub-cream">1 life</strong>. Think twice.
                        </p>
                    </div>
                </div>

                <p class="font-body text-pub-cream/40 text-xs text-center italic mt-8">
                    After the reveal, a new round begins with cards redistributed to all players.
                </p>
            </div>
        </section>

        <section class="relative py-24 px-6" style="background: rgba(255,255,255,0.015);">
            <div class="max-w-3xl mx-auto">

                <SectionTitle>Lives & Elimination</SectionTitle>

                <div class="mt-12 flex flex-col items-center gap-10">

                    <div class="flex flex-col items-center gap-3">
                        <div class="flex gap-3 text-3xl">
                            <span>❤️</span><span>❤️</span><span>❤️</span>
                        </div>
                        <p class="font-body text-pub-cream/60 text-sm text-center max-w-xs">
                            Every player starts with <strong class="text-pub-cream">3 lives</strong>.
                            Each penalty removes one.
                        </p>
                    </div>

                    <div class="h-px w-full max-w-xs" style="background: linear-gradient(to right, transparent, rgba(184,134,11,0.4), transparent);"></div>

                    <div class="flex flex-col items-center gap-3">
                        <div class="flex gap-3 text-3xl">
                            <span>❤️</span><span class="opacity-20">❤️</span><span class="opacity-20">❤️</span>
                        </div>
                        <p class="font-body text-pub-cream/60 text-sm text-center max-w-xs">
                            With <strong class="text-pub-cream">1 life</strong> left, one mistake
                            means elimination. Watch your accusations.
                        </p>
                    </div>

                    <div class="h-px w-full max-w-xs" style="background: linear-gradient(to right, transparent, rgba(184,134,11,0.4), transparent);"></div>

                    <div class="flex flex-col items-center gap-3">
                        <div class="text-5xl animate-bounce" style="filter: drop-shadow(0 0 16px rgba(184,134,11,0.5));">🏆</div>
                        <p class="font-body text-pub-cream/60 text-sm text-center max-w-xs">
                            The <strong class="text-pub-gold">last survivor</strong> with lives remaining
                            wins the match.
                        </p>
                    </div>

                </div>
            </div>
        </section>

        <section class="relative py-24 px-6">
            <div class="max-w-3xl mx-auto">

                <SectionTitle>Quick Tips</SectionTitle>

                <div class="mt-12 grid md:grid-cols-3 gap-5">
                    <TipCard icon="🃏" title="Save the Joker">
                        The Joker is your most powerful card. Use it when your hand is weak
                        and you need to bluff with confidence.
                    </TipCard>
                    <TipCard icon="👁️" title="Watch the Others">
                        How many cards does each player have? Someone who plays too fast may be
                        very confident — or scared.
                    </TipCard>
                    <TipCard icon="⏱️" title="Watch the Clock">
                        Each turn has a time limit. Anyone who neither plays nor calls bluff
                        automatically loses a life.
                    </TipCard>
                </div>
            </div>
        </section>

        <section class="relative py-24 px-6 flex flex-col items-center gap-8 text-center"
            style="background: radial-gradient(ellipse at 50% 50%, rgba(184,134,11,0.06) 0%, transparent 65%);">
            <div class="h-px w-48" style="background: linear-gradient(to right, transparent, #b8860b66, transparent);"></div>

            <div class="text-5xl" style="filter: drop-shadow(0 0 20px rgba(184,134,11,0.4));">🂡</div>

            <h2 class="font-pub text-4xl md:text-5xl font-black tracking-widest"
                style="color: #f0c040; text-shadow: 0 0 30px rgba(184,134,11,0.4);">
                Ready to Bluff?
            </h2>

            <p class="font-body italic text-pub-cream/50 max-w-sm">
                Gather your friends, sit at the table and let the game begin.
            </p>

            <div class="h-px w-48" style="background: linear-gradient(to right, transparent, #b8860b66, transparent);"></div>
        </section>

        <div class="h-1" style="background: linear-gradient(to right, transparent, #b8860b, transparent);"></div>

    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { king as kingImg, queen as queenImg, jack as jackImg, joker as jokerImg, no_card as noCardImg } from '~/assets/cards';

useHead({ title: 'Bluff Pub' });

const deckCards = [
    { name: 'King',  src: kingImg,   description: 'The king of the table. Play with confidence — or conviction.',  special: false },
    { name: 'Queen', src: queenImg,  description: 'The queen. Hard to read, easy to bluff with.',                  special: false },
    { name: 'Jack',  src: jackImg,   description: 'The jack. Simple, direct and devastating in the right hands.',  special: false },
    { name: 'Joker', src: jokerImg,  description: 'The wild card. Counts as any card in the round.',               special: true  },
];

const cardSrcs = [kingImg, queenImg, jackImg, noCardImg];

const floatingCards = computed(() => {
    const cards: { id: number; src: string; style: string }[] = [];
    const positions = [
        { left: '5%',  top: '10%', delay: '0s',    duration: '14s', rot: '-18deg', scale: 0.9 },
        { left: '12%', top: '65%', delay: '2.5s',  duration: '17s', rot: '12deg',  scale: 0.75 },
        { left: '22%', top: '30%', delay: '5s',    duration: '12s', rot: '-6deg',  scale: 0.8 },
        { left: '78%', top: '15%', delay: '1s',    duration: '16s', rot: '22deg',  scale: 0.85 },
        { left: '85%', top: '55%', delay: '3.5s',  duration: '13s', rot: '-14deg', scale: 0.7 },
        { left: '70%', top: '80%', delay: '6s',    duration: '18s', rot: '8deg',   scale: 0.95 },
        { left: '45%', top: '5%',  delay: '4s',    duration: '15s', rot: '-20deg', scale: 0.65 },
        { left: '55%', top: '88%', delay: '7s',    duration: '11s', rot: '16deg',  scale: 0.8 },
    ];
    positions.forEach((p, i) => {
        cards.push({
            id: i,
            src: cardSrcs[i % cardSrcs.length],
            style: `
                left: ${p.left}; top: ${p.top};
                width: 64px; height: 90px;
                transform: rotate(${p.rot}) scale(${p.scale});
                animation: float-card ${p.duration} ${p.delay} ease-in-out infinite;
                filter: blur(0.5px);
            `,
        });
    });
    return cards;
});
</script>

<style scoped>
@keyframes float-card {
    0%   { opacity: 0;    transform: translateY(0px)   rotate(var(--r, 0deg)) scale(var(--s, 1)); }
    10%  { opacity: 0.12; }
    50%  { opacity: 0.18; transform: translateY(-22px) rotate(var(--r, 0deg)) scale(var(--s, 1)); }
    90%  { opacity: 0.12; }
    100% { opacity: 0;    transform: translateY(0px)   rotate(var(--r, 0deg)) scale(var(--s, 1)); }
}

.hero-title {
    animation: fade-in-up 1s ease-out both;
}

.hero-cta {
    animation: fade-in-up 1s ease-out 0.3s both;
}

.hero-cta:hover {
    background: rgba(184,134,11,0.28) !important;
    border-color: rgba(184,134,11,0.9) !important;
    box-shadow: 0 0 24px rgba(184,134,11,0.25);
    transform: translateY(-1px);
}

@keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}
</style>
