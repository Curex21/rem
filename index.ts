import express from "express";
import http from "http";
import socketIO from "socket.io";
import { handleSocketConnection } from "./server";

const PORT = 4001;

const app = express();

const server = http.createServer(app);

const io = new socketIO.Server(server, {
    cors: {
        origin: "*",
    },
});

io.sockets.on("error", (err) => console.log(err));

io.sockets.on("connection", handleSocketConnection);

app.use(express.static("app/dist"));

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
