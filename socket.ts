import { reactive } from "vue";
import { io, type Socket } from "socket.io-client";

export const state = reactive({
  connected: false,
  ping: null as number | null,
  online: null as number | null,
  playing: null as number | null,
  rooms: null as number | null,
});

const url = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3001';

export let socket: Socket;

if (import.meta.client) {
  let sessionId = sessionStorage.getItem("bluff-session-id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("bluff-session-id", sessionId);
  }

  socket = io(url);

  socket.on("connect", () => {
    state.connected = true;
    socket.emit("register-session", sessionId);
    measurePing();
  });

  socket.on("disconnect", () => {
    state.connected = false;
    state.ping = null;
  });

  socket.on("pong-check", (timestamp: number) => {
    state.ping = Date.now() - timestamp;
  });

  socket.on("server-info", ({ online, playing, rooms }: { online: number; playing: number; rooms: number }) => {
    state.online = online;
    state.playing = playing;
    state.rooms = rooms;
  });

  setInterval(measurePing, 5000);

  window.addEventListener("beforeunload", () => socket.disconnect());
}

function measurePing() {
  if (!socket?.connected) return;
  socket.emit("ping-check", Date.now());
}
