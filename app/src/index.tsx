import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import socketIO from "socket.io";

let mountNode = document.getElementById("app");
ReactDOM.render(<App />, mountNode);
