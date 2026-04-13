<template>
    <div class="flex flex-row h-screen">
        <RoomSidebar />
        <GameBoard />
    </div>
</template>

<script setup lang="ts">
definePageMeta({ ssr: false });

import { socket } from "~/socket";
import { randomName } from "~/utils/randomName";

const _room = useRoom();

onMounted(() => {
    _room.mainPlayer.username = randomName();
    _room.mainPlayer.avatar = Math.floor(Math.random() * 12);

    window.addEventListener('beforeunload', () => socket.emit('left-room', _room));

});
</script>
