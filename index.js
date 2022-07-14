const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs')
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
    console.log(user, ' connected');
    fs.appendFile('./main/chat.log', user + ' connected \n', (err) => {
      if (err) {
        console.log(err)
      }
    })
    io.emit('userConnect', (user));
  });
  socket.on('chat message', (msg, name) => {
    console.log(name, msg);
    const to_append = name + ' ' + msg + '\n'
    fs.appendFile('./main/chat.log', to_append, (err) => {
      if (err) {
        console.log(err)
      }
    })
  });
  socket.on('chat message', (msg, name) => {
    io.emit('chat message', msg, name);
  });
     
});

app.use(express.static(__dirname + '/main'));

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
