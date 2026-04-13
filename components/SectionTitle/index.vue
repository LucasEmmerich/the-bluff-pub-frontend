<template>
    <div class="flex flex-col items-center gap-4">
        <div class="flex items-center gap-4 w-full">
            <div class="flex-1 h-px" style="background: linear-gradient(to right, transparent, rgba(184,134,11,0.5));"></div>
            <h2 class="font-pub text-pub-gold text-2xl md:text-3xl font-bold tracking-widest whitespace-nowrap">
                <slot />
            </h2>
            <div class="flex-1 h-px" style="background: linear-gradient(to left, transparent, rgba(184,134,11,0.5));"></div>
        </div>
    </div>
</template>
