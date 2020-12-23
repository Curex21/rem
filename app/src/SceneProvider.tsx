import React, { createRef, FC, RefObject, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import Peer from "peerjs";

interface RemoteData {
    type: "hello" | "bye";
}

interface Node {
    id: string;
    color: string;
}
interface MediaStreamRef {
    media: MediaStream;
    ref: RefObject<HTMLVideoElement> | null;
}

interface PeerConnection {
    [key: string]: MediaStreamRef;
}

interface RemoteBoardProps {
    socket: Socket;
    width?: string | number;
    height?: string | number;
}

const SceneProvider: FC<RemoteBoardProps> = ({ socket, width, height }: RemoteBoardProps) => {
    // const [videoRefs, setVideoRefs] = useState<RefObject<HTMLVideoElement>[]>([]);

    const [remoteCanvas, setRemoteCanvas] = useState<PeerConnection>({});

    const totalRemotes = Object.keys(remoteCanvas).length;

    useEffect(() => {
        let finalRemotes: PeerConnection = { ...remoteCanvas };

        Object.keys(remoteCanvas).map((r) => {
            if (remoteCanvas[r].ref === null) {
                finalRemotes[r].ref = createRef();
            }
        });

        setRemoteCanvas(finalRemotes);
    }, [totalRemotes]);

    useEffect(() => {
        Object.keys(remoteCanvas).map((r) => {
            if (remoteCanvas[r].ref !== null && remoteCanvas[r].ref?.current != null) {
                //@ts-ignore
                remoteCanvas[r].ref.current!.srcObject = remoteCanvas[r].media;
            }
        });
    }, [remoteCanvas]);

    useEffect(() => {
        const peer = new Peer();

        socket.on("contact-list", (nodes: Array<Node>) => {
            console.log(`I'm ${peer.id}, ready to connect with my peers`);

            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    nodes.forEach((node: Node) => {
                        console.log(`calling to ${node.id}`);

                        const conn = peer.connect(node.id);

                        const call = peer.call(node.id, stream);
                        call.on("stream", (remoteStream) => {
                            // Show stream in some <video> element.
                            console.log("stablished stream connection");
                            setRemoteCanvas((r) => ({ ...r, [call.peer]: { media: remoteStream, ref: null } }));
                        });

                        conn.on("data", (data: RemoteData) => {
                            console.log(`event [${data.type}] from ${conn.peer}`);
                        });

                        conn.on("close", () => {
                            console.log(`event [close] from ${conn.peer}`);
                            let newRemoteCanvas = { ...remoteCanvas };
                            delete newRemoteCanvas[call.peer];
                            setRemoteCanvas(newRemoteCanvas);
                        });

                        conn.send("hello");

                        // const call = peer.call(node.id, stream);

                        // call.on("stream", (remoteStream: MediaStream) => {
                        //     setRemoteCanvas((r) => ({ ...r, [call.peer]: { media: remoteStream, ref: null } }));
                        // });

                        // call.on("close", () => {
                        //     console.log(`closing call with ${call.peer}`);
                        //     let newRemoteCanvas = { ...remoteCanvas };
                        //     delete newRemoteCanvas[call.peer];
                        //     setRemoteCanvas(newRemoteCanvas);
                        // });
                    });
                })
                .catch((err) => console.log(err));
        });

        peer.on("open", (id: string) => socket.emit("register-node", id));

        peer.on("call", (call: Peer.MediaConnection) => {
            console.log(`call from ${call.peer}`);

            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                call.answer(stream);

                call.on("stream", (remoteStream: MediaStream) => {
                    setRemoteCanvas((r) => ({ ...r, [call.peer]: { media: remoteStream, ref: null } }));
                });

                call.on("close", () => {
                    console.log(`closing call with ${call.peer}`);
                    let newRemoteCanvas = { ...remoteCanvas };
                    delete newRemoteCanvas[call.peer];
                    setRemoteCanvas(newRemoteCanvas);
                });

                const conn = peer.connect(call.peer);

                conn.on("data", (data: RemoteData) => {
                    console.log(`event [${data.type}] from ${conn.peer}`);
                });

                conn.on("close", () => {
                    console.log(`event [close] from ${conn.peer}`);
                    let newRemoteCanvas = { ...remoteCanvas };
                    delete newRemoteCanvas[call.peer];
                    setRemoteCanvas(newRemoteCanvas);
                });
            });
        });

        peer.on("close", () => {
            console.log("closing");
        });

        peer.on("disconnected", () => {
            console.log("disconnecting");
        });
    }, []);

    return (
        <>
            {Object.keys(remoteCanvas).map((r, i) => (
                <video
                    ref={remoteCanvas[r].ref}
                    key={i}
                    autoPlay
                    muted
                    width={width}
                    height={height}
                    style={{ position: "absolute", mixBlendMode: "lighten" }}
                ></video>
            ))}
        </>
    );
};

export default SceneProvider;
