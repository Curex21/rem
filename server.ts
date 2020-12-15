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

let nodes: Set<string> = new Set();

io.sockets.on("error", (err) => console.log(err));

io.sockets.on("connection", (socket) => {
    socket.on("node-connection", (newNodeID: string) => {
        nodes.add(newNodeID);

        console.log("new connection: " + newNodeID);

        Array.from(nodes).map((node: string) => {
            if (node === newNodeID) {
                return;
            }
            console.log(`send (${newNodeID}) to other node (${node})`);
            socket.to(node).emit("node-connection", newNodeID);
        });
    });

    socket.on("node-watcher", (who: string) => {
        console.log("receive watcher signal: " + who);
        socket.to(socket.id).emit("node-watcher", who);
        // socket.broadcast.emit("node-watcher", id);
    });

    socket.on("disconnect", (id: string, msg: string) => {
        console.log("disconnect pair: " + socket.id);
        Array.from(nodes).map((node) => {
            if (node === id) {
                return;
            }
            console.log("closing connection to other nodes: " + node);
            socket.to(node).emit("disconnectPeer", id);
        });
        nodes.delete(id);
        // socket.to(broadcaster).emit("disconnectPeer", socket.id);
    });

    // socket.on("broadcaster", () => {
    //     broadcaster = socket.id;
    //     socket.broadcast.emit("broadcaster");
    // });

    // socket.on("watcher", () => {
    //     socket.to(broadcaster).emit("watcher", socket.id);
    // });

    // socket.on("disconnect", () => {
    //     socket.to(broadcaster).emit("disconnectPeer", socket.id);
    // });

    // socket.on("offer", (id: string, message: string) => {
    //     socket.to(id).emit("offer", socket.id, message);
    // });

    // socket.on("answer", (id: string, message: string) => {
    //     socket.to(id).emit("answer", socket.id, message);
    // });

    // socket.on("candidate", (id: string, message: string) => {
    //     socket.to(id).emit("candidate", socket.id, message);
    // });
});

//@ts-ignore
app.options("*", cors());

server.listen(port, () => console.log(`Server is running on port ${port}`));
