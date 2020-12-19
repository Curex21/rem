import React, { FC, Ref, useEffect } from "react";
import { Socket } from "socket.io-client";
// import { Manager } from "socket.io-client";
import { SOCKETIO_ENDPOINT, useSocketBroadcaster } from "./socket";
// import { zmqSetup } from "./zmq";

interface PropsBroadcaster {
    canvasElement: HTMLCanvasElement | undefined;
    socket: Socket;
}

const Broadcaster: FC<PropsBroadcaster> = ({ canvasElement: canvasRef, socket }: PropsBroadcaster) => {
    const [connect] = useSocketBroadcaster(socket);

    useEffect(() => {
        connect();

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
