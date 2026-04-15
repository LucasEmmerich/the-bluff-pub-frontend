<template>
    <div class="min-h-full flex items-center justify-center px-6 py-16" style="background: #0a0603;">

        <div class="flex flex-col items-center gap-10 text-center" style="max-width: 480px;">

            <h1 class="font-pub font-black tracking-widest" style="font-size: 3.5rem; color: #f0c040; text-shadow: 0 0 40px rgba(184,134,11,0.35);">
                BLUFF<span style="color: rgba(255,248,238,0.7);">PUB</span>
            </h1>

            <p class="font-body leading-relaxed" style="color: rgba(255,248,238,0.45); font-size: 0.95rem;">
                Real-time multiplayer bluffing card game for 2–4 players.
                Play cards face down, lie about what you played, and catch everyone else doing the same.
            </p>

            <div class="flex flex-col items-center gap-3">
                <span class="font-pub text-[10px] tracking-[0.5em] uppercase" style="color: rgba(184,134,11,0.4);">Built with</span>
                <div class="flex items-center gap-5">
                    <div v-for="tech in stack" :key="tech.name" class="flex flex-col items-center gap-1.5">
                        <img :src="tech.icon" :alt="tech.name" class="w-7 h-7" style="filter: grayscale(20%);" />
                        <span class="font-body text-[9px] tracking-wide" style="color: rgba(196,168,130,0.35);">{{ tech.name }}</span>
                    </div>
                </div>
            </div>

            <div class="h-px w-24" style="background: rgba(184,134,11,0.15);"></div>

            <div class="flex flex-col items-center gap-4">
                <div class="flex flex-col items-center gap-1">
                    <span class="font-pub font-black tracking-widest text-lg" style="color: rgba(255,248,238,0.7);">Lucas Araujo Emmerich</span>
                    <span class="font-body text-xs" style="color: rgba(196,168,130,0.35);">Senior Full-stack Developer</span>
                </div>
                <div class="flex items-center gap-3">
                    <a href="https://github.com/LucasEmmerich" target="_blank"
                        class="font-pub text-[10px] tracking-[0.3em] uppercase px-5 py-2 rounded-full transition-all duration-200 hover:opacity-80"
                        style="border: 1px solid rgba(184,134,11,0.25); color: rgba(184,134,11,0.55);">
                        GitHub
                    </a>
                    <a href="https://www.linkedin.com/in/lucas-araujoemmerich" target="_blank"
                        class="font-pub text-[10px] tracking-[0.3em] uppercase px-5 py-2 rounded-full transition-all duration-200 hover:opacity-80"
                        style="border: 1px solid rgba(184,134,11,0.25); color: rgba(184,134,11,0.55);">
                        LinkedIn
                    </a>
                </div>
            </div>

        </div>

    </div>
</template>

<script setup lang="ts">
useHead({ title: 'About — Bluff Pub' });

const stack = [
    { name: 'Node.js',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
    { name: 'Vue',        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg' },
    { name: 'Nuxt',       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nuxtjs/nuxtjs-original.svg' },
    { name: 'Tailwind',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
    { name: 'Socket.IO',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/socketio/socketio-original.svg' },
];
</script>
