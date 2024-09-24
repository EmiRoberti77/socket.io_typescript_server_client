"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const express = require("express");
const path = require("path");
const luckyNumber_1 = require("./luckyNumber");
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
    outPut["genEmit"] = "gen Emit message";
    outPut["genBroadcast"] = "broadcast";
})(outPut || (outPut = {}));
const luckyNum = (num) => `you lucky number is ${num}`;
const youWin = (num) => `you are lucky winner with number ${num}`;
const port = 3000;
const app = express();
//path to server client static pages
app.use(express.static(path.join(__dirname, '../client')));
//http server
const server = (0, http_1.createServer)(app);
//new socket server
const io = new socket_io_1.Server(server);
//create luckyNumber game
const game = new luckyNumber_1.default();
//handle new connection
io.on(messageType.connection, (socket) => {
    // assign a lucky number to the connected socket
    game.luckyNumbers[socket.id] = Math.floor(Math.random() * 20);
    //let the client socket know what their lucky number is
    socket.emit(messageType.message, {
        message: luckyNum(game.luckyNumbers[socket.id]),
        socketId: socket.id
    });
    //handle disconnect event
    socket.on(messageType.disconnect, () => {
        console.log(outPut.disconnected, socket.id);
        const broadcastLeft = { message: outPut.left, socketId: socket.id };
        socket.broadcast.emit(messageType.message, broadcastLeft);
    });
    const obj = { message: outPut.hello, socketId: socket.id };
    //send hello to connected client
    socket.emit(messageType.message, obj);
});
server.listen(port, () => {
    console.log(outPut.serverStarted + SPACE + port);
});
//pick a lucky number
setInterval(() => {
    const luckyNum = Math.floor(Math.random() * 20);
    const winners = game.GetWinners(luckyNum);
    const intervalEmit = { message: outPut.genEmit, socketId: new Date().toISOString() };
    winners.forEach((w) => {
        //iterate through the winners array and send message only to winners
        io.to(w).emit(messageType.message, { message: youWin(luckyNum), socketId: w });
    });
    //send out messages of the lucky number sent out that has been picked.
    io.emit(messageType.message, { message: luckyNum, socketId: 'x' });
}, 5000);
