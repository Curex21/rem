import React, { useEffect } from "react";
import socketIO from "socket.io";
import { Manager } from "socket.io-client";
import { SOCKETIO_ENDPOINT } from "./socket";

const Actor = () => {
    useEffect(() => {
        let peerConnection: RTCPeerConnection;

        const config = {
            iceServers: [
                {
                    urls: ["stun:stun.l.google.com:19302"],
                },
            ],
        };

        const socket = new Manager(SOCKETIO_ENDPOINT);

        const video = document.querySelector("video#actor");

        if (video === undefined || video === null) {
            return;
        }
        // Media contrains
        const constraints = {
            video: { facingMode: "user" },
            // Uncomment to enable audio
            // audio: true,
        };

        socket.on("offer", (id: string, description: RTCSessionDescriptionInit) => {
            peerConnection = new RTCPeerConnection(config);
            peerConnection
                .setRemoteDescription(description)
                .then(() => peerConnection.createAnswer())
                .then((sdp) => peerConnection.setLocalDescription(sdp))
                .then(() => {
                    socket.emit("answer", id, peerConnection.localDescription);
                });
            peerConnection.ontrack = (event) => {
                video.srcObject = event.streams[0];
            };
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit("candidate", id, event.candidate);
                }
            };
        });

        socket.on("candidate", (id: string, candidate: RTCIceCandidateInit) => {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch((e) => console.error(e));
        });

        socket.on("connect", () => {
            socket.emit("watcher");
        });

        socket.on("broadcaster", () => {
            socket.emit("watcher");
        });

        socket.on("disconnectPeer", () => {
            peerConnection.close();
        });

        window.onunload = window.onbeforeunload = () => {
            socket._close();
        };
    }, []);

    return (
        <div>
            I'm an Actor
            <video id={"actor"} playsInline autoPlay></video>
        </div>
    );
};

export default Actor;
