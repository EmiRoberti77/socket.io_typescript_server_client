import { createServer } from 'http';
import { Server } from 'socket.io';
import * as express from 'express';
import * as path from 'path';
import LuckyNumber from './luckyNumber';
//message types
enum messageType {
  connection = 'connection',
  disconnect = 'disconnect',
  message = 'message',
  joining = 'joining',
  joined = 'joined'
}
const SPACE = ' ';
enum outPut {
  newClient = 'new client connected',
  disconnected = 'disconnected',
  counter = 'counter',
  left = 'left the building!',
  welcomeBack = 'welcome back',
  serverStarted = 'server started',
  welcome = 'welcome',
  genBroadcast = 'broadcast'
}
const luckyNum = (num: number) => `you lucky number is ${num}`;
const youWin = (num: number) => `you are lucky winner with number ${num}`;
const sayHelloTo = (playerName: string) => `Hello all say hello to ${playerName}`;

const port = 3000;
const app = express();
//path to server client static pages
app.use(express.static(path.join(__dirname, '../client')));
//http server
const server = createServer(app);
//new socket server
const io = new Server(server);
//create luckyNumber game
const game = new LuckyNumber();
const players: { [id: string]: { luckyNumber: number; sockedId: string } } = {};
//handle new connection
io.on(messageType.connection, (socket) => {
  socket.on(messageType.joining, (playerName) => {
    if (players[playerName]) {
      //update socket id for logged in player
      players[playerName].sockedId = socket.id;
      //welcome Back player and let them know about their saved lucky number
      socket.emit(messageType.joined, {
        message:
          outPut.welcomeBack +
          SPACE +
          playerName +
          SPACE +
          luckyNum(players[playerName].luckyNumber),
        socketId: socket.id
      });
    } else {
      //new player
      players[playerName] = {
        luckyNumber: Math.floor(Math.random() * 20),
        sockedId: socket.id
      };
      //welcome new player and let them know about their lucky number
      socket.emit(messageType.joined, {
        message:
          outPut.welcome +
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
