import React, { FC, Ref, useEffect } from "react";
// import { Manager } from "socket.io-client";
import { SOCKETIO_ENDPOINT } from "./socket";
import socketIOClient from "socket.io-client";

let peerConnections: { [key: string]: RTCPeerConnection } = {};
let ownID: string;

interface PropsBroadcaster {
    canvasElement: HTMLCanvasElement | undefined;
}

const Broadcaster: FC<PropsBroadcaster> = ({ canvasElement: canvasRef }: PropsBroadcaster) => {
    useEffect(() => {
        const config = {
            iceServers: [
                {
                    urls: ["stun:stun.l.google.com:19302"],
                },
            ],
        };

        //@ts-ignore
        const socket = socketIOClient(SOCKETIO_ENDPOINT);

        const video = document.querySelector<HTMLVideoElement>("video#broadcaster");

        if (video === undefined || video === null) {
            return;
        }

        const constraints = {
            video: { facingMode: "user" },
        };

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
                video.srcObject = stream;
                socket.emit("node-connection", socket.id);
            })
            .catch((error) => console.error(error));

        socket.on("node-connection", (peerID: string) => {
            console.log(`node-connection (${peerID}) send to node-watcher (${ownID})`);
            socket.to(peerID).emit("node-watcher", ownID); // cross roads
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

        // window.onunload = window.onbeforeunload = () => {
        //     ;
        // };

        return () => {
            // console.log("sending socket disconnection");
            // socket.close();
        };
    }, []);

    return (
        <div>
            I'm the broadcaster
            <video id="broadcaster" playsInline autoPlay muted></video>
        </div>
    );
};

export default Broadcaster;
