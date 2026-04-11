import { reactive, ref } from 'vue';
import { socket } from '~/socket';

type PeerEntry = { connection: RTCPeerConnection; stream: MediaStream | null };

export const localStream = ref<MediaStream | null>(null);
export const peers = reactive<Record<string, PeerEntry>>({});
export const enabledPeers = reactive(new Set<string>());
export const isEnabled = ref(false);
export const isMuted = ref(false);
export const isCamOff = ref(false);

const ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
];

const createPeer = (remoteId: string): RTCPeerConnection => {
    if (peers[remoteId]) {
        peers[remoteId].connection.close();
        delete peers[remoteId];
    }

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    if (localStream.value) {
        localStream.value.getTracks().forEach(t => pc.addTrack(t, localStream.value!));
    } else {
        pc.addTransceiver('video', { direction: 'recvonly' });
        pc.addTransceiver('audio', { direction: 'recvonly' });
    }

    pc.onicecandidate = ({ candidate }) => {
        if (candidate) socket.emit('webrtc-ice', { to: remoteId, candidate });
    };

    pc.ontrack = ({ streams }) => {
        if (peers[remoteId]) peers[remoteId].stream = streams[0];
    };

    peers[remoteId] = { connection: pc, stream: null };
    return pc;
};

const closePeer = (id: string) => {
    peers[id]?.connection.close();
    delete peers[id];
    enabledPeers.delete(id);
};

export const enableWebRTC = async (roomId: string) => {
    try {
        localStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        isEnabled.value = true;

        for (const [remoteId, entry] of Object.entries(peers)) {
            const pc = entry.connection;
            if (pc.signalingState === 'closed') continue;
            localStream.value.getTracks().forEach(t => pc.addTrack(t, localStream.value!));
            try {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit('webrtc-offer', { to: remoteId, offer });
            } catch { /* ignore */ }
        }

        socket.emit('webrtc-join', { roomId });
    } catch {
        localStream.value = null;
        isEnabled.value = false;
    }
};

export const disableWebRTC = (roomId: string) => {
    localStream.value?.getTracks().forEach(t => t.stop());
    localStream.value = null;
    Object.keys(peers).forEach(closePeer);
    isEnabled.value = false;
    isMuted.value = false;
    isCamOff.value = false;
    socket.emit('webrtc-leave', { roomId });
};

export const toggleMute = () => {
    const track = localStream.value?.getAudioTracks()[0];
    if (track) { track.enabled = !track.enabled; isMuted.value = !track.enabled; }
};

export const toggleCam = () => {
    const track = localStream.value?.getVideoTracks()[0];
    if (track) { track.enabled = !track.enabled; isCamOff.value = !track.enabled; }
};

socket.on('webrtc-user-joined', async ({ from }: { from: string }) => {
    enabledPeers.add(from);
    if (peers[from]?.stream) return;
    const pc = createPeer(from);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('webrtc-offer', { to: from, offer });
});

socket.on('webrtc-offer', async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
    enabledPeers.add(from);

    let pc: RTCPeerConnection;
    const existing = peers[from];

    if (existing && existing.connection.signalingState !== 'closed') {
        pc = existing.connection;
    } else {
        pc = createPeer(from);
    }

    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit('webrtc-answer', { to: from, answer });
});

socket.on('webrtc-answer', async ({ from, answer }: { from: string; answer: RTCSessionDescriptionInit }) => {
    const pc = peers[from]?.connection;
    if (pc && pc.signalingState === 'have-local-offer') {
        await pc.setRemoteDescription(answer);
    }
});

socket.on('webrtc-ice', async ({ from, candidate }: { from: string; candidate: RTCIceCandidateInit }) => {
    const pc = peers[from]?.connection;
    if (pc && pc.remoteDescription) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
});

socket.on('webrtc-user-left', ({ from }: { from: string }) => closePeer(from));

socket.on('disconnect', () => {
    localStream.value?.getTracks().forEach(t => t.stop());
    localStream.value = null;
    Object.keys(peers).forEach(closePeer);
    enabledPeers.clear();
    isEnabled.value = false;
});
