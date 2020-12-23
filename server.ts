import socketIO from "socket.io";

let nodes: Set<string> = new Set();

export const handleSocketConnection = (socket: socketIO.Socket) => {
    console.log(`socket id: ${socket.id}`);

    socket.on("node-connection", () => {
        nodes.add(socket.id);
        socket.broadcast.emit("node-connection", socket.id);
    });

    socket.on("node-watcher", (peerID: string) => {
        socket.to(peerID).emit("node-watcher", socket.id);
    });

    socket.on("disconnect", () => {
        console.log("disconnect pair: " + socket.id);
        nodes.delete(socket.id);
        socket.broadcast.emit("disconnectPeer", socket.id);
        // socket.to(broadcaster).emit("disconnectPeer", socket.id);
    });

    socket.on("candidate", (peerID: string, message: string) => {
        socket.to(peerID).emit("candidate", socket.id, message);
    });

    socket.on("offer", (peerID: string, message: string) => {
        socket.to(peerID).emit("offer", socket.id, message);
    });

    // socket.on("disconnect", () => {
    //     socket.to(broadcaster).emit("disconnectPeer", socket.id);
    // });

    // socket.on("answer", (id: string, message: string) => {
    //     socket.to(id).emit("answer", socket.id, message);
    // });
};
