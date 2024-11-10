<template>
    <div class="flex flex-row h-screen">
        <div class="p-8 w-1/3 lg:w-1/4 md:w-1/3 border-r">
            <div class="flex justify-between">
                <AvatarSelector :onlyView="!!_room.id" :images="avatars" v-model="_room.mainPlayer.avatar"
                    :disabled="_game.matchStarted" />
                <TextInput class="w-56" :disabled="_room.id" v-model="_room.mainPlayer.username"
                    placeholder="Type your nickname" label="Nickname:" sublabel="Name displayed inside the room." />
            </div>
            <hr class="my-5" />
            <div class="flex flex-col gap-10" v-if="!_room.id">
                <div class="flex justify-center h-4">
                    <CustomButton class="max-w-40" v-if="!_room.id" label="Create room" type="info"
                        @click="[createRoom(), notifyLocally('success', 'Room created!')]" />
                </div>
                <div class="text-center">
                    <b>OU</b>
                </div>
                <div class="flex items-end h-8">
                    <TextInput v-model="_room.enterRoomId" placeholder="Room code" label="Código da sala:" />
                    <CustomButton class="" label="Enter room" type="save" @click="joinRoom" />
                </div>
            </div>
            <div class="flex flex-col gap-4" v-if="_room.id">
                <div class="flex justify-center items-center flex-col">
                    <b class="text-lg italic">{{ _room.id }}</b>
                    <CustomButton class="max-w-40" label="Copy room code" type="info"
                        @click="[copyRoomCodeToClipboard(), $toast.success('Code copied to clipboard!')]" />
                </div>
                <div class="font-bold pl-1">
                    <span>Player's list:</span>
                </div>
                <div v-for="p in _room.players"
                    class="flex items-center justify-start bg-white shadow-lg rounded-lg p-2 w-full" :key="p.username">
                    <img :src="avatars[p.avatar as number]" class="w-14 border rounded-full" />
                    <div class="ml-12 font-semibold">
                        {{ p.username }}
                        <b class="text-xl text-center" v-if="p.roomOwner">👑</b>
                    </div>
                </div>
                <div class="flex justify-center">
                    <CustomButton v-if="_room.mainPlayer.roomOwner" class="max-w-40" label="Start game" type="save"
                        @click="startGame" />
                    <span v-else class="text-lg font-semibold">The room leader will start the game soon.</span>
                </div>
            </div>
        </div>
        <div class="w-2/3 lg:w-3/4 md:w-2/3 mt-16">
            <div class="bg-green-700 h-5/6 w-3/4 rounded-md relative m-auto" v-if="_game.hands.length && !champion()">
                <div v-for="(playerCards, hi) in _game.hands" :key="hi" :id="'hand' + (hi + 1)"
                    class="absolute transform w-24 h-24" :class="handPosition(playerCards)">
                    <div class="flex justify-center mb-2 bg-gray-900 rounded-md">
                        <span v-for="l in playerCards.life">💖&nbsp;</span>
                    </div>
                    <div class="flex" v-if="playerCards.username === _room.mainPlayer.username">
                        <div class="flex justify-center items-center space-x-[-60px]" id="hands-cards">
                            <img v-for="(card, i) in playerCards.hand" :key="i" @click="() => selectCard(card)"
                                :id="`card-${card.id}`" :src="card.img"
                                :class="['transform transition-transform w-24 h-32 shadow-lg bg-center bg-cover', (card.selected ? 'animate-rotate-to-center translate-y-3 border-4 border-blue-500 shadow-2xl' : '')]"
                                :style="{ transform: `rotate(${[-15, -7.5, 0, 7.5, 15][i]}deg)` }" />
                        </div>
                    </div>
                    <div class="flex" v-else>
                        <div class="flex justify-center items-center space-x-[-60px]">
                            <img v-for="(card, i) in playerCards.hand" :key="i" @click="() => selectCard(card)"
                                :id="`card-${card.id}`" :src="CARD_IMAGES.no_card"
                                :class="'transform transition-transform w-24 h-32 shadow-lg bg-center bg-cover'"
                                :style="{ transform: `rotate(${[-15, -7.5, 0, 7.5, 15][i]}deg)` }" />
                        </div>
                    </div>
                    <div v-if="playerCards.username === _game.turn" class="flex pt-5 justify-center flex-row">
                        <div v-if="playerCards.username === _room.mainPlayer.username" class="flex flex-row">
                            <CustomButton label="Liar" type="cancel" v-if="_game.table.cards.length > 0"
                                @click="() => dropCards(true)" />
                            <CustomButton label="Drop" type="save" @click="() => dropCards(false)" />
                        </div>
                        <div v-else class="rounded-full bg-red-700 h-5 w-5 pl-0"></div>
                    </div>
                </div>
                <div>
                    <div v-if="_game.cardType" class="absolute w-[200px] ml-8 top-[35%] left-[calc(50%-100px)]">
                        <span
                            class="bg-yellow-100 text-yellow-800 text-lg px-6 py-1.5 rounded dark:bg-yellow-900 dark:text-yellow-300 font-bold">
                            {{ _game.cardType }}'s table
                        </span>
                    </div>
                    <div v-if="_game.table.cards.length > 0"
                        class="flex flex-wrap max-w-72 justify-center gap-5 absolute top-[calc(50%-50px)] left-[calc(50%-145px)] fade-in">
                        <img v-for="(card, i) in _game.table.cards" :key="i" :src="CARD_IMAGES.no_card"
                            :class="'w-18 h-24'" :id="'table-card-' + card.id" />
                    </div>
                </div>
            </div>
            <div class="flex bg-green-700 h-5/6 w-3/4 rounded-md relative m-auto" v-else-if="champion()">
                <div class="m-auto flex justify-center flex-col">
                    <span class="text-white text-lg text-center ml-4 mb-10 font-bold">{{ champion() + ' wins!!!'
                        }}</span>
                    <CustomButton label="Let's go again!" type="save" @click="startGame" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { socket } from "@/socket";
import { avatars } from "~/assets/avatars";

const { $toast }: any = useNuxtApp();

const _room = useRoom();
const _game = useGame();

const randomizeMainPlayer = () => {
    _room.mainPlayer.username = 'user_' + new Date().getTime().toString();
    _room.mainPlayer.avatar = Math.floor(Math.random() * avatars.length);
}

onMounted(() => {
    window.addEventListener("beforeunload", onPlayerDisconected);
    randomizeMainPlayer();
})

const onPlayerDisconected = () => {
    socket.emit('left-room', _room);
}
socket.on('player-left', (players, leftPlayer) => {
    _room.players = players;
    notifyLocally('info', `${leftPlayer.username} saiu da sala!`);
});

// Server Notifications
const notifyLocally = (type: 'error' | 'info' | 'success', message: string) => $toast[type](message);
socket.on('send-notification', ({ type, message }) => notifyLocally(type, message));

</script>