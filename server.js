const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 5000;

http.listen(PORT, function() {
  console.log(`listening on ${PORT}`);
});

let rooms = [];

io.on('connection', socket => {
  console.log('Connected', socket.id);

  socket.on('join', userName => {
    console.log('userName', userName);
    if (rooms[0] === userName) {
      io.emit('room', 'Username taken by your opponent');
    }
    if (rooms[0] !== userName) {
      rooms.push(userName);
    }

    if (rooms.length < 2 && rooms[0] !== userName) {
      io.emit('room', 'waiting for other user');
    }
    if (rooms.length === 2) {
      io.emit('room', rooms);
      rooms = [];
    }
  });
});
