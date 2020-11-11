import express from "express";
import httpServer from "http";
import socket from "socket.io";
import path from "path";
import { nanoid } from "nanoid";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync.js";

const __dirname = path.resolve();

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ users: [] }).write();

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
    // db.get("users").filter({id: })
    let remID = socket.handshake.query.remID;
    let color = "#000";

    console.log("id:", remID);

    if (remID === undefined || remID === null || remID === "null") {
        remID = nanoid(8);
        color = colors[1]; // TODO: Make a dynamic color assign
        db.get("users").push({ id: remID, color: color }).write();
        setTimeout(() => {
            socket.emit("register", { remID: remID });
        }, 1000);
    } else {
        const users = db.get("users").filter({ id: remID }).value();
        console.log(users);
        if (users && users.length > 0) {
            color = users[0].color;
        }
    }

    // socket.
    // console.log(totalUsersConnected);

    // if (totalUsersConnected > colors.length - 1) return; // TODO: Response with a gentle error;

    // const color = colors[totalUsersConnected];
    // userColors[newID] = color;
    // totalUsersConnected += 1;

    // console.log(userColors);

    socket.on("drawing", (data) => {
        // Check if the user exist into userlist
        // const color = userColors[data.user];
        // console.log(data.user, color);
        io.emit("to-draw", { ...data, color });
        // socket.broadcast.emit("to-draw", { ...data, color });
        // socket.broadcast.emit("to-draw", data);
    });

    socket.on("identify", (data) => {
        data.id;
    });
});

io.on("disconnect", (socket) => {
    // validate if is disconnect
    totalUsersConnected -= 1;
});
