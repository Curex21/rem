import React from "react";
import BasicBoard from "./BasicBoard";

const App: React.FC = () => {
    return (
        <>
            <BasicBoard pointerColor={"#ff00ff"} pointerScale={3} />
            {/* <BasicBoard />
            <BasicBoard />
            <BasicBoard /> */}
        </>
    );
};

export default App;
