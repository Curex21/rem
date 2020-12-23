import React, { FC, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import Peer from "peerjs";
// import { SOCKETIO_ENDPOINT } from "./socket";
// import { Manager } from "socket.io-client";
// import socketIOClient from "socket.io-client";

interface RemoteBoardProps {
    canvasElement?: HTMLCanvasElement;
    socket: Socket;
}

const RemoteBoard: FC<RemoteBoardProps> = ({ canvasElement, socket }: RemoteBoardProps) => {
    const [remoteCanvas, setRemoteCanvas] = useState<HTMLVideoElement[]>([]);
    useEffect(() => {
        if (!canvasElement) {
            return;
        }

        const peer = new Peer();

        socket.on("contact-list", (nodes: Array<string>) => {
            console.log("list: ", nodes);
            nodes
                .filter((n) => n !== peer.id)
                .forEach((n) => {
                    console.log(`calling ${n}...`);

                    //@ts-ignore
                    let stream: MediaStream = canvasElement.captureStream(25);
                    console.log("my own canvas stream", stream);

                    const call = peer.call(n, stream);

                    call.on("stream", (remoteStream: MediaStream) => {
                        const video = document.createElement("video");
                        video.srcObject = remoteStream;
                        video.playsInline = true;
                        video.autoplay = true;
                        video.muted = true;
                        setRemoteCanvas([...remoteCanvas, video]);
                    });
                });
        });

        peer.on("open", (id: string) => socket.emit("register-node", id));

        peer.on("call", (call: Peer.MediaConnection) => {
            //@ts-ignore
            let stream: MediaStream = canvasElement.captureStream(25);
            console.log("my own canvas stream", stream);
            call.answer(stream); // Answer the call with an A/V stream.
            call.on("stream", (remoteStream) => {
                // Show stream in some <video> element.
                console.log("unhandled stream:", remoteStream);
            });
        });
    }, [canvasElement]);

    return (
        <div>
            I'm an Remote Board
            {remoteCanvas.map((c) => (
                <div>canvas {c}</div>
            ))}
        </div>
    );
};

export default RemoteBoard;
