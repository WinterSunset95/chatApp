const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var userArray = [];
function userObj(name, ssid) {
  this.name = name;
  this.id = ssid;
}

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
    userArray.push(new function () {
      this.name = name;
      this.id = socketId;
    });
    io.emit('userConnect', userArray, name, socketId);
    
  });
  socket.on('chat message', (msg, name) => {
    io.emit('chat message', msg, name);
    console.log(name, msg);
  });
  socket.on('disconnect', () => {
    try {
      id = socket.id;
      var dcon = userArray.find(dcon => dcon.id === id);
      console.log(dcon);
      var user = dcon.name;
      console.log(user, ' disconnected, ID- ', id);
      var ind = userArray.indexOf(dcon);
      userArray.pop(ind);
      io.emit('userdisconn', userArray, user, id);
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
