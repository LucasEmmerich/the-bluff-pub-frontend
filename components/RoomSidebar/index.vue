<template>
    <div
        class="relative flex flex-col h-full shrink-0 items-center justify-center px-5 py-8 gap-6"
        style="width: 260px; background: #0a0603; border-right: 1px solid rgba(255, 255, 255, 0.06)"
    >
        <div
            class="flex flex-col items-center gap-3 w-full px-4 py-4 rounded-xl"
            style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(184, 134, 11, 0.12)"
        >
            <img
                :src="avatars[_room.mainPlayer.avatar as number]"
                class="w-16 h-16 rounded-full ring-2 ring-pub-gold/25"
            />
            <div class="flex items-center gap-2">
                <span class="font-pub text-pub-cream/70 text-sm tracking-wide">{{ _room.mainPlayer.username }}</span>
                <button
                    v-if="!_room.id"
                    @click="showEditModal = true"
                    class="w-6 h-6 rounded-full flex items-center justify-center transition-all hover:opacity-70"
                    style="background: rgba(184, 134, 11, 0.08); border: 1px solid rgba(184, 134, 11, 0.3)"
                >
                    <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(184,134,11,0.8)"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                </button>
            </div>
        </div>

        <PlayerSetupModal
            :visible="showEditModal"
            :initialUsername="_room.mainPlayer.username || ''"
            :initialAvatar="_room.mainPlayer.avatar ?? 0"
            @confirm="onEditConfirm"
        />

        <div class="flex flex-col gap-3 w-full" v-if="!_room.id">
            <CustomButton label="Open Table" type="info" @click="[createRoom(), $toast.success('Table opened!')]" />

            <div class="flex items-center gap-3">
                <div class="flex-1 h-px" style="background: rgba(255, 255, 255, 0.08)"></div>
                <span class="font-pub text-pub-cream-dim/50 text-xs tracking-widest">OR</span>
                <div class="flex-1 h-px" style="background: rgba(255, 255, 255, 0.08)"></div>
            </div>

            <div class="flex flex-col gap-2">
                <TextInput v-model="_room.enterRoomId" placeholder="Table code" label="Join a table:" sublabel="" />
                <CustomButton label="Join" type="save" @click="joinRoom" />
            </div>
        </div>

        <div class="flex flex-col gap-5 w-full" v-if="_room.id">
            <div
                class="flex flex-col items-center gap-3 w-full px-1 py-4 rounded-xl"
                style="background: rgba(184, 134, 11, 0.06); border: 1px solid rgba(184, 134, 11, 0.18)"
            >
                <span class="font-pub text-[10px] tracking-[0.5em] uppercase" style="color: rgba(184, 134, 11, 0.45)"
                    >Table Code</span
                >
                <span
                    class="font-pub font-black tracking-[0.3em] text-base"
                    style="color: #f0c040; text-shadow: 0 0 16px rgba(184, 134, 11, 0.35)"
                    >{{ _room.id }}</span
                >
                <button
                    class="font-pub text-[9px] tracking-[0.2em] uppercase px-3 py-1 rounded-full transition-all duration-200 hover:opacity-80"
                    style="border: 1px solid rgba(184, 134, 11, 0.25); color: rgba(184, 134, 11, 0.6)"
                    @click="[copyRoomCodeToClipboard(), $toast.success('Code copied!')]"
                >
                    Copy Code
                </button>
            </div>

            <div>
                <div class="font-pub text-pub-cream-dim/40 text-[10px] tracking-[0.5em] uppercase mb-3">Players</div>
                <div class="flex flex-col gap-2.5" style="height: 158px">
                    <div v-for="p in _room.players" :key="p.username" class="flex items-center gap-3">
                        <img :src="avatars[p.avatar as number]" class="w-8 h-8 rounded-full" style="opacity: 0.9" />
                        <span class="font-pub text-pub-cream/80 text-sm flex-1 truncate">{{ p.username }}</span>
                        <span v-if="p.id === _room.roomOwner?.id" class="text-sm opacity-70">👑</span>
                    </div>
                </div>
            </div>

            <CustomButton
                v-if="_room.mainPlayer.id === _room.roomOwner?.id"
                label="⚔ Start Game"
                type="save"
                @click="startGame"
            />
            <p
                v-else
                class="font-pub text-pub-cream-dim/50 text-xs italic tracking-wide text-center w-full flex items-center justify-center rounded border px-2 whitespace-nowrap"
                style="border-color: rgba(255, 255, 255, 0.06); height: 38px"
            >
                Waiting for the table owner...
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { avatars } from "~/assets/avatars";
import { createRoom, joinRoom, copyRoomCodeToClipboard } from "~/composables/useRoom";
import { startGame } from "~/composables/useGame";
import { socket } from "~/socket";

const { $toast }: any = useNuxtApp();
const _room = useRoom();
const _game = useGame();

const showEditModal = ref(false);

const onEditConfirm = (username: string, avatar: number) => {
    localStorage.setItem("bluffpub_username", username);
    localStorage.setItem("bluffpub_avatar", String(avatar));
    _room.mainPlayer.username = username;
    _room.mainPlayer.avatar = avatar;
    showEditModal.value = false;
};

onMounted(() => {
    socket.on("player-left", (_room: any, leftPlayer: any) => {
        $toast.info(`${leftPlayer.username} left the table.`);
    });

    socket.on("send-notification", ({ type, message }: { type: "error" | "info" | "success"; message: string }) => {
        $toast[type](message);
    });
});
</script>
