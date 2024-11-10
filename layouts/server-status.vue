<template>
    <div class="flex flex-row bg-slate-100 p-1 absolute bottom-0 right-0 border-slate-500">
        <div v-if="state" class="bg-green-500 w-6 h-6 rounded-full"></div>
        <div v-else class="bg-red-500 w-6 h-6 rounded-full"></div>
        <span class="ml-2 font-bold">{{ state.connected ? ' Conectado' : ' Desconectado' }}</span>
    </div>
</template>
<script setup lang="ts">
import { state } from "@/socket";
</script>