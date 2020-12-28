import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createSocketConnection } from "./socket";

const socket = createSocketConnection();

let mountNode = document.getElementById("app");

ReactDOM.render(<App socket={socket} />, mountNode);
