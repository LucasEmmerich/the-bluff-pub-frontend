import { reactive } from "vue";
import { socket } from "~/socket";
import {
    king,
    queen,
    ace,
    joker,
    no_card
} from '~/assets/cards';

export const DECK: Array<Card> = [
    { id: 1, name: 'King', values: ['King'], img: king },
    { id: 2, name: 'King', values: ['King'], img: king },
    { id: 3, name: 'King', values: ['King'], img: king },
    { id: 4, name: 'King', values: ['King'], img: king },
    { id: 5, name: 'King', values: ['King'], img: king },
    { id: 6, name: 'King', values: ['King'], img: king },
    { id: 7, name: 'Queen', values: ['Queen'], img: queen },
    { id: 8, name: 'Queen', values: ['Queen'], img: queen },
    { id: 9, name: 'Queen', values: ['Queen'], img: queen },
    { id: 10, name: 'Queen', values: ['Queen'], img: queen },
    { id: 11, name: 'Queen', values: ['Queen'], img: queen },
    { id: 12, name: 'Queen', values: ['Queen'], img: queen },
    { id: 13, name: 'Ace', values: ['Ace'], img: ace },
    { id: 14, name: 'Ace', values: ['Ace'], img: ace },
    { id: 15, name: 'Ace', values: ['Ace'], img: ace },
    { id: 16, name: 'Ace', values: ['Ace'], img: ace },
    { id: 17, name: 'Ace', values: ['Ace'], img: ace },
    { id: 18, name: 'Ace', values: ['Ace'], img: ace },
    { id: 19, name: 'Joker', values: ['King', 'Queen', 'Ace'], img: joker },
    { id: 20, name: 'Joker', values: ['King', 'Queen', 'Ace'], img: joker },
];

export const CARD_IMAGES = { king, queen, ace, joker, no_card };

export const CARD_TYPES = ['King', 'Queen', 'Ace'];

export type Card = {
    id: number,
    name: string,
    values: Array<string>,
    img: string,
    selected?: boolean
};

export type Hand = {
    username: string,
    avatar: number,
    hand: Array<Card>,
    life: number
};

export type Game = {
    round: number,
    cardTypes: Array<string>,
    cardType?: 'King' | 'Queen' | 'Ace',
    deck: Array<Card>,
    turn?: string,
    matchStarted: boolean,
    hands: Array<Hand>,
    table: {
        playedBy?: string,
        cards: Array<Card>
    }
};

export type Table = {
    playedBy?: string,
    cards: Array<Card>
};

const _initialState: Game = {
    round: 0,
    deck: DECK,
    cardTypes: CARD_TYPES,
    cardType: undefined,
    turn: undefined,
    matchStarted: false,
    hands: Array<Hand>(),
    table: {
        playedBy: '',
        cards: []
    }
};

export const startGame = () => {
    shuffleCards();
    socket.emit('game-start', _room, _game);
};

export const champion = () => {
    const playersAlive = _game.hands.filter(h => h.life);
    return playersAlive.length === 1 ? playersAlive[0].username : undefined;
};

export const shuffleCards = () => {
    _game.deck = [...DECK];
    for (let i = _game.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [_game.deck[i], _game.deck[j]] = [_game.deck[j], _game.deck[i]];
    }
};

export const selectCard = (card: Card) => {
    if (_room.mainPlayer.username !== _game.turn) return;
    _game.hands.find(x => x.username === _room.mainPlayer.username)?.hand?.forEach(x => {
        if (card.id === x.id) {
            x.selected = !x.selected
        }
    });
};
export const dropCards = (callLiar: boolean) => {
    shuffleCards();
    const move = {
        cardsDropped: _game.hands.find(x => x.username === _room.mainPlayer.username)?.hand?.filter(x => x.selected),
        cardsLeft: _game.hands.find(x => x.username === _room.mainPlayer.username)?.hand?.filter(x => !x.selected),
        callLiar
    }
    dropCardsAnimation(_game, () => socket.emit('drop-cards', _room, _game, move));
    // socket.emit('drop-cards', _room, _game, move);
};

export const handPosition = (pl: Hand) => {
    const handPositionClasses = [
        `bottom-10 left-[calc(50%-50px)]`,
        `left-10 top-[calc(50%-50px)] rotate-90`,
        `top-10 left-[calc(50%-50px)] rotate-180`,
        `right-10 top-[calc(50%-50px)] rotate-[-90deg]`
    ]
    if (pl.username === _room.mainPlayer.username) {
        return handPositionClasses[0];
    } else {
        const index = _game.hands.findIndex(x => x.username === _room.mainPlayer.username);
        const leftPositions = handPositionClasses.slice(3);
        return leftPositions[index + 1] || leftPositions[0];
    }
};
export const orderPlayerTablePosition = (hands: Array<Hand>) => {
    const index = hands.findIndex(x => x.username === _room.mainPlayer.username);
    return [...hands.slice(index + 1), ...hands.slice(0, index + 1)];
};
socket.on('game-started', game => {
    _game.turn = game.turn;
    _game.hands = orderPlayerTablePosition(game.hands);
    _game.matchStarted = game.matchStarted;
    _game.cardType = game.cardType;
});
socket.on('cards-dropped', game => {
    _game.turn = game.turn;
    _game.hands = orderPlayerTablePosition(game.hands);
    _game.cardType = game.cardType;
    tableCardsAnimation(game.table);
});
const tableCardsAnimation = (table: any) => {
    document.getElementById('table-cards')?.classList.remove('fade-in')
    _game.table = table;
    document.getElementById('table-cards')?.classList.add('fade-in')
}
const dropCardsAnimation = (game: Game, cb: () => void) => {
    const playerHand = game.hands.find(x => x.username === _game.turn)?.hand;
    const cardsElements: Array<any> = [];
    playerHand?.forEach(c => {
        if (c.selected) {
            cardsElements.push(document.getElementById(`card-${c.id}`))
        }
    })
    cardsElements.forEach(x => {
        x.classList.add('animate-throw-up');
    })
    setTimeout(() => {
        cardsElements.forEach(x => {
            x.classList.remove('animate-throw-up');
        });
        _game.table.cards = [];
        _game.table.playedBy = '';
        cb();
    }, 1000)
}

socket.on('disconnect', () => {
    _game.round = 0;
    _game.deck = DECK;
    _game.cardTypes = CARD_TYPES;
    _game.cardType = undefined;
    _game.turn = undefined;
    _game.matchStarted = false;
    _game.hands = Array<Hand>();
    _game.table = {
        playedBy: '',
        cards: []
    };
});

export const _game = reactive<Game>(_initialState);
export const useGame = () => _game;