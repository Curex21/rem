import socketIO from "socket.io";

let nodes: Set<string> = new Set();

export const handleSocketConnection = (socket: socketIO.Socket) => {
    console.log(`socket id: ${socket.id}`);

    socket.on("node-connection", () => {
        nodes.add(socket.id);
        // console.log("new connection: " + socket.id);
        // console.log(`[${socket.id}] emiting broadcast to all`);
        socket.broadcast.emit("node-connection", socket.id);
    });

    socket.on("node-watcher", (peerID: string) => {
        // console.log("receive watcher signal: " + who);
        // console.log("send node-watcher to " + socket.id);
        socket.to(peerID).emit("node-watcher", socket.id);
        // socket.broadcast.emit("node-watcher", id);
    });

    socket.on("disconnect", () => {
        console.log("disconnect pair: " + socket.id);
        nodes.delete(socket.id);
        socket.broadcast.emit("disconnectPeer", socket.id);
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
};
