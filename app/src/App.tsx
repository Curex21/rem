import React from "react";
import Actor from "./Actor";
import BasicBoard from "./BasicBoard";
import Broadcaster from "./Broadcaster";

const App: React.FC = () => {
    return (
        <>
            <BasicBoard pointerColor={"#0ef5ce"} pointerScale={3} />
            <Broadcaster />
            <Actor />
        </>
    );
};

export default App;
