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
    messageType["joining"] = "joining";
    messageType["joined"] = "joined";
})(messageType || (messageType = {}));
const SPACE = ' ';
var outPut;
(function (outPut) {
    outPut["newClient"] = "new client connected";
    outPut["disconnected"] = "disconnected";
    outPut["counter"] = "counter";
    outPut["left"] = "left the building!";
    outPut["welcomeBack"] = "welcome back";
    outPut["serverStarted"] = "server started";
    outPut["welcome"] = "welcome";
    outPut["genBroadcast"] = "broadcast";
})(outPut || (outPut = {}));
const luckyNum = (num) => `you lucky number is ${num}`;
const youWin = (num) => `you are lucky winner with number ${num}`;
const sayHelloTo = (playerName) => `Hello all say hello to ${playerName}`;
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
const players = {};
//handle new connection
io.on(messageType.connection, (socket) => {
    socket.on(messageType.joining, (playerName) => {
        if (players[playerName]) {
            //update socket id for logged in player
            players[playerName].sockedId = socket.id;
            //welcome Back player and let them know about their saved lucky number
            socket.emit(messageType.joined, {
                message: outPut.welcomeBack +
                    SPACE +
                    playerName +
                    SPACE +
                    luckyNum(players[playerName].luckyNumber),
                socketId: socket.id
            });
        }
        else {
            //new player
            players[playerName] = {
                luckyNumber: Math.floor(Math.random() * 20),
                sockedId: socket.id
            };
            //welcome new player and let them know about their lucky number
            socket.emit(messageType.joined, {
                message: outPut.welcome +
                    SPACE +
                    playerName +
                    SPACE +
                    luckyNum(players[playerName].luckyNumber)
            });
        }
        //store lucky number in game class
        game.luckyNumbers[socket.id] = players[playerName].luckyNumber;
        //let the client socket know what their lucky number is
        socket.broadcast.emit(messageType.message, {
            message: sayHelloTo(playerName),
            socketId: socket.id
        });
    });
    //handle disconnect event
    socket.on(messageType.disconnect, () => {
        console.log(outPut.disconnected, socket.id);
        const broadcastLeft = { message: outPut.left, socketId: socket.id };
        socket.broadcast.emit(messageType.message, broadcastLeft);
    });
});
server.listen(port, () => {
    console.log(outPut.serverStarted + SPACE + port);
});
//pick a lucky number
setInterval(() => {
    const luckyNum = Math.floor(Math.random() * 20);
    const winners = game.GetWinners(luckyNum);
    winners.forEach((socketId) => {
        //iterate through the winners array and send message only to winners
        io.to(socketId).emit(messageType.message, { message: youWin(luckyNum), socketId });
    });
    //send out messages of the lucky number sent out that has been picked.
    io.emit(messageType.message, { message: luckyNum, socketId: 'x' });
}, 3000);
