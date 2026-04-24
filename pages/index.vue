<template>
    <div class="h-full flex flex-col">
        <GameBoard class="flex-1 min-h-0" />
        <PlayerSetupModal
            :visible="showSetupModal"
            :initialUsername="initialUsername"
            :initialAvatar="initialAvatar"
            @confirm="onSetupConfirm"
        />
    </div>
</template>

<script setup lang="ts">
definePageMeta({ ssr: false });

import { socket } from "~/socket";
import { randomName } from "~/utils/randomName";

useHead({ title: "Bluff Pub" });

const { $toast }: any = useNuxtApp();
const _room = useRoom();

const showSetupModal = ref(false);
const initialUsername = ref("");
const initialAvatar = ref(0);

onMounted(() => {
    const savedUsername = localStorage.getItem("bluffpub_username");
    const savedAvatar = localStorage.getItem("bluffpub_avatar");

    if (savedUsername && savedAvatar !== null) {
        _room.mainPlayer.username = savedUsername;
        _room.mainPlayer.avatar = parseInt(savedAvatar);
    } else {
        initialUsername.value = randomName();
        initialAvatar.value = Math.floor(Math.random() * 12);
        _room.mainPlayer.username = initialUsername.value;
        _room.mainPlayer.avatar = initialAvatar.value;
        showSetupModal.value = true;
    }

    socket.on("player-left", (_room: any, leftPlayer: any) => {
        $toast.info(`${leftPlayer.username} left the table.`);
    });

    socket.on("send-notification", ({ type, message }: { type: "error" | "info" | "success"; message: string }) => {
        $toast[type](message);
    });

    window.addEventListener("beforeunload", () => socket.emit("left-room", _room));
});

const onSetupConfirm = (username: string, avatar: number) => {
    localStorage.setItem("bluffpub_username", username);
    localStorage.setItem("bluffpub_avatar", String(avatar));
    _room.mainPlayer.username = username;
    _room.mainPlayer.avatar = avatar;
    showSetupModal.value = false;
};
</script>
