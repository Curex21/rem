import { io, Socket } from "socket.io-client";
import useStore from "./store";
import shallow from "zustand/shallow";
import { useState } from "react";

export const SOCKETIO_ENDPOINT = "http://127.0.0.1:4001";

export const useSocketConnection = () => {
    const [socket, setSocket] = useState<Socket>(
        io(SOCKETIO_ENDPOINT, {
            // transports: ["websocket"],
            // upgrade: false,
        })
    );
    return socket;
};

export const useSocketBroadcaster = (socket: Socket, performWatcher: (id: string, conn: RTCPeerConnection) => void) => {
    const [peerConnections, registerNewPeer] = useStore(
        (store) => [store.peerConnections, store.registerNewPeer],
        shallow
    );

    const config = {
        iceServers: [
            {
                urls: ["stun:stun.l.google.com:19302"],
            },
        ],
    };

    socket.on("node-connection", (peerID: string) => {
        // console.log(`[${socket.id}] node-connection: (${peerID}) send to node-watcher`);
        socket.emit("node-watcher", peerID);
        // socket.to(peerID).emit(); // cross roads
    });

    socket.on("node-watcher", (who: string) => {
        console.log(`node-watcher: ${who}`);
        const peerConnection = new RTCPeerConnection(config);
        registerNewPeer(who, peerConnection);
        // peerConnections[who] = peerConnection;
        performWatcher(who, peerConnection);
    });

    socket.on("answer", (id: string, description: RTCSessionDescription) => {
        peerConnections[id].setRemoteDescription(description);
    });

    socket.on("candidate", (id: string, candidate: RTCIceCandidateInit) => {
        peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("disconnectPeer", (id: string) => {
        peerConnections[id].close();
        delete peerConnections[id];
    });

    const connect = () => {
        console.log("sending node-connection event");
        socket.emit("node-connection");
    };

    return [connect];
};
