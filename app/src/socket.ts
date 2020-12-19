export const SOCKETIO_ENDPOINT = "http://127.0.0.1:4001";
import { io, Socket } from "socket.io-client";

export const useSocketConnection = () => {
    const socket = io(SOCKETIO_ENDPOINT, {
        transports: ["websocket"],
        upgrade: false,
    });

    return socket;
};

export const useSocketBroadcaster = (socket: Socket) => {
    let peerConnections: { [key: string]: RTCPeerConnection } = {};
    let ownID: string;

    const config = {
        iceServers: [
            {
                urls: ["stun:stun.l.google.com:19302"],
            },
        ],
    };

    socket.on("node-connection", (peerID: string) => {
        console.log(`node-connection (${peerID}) send to node-watcher (${ownID})`);
        socket.send("node-watcher", ownID);
        // socket.to(peerID).emit(); // cross roads
    });

    socket.on("node-watcher", (who: string) => {
        const peerConnection = new RTCPeerConnection(config);
        peerConnections[who] = peerConnection;

        //@ts-ignore
        let stream: MediaStream = canvasRef.captureStream(25);

        console.log(stream);

        // stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

        // peerConnection.onicecandidate = (event) => {
        //     if (event.candidate) {
        //         socket.emit("candidate", id, event.candidate);
        //     }
        // };

        // peerConnection
        //     .createOffer()
        //     .then((sdp) => peerConnection.setLocalDescription(sdp))
        //     .then(() => {
        //         socket.emit("offer", id, peerConnection.localDescription);
        //     });
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
        socket.send("node-connection");
    };

    return [connect];
};
