import { io } from 'socket.io-client';

const socket = io();

socket.on('connect', () => {
  document.body.innerText = 'Connected : ' + socket.id;
});

socket.on('disconnect', (message) => {
  // deal or clean up resources for a disconnect event
  // this could be the server loosing connection to client
  document.body.innerHTML = `<p>${message}</p>`;
});

socket.on('message', (message: { message: string; socketId: string }) => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  });
  document.body.innerHTML += `<div><p>message:${message.message}, socketId:${message.socketId}</p></div>`;
});
