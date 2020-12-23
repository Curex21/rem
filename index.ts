import { zmqBroker } from "./zmqserver";
import Express from "express";
import http from "http";
import socketIO from "socket.io";
import { handleSocketConnection } from "./server";

const PORT = 4001;

const app = Express();
const server = http.createServer(app);
const io = new socketIO.Server(server, {
    cors: {
        origin: "*",
    },
});

io.sockets.on("error", (err) => console.log(err));

io.sockets.on("connection", handleSocketConnection);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
