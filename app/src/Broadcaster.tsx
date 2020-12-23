import React, { FC, Ref, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
// import { Manager } from "socket.io-client";
import { useSocket } from "./socket";
// import { zmqSetup } from "./zmq";

interface PropsBroadcaster {
    canvasElement?: HTMLCanvasElement;
    socket: Socket;
}

const Broadcaster: FC<PropsBroadcaster> = ({ socket, canvasElement }: PropsBroadcaster) => {
    // console.log(canvasElement);

    const [connect] = useSocket(socket, (id, peerConnection) => {
        console.log("perform offer to ice server", canvasElement);

        if (!canvasElement) {
            return;
        }

        //@ts-ignore
        let stream: MediaStream = canvasElement.captureStream(25);

        console.log("my own canvas stream", canvasElement);

        stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

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

    useEffect(() => {
        if (canvasElement) {
            console.log("connecting");
            connect();
        }

        return () => {
            // console.log("sending socket disconnection");
            // socket.close();
        };
    }, [canvasElement]);

    // useEffect(() => {
    //     setSocketID(socket.id);
    // }, [socket]);

    return (
        <div>
            I'm the broadcaster
            <video id="broadcaster" playsInline autoPlay muted></video>
        </div>
    );
};

export default Broadcaster;
