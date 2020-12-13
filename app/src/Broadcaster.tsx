import React, { FC, useEffect } from "react";
import socketIO from "socket.io";

const Broadcaster: FC = () => {
    useEffect(() => {
        const peerConnections = {};
        const config = {
            iceServers: [
                {
                    urls: ["stun:stun.l.google.com:19302"],
                },
            ],
        };

        // const socket = io.connect(window.location.origin);
        const video = document.querySelector("video");

        // Media contrains
        const constraints = {
            video: { facingMode: "user" },
            // Uncomment to enable audio
            // audio: true,
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
