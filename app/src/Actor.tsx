import React from "react";
import socketIO from "socket.io";

const Actor = () => {
    return (
        <div>
            I'm an Actor
            <video playsInline autoPlay></video>
        </div>
    );
};

export default Actor;
