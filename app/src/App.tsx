import React, { useRef } from "react";
import Actor from "./Actor";
import BasicBoard from "./BasicBoard";
import Broadcaster from "./Broadcaster";

const App: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>();

    return (
        <>
            <BasicBoard
                pointerColor={"#0ef5ce"}
                pointerScale={3}
                onCanvasLoaded={(canvas) => (canvasRef.current = canvas as HTMLCanvasElement)}
            />
            <Broadcaster canvasElement={canvasRef.current} />
            <Actor />
        </>
    );
};

export default App;
