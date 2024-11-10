<template>
    <div class="w-full max-w-sm min-w-[200px]">
        <span class="flex items-start mt-2 text-sm text-slate-500 p-2">{{ label }}</span>
        <div class="relative">
            <input v-bind="$attrs" v-model="model"
                class="w-full pl-3 pr-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" />
            <p v-if="sublabel" class="flex items-start mt-2 text-xs text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mr-1.5">
                    <path fill-rule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                        clip-rule="evenodd" />
                </svg>
                {{ sublabel }}
            </p>
        </div>
    </div>
</template>
<script setup lang="ts">
type Props = {
    label?: string,
    sublabel?: string
};
defineProps<Props>();
const model = defineModel<string>()
</script>