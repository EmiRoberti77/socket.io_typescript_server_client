import { createServer } from 'http';
import { Server } from 'socket.io';
import * as express from 'express';
import * as path from 'path';
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
  genEmit = 'getEmit',
  getBroadcast = 'getBroadcast'
}
const port = 3000;
const app = express();
//path to server client static pages
app.use(express.static(path.join(__dirname, '../client')));
//http server
const server = createServer(app);
//new socket server
const io = new Server(server);
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
