import socketIO from "socket.io";

interface Node {
    id: string;
    color: string;
}

let nodesTable: { [key: string]: Node } = {};
let nodes: Set<Node> = new Set();
let sceneProvider: string;

const colors = ["#21f533", "#4821f5", "#e7f521", "#21f5d9", "#f54121"];

export const handleSocketConnection = (socket: socketIO.Socket) => {
    console.log(`hello ${socket.id}`);

    socket.on("register-node", (id: string) => {
        const node = { id, color: colors[nodes.size % colors.length] };
        nodes.add(node);
        nodesTable[socket.id] = node;
        socket.emit(
            "contact-list",
            Array.from(nodes).filter((n) => n.id !== id)
        );
    });

    socket.on("register-scene-provider", (id: string) => {
        const node = { id, color: "block" };
        nodes.add(node);
        sceneProvider = id;
        nodesTable[socket.id] = node;
        socket.emit(
            "contact-list",
            Array.from(nodes).filter((n) => n.id !== id)
        );
    });

    socket.on("disconnect", () => {
        console.log(`bye ${socket.id}`);
        nodes.delete(nodesTable[socket.id]);
        delete nodesTable[socket.id];
    });

    // socket.on("node-connection", () => {
    //     nodes.add(socket.id);
    //     socket.broadcast.emit("node-connection", socket.id);
    // });

    // socket.on("node-watcher", (peerID: string) => {
    //     socket.to(peerID).emit("node-watcher", socket.id);
    // });

    // socket.on("disconnect", () => {
    //     console.log("disconnect pair: " + socket.id);
    //     nodes.delete(socket.id);
    //     socket.broadcast.emit("disconnectPeer", socket.id);
    //     // socket.to(broadcaster).emit("disconnectPeer", socket.id);
    // });

    // socket.on("candidate", (peerID: string, message: string) => {
    //     socket.to(peerID).emit("candidate", socket.id, message);
    // });

    // socket.on("offer", (peerID: string, message: string) => {
    //     socket.to(peerID).emit("offer", socket.id, message);
    // });

    // socket.on("answer", (peerID: string, message: string) => {
    //     socket.to(peerID).emit("answer", socket.id, message);
    // });
};
