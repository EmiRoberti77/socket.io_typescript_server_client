import { createServer } from 'http';
import { Server } from 'socket.io';
import * as express from 'express';
import * as path from 'path';
import LuckyNumber from './luckyNumber';
//message types
enum messageType {
  connection = 'connection',
  disconnect = 'disconnect',
  message = 'message'
}
const SPACE = ' ';
enum outPut {
  newClient = 'new client connected',
  disconnected = 'disconnected',
  counter = 'counter',
  left = 'left the building!',
  hello = 'hello',
  serverStarted = 'server started',
  genEmit = 'gen Emit message',
  genBroadcast = 'broadcast'
}
const luckyNum = (num: number) => `you lucky number is ${num}`;
const youWin = (num: number) => `you are lucky winner with number ${num}`;
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
  winners.forEach((socketId) => {
    //iterate through the winners array and send message only to winners
    io.to(socketId).emit(messageType.message, { message: youWin(luckyNum), socketId });
  });
  //send out messages of the lucky number sent out that has been picked.
  io.emit(messageType.message, { message: luckyNum, socketId: 'x' });
}, 5000);
