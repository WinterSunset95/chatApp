const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('userConnect', (user) => {
    console.log(user, ' connected');
    io.emit('userConnect', (user));
  });
  socket.on('chat message', (msg, name) => {
    console.log(name, msg);
  });
  socket.on('chat message', (msg, name) => {
    io.emit('chat message', msg, name);
  });
     
});

app.use(express.static(__dirname));

server.listen(3000, () => {
  console.log('Listening on port 3000');
});