import { reactive, ref } from "vue";
import { socket } from "~/socket";
import { king, queen, jack, joker, no_card } from '~/assets/cards';
import { _room } from "~/composables/useRoom";
import type { Card, Hand, Game, BluffResult } from "~/types";

export const DECK: Array<Card> = [
    { id: 1,  name: 'King',  values: ['King'],                 img: king },
    { id: 2,  name: 'King',  values: ['King'],                 img: king },
    { id: 3,  name: 'King',  values: ['King'],                 img: king },
    { id: 4,  name: 'King',  values: ['King'],                 img: king },
    { id: 5,  name: 'King',  values: ['King'],                 img: king },
    { id: 6,  name: 'King',  values: ['King'],                 img: king },
    { id: 7,  name: 'Queen', values: ['Queen'],                img: queen },
    { id: 8,  name: 'Queen', values: ['Queen'],                img: queen },
    { id: 9,  name: 'Queen', values: ['Queen'],                img: queen },
    { id: 10, name: 'Queen', values: ['Queen'],                img: queen },
    { id: 11, name: 'Queen', values: ['Queen'],                img: queen },
    { id: 12, name: 'Queen', values: ['Queen'],                img: queen },
    { id: 13, name: 'Jack',   values: ['Jack'],                  img: jack},
    { id: 14, name: 'Jack',   values: ['Jack'],                  img: jack},
    { id: 15, name: 'Jack',   values: ['Jack'],                  img: jack},
    { id: 16, name: 'Jack',   values: ['Jack'],                  img: jack},
    { id: 17, name: 'Jack',   values: ['Jack'],                  img: jack},
    { id: 18, name: 'Jack',   values: ['Jack'],                  img: jack},
    { id: 19, name: 'Joker', values: ['King', 'Queen', 'Jack'], img: joker },
    { id: 20, name: 'Joker', values: ['King', 'Queen', 'Jack'], img: joker },
];

export const CARD_IMAGES = { king, queen, jack, joker, no_card };
export const CARD_TYPES = ['King', 'Queen', 'Jack'];

const _initialState: Game = {
    round: 0,
    deck: DECK,
    cardTypes: CARD_TYPES,
    cardType: undefined,
    turn: undefined,
    matchStarted: false,
    revealing: false,
    hands: [],
    table: { cards: [], moves: [] }
};

export const startGame = () => {
    socket.emit('game-start', { room: _room, player: _room.mainPlayer });
};

export const champion = () => {
    const playersAlive = _game.hands.filter(h => h.life > 0);
    return playersAlive.length === 1 ? playersAlive[0].player.username : undefined;
};

export const selectCard = (card: Card) => {
    if (_room.mainPlayer.username !== _game.turn) return;
    _game.hands.find(x => x.player.id === _room.mainPlayer.id)?.cards?.forEach(x => {
        if (card.id === x.id) x.selected = !x.selected;
    });
};

export const dropCards = (callLiar: boolean) => {
    const move = {
        player: _room.mainPlayer,
        cardsDropped: _game.hands.find(x => x.player.id === _room.mainPlayer.id)?.cards?.filter(x => x.selected),
        liarCall: callLiar
    };
    if (callLiar) {
        bluffCallerId.value = _room.mainPlayer.id ?? null;
        callBluffAnimation(() => socket.emit('drop-cards', { room: _room, move }));
    } else {
        dropCardsAnimation(() => socket.emit('drop-cards', { room: _room, move }));
    }
};

export const giveUpPlayerId = ref<string | null>(null);

export const giveUp = () => {
    giveUpPlayerId.value = _room.mainPlayer.id ?? null;
    socket.emit('give-up', { room: { id: _room.id }, playerId: _room.mainPlayer.id });
};

export const TABLE_RX = 46;
export const TABLE_RY = 46;

export const bluffCallerId = ref<string | null>(null);

export const getOpponentAngles = (count: number): number[] => {
    if (count === 0) return [];
    if (count === 1) return [270];
    if (count === 2) return [210, 330];
    if (count === 3) return [180, 270, 0];
    const arcStart = 130;
    const arcEnd = 410;
    return Array.from({ length: count }, (_, i) => arcStart + ((arcEnd - arcStart) / (count - 1)) * i);
};

const isSpectator = () => !_game.hands.some(h => h.player.id === _room.mainPlayer.id);

export const handPosition = (pl: Hand): Record<string, string> => {
    if (pl.player.id === _room.mainPlayer.id) {
        return { left: '50%', top: '100%', transform: 'translate(-50%, -50%)' };
    }

    const spectator = isSpectator();
    const pool = spectator ? _game.hands : _game.hands.filter(x => x.player.id !== _room.mainPlayer.id);
    const idx = pool.findIndex(x => x.player.id === pl.player.id);
    const angles = getOpponentAngles(pool.length);
    const deg = angles[idx] ?? 270;

    const rad = (deg * Math.PI) / 180;
    return {
        left: `${50 + TABLE_RX * Math.cos(rad)}%`,
        top: `${50 + TABLE_RY * Math.sin(rad)}%`,
        transform: 'translate(-50%, -50%)',
    };
};

export const handFlip = (pl: Hand): boolean => {
    if (pl.player.id === _room.mainPlayer.id) return false;
    const pool = _game.hands.filter(x => x.player.id !== _room.mainPlayer.id);
    const idx = pool.findIndex(x => x.player.id === pl.player.id);
    const angles = getOpponentAngles(pool.length);
    const deg = angles[idx] ?? 270;
    const rad = (deg * Math.PI) / 180;
    return Math.cos(rad) > 0.2;
};

export const handRotation = (pl: Hand): number => {
    if (pl.player.id === _room.mainPlayer.id) return 0;

    const spectator = isSpectator();
    const pool = spectator ? _game.hands : _game.hands.filter(x => x.player.id !== _room.mainPlayer.id);
    const idx = pool.findIndex(x => x.player.id === pl.player.id);
    const angles = getOpponentAngles(pool.length);
    const deg = angles[idx] ?? 270;
    return deg - 90;
};

export const orderPlayerTablePosition = (hands: Array<Hand>) => {
    const index = hands.findIndex(x => x.player.id === _room.mainPlayer.id);
    return [...hands.slice(index + 1), ...hands.slice(0, index + 1)];
};

const remapImages = (cards: Array<Card>): Array<Card> =>
    cards.map(card => ({
        ...card,
        img: CARD_IMAGES[card.name.toLowerCase() as keyof typeof CARD_IMAGES] ?? CARD_IMAGES.no_card
    }));

const remapHandImages = (hands: Array<Hand>): Array<Hand> =>
    hands.map(hand => ({ ...hand, cards: remapImages(hand.cards) }));

const tableCardsAnimation = (table: any) => {
    document.getElementById('table-cards')?.classList.remove('fade-in');
    _game.table = table;
    document.getElementById('table-cards')?.classList.add('fade-in');
};

const callBluffAnimation = (cb: () => void) => {
    _game.hands.find(x => x.player.id === _room.mainPlayer.id)?.cards.forEach(c => c.selected = false);
    socket.emit('bluff-intent', { room: { id: _room.id }, callerId: _room.mainPlayer.id });

    const tableCardsEl = document.getElementById('table-cards');
    if (!tableCardsEl) { cb(); return; }

    const dur = _bluffCallAnimMs;
    tableCardsEl.animate([
        { transform: 'translateX(0px)   scale(1)',    filter: 'drop-shadow(0 0 0px   rgba(220,38,38,0))',    offset: 0    },
        { transform: 'translateX(-12px) scale(1.06)', filter: 'drop-shadow(0 0 16px  rgba(220,38,38,0.95))', offset: 0.05 },
        { transform: 'translateX(12px)  scale(1.06)', filter: 'drop-shadow(0 0 22px  rgba(220,38,38,1))',    offset: 0.11 },
        { transform: 'translateX(-12px) scale(1.06)', filter: 'drop-shadow(0 0 22px  rgba(220,38,38,1))',    offset: 0.17 },
        { transform: 'translateX(10px)  scale(1.05)', filter: 'drop-shadow(0 0 20px  rgba(220,38,38,0.95))', offset: 0.23 },
        { transform: 'translateX(-8px)  scale(1.04)', filter: 'drop-shadow(0 0 20px  rgba(220,38,38,0.9))',  offset: 0.32 },
        { transform: 'translateX(8px)   scale(1.04)', filter: 'drop-shadow(0 0 20px  rgba(220,38,38,0.9))',  offset: 0.41 },
        { transform: 'translateX(-6px)  scale(1.03)', filter: 'drop-shadow(0 0 18px  rgba(220,38,38,0.8))',  offset: 0.52 },
        { transform: 'translateX(6px)   scale(1.03)', filter: 'drop-shadow(0 0 16px  rgba(220,38,38,0.7))',  offset: 0.63 },
        { transform: 'translateX(-4px)  scale(1.02)', filter: 'drop-shadow(0 0 12px  rgba(220,38,38,0.5))',  offset: 0.74 },
        { transform: 'translateX(3px)   scale(1.01)', filter: 'drop-shadow(0 0 8px   rgba(220,38,38,0.3))',  offset: 0.85 },
        { transform: 'translateX(0px)   scale(1)',    filter: 'drop-shadow(0 0 0px   rgba(220,38,38,0))',    offset: 1    },
    ], { duration: dur, easing: 'ease-out', fill: 'forwards' });

    setTimeout(() => {
        tableCardsEl.getAnimations().forEach(a => a.cancel());
        cb();
    }, dur + 30);
};

const dropCardsAnimation = (cb: () => void) => {
    const selectedCards = _game.hands.find(x => x.player.id === _room.mainPlayer.id)?.cards?.filter(c => c.selected) ?? [];
    const elements = selectedCards.map(c => document.getElementById(`card-${c.id}`));
    const count = elements.length;

    const tableRect = document.getElementById('felt-table')?.getBoundingClientRect();

    elements.forEach((el, i) => {
        if (!el) return;

        const cardRect = el.getBoundingClientRect();
        const dir = i - (count - 1) / 2;

        const targetX = tableRect
            ? (tableRect.left + tableRect.width / 2) - (cardRect.left + cardRect.width / 2) + dir * 28
            : 0;
        const targetY = tableRect
            ? (tableRect.top + tableRect.height / 2) - (cardRect.top + cardRect.height / 2)
            : -200;

        const peakX = targetX * 0.38;
        const peakY = targetY * 0.35 - Math.abs(targetY) * 0.45;

        const rot = dir * 20 + (Math.random() - 0.5) * 10;

        el.animate([
            { transform: 'translate(0px, 0px) rotate(0deg) scale(1)',                                           opacity: 1, offset: 0    },
            { transform: `translate(${peakX}px, ${peakY}px) rotate(${rot * 0.5}deg) scale(1.06)`,              opacity: 1, offset: 0.42 },
            { transform: `translate(${targetX}px, ${targetY}px) rotate(${rot}deg) scale(0.82)`,                opacity: 0, offset: 1    },
        ], { duration: 820, delay: i * 65, easing: 'linear', fill: 'forwards' });
    });

    const totalMs = 820 + (count - 1) * 65 + 100;
    setTimeout(() => {
        elements.forEach(el => el?.getAnimations().forEach(a => a.cancel()));
        _game.table.cards = [];
        cb();
    }, totalMs);
};

export type GameLogEntry = {
    id: number;
    type: 'play' | 'bluff-win' | 'bluff-fail' | 'timeout' | 'eliminated' | 'round';
    text: string;
    sub?: string;
};

let _logId = 0;
export const gameLogs = reactive<GameLogEntry[]>([]);

const addLog = (entry: Omit<GameLogEntry, 'id'>) => {
    gameLogs.unshift({ ...entry, id: _logId++ });
    if (gameLogs.length > 40) gameLogs.pop();
};

export type GameToast = GameLogEntry;
export const toasts = reactive<GameToast[]>([]);

const TOAST_TYPES = new Set<GameLogEntry['type']>(['bluff-win', 'bluff-fail', 'eliminated']);

const addToast = (entry: Omit<GameToast, 'id'>, delayMs = 0) => {
    if (!TOAST_TYPES.has(entry.type)) return;
    setTimeout(() => {
        const id = _logId++;
        toasts.push({ ...entry, id });
        setTimeout(() => {
            const idx = toasts.findIndex(t => t.id === id);
            if (idx !== -1) toasts.splice(idx, 1);
        }, 3200);
    }, delayMs);
};


export type LifeEvent = { id: number; playerId: string; isMainPlayer: boolean };
export const lifeEvents = reactive<LifeEvent[]>([]);
export const vignetteActive = ref(false);

const triggerLifeLoss = (loserId: string) => {
    const hand = _game.hands.find(h => h.player.id === loserId);
    if (!hand) return;

    const id = _logId++;
    lifeEvents.push({ id, playerId: loserId, isMainPlayer: loserId === _room.mainPlayer.id });
    setTimeout(() => {
        const idx = lifeEvents.findIndex(e => e.id === id);
        if (idx !== -1) lifeEvents.splice(idx, 1);
    }, 4200);

    if (loserId === _room.mainPlayer.id) {
        vignetteActive.value = true;
        setTimeout(() => { vignetteActive.value = false; }, 900);
    }
};

export const dealingActive = ref(false);

export type GamePhase = 'idle' | 'dealing' | 'revealing' | 'waiting' | 'playing';
export const gamePhase = ref<GamePhase>('idle');

export const turnTimeLeft = ref(20);
export const turnDurationS = ref(20);
let _turnDurationS = 20;
let _interTurnDelayMs = 2000;
let _lifeLossRevealMs = 5000;
let _bluffCallAnimMs = 2000;
let _timerInterval: ReturnType<typeof setInterval> | null = null;

const startCountdown = (delayMs = 0) => {
    if (_timerInterval) clearInterval(_timerInterval);
    turnTimeLeft.value = _turnDurationS;
    gamePhase.value = 'waiting';
    setTimeout(() => {
        gamePhase.value = 'playing';
        _timerInterval = setInterval(() => {
            turnTimeLeft.value--;
            if (turnTimeLeft.value <= 0 && _timerInterval) {
                clearInterval(_timerInterval);
                _timerInterval = null;
            }
        }, 1000);
    }, delayMs);
};

const _bluffResultHandlers: Array<(result: BluffResult) => void> = [];

export const onBluffCalled = (handler: (result: BluffResult) => void) => {
    _bluffResultHandlers.push(handler);
};

if (import.meta.client) {

socket.on('game-started', (game: any) => {
    if (game.leaderboard) _room.leaderboard = game.leaderboard;
    if (game.timing) {
        _turnDurationS = Math.round(game.timing.turnMs / 1000);
        turnDurationS.value = _turnDurationS;
        _interTurnDelayMs = game.timing.interTurnDelayMs;
        _lifeLossRevealMs = game.timing.lifeLossRevealMs;
        if (game.timing.bluffCallAnimMs) _bluffCallAnimMs = game.timing.bluffCallAnimMs;
    }
    _game.turn = game.turn?.username ?? game.turn;
    _game.hands = remapHandImages(orderPlayerTablePosition(game.hands));
    _game.matchStarted = game.matchStarted;
    _game.cardType = game.cardType;
    _game.table = { cards: [], moves: [] };
    gameLogs.splice(0, gameLogs.length);
    addLog({ type: 'round', text: 'Match started', sub: `${game.hands.length} players` });
    dealingActive.value = true;
    gamePhase.value = 'dealing';
    const dealDuration = game.timing?.dealAnimationMs ?? (200 + (5 * game.hands.length - 1) * 180 + 750 + 400);
    setTimeout(() => { dealingActive.value = false; startCountdown(); }, dealDuration);
});

socket.on('cards-dropped', game => {
    const lastMove = game.table.moves?.[game.table.moves.length - 1];
    if (lastMove) {
        addLog({
            type: 'play',
            text: lastMove.player.username,
            sub: `played ${lastMove.cardsDropped.length} card${lastMove.cardsDropped.length !== 1 ? 's' : ''}`,
        });
    }
    _game.turn = game.turn?.username ?? game.turn;
    _game.hands = remapHandImages(orderPlayerTablePosition(game.hands));
    _game.cardType = game.cardType;
    tableCardsAnimation({ ...game.table, cards: remapImages(game.table.cards), moves: game.table.moves });
    startCountdown(_interTurnDelayMs);
});

socket.on('bluff-intent', ({ callerId }: { callerId: string }) => {
    bluffCallerId.value = callerId ?? null;
});

socket.on('bluff-called', ({ game, result }: { game: any, result: BluffResult }) => {
    triggerLifeLoss(result.loser.id);
    const bluffEntry = {
        type: (result.bluffed ? 'bluff-win' : 'bluff-fail') as GameLogEntry['type'],
        text: result.bluffed ? 'Bluff detected!' : 'Not a bluff!',
        sub: `${result.loser.username} loses 1 life`,
    };
    addLog(bluffEntry);
    addToast(bluffEntry);
    if (result.eliminated) {
        const e = { type: 'eliminated' as GameLogEntry['type'], text: `${result.loser.username} eliminated` };
        addLog(e);
        addToast(e, 1800);
    }

    _game.table.cards = remapImages(result.tableCards);
    _game.revealing = true;
    gamePhase.value = 'revealing';
    _bluffResultHandlers.forEach(h => h(result));
    setTimeout(() => {
        bluffCallerId.value = null;
        _game.revealing = false;
        _game.turn = game.turn?.username ?? game.turn;
        _game.hands = remapHandImages(orderPlayerTablePosition(game.hands));
        _game.cardType = game.cardType;
        _game.table = game.table;
        _game.matchStarted = !result.gameOver;
        startCountdown(_interTurnDelayMs);
    }, _lifeLossRevealMs);
});

socket.on('turn-timeout', ({ game, result }: { game: any, result: BluffResult }) => {
    triggerLifeLoss(result.loser.id);
    const timeoutEntry = { type: 'timeout' as GameLogEntry['type'], text: `${result.loser.username}`, sub: 'ran out of time — loses a life' };
    addLog(timeoutEntry);
    addToast(timeoutEntry);
    if (result.eliminated) {
        const e = { type: 'eliminated' as GameLogEntry['type'], text: `${result.loser.username} eliminated` };
        addLog(e);
        addToast(e, 1500);
    }

    _game.revealing = true;
    gamePhase.value = 'revealing';
    _bluffResultHandlers.forEach(h => h(result));
    setTimeout(() => {
        _game.revealing = false;
        _game.turn = game.turn?.username ?? game.turn;
        _game.hands = remapHandImages(orderPlayerTablePosition(game.hands));
        _game.cardType = game.cardType;
        _game.table = game.table;
        _game.matchStarted = !result.gameOver;
        if (result.gameOver) gamePhase.value = 'idle';
        else startCountdown(_interTurnDelayMs);
    }, _lifeLossRevealMs);
});

socket.on('player-gave-up', ({ game, result }: { game: any, result: BluffResult }) => {
    giveUpPlayerId.value = result.loser.id;
    const e = { type: 'eliminated' as GameLogEntry['type'], text: `${result.loser.username} gave up` };
    addLog(e);
    addToast(e, 1800);
    setTimeout(() => {
        giveUpPlayerId.value = null;
        _game.turn = game.turn?.username ?? game.turn;
        _game.hands = remapHandImages(orderPlayerTablePosition(game.hands));
        _game.cardType = game.cardType;
        _game.table = game.table;
        _game.matchStarted = !result.gameOver;
        if (result.gameOver) gamePhase.value = 'idle';
    }, _lifeLossRevealMs);
});

socket.on('turn-skipped', game => {
    _game.turn = game.turn?.username ?? game.turn;
    _game.hands = remapHandImages(orderPlayerTablePosition(game.hands));
    startCountdown();
});

socket.on('disconnect', () => {
    Object.assign(_game, _initialState);
    _game.hands = [];
    _game.table = { cards: [], moves: [] };
});

}

export const _game = reactive<Game>(_initialState);
export const useGame = () => _game;
