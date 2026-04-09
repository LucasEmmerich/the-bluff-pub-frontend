export type Player = {
    id?: string;
    username?: string;
    avatar?: number;
};

export type Card = {
    id: number;
    name: string;
    values: Array<string>;
    img: string;
    selected?: boolean;
};

export type Hand = {
    player: Player;
    cards: Array<Card>;
    life: number;
};

export type Move = {
    player: Player;
    cardsDropped: Array<Card>;
    liarCall: boolean;
};

export type Game = {
    round: number;
    cardTypes: Array<string>;
    cardType?: 'King' | 'Queen' | 'Ace';
    deck: Array<Card>;
    turn?: string;
    matchStarted: boolean;
    revealing: boolean;
    hands: Array<Hand>;
    table: {
        cards: Array<Card>;
        moves: Array<Move>;
    };
};

export type Room = {
    id: string | undefined;
    enterRoomId: string | undefined;
    mainPlayer: Player;
    players: Array<Player>;
    roomOwner?: Player;
};

export type BluffResult = {
    bluffed: boolean;
    loser: { username: string };
    eliminated: boolean;
    gameOver: boolean;
    winner?: { username: string };
    tableCards: Array<Card>;
};
