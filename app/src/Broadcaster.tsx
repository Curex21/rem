import React, { FC, Ref, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
// import { Manager } from "socket.io-client";
import { SOCKETIO_ENDPOINT, useSocketBroadcaster } from "./socket";
// import { zmqSetup } from "./zmq";

interface PropsBroadcaster {
    canvasElement?: HTMLCanvasElement;
    socket: Socket;
}

const Broadcaster: FC<PropsBroadcaster> = ({ socket, canvasElement }: PropsBroadcaster) => {
    console.log(canvasElement);

    const [connect] = useSocketBroadcaster(socket, (id, peerConnection) => {
        //@ts-ignore
        let stream: MediaStream = canvasElement.captureStream(25);

        console.log(stream);

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
        canvasElement && connect();

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
