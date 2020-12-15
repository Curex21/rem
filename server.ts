import Express from "express";
import http from "http";
import socketIO from "socket.io";
import cors from "cors";
const port = 4000;

const app = Express();

const options: cors.CorsOptions = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: "http://localhost:1234",
    preflightContinue: false,
};

//@ts-ignore
app.use(cors());

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

//@ts-ignore
app.options("*", cors());

server.listen(port, () => console.log(`Server is running on port ${port}`));
