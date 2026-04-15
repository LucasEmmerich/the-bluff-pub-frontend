<template>
    <Teleport to="body">
        <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center"
            style="background: rgba(0,0,0,0.8); backdrop-filter: blur(4px);">
            <div class="flex flex-col items-center gap-6 p-8 rounded-2xl"
                style="background: #0a0603; border: 1px solid rgba(184,134,11,0.3); box-shadow: 0 0 60px rgba(0,0,0,0.8); width: 320px;">

                <div class="flex flex-col items-center gap-1.5 text-center">
                    <span class="font-pub font-black tracking-widest text-xl" style="color: #f0c040;">Who are you?</span>
                    <span class="font-body text-xs leading-relaxed" style="color: rgba(255,248,238,0.35);">
                        Pick an avatar and set your nickname.
                    </span>
                </div>

                <AvatarSelector :images="avatars" v-model="localAvatar" />

                <div class="w-full">
                    <TextInput v-model="localUsername" placeholder="Your nickname..." label="Nickname:" maxlength="16" />
                    <span v-if="usernameError" class="font-body text-[11px] px-1 mt-1 block" style="color: rgba(248,113,113,0.8);">{{ usernameError }}</span>
                </div>

                <CustomButton label="Sit Down" type="save" :disabled="!isValid" @click="confirm" />
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { avatars } from '~/assets/avatars';

const props = defineProps<{
    visible: boolean;
    initialUsername: string;
    initialAvatar: number;
}>();

const emit = defineEmits<{
    confirm: [username: string, avatar: number];
}>();

const localUsername = ref(props.initialUsername);
const localAvatar = ref(props.initialAvatar);

watch(() => props.initialUsername, val => { localUsername.value = val; });
watch(() => props.initialAvatar, val => { localAvatar.value = val; });

const usernameRegex = /^[a-zA-Z0-9]*$/;

const usernameError = computed(() => {
    const val = localUsername.value?.trim() ?? '';
    if (!val) return null;
    if (!usernameRegex.test(val)) return 'Letters and numbers only.';
    return null;
});

const isValid = computed(() => {
    const val = localUsername.value?.trim() ?? '';
    return val.length > 0 && usernameRegex.test(val);
});

const confirm = () => {
    if (!isValid.value) return;
    emit('confirm', localUsername.value.trim(), localAvatar.value);
};
</script>
