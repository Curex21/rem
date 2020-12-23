import React, { useRef, useState } from "react";
import RemoteBoard from "./RemoteBoard";
import BasicBoard from "./BasicBoard";
import Broadcaster from "./Broadcaster";
import { useSocketConnection } from "./socket";

const App: React.FC = () => {
    // const canvasRef = useRef<HTMLCanvasElement>();
    const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement>();
    const socket = useSocketConnection();

    // console.log(canvasRef);

    return (
        <>
            <BasicBoard
                pointerColor={"#21f5d9"}
                pointerScale={3}
                onCanvasLoaded={(canvas) => setCanvasRef(canvas?.children[0] as HTMLCanvasElement)}
            />
            <Broadcaster canvasElement={canvasRef} socket={socket} />
            {/* <Actor /> */}
        </>
    );
};

export default App;
