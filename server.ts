import Express from "express";
import http from "http";
import socketIO from "socket.io";

const port = 4000;

const app = Express();

const server = http.createServer(app);
const io = new socketIO.Server(server);

let broadcaster: string;

io.sockets.on("error", (err) => console.log(err));

io.sockets.on("connection", (socket) => {
    socket.on("broadcaster", () => {
        broadcaster = socket.id;
        socket.broadcast.emit("broadcaster");
    });

    socket.on("watcher", () => {
        socket.to(broadcaster).emit("watcher", socket.id);
    });

    socket.on("disconnect", () => {
        socket.to(broadcaster).emit("disconnectPeer", socket.id);
    });

    socket.on("offer", (id: string, message: string) => {
        socket.to(id).emit("offer", socket.id, message);
    });

    socket.on("answer", (id: string, message: string) => {
        socket.to(id).emit("answer", socket.id, message);
    });

    socket.on("candidate", (id: string, message: string) => {
        socket.to(id).emit("candidate", socket.id, message);
    });
});

server.listen(port, () => console.log(`Server is running on port ${port}`));
