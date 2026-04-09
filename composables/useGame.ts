import { reactive, ref } from "vue";
import { socket } from "~/socket";
import { king, queen, ace, joker, no_card } from '~/assets/cards';
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
    { id: 13, name: 'Ace',   values: ['Ace'],                  img: ace },
    { id: 14, name: 'Ace',   values: ['Ace'],                  img: ace },
    { id: 15, name: 'Ace',   values: ['Ace'],                  img: ace },
    { id: 16, name: 'Ace',   values: ['Ace'],                  img: ace },
    { id: 17, name: 'Ace',   values: ['Ace'],                  img: ace },
    { id: 18, name: 'Ace',   values: ['Ace'],                  img: ace },
    { id: 19, name: 'Joker', values: ['King', 'Queen', 'Ace'], img: joker },
    { id: 20, name: 'Joker', values: ['King', 'Queen', 'Ace'], img: joker },
];

export const CARD_IMAGES = { king, queen, ace, joker, no_card };
export const CARD_TYPES = ['King', 'Queen', 'Ace'];

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
    dropCardsAnimation(() => socket.emit('drop-cards', { room: _room, move }));
};

const OTHER_ANGLES: Record<number, number[]> = {
    2: [270],
    3: [215, 325],
    4: [180, 270, 360],
    5: [180, 225, 315, 360],
};

export const handPosition = (pl: Hand): Record<string, string> => {
    if (pl.player.id === _room.mainPlayer.id) {
        return { left: '50%', top: '88%', transform: 'translate(-50%, -50%)' };
    }

    const total = _game.hands.length;
    const others = _game.hands.filter(x => x.player.id !== _room.mainPlayer.id);
    const otherIndex = others.findIndex(x => x.player.id === pl.player.id);
    const angles = OTHER_ANGLES[total] ?? OTHER_ANGLES[5];
    const deg = angles[otherIndex] ?? 270;

    const rad = (deg * Math.PI) / 180;
    const x = 50 + 40 * Math.cos(rad);
    const y = 50 + 40 * Math.sin(rad);

    return { left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' };
};

export const handRotation = (pl: Hand): number => {
    if (pl.player.id === _room.mainPlayer.id) return 0;
    const others = _game.hands.filter(x => x.player.id !== _room.mainPlayer.id);
    const otherIndex = others.findIndex(x => x.player.id === pl.player.id);
    const angles = OTHER_ANGLES[_game.hands.length] ?? OTHER_ANGLES[4];
    const deg = angles[otherIndex] ?? 270;
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

const TOAST_TYPES = new Set<GameLogEntry['type']>(['bluff-win', 'bluff-fail', 'timeout', 'eliminated']);

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

export const turnTimeLeft = ref(20);
let _timerInterval: ReturnType<typeof setInterval> | null = null;

const startCountdown = (delayMs = 0) => {
    if (_timerInterval) clearInterval(_timerInterval);
    turnTimeLeft.value = 20;
    setTimeout(() => {
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

socket.on('game-started', game => {
    _game.turn = game.turn?.username ?? game.turn;
    _game.hands = remapHandImages(orderPlayerTablePosition(game.hands));
    _game.matchStarted = game.matchStarted;
    _game.cardType = game.cardType;
    gameLogs.splice(0, gameLogs.length);
    addLog({ type: 'round', text: 'Partida iniciada', sub: `${game.hands.length} jogadores` });
    dealingActive.value = true;
    const totalCards = 5 * game.hands.length;
    const dealDuration = 200 + (totalCards - 1) * 180 + 750 + 400;
    setTimeout(() => { dealingActive.value = false; startCountdown(); }, dealDuration);
});

socket.on('cards-dropped', game => {
    const lastMove = game.table.moves?.[game.table.moves.length - 1];
    if (lastMove) {
        addLog({
            type: 'play',
            text: lastMove.player.username,
            sub: `jogou ${lastMove.cardsDropped.length} carta${lastMove.cardsDropped.length !== 1 ? 's' : ''}`,
        });
    }
    _game.turn = game.turn?.username ?? game.turn;
    _game.hands = remapHandImages(orderPlayerTablePosition(game.hands));
    _game.cardType = game.cardType;
    tableCardsAnimation({ ...game.table, cards: remapImages(game.table.cards), moves: game.table.moves });
    startCountdown();
});

socket.on('bluff-called', ({ game, result }: { game: any, result: BluffResult }) => {
    triggerLifeLoss(result.loser.id);
    const bluffEntry = {
        type: (result.bluffed ? 'bluff-win' : 'bluff-fail') as GameLogEntry['type'],
        text: result.bluffed ? 'Mentira detectada!' : 'Não era mentira!',
        sub: `${result.loser.username} perde uma vida`,
    };
    addLog(bluffEntry);
    addToast(bluffEntry);
    if (result.eliminated) {
        const e = { type: 'eliminated' as GameLogEntry['type'], text: `${result.loser.username} eliminado` };
        addLog(e);
        addToast(e, 1800);
    }

    _game.table.cards = remapImages(result.tableCards);
    _game.revealing = true;
    setTimeout(() => {
        _game.revealing = false;
        _game.turn = game.turn?.username ?? game.turn;
        _game.hands = remapHandImages(orderPlayerTablePosition(game.hands));
        _game.cardType = game.cardType;
        _game.table = game.table;
        _game.matchStarted = !result.gameOver;
    }, 2000);
    _bluffResultHandlers.forEach(h => h(result));
    startCountdown(4000);
});

socket.on('turn-timeout', ({ game, result }: { game: any, result: BluffResult }) => {
    triggerLifeLoss(result.loser.id);
    const timeoutEntry = { type: 'timeout' as GameLogEntry['type'], text: `${result.loser.username}`, sub: 'esgotou o tempo — perde vida' };
    addLog(timeoutEntry);
    addToast(timeoutEntry);
    if (result.eliminated) {
        const e = { type: 'eliminated' as GameLogEntry['type'], text: `${result.loser.username} eliminado` };
        addLog(e);
        addToast(e, 1500);
    }

    _game.turn = game.turn?.username ?? game.turn;
    _game.hands = remapHandImages(orderPlayerTablePosition(game.hands));
    _game.cardType = game.cardType;
    _game.table = game.table;
    _game.matchStarted = !result.gameOver;
    _bluffResultHandlers.forEach(h => h(result));
    if (!result.gameOver) startCountdown(4000);
});

socket.on('disconnect', () => {
    Object.assign(_game, _initialState);
    _game.hands = [];
    _game.table = { cards: [], moves: [] };
});

export const _game = reactive<Game>(_initialState);
export const useGame = () => _game;
