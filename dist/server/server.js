"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const express = require("express");
const path = require("path");
//message types
var messageType;
(function (messageType) {
    messageType["connection"] = "connection";
    messageType["disconnect"] = "disconnect";
    messageType["message"] = "message";
})(messageType || (messageType = {}));
const SPACE = ' ';
var outPut;
(function (outPut) {
    outPut["newClient"] = "new client connected";
    outPut["disconnected"] = "disconnected";
    outPut["counter"] = "counter";
    outPut["left"] = "left the building!";
    outPut["hello"] = "hello";
    outPut["serverStarted"] = "server started";
    outPut["genEmit"] = "getEmit";
    outPut["getBroadcast"] = "getBroadcast";
})(outPut || (outPut = {}));
const port = 3000;
const app = express();
//path to server client static pages
app.use(express.static(path.join(__dirname, '../client')));
//http server
const server = (0, http_1.createServer)(app);
//new socket server
const io = new socket_io_1.Server(server);
//connection count
let counter = 0;
//handle new connection
io.on(messageType.connection, (socket) => {
    console.log(outPut.newClient + SPACE + socket.id);
    counter++;
    //handle disconnect event
    socket.on(messageType.disconnect, () => {
        console.log(outPut.disconnected, socket.id);
        counter--;
        console.log(outPut.counter, counter);
        const broadcastLeft = { message: outPut.left, socketId: socket.id };
        socket.broadcast.emit(messageType.message, broadcastLeft);
    });
    //send broadcast message to all connected clients except its self
    const broadcastObj = { message: outPut.getBroadcast, socketId: socket.id };
    socket.broadcast.emit(messageType.message, broadcastObj);
    const obj = { message: outPut.hello, socketId: socket.id };
    //send hello to connected client
    socket.emit(messageType.message, obj);
    console.log(outPut.counter, counter);
});
server.listen(port, () => {
    console.log(outPut.serverStarted + SPACE + port);
});
setInterval(() => {
    const random = Math.floor(Math.random() * 1000000);
    const intervalEmit = { message: outPut.genEmit, socketId: new Date().toISOString() };
    io.emit(messageType.message, intervalEmit);
}, 5000);
