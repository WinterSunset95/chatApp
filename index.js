const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var users = ['hehe', 'wallass', 'dyrroth'];

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/main/login.html');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/main/index.html');
});

app.get('/logout', (req, res) => {
  res.sendFile(__dirname + '/main/logout.html');
});

io.on('connection', (socket) => {
  socket.on('userConnect', (user) => {
    users.push(user);
    console.log(users);
    console.log(user, ' connected');
    io.emit('userConnect', (user));
  });
 socket.on('chat message', (msg, name) => {
    io.emit('chat message', msg, name);
    console.log(name, msg);
  });
     
});

app.use(express.static(__dirname + '/main'));

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
