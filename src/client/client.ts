import { io } from 'socket.io-client';

const socket = io();
let joined = false;

socket.on('connect', () => {
  const playerName = prompt('name please?');
  if (playerName) {
    //let server know a new player has joined
    socket.emit('joining', playerName);
  }
});

socket.on('disconnect', (message) => {
  // deal or clean up resources for a disconnect event
  // this could be the server loosing connection to client
  document.body.innerHTML = `<p>${message}</p>`;
});

socket.on('joined', (message: { message: string; socketId: string }) => {
  document.body.innerHTML += message.message;
  joined = true;
});

socket.on('message', (message: { message: string; socketId: string }) => {
  if (joined) {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
    document.body.innerHTML += `<div><p>message:${message.message}, socketId:${message.socketId}</p></div>`;
  }
});
