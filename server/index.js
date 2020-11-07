import express from "express";
import httpServer from "http";
import socket from "socket.io";
import path from "path";
const __dirname = path.resolve();

let app = express();
let http = httpServer.createServer(app);
let io = socket(http);

const port = process.env.PORT || 3000;

const publicDir = `${__dirname}/public`;

// start http server
http.listen(port, () => {
    console.log("Iniciando Express y Socket.IO en localhost:%d", port);
});

// route to the root path '/'
app.get("/", (req, res) => {
    // res.sendFile(`${publicDir}/client.html`);
    res.sendFile(`${publicDir}/remboard.html`);
});

// route to the /streaming path
app.get("/streaming", (req, res) => {
    res.sendFile(`${publicDir}/server.html`);
});

// starts the socker.io connection
io.on("connection", (socket) => {
    socket.on("drawing", (data) => {
        io.sockets.emit("drawing",data);
        console.log(data);
    
        
        // Check if the user exist into userlist
    });
io.on('connection', (socket) => {
        socket.on('streaming', (image) => {
            io.emit('play stream', image)
            //console.log(image)
        });

});
});