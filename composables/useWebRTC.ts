import { reactive, ref } from "vue";
import { socket } from "~/socket";

type PeerEntry = { connection: RTCPeerConnection; stream: MediaStream | null };

export const localStream = ref<MediaStream | null>(null);
export const peers = reactive<Record<string, PeerEntry>>({});
export const enabledPeers = reactive(new Set<string>());
export const isAudioEnabled = ref(false);
export const isCamEnabled = ref(false);

const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }];

let webrtcJoined = false;

const createPeer = (remoteId: string): RTCPeerConnection => {
    if (peers[remoteId]) {
        peers[remoteId].connection.close();
        delete peers[remoteId];
    }

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    if (localStream.value) {
        localStream.value.getTracks().forEach((t) => pc.addTrack(t, localStream.value!));
    } else {
        pc.addTransceiver("video", { direction: "recvonly" });
        pc.addTransceiver("audio", { direction: "recvonly" });
    }

    pc.onicecandidate = ({ candidate }) => {
        if (candidate) socket.emit("webrtc-ice", { to: remoteId, candidate });
    };

    pc.ontrack = ({ streams }) => {
        if (!peers[remoteId]) return;
        peers[remoteId].stream = streams[0];
        streams[0].onremovetrack = () => {
            if (peers[remoteId] && streams[0].getTracks().length === 0) {
                peers[remoteId].stream = null;
            }
        };
    };

    peers[remoteId] = { connection: pc, stream: null };
    return pc;
};

const closePeer = (id: string) => {
    peers[id]?.connection.close();
    delete peers[id];
    enabledPeers.delete(id);
};

const ensureLocalStream = (): MediaStream => {
    if (!localStream.value) localStream.value = new MediaStream();
    return localStream.value;
};

const renegotiate = async () => {
    for (const [remoteId, entry] of Object.entries(peers)) {
        const pc = entry.connection;
        if (pc.signalingState === "closed") continue;
        try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit("webrtc-offer", { to: remoteId, offer });
        } catch {}
    }
};

const joinIfNeeded = (roomId: string) => {
    if (!webrtcJoined) {
        socket.emit("webrtc-join", { roomId });
        webrtcJoined = true;
    }
};

const cleanupIfEmpty = () => {
    if (!isAudioEnabled.value && !isCamEnabled.value) {
        localStream.value = null;
        webrtcJoined = false;
    }
};

export const toggleAudio = async (roomId: string) => {
    if (isAudioEnabled.value) {
        localStream.value?.getAudioTracks().forEach((t) => {
            t.stop();
            localStream.value?.removeTrack(t);
        });
        isAudioEnabled.value = false;
        cleanupIfEmpty();
        await renegotiate();
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const ls = ensureLocalStream();
            stream.getAudioTracks().forEach((t) => {
                ls.addTrack(t);
                Object.values(peers).forEach(({ connection: pc }) => {
                    if (pc.signalingState !== "closed") pc.addTrack(t, ls);
                });
            });
            isAudioEnabled.value = true;
            joinIfNeeded(roomId);
            await renegotiate();
        } catch {}
    }
};

export const toggleCam = async (roomId: string) => {
    if (isCamEnabled.value) {
        localStream.value?.getVideoTracks().forEach((t) => {
            t.stop();
            localStream.value?.removeTrack(t);
        });
        isCamEnabled.value = false;
        cleanupIfEmpty();
        await renegotiate();
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const ls = ensureLocalStream();
            stream.getVideoTracks().forEach((t) => {
                ls.addTrack(t);
                Object.values(peers).forEach(({ connection: pc }) => {
                    if (pc.signalingState !== "closed") pc.addTrack(t, ls);
                });
            });
            isCamEnabled.value = true;
            joinIfNeeded(roomId);
            await renegotiate();
        } catch {}
    }
};

if (import.meta.client) {
    socket.on("webrtc-user-joined", async ({ from }: { from: string }) => {
        enabledPeers.add(from);
        const existing = peers[from];
        if (existing && existing.connection.signalingState !== "closed") return;
        const pc = createPeer(from);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("webrtc-offer", { to: from, offer });
    });

    socket.on("webrtc-offer", async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
        enabledPeers.add(from);

        let pc: RTCPeerConnection;
        const existing = peers[from];

        if (existing && existing.connection.signalingState !== "closed") {
            pc = existing.connection;
        } else {
            pc = createPeer(from);
        }

        await pc.setRemoteDescription(offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("webrtc-answer", { to: from, answer });
    });

    socket.on("webrtc-answer", async ({ from, answer }: { from: string; answer: RTCSessionDescriptionInit }) => {
        const pc = peers[from]?.connection;
        if (pc && pc.signalingState === "have-local-offer") {
            await pc.setRemoteDescription(answer);
        }
    });

    socket.on("webrtc-ice", async ({ from, candidate }: { from: string; candidate: RTCIceCandidateInit }) => {
        const pc = peers[from]?.connection;
        if (pc && pc.remoteDescription) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
    });

    socket.on("webrtc-user-left", ({ from }: { from: string }) => closePeer(from));

    socket.on("disconnect", () => {
        localStream.value?.getTracks().forEach((t) => t.stop());
        localStream.value = null;
        isAudioEnabled.value = false;
        isCamEnabled.value = false;
        webrtcJoined = false;
        Object.keys(peers).forEach(closePeer);
        enabledPeers.clear();
    });
}
