import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false
});

const url = (import.meta.env.VITE_SOCKET_URL !== undefined ? import.meta.env.VITE_SOCKET_URL : 'http://localhost:3001');
export const socket = io(url);

socket.on("connect", () => { state.connected = true; });
socket.on("disconnect", () => { state.connected = false; });
