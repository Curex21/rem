import express from "express";
import httpServer from "http";
import socket from "socket.io";
import path from "path";
import { nanoid } from "nanoid";

const __dirname = path.resolve();

let app = express();
let http = httpServer.createServer(app);
let io = socket(http);

const port = process.env.PORT || 3000;

const publicDir = `${__dirname}/public`;

const colors = ["#ffa", "#faa", "#faf"];

let totalUsersConnected = 0;
let userColors = {};

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
    const newID = nanoid(8);

    // socket.
    // console.log(totalUsersConnected);

    if (totalUsersConnected > colors.length - 1) return; // TODO: Response with a gentle error;

    socket.emit("register", newID);

    const color = colors[totalUsersConnected];
    userColors[newID] = color;
    totalUsersConnected += 1;

    console.log(userColors);

    socket.on("drawing", (data) => {
        // Check if the user exist into userlist
        const color = userColors[data.user];
        console.log(data.user, color);
        io.emit("to-draw", { ...data, color });
        // socket.broadcast.emit("to-draw", data);
    });
});

io.on("disconnect", (socket) => {
    // validate if is disconnect
    totalUsersConnected -= 1;
});
