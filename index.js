const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

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
    console.log(user, ' connected, ID- ', socket.id);
    name = user;
    socketId = socket.id;
    io.emit('userConnect', name, socketId);
    
  });
  socket.on('chat message', (msg, name) => {
    io.emit('chat message', msg, name);
    console.log(name, msg);
  });
  socket.on('disconnect', () => {
    try {
      console.log(socket.id, ' disconnected');
      io.emit('userdisconn', socket.id);
  }
    catch (err) {
      console.log('err-');
    }
  })
  
});
app.use(express.static(__dirname + '/main'));

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
