import React, { useRef } from "react";
import Actor from "./Actor";
import BasicBoard from "./BasicBoard";
import Broadcaster from "./Broadcaster";
import { useSocketConnection } from "./socket";

const App: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>();
    const socket = useSocketConnection();

    return (
        <>
            <BasicBoard
                pointerColor={"#0ef5ce"}
                pointerScale={3}
                onCanvasLoaded={(canvas) => (canvasRef.current = canvas as HTMLCanvasElement)}
            />
            <Broadcaster canvasElement={canvasRef.current} socket={socket} />
            {/* <Actor /> */}
        </>
    );
};

export default App;
