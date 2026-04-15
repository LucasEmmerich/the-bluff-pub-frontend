<template>
    <div class="min-h-screen flex flex-col" style="background: #0a0603; color: #f0e0c0;">

        <AppNav style="position: sticky; top: 0;" />

        <div class="flex-1 flex flex-col items-center justify-center gap-6 text-center px-6">

            <span class="font-pub font-black" style="font-size: 6rem; color: rgba(184,134,11,0.15); line-height: 1;">404</span>

            <div class="flex flex-col gap-2">
                <p class="font-pub font-black tracking-widest text-lg" style="color: rgba(255,248,238,0.6);">
                    Wrong table.
                </p>
                <p class="font-body italic text-sm" style="color: rgba(255,248,238,0.25);">
                    This seat doesn't exist.
                </p>
            </div>

            <NuxtLink to="/"
                class="font-pub text-xs tracking-[0.3em] uppercase px-6 py-2 rounded-full transition-all duration-200 hover:opacity-80"
                style="background: rgba(184,134,11,0.15); border: 1px solid rgba(184,134,11,0.3); color: #f0c040;">
                Back to the table
            </NuxtLink>

        </div>

    </div>
</template>

<script setup lang="ts">
useHead({ title: '404 — Bluff Pub' });
</script>
