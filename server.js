const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 5000;

http.listen(PORT, function() {
  console.log(`listening on ${PORT}`);
});

let users = 0;
let player = 0;

io.on('connection', socket => {
  console.log('Connected', socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  //This
  socket.on('join', userName => {
    console.log('userName', userName);
    users++;
    if (users > 2) {
      io.emit('status', `connection rejected play in session`);
    }
    if (users <= 2) {
      io.emit('status', `connection successful`);
    }
  });
  socket.on(`ready`, () => {
    if (player < 2) {
      player++;
      io.emit(`playerNumber`, player);
      if (player === 2) {
        io.sockets.emit(`room-ready`, true);
      }
    }
  });

  socket.on(`movement`, movement => {
    socket.broadcast.emit(`response`, movement);
  });
});
