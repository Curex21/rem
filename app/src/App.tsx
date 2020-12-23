import React, { useRef, useState } from "react";
import RemoteBoards from "./RemoteBoard";
import BasicBoard from "./BasicBoard";
// import styled from "styled-components";

import { useSocketConnection } from "./socket";

const App: React.FC = () => {
    // const canvasRef = useRef<HTMLCanvasElement>();
    const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement>();
    const socket = useSocketConnection();

    const width = 600;
    const height = 400;
    // console.log(canvasRef);

    const colors = ["#e7f521", "#21f5d9", "#f54121"];
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
