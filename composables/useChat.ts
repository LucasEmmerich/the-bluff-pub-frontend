import { reactive } from "vue";
import { socket } from "~/socket";

export type ChatMessage = {
    id: number;
    playerId: string;
    username: string;
    avatar: number;
    text: string;
};

export const roomMessages = reactive<ChatMessage[]>([]);

export const sendRoomMessage = (
    roomId: string,
    player: { id?: string; username?: string; avatar?: number },
    text: string
) => {
    socket.emit("room-chat-message", {
        roomId,
        message: { playerId: player.id, username: player.username, avatar: player.avatar, text },
    });
};

if (import.meta.client) {
    socket.on("room-chat-message", (msg: ChatMessage) => {
        roomMessages.push(msg);
        if (roomMessages.length > 100) roomMessages.shift();
    });

    socket.on("disconnect", () => {
        roomMessages.splice(0, roomMessages.length);
    });
}
