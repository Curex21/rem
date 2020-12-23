import React, { useRef, useState } from "react";
import RemoteBoards from "./RemoteBoard";
import BasicBoard from "./BasicBoard";
// import styled from "styled-components";

import { createSocketConnection } from "./socket";
import { Socket } from "socket.io-client";

interface AppProps {
    socket: Socket;
}

const App: React.FC<AppProps> = ({ socket }: AppProps) => {
    // const canvasRef = useRef<HTMLCanvasElement>();
    const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement>();

    const width = 860;
    const height = 640;
    // console.log(canvasRef);

    const colors = ["#21f533", "#4821f5", "#e7f521", "#21f5d9", "#f54121"];

    return (
        <div style={{ position: "relative", backgroundColor: "black" }}>
            {/* <div style={{ position: "absolute" }}> */}
            <RemoteBoards canvasElement={canvasElement} socket={socket} width={width} height={height} />
            {/* </div> */}
            <div style={{ position: "absolute", mixBlendMode: "lighten" }}>
                <BasicBoard
                    width={width}
                    height={height}
                    pointerColor={colors[Math.floor(Math.random() * colors.length)]}
                    pointerScale={2}
                    onCanvasLoaded={(canvas) => setCanvasElement(canvas?.children[0] as HTMLCanvasElement)}
                />
            </div>
        </div>
    );
};

export default App;
