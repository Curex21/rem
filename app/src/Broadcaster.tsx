import React, { FC, useEffect } from "react";
import { Manager } from "socket.io-client";
import { SOCKETIO_ENDPOINT } from "./socket";

const Broadcaster: FC = () => {
    useEffect(() => {
        const peerConnections: { [key: string]: RTCPeerConnection } = {};

        const config = {
            iceServers: [
                {
                    urls: ["stun:stun.l.google.com:19302"],
                },
            ],
        };

        const socket = new Manager(SOCKETIO_ENDPOINT);

        const video = document.querySelector("video");

        if (video === undefined || video === null) {
            return;
        }
        // Media contrains
        const constraints = {
            video: { facingMode: "user" },
            // Uncomment to enable audio
            // audio: true,
        };

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
                video.srcObject = stream;
                socket.emit("broadcaster");
                console.log(video);
            })
            .catch((error) => console.error(error));

        socket.on("watcher", (id: string) => {
            const peerConnection = new RTCPeerConnection(config);
            peerConnections[id] = peerConnection;

            let stream = video.srcObject;
            if (stream === undefined || stream === null) {
                return;
            }

            (stream as MediaStream)
                .getTracks()
                .forEach((track) => peerConnection.addTrack(track, stream as MediaStream));

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit("candidate", id, event.candidate);
                }
            };

            peerConnection
                .createOffer()
                .then((sdp) => peerConnection.setLocalDescription(sdp))
                .then(() => {
                    socket.emit("offer", id, peerConnection.localDescription);
                });
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

        window.onunload = window.onbeforeunload = () => {
            socket._close();
        };
    }, []);

    return (
        <div>
            I'm the broadcaster
            <video playsInline autoPlay muted></video>
        </div>
    );
};

export default Broadcaster;
