import { reactive } from "vue";
import { socket } from "~/socket";

export type Player = {
    id?: string,
    username?: string,
    avatar?: number
}

export type Room = {
    id: string | undefined,
    enterRoomId: string | undefined,
    mainPlayer: Player,
    players: Array<Player>,
    roomOwner?: Player
}

const _initialState: Room = {
    id: undefined,
    enterRoomId: undefined,
    mainPlayer: {
        id: undefined,
        username: undefined,
        avatar: undefined,
    },
    players: [],
    roomOwner: undefined
}

export const copyRoomCodeToClipboard = () => {
    navigator.clipboard.writeText(_room.id as string);
};

export const createRoom = () => {
    socket.emit('create-room', _room);
};
socket.on('room-created', room => {
    _room.id = room.id;
    _room.mainPlayer.id = room.roomOwner.id;
    _room.roomOwner = room.roomOwner;
});

export const joinRoom = () => {
    socket.emit('join-room', _room);
};
socket.on('player-joined', room => {
    _room.id = room.id;
    _room.players = room.players;
    _room.roomOwner = room.roomOwner;
});

socket.on('disconnect', () => {
    _room.id = undefined;
    _room.enterRoomId = undefined;
    _room.mainPlayer = {
        id: undefined,
        username: undefined,
        avatar: undefined
    },
    _room.players = [];
});

export const _room = reactive<Room>(_initialState);
export const useRoom = () => _room;