import socketIO from "socket.io";

let nodesTable: { [key: string]: string } = {};
let nodes: Set<string> = new Set();
let sceneProvider: string;

export const handleSocketConnection = (socket: socketIO.Socket) => {
    console.log(`hello ${socket.id}`);

    socket.on("register-node", (id: string) => {
        nodes.add(id);
        nodesTable[socket.id] = id;
        socket.emit(
            "contact-list",
            Array.from(nodes).filter((n) => n !== id)
        );
    });

    socket.on("register-scene-provider", (id: string) => {
        nodes.add(id);
        sceneProvider = id;
        nodesTable[socket.id] = id;
        socket.emit("contact-list", Array.from(nodes));
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
