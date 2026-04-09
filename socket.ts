import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false
});

const url = import.meta.env.NUXT_PUBLIC_API_URL ?? 'http://localhost:3001';
export const socket = io(url);

socket.on("connect", () => { state.connected = true; });
socket.on("disconnect", () => { state.connected = false; });
