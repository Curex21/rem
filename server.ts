import socketIO from "socket.io";

let nodes: Set<string> = new Set();

export const handleSocketConnection = (socket: socketIO.Socket) => {
    console.log(`socket id: ${socket.id}`);

    socket.on("node-connection", () => {
        nodes.add(socket.id);

        console.log("new connection: " + socket.id);

        // Array.from(nodes).forEach((node: string) => {
        //     if (node === socket.id) {
        //         return;
        //     }

        // });
        // console.log(`send (${socket.id}) to other node (${node})`);
        console.log(`broadcast from ${socket.id}`);
        socket.broadcast.emit("node-connection", socket.id);
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
};
