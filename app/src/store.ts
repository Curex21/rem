import create from "zustand";

type State = {
    peerConnections: { [key: string]: RTCPeerConnection };
    registerNewPeer: (peerID: string, conn: RTCPeerConnection) => void;
};

const useStore = create<State>((set) => ({
    peerConnections: {},
    registerNewPeer: (peerID: string, conn: RTCPeerConnection) =>
        set((state) => ({
            peerConnections: { ...state.peerConnections, [peerID]: conn },
        })),
}));

const createStore = () => {};

export default useStore;
