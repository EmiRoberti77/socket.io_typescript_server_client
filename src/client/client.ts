import { io } from 'socket.io-client';

const socket = io();

socket.on('connect', () => {
  document.body.innerText = 'Connected : ' + socket.id;
});

socket.on('message', (message: { message: string; socketId: string }) => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  });
  document.body.innerHTML += `<div><p>message:${message.message}, socketId:${message.socketId}</p></div>`;
});
